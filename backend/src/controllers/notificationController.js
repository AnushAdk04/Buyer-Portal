const Notification = require('../models/notificationModel');

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findByUserId(userId);
    const unreadCount = await Notification.getUnreadCount(userId);
    
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await Notification.markAsRead(notificationId, userId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or unauthorized' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.markAllAsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead
};
