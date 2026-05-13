const Inquiry = require('../models/inquiryModel');
const Property = require('../models/propertyModel');
const Notification = require('../models/notificationModel');

const createInquiry = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { propertyId, message } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({ message: 'Property ID and message are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const receiverId = property.uploaded_by;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'You cannot send an inquiry to yourself' });
    }

    const inquiry = await Inquiry.create(propertyId, senderId, receiverId, message);

    // Create a notification for the receiver
    await Notification.create(
      receiverId,
      'inquiry',
      'New Property Inquiry',
      `You received a new inquiry for "${property.title}"`,
      `/dashboard/inquiries`
    );

    res.status(201).json({ message: 'Inquiry sent successfully', inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyInquiries = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get inquiries received (as a seller)
    const received = await Inquiry.findByReceiverId(userId);
    // Get inquiries sent (as a buyer)
    const sent = await Inquiry.findBySenderId(userId);

    res.json({ received, sent });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const inquiryId = req.params.id;
    const userId = req.user.id;

    const inquiry = await Inquiry.markAsRead(inquiryId, userId);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found or unauthorized' });
    }

    res.json({ message: 'Marked as read', inquiry });
  } catch (error) {
    console.error('Error marking inquiry as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const inquiryId = req.params.id;
    const userId = req.user.id;

    const inquiry = await Inquiry.delete(inquiryId, userId);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found or unauthorized' });
    }

    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  markAsRead,
  deleteInquiry
};
