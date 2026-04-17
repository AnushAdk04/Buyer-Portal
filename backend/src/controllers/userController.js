const { findById, updateProfile, updateAvatar, getAvatarPublicId, updatePassword } = require('../models/userModel');
const { cloudinary } = require('../config/cloudinary');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
  try {
    const user = await findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Could not fetch profile' });
  }
};

const editProfile = async (req, res) => {
  try {
    const { name, phone, bio } = req.body;

    if (!name || name.trim().length === 0)
      return res.status(400).json({ message: 'Name is required' });

    if (phone && !/^\+?[\d\s\-()]{7,20}$/.test(phone))
      return res.status(400).json({ message: 'Invalid phone number format' });

    await updateProfile(req.user.id, {
      name: name.trim(),
      phone: phone?.trim() || null,
      bio: bio?.trim() || null,
    });

    const user = await findById(req.user.id);
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Edit profile error:', err);
    res.status(500).json({ message: 'Could not update profile' });
  }
};

const changeAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'Image file is required' });

    // delete old avatar from cloudinary if exists
    const oldPublicId = await getAvatarPublicId(req.user.id);
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    await updateAvatar(req.user.id, req.file.path, req.file.filename);

    const user = await findById(req.user.id);
    res.json({ message: 'Profile picture updated successfully', user });
  } catch (err) {
    console.error('Change avatar error:', err);
    res.status(500).json({ message: 'Could not update profile picture' });
  }
};

const removeAvatar = async (req, res) => {
  try {
    const oldPublicId = await getAvatarPublicId(req.user.id);
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    await updateAvatar(req.user.id, null, null);

    const user = await findById(req.user.id);
    res.json({ message: 'Profile picture removed', user });
  } catch (err) {
    console.error('Remove avatar error:', err);
    res.status(500).json({ message: 'Could not remove profile picture' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Current and new password are required' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });

    if (currentPassword === newPassword)
      return res.status(400).json({ message: 'New password must be different from current password' });

    // get full user record including password_hash
    const { findByEmail } = require('../models/userModel');
    const fullUser = await findById(req.user.id);
    const userWithHash = await require('../models/userModel').findByEmail(fullUser.email);

    const isMatch = await bcrypt.compare(currentPassword, userWithHash.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: 'Current password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await updatePassword(req.user.id, newHash);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Could not change password' });
  }
};

module.exports = { getProfile, editProfile, changeAvatar, removeAvatar, changePassword };