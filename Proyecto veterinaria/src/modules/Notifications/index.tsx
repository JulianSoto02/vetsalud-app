import React from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { useNotifications, Notification } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';

const Notifications: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  // Sort notifications by date (newest first) and group by read status
  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const unreadNotifications = sortedNotifications.filter(notification => !notification.read);
  const readNotifications = sortedNotifications.filter(notification => notification.read);

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Bell className="mr-2 h-6 w-6 text-teal-600" />
            Notificaciones
          </h2>
          <p className="text-gray-600">Recordatorios de citas y vacunas</p>
        </div>
        {unreadNotifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center text-teal-600 hover:text-teal-800 focus:outline-none focus:underline"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {unreadNotifications.length === 0 && readNotifications.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500">No hay notificaciones.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {unreadNotifications.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <span className="relative mr-2">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2.5 h-2.5"></span>
                </span>
                No leídas ({unreadNotifications.length})
              </h3>
              <div className="space-y-3">
                {unreadNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            </div>
          )}

          {readNotifications.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Leídas ({readNotifications.length})
              </h3>
              <div className="space-y-3">
                {readNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;