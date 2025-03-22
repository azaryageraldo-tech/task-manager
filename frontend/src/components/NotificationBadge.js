import { useQuery } from '@tanstack/react-query';
import { Badge } from '@mui/material';
import { notificationService } from '../services/notificationService';

export default function NotificationBadge({ children }) {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      const notifications = await notificationService.getAllNotifications();
      return notifications.filter(n => !n.read).length;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <Badge badgeContent={unreadCount} color="error">
      {children}
    </Badge>
  );
}