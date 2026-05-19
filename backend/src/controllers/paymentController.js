const crypto = require('crypto');
const db = require('../config/db');

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q'; // default UAT key
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const FEATURE_AMOUNT = 500.00; // NPR 500 to feature property

/**
 * Generate HMAC-SHA256 signature in Base64
 */
const generateSignature = (message, secret) => {
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('base64');
};

/**
 * @desc    Initiate eSewa payment for featuring property
 * @route   POST /api/payments/initiate-esewa
 * @access  Private
 */
const initiateEsewaPayment = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    // Verify property exists and is owned by the user
    const { rows: propertyRows } = await db.query(
      'SELECT * FROM properties WHERE id = $1 AND uploaded_by = $2',
      [propertyId, req.user.id]
    );

    if (propertyRows.length === 0) {
      return res.status(404).json({ message: 'Property not found or you are not authorized' });
    }

    const property = propertyRows[0];

    if (property.is_featured) {
      return res.status(400).json({ message: 'Property is already featured' });
    }

    // Generate transaction UUID
    const transactionUuid = `txn-${propertyId}-${Date.now()}`;

    // Create payment entry in database
    await db.query(
      `INSERT INTO payments (user_id, property_id, amount, transaction_uuid, status) 
       VALUES ($1, $2, $3, $4, 'PENDING')`,
      [req.user.id, propertyId, FEATURE_AMOUNT, transactionUuid]
    );

    // Build the data string to sign
    // Format: total_amount=YOUR_AMOUNT,transaction_uuid=YOUR_UUID,product_code=YOUR_PRODUCT_CODE
    const signString = `total_amount=${FEATURE_AMOUNT},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
    const signature = generateSignature(signString, ESEWA_SECRET_KEY);

    // eSewa params
    const paymentParams = {
      amount: FEATURE_AMOUNT.toString(),
      tax_amount: '0',
      total_amount: FEATURE_AMOUNT.toString(),
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${FRONTEND_URL}/payment/success`,
      failure_url: `${FRONTEND_URL}/payment/failure`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: signature,
      esewa_url: process.env.NODE_ENV === 'production' 
        ? 'https://epay.esewa.com.np/api/epay/main/v2/form' 
        : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
    };

    res.status(200).json({
      success: true,
      params: paymentParams
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ message: 'Could not initiate payment' });
  }
};

/**
 * @desc    Verify eSewa payment from redirect
 * @route   POST /api/payments/verify-esewa
 * @access  Private
 */
const verifyEsewaPayment = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: 'Redirection data is required' });
    }

    // Decode Base64 data from eSewa success redirection
    const decodedString = Buffer.from(data, 'base64').toString('utf-8');
    let paymentData;
    try {
      paymentData = JSON.parse(decodedString);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid payload encoding' });
    }

    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signed_field_names,
      signature
    } = paymentData;

    if (status !== 'COMPLETE') {
      return res.status(400).json({ message: 'Transaction status is not complete' });
    }

    // Regenerate signature for validation
    // Format: total_amount=YOUR_AMOUNT,transaction_uuid=YOUR_UUID,product_code=YOUR_PRODUCT_CODE
    // Note: Use exact fields listed in signed_field_names in the received order
    const fields = signed_field_names.split(',');
    const mappedFields = fields
      .filter(field => field !== 'signature')
      .map(field => `${field}=${paymentData[field]}`)
      .join(',');

    const expectedSignature = generateSignature(mappedFields, ESEWA_SECRET_KEY);

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Signature verification failed (Possible tamper)' });
    }

    // Start transaction to update payment and property featured status
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Fetch payment record
      const { rows: paymentRows } = await client.query(
        'SELECT * FROM payments WHERE transaction_uuid = $1 FOR UPDATE',
        [transaction_uuid]
      );

      if (paymentRows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Payment record not found' });
      }

      const payment = paymentRows[0];

      if (payment.status === 'COMPLETE') {
        await client.query('ROLLBACK');
        return res.status(200).json({ success: true, message: 'Payment already processed' });
      }

      // Update payment record
      await client.query(
        `UPDATE payments 
         SET status = 'COMPLETE', transaction_code = $1, updated_at = NOW() 
         WHERE id = $2`,
        [transaction_code, payment.id]
      );

      // Update property featured status
      await client.query(
        'UPDATE properties SET is_featured = true WHERE id = $1',
        [payment.property_id]
      );

      // Create a gorgeous notification
      await client.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'payment', 'Listing Featured ⭐', 'Your property listing has been featured successfully via eSewa!', $2)`,
        [payment.user_id, `/dashboard/properties/${payment.property_id}`]
      );

      await client.query('COMMIT');

      res.status(200).json({
        success: true,
        message: 'Payment verified and property featured successfully!',
        propertyId: payment.property_id
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Could not verify payment' });
  }
};

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

/**
 * @desc    Initiate Khalti payment for featuring property
 * @route   POST /api/payments/initiate-khalti
 * @access  Private
 */
const initiateKhaltiPayment = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    if (!KHALTI_SECRET_KEY) {
      return res.status(400).json({ 
        message: 'Khalti secret key is not configured. Please add KHALTI_SECRET_KEY to your backend/.env file.' 
      });
    }

    // Verify property exists and is owned by the user
    const { rows: propertyRows } = await db.query(
      'SELECT * FROM properties WHERE id = $1 AND uploaded_by = $2',
      [propertyId, req.user.id]
    );

    if (propertyRows.length === 0) {
      return res.status(404).json({ message: 'Property not found or you are not authorized' });
    }

    const property = propertyRows[0];

    if (property.is_featured) {
      return res.status(400).json({ message: 'Property is already featured' });
    }

    // Generate transaction UUID
    const transactionUuid = `khalti-txn-${propertyId}-${Date.now()}`;

    // Create payment entry in database
    await db.query(
      `INSERT INTO payments (user_id, property_id, amount, transaction_uuid, gateway, status) 
       VALUES ($1, $2, $3, $4, 'khalti', 'PENDING')`,
      [req.user.id, propertyId, FEATURE_AMOUNT, transactionUuid]
    );

    // Call Khalti initiate API using global fetch
    const khaltiUrl = process.env.NODE_ENV === 'production'
      ? 'https://khalti.com/api/v2/epayment/initiate/'
      : 'https://a.khalti.com/api/v2/epayment/initiate/';

    const response = await fetch(khaltiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        return_url: `${FRONTEND_URL}/payment/success`,
        website_url: FRONTEND_URL,
        amount: Math.round(FEATURE_AMOUNT * 100), // Rs to Paisa (50000 paisa)
        purchase_order_id: transactionUuid,
        purchase_order_name: `Feature Listing - #${property.title.substring(0, 30)}`
      })
    });

    const data = await response.json();

    if (!response.ok || !data.pidx) {
      console.error('Khalti initiate error:', data);
      return res.status(400).json({ 
        message: 'Could not initiate Khalti payment. Please check your KHALTI_SECRET_KEY configuration.', 
        error: data 
      });
    }

    // Update the payment record with the real pidx
    await db.query(
      `UPDATE payments SET transaction_code = $1 WHERE transaction_uuid = $2`,
      [data.pidx, transactionUuid]
    );

    res.status(200).json({
      success: true,
      payment_url: data.payment_url,
      pidx: data.pidx
    });
  } catch (error) {
    console.error('Initiate Khalti payment error:', error);
    res.status(500).json({ message: 'Could not initiate Khalti payment' });
  }
};

/**
 * @desc    Verify Khalti payment from callback
 * @route   POST /api/payments/verify-khalti
 * @access  Private
 */
const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, purchase_order_id } = req.body;

    if (!pidx) {
      return res.status(400).json({ message: 'pidx is required for verification' });
    }

    if (!KHALTI_SECRET_KEY) {
      return res.status(400).json({ 
        message: 'Khalti secret key is not configured. Please add KHALTI_SECRET_KEY to your backend/.env file.' 
      });
    }

    // Call Khalti lookup API using global fetch
    const lookupUrl = process.env.NODE_ENV === 'production'
      ? 'https://khalti.com/api/v2/epayment/lookup/'
      : 'https://a.khalti.com/api/v2/epayment/lookup/';

    const response = await fetch(lookupUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pidx })
    });

    const data = await response.json();

    if (!response.ok || data.status !== 'Completed') {
      console.error('Khalti lookup error:', data);
      return res.status(400).json({ 
        message: 'Khalti payment verification failed. Payment status is not completed.', 
        error: data 
      });
    }

    // Start transaction to update payment and property featured status
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Fetch payment record matching pidx or transaction_uuid (purchase_order_id)
      const { rows: paymentRows } = await client.query(
        'SELECT * FROM payments WHERE transaction_code = $1 OR transaction_uuid = $2 FOR UPDATE',
        [pidx, purchase_order_id || '']
      );

      if (paymentRows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Payment record not found' });
      }

      const payment = paymentRows[0];

      if (payment.status === 'COMPLETE') {
        await client.query('ROLLBACK');
        return res.status(200).json({ success: true, message: 'Payment already processed' });
      }

      // Update payment record
      await client.query(
        `UPDATE payments 
         SET status = 'COMPLETE', transaction_code = $1, updated_at = NOW() 
         WHERE id = $2`,
        [data.transaction_id || pidx, payment.id]
      );

      // Update property featured status
      await client.query(
        'UPDATE properties SET is_featured = true WHERE id = $1',
        [payment.property_id]
      );

      // Create a notification
      await client.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'payment', 'Listing Featured ⭐', 'Your property listing has been featured successfully via Khalti!', $2)`,
        [payment.user_id, `/dashboard/properties/${payment.property_id}`]
      );

      await client.query('COMMIT');

      return res.status(200).json({
        success: true,
        message: 'Payment verified and property featured successfully!',
        propertyId: payment.property_id
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Verify Khalti payment error:', error);
    res.status(500).json({ message: 'Could not verify Khalti payment' });
  }
};

module.exports = {
  initiateEsewaPayment,
  verifyEsewaPayment,
  initiateKhaltiPayment,
  verifyKhaltiPayment
};
