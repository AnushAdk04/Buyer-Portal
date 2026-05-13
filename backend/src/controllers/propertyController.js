const { createProperty, getPropertiesByUser, getPropertyById, deleteProperty, updateProperty, updatePropertyWithImage } = require('../models/propertyModel');
const { addPropertyImage, getPropertyImages, deleteImagesByProperty } = require('../models/propertyImageModel');
const { cloudinary } = require('../config/cloudinary');

const extractPropertyFields = (body) => {
  return {
    title: body.title,
    location: body.location,
    price: body.price,
    description: body.description,
    propertyType: body.propertyType,
    status: body.status,
    bedrooms: body.bedrooms ? parseInt(body.bedrooms, 10) : 0,
    bathrooms: body.bathrooms ? parseInt(body.bathrooms, 10) : 0,
    areaSqft: body.areaSqft ? parseFloat(body.areaSqft) : null,
    amenities: body.amenities ? (Array.isArray(body.amenities) ? body.amenities : JSON.parse(body.amenities)) : [],
    yearBuilt: body.yearBuilt ? parseInt(body.yearBuilt, 10) : null,
    parkingSpaces: body.parkingSpaces ? parseInt(body.parkingSpaces, 10) : 0
  };
};

const uploadProperty = async (req, res) => {
  try {
    const fields = extractPropertyFields(req.body);

    if (!fields.title || !fields.location || !fields.price)
      return res.status(400).json({ message: 'Title, location and price are required' });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'At least one property image is required' });

    if (isNaN(fields.price) || Number(fields.price) <= 0)
      return res.status(400).json({ message: 'Price must be a valid positive number' });

    const primaryImage = req.files[0];
    
    const propertyId = await createProperty({
      ...fields,
      price: Number(fields.price),
      imageUrl: primaryImage.path,
      imagePublicId: primaryImage.filename,
      uploadedBy: req.user.id,
    });

    // save additional images if any
    if (req.files.length > 1) {
      for (let i = 1; i < req.files.length; i++) {
        await addPropertyImage(propertyId, req.files[i].path, req.files[i].filename, i);
      }
    }

    const property = await getPropertyById(propertyId);
    res.status(201).json({ message: 'Property uploaded successfully', property });
  } catch (err) {
    console.error('Upload property error:', err);
    res.status(500).json({ message: 'Could not upload property' });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await getPropertiesByUser(req.user.id);
    res.json({ properties });
  } catch (err) {
    console.error('Get my properties error:', err);
    res.status(500).json({ message: 'Could not fetch your properties' });
  }
};

const getSingleProperty = async (req, res) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property)
      return res.status(404).json({ message: 'Property not found' });
      
    const images = await getPropertyImages(req.params.id);
    property.images = images;
    
    res.json({ property });
  } catch (err) {
    console.error('Get property error:', err);
    res.status(500).json({ message: 'Could not fetch property' });
  }
};

const removeProperty = async (req, res) => {
  try {
    const property = await getPropertyById(req.params.id);

    if (!property)
      return res.status(404).json({ message: 'Property not found' });

    if (property.uploaded_by !== req.user.id)
      return res.status(403).json({ message: 'You can only delete your own properties' });

    // delete primary image
    if (property.image_public_id) {
      await cloudinary.uploader.destroy(property.image_public_id);
    }
    
    // delete additional images from cloudinary
    const images = await getPropertyImages(req.params.id);
    for (const img of images) {
      if (img.image_public_id) {
        await cloudinary.uploader.destroy(img.image_public_id);
      }
    }

    const affected = await deleteProperty(req.params.id, req.user.id);
    if (affected === 0)
      return res.status(404).json({ message: 'Property not found' });

    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ message: 'Could not delete property' });
  }
};

const editProperty = async (req, res) => {
  try {
    const fields = extractPropertyFields(req.body);

    if (!fields.title || !fields.location || !fields.price)
      return res.status(400).json({ message: 'Title, location and price are required' });

    if (isNaN(fields.price) || Number(fields.price) <= 0)
      return res.status(400).json({ message: 'Price must be a valid positive number' });

    const property = await getPropertyById(req.params.id);
    if (!property)
      return res.status(404).json({ message: 'Property not found' });

    if (property.uploaded_by !== req.user.id)
      return res.status(403).json({ message: 'You can only edit your own properties' });

    if (req.files && req.files.length > 0) {
      const primaryImage = req.files[0];
      
      // delete old primary image
      if (property.image_public_id) {
        await cloudinary.uploader.destroy(property.image_public_id);
      }

      await updatePropertyWithImage(req.params.id, req.user.id, {
        ...fields,
        price: Number(fields.price),
        imageUrl: primaryImage.path,
        imagePublicId: primaryImage.filename,
      });
      
      // if we're replacing images, let's delete the old secondary ones
      // in a full implementation, you'd manage them individually, but here we replace all if new ones are uploaded
      const oldImages = await getPropertyImages(req.params.id);
      for (const img of oldImages) {
        if (img.image_public_id) {
          await cloudinary.uploader.destroy(img.image_public_id);
        }
      }
      await deleteImagesByProperty(req.params.id);
      
      if (req.files.length > 1) {
        for (let i = 1; i < req.files.length; i++) {
          await addPropertyImage(req.params.id, req.files[i].path, req.files[i].filename, i);
        }
      }
    } else {
      // no new image — just update the text fields
      await updateProperty(req.params.id, req.user.id, {
        ...fields,
        price: Number(fields.price),
      });
    }

    const updated = await getPropertyById(req.params.id);
    res.json({ message: 'Property updated successfully', property: updated });
  } catch (err) {
    console.error('Edit property error:', err);
    res.status(500).json({ message: 'Could not update property' });
  }
};

module.exports = { uploadProperty, getMyProperties, getSingleProperty, removeProperty, editProperty };