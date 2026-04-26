const { getFavourites, addFavourite, removeFavourite, isFavourite } = require('../models/favouriteModel');
const db = require('../config/db');

const listFavourites = async (req, res) => {
  try {
    const favourites = await getFavourites(req.user.id);
    res.json({ favourites });
  } catch (err) {
    console.error('List favourites error:', err);
    res.status(500).json({ message: 'Could not fetch favourites' });
  }
};

const add = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId)
      return res.status(400).json({ message: 'propertyId is required' });

    const { rows: props } = await db.query('SELECT id FROM properties WHERE id = $1', [propertyId]);
    if (props.length === 0)
      return res.status(404).json({ message: 'Property not found' });

    const already = await isFavourite(req.user.id, propertyId);
    if (already)
      return res.status(409).json({ message: 'Already in favourites' });

    await addFavourite(req.user.id, propertyId);
    res.status(201).json({ message: 'Added to favourites' });
  } catch (err) {
    console.error('Add favourite error:', err);
    res.status(500).json({ message: 'Could not add favourite' });
  }
};

const remove = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const affected = await removeFavourite(req.user.id, propertyId);
    if (affected === 0)
      return res.status(404).json({ message: 'Favourite not found' });
    res.json({ message: 'Removed from favourites' });
  } catch (err) {
    console.error('Remove favourite error:', err);
    res.status(500).json({ message: 'Could not remove favourite' });
  }
};

const listAllProperties = async (req, res) => {
  try {
    const { rows: properties } = await db.query(
      'SELECT * FROM properties ORDER BY created_at DESC'
    );
    const favourites = await getFavourites(req.user.id);
    const favIds = new Set(favourites.map(f => f.id));

    const result = properties.map(p => ({
      ...p,
      isFavourite: favIds.has(p.id)
    }));

    res.json({ properties: result });
  } catch (err) {
    console.error('List properties error:', err);
    res.status(500).json({ message: 'Could not fetch properties' });
  }
};

module.exports = { listFavourites, add, remove, listAllProperties };