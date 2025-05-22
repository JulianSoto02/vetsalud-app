import React from 'react';
import { Notification } from '../../context/NotificationContext';
import { Calendar, Bell, BedDouble as Needle, Info, Check, Trash2 } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  const { id, title, message, type, read, date } = notification;

  // Format date to display relative time (e.g., "2 hours ago")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace un momento';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
    
    // For older notifications, show the actual date
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getNotificationIcon = () => {
    switch (type) {
      case 'appointment':
        return <Calendar className={`h-5 w-5 ${read ? 'text-gray-400' : 'text-blue-500'}`} />;
      case 'vaccination':
        return <Needle className={`h-5 w-5 ${read ? 'text-gray-400' : 'text-yellow-500'}`} />;
      case 'system':
        return <Info className={`h-5 w-5 ${read ? 'text-gray-400' : 'text-purple-500'}`} />;
      default:
        return <Bell className={`h-5 w-5 ${read ? 'text-gray-400' : 'text-teal-500'}`} />;
    }
  };

  const getBorderColor = () => {
    if (read) {
      return 'border-gray-200';
    }
    
    switch (type) {
      case 'appointment':
        return 'border-blue-200';
      case 'vaccination':
        return 'border-yellow-200';
      case 'system':
        return 'border-purple-200';
      default:
        return 'border-teal-200';
    }
  };

  const getBackgroundColor = () => {
    if (read) {
      return 'bg-white';
    }
    
    switch (type) {
      case 'appointment':
        return 'bg-blue-50';
      case 'vaccination':
        return 'bg-yellow-50';
      case 'system':
        return 'bg-purple-50';
      default:
        return 'bg-teal-50';
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border ${getBorderColor()} ${getBackgroundColor()} overflow-hidden transition-colors duration-200`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            {getNotificationIcon()}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`text-sm font-medium ${read ? 'text-gray-600' : 'text-gray-900'}`}>
                  {title}
                </h4>
                <p className={`text-sm mt-1 ${read ? 'text-gray-500' : 'text-gray-700'}`}>
                  {message}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(date)}
                </p>
              </div>
              <div className="flex space-x-2 ml-2">
                {!read && (
                  <button
                    onClick={() => onMarkAsRead(id)}
                    className="text-teal-600 hover:text-teal-800 focus:outline-none"
                    title="Marcar como leída"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(id)}
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                  title="Eliminar notificación"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;