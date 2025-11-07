import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/students/notifications');
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/students/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.isRead).map(n => 
          api.patch(`/api/students/notifications/${n._id}/read`)
        )
      );
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    return <Bell size={20} style={{ color: 'var(--accent)' }} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
             style={{ borderColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Notifications
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Stay updated with placement activities
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            <CheckCheck size={18} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                !notif.isRead ? 'border-l-4' : ''
              }`}
              style={{
                background: notif.isRead ? 'var(--bg-secondary)' : 'var(--accent)' + '10',
                borderColor: notif.isRead ? 'var(--border)' : 'var(--accent)',
                borderLeftColor: !notif.isRead ? 'var(--accent)' : 'var(--border)'
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 rounded-full"
                     style={{ background: 'var(--bg-primary)' }}>
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                    )}
                  </div>

                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {notif.message}
                  </p>

                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <Bell size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            No notifications yet
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            You'll receive updates about placement activities here
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
