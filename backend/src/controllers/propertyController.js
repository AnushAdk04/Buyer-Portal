const { createProperty, getPropertiesByUser, getPropertyById, deleteProperty, updateProperty, updatePropertyWithImage } = require('../models/propertyModel');
const { cloudinary } = require('../config/cloudinary');

const uploadProperty = async (req, res) => {
  try {
    const { title, location, price, description } = req.body;

    if (!title || !location || !price)
      return res.status(400).json({ message: 'Title, location and price are required' });

    if (!req.file)
      return res.status(400).json({ message: 'Property image is required' });

    if (isNaN(price) || Number(price) <= 0)
      return res.status(400).json({ message: 'Price must be a valid positive number' });

    const propertyId = await createProperty({
      title,
      location,
      price: Number(price),
      description: description || null,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      uploadedBy: req.user.id,
    });

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

    if (property.image_public_id) {
      await cloudinary.uploader.destroy(property.image_public_id);
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
    const { title, location, price, description } = req.body;

    if (!title || !location || !price)
      return res.status(400).json({ message: 'Title, location and price are required' });

    if (isNaN(price) || Number(price) <= 0)
      return res.status(400).json({ message: 'Price must be a valid positive number' });

    const property = await getPropertyById(req.params.id);
    if (!property)
      return res.status(404).json({ message: 'Property not found' });

    if (property.uploaded_by !== req.user.id)
      return res.status(403).json({ message: 'You can only edit your own properties' });

    if (req.file) {
      // new image uploaded — delete old one from cloudinary first
      if (property.image_public_id) {
        await cloudinary.uploader.destroy(property.image_public_id);
      }

      await updatePropertyWithImage(req.params.id, req.user.id, {
        title,
        location,
        price: Number(price),
        description: description || null,
        imageUrl: req.file.path,
        imagePublicId: req.file.filename,
      });
    } else {
      // no new image — just update the text fields
      await updateProperty(req.params.id, req.user.id, {
        title,
        location,
        price: Number(price),
        description: description || null,
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