import { useState, useEffect, useCallback } from "react";

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/inapp-notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    // Polling toutes les 30 secondes pour mettre à jour les notifications en temps réel
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    try {
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      await fetch(`http://localhost:4000/api/inapp-notifications/${id}/read`, { method: "PUT" });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      await fetch("http://localhost:4000/api/inapp-notifications/read-all", { method: "PUT" });
    } catch (e) {
      console.error(e);
    }
  };

  return { 
    notifications, 
    loading, 
    unreadCount: notifications.filter(n => !n.isRead).length,
    markAsRead, 
    markAllAsRead, 
    refresh: fetchNotifications 
  };
}
