"use client";

import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={dropdownRef}>
      {/* Dropdown Menu (ouvre vers le haut) */}
      {isOpen && (
        <div className="mb-3 w-80 max-h-[400px] flex flex-col bg-[#23201f] border border-stone-800 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-bottom-right transition-all">
          <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900/50">
            <h3 className="font-bold text-stone-200">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-orange-400 hover:text-orange-300 font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-stone-500 text-sm">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y divide-stone-800/50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      if (!notif.isRead) markAsRead(notif.id);
                    }}
                    className={`p-4 cursor-pointer transition-colors ${notif.isRead ? 'opacity-60 hover:bg-stone-800/30' : 'bg-stone-800/20 hover:bg-stone-800/50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-semibold flex items-center gap-2 ${notif.isRead ? 'text-stone-300' : 'text-orange-400'}`}>
                        {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>}
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-stone-500 whitespace-nowrap">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 leading-snug ml-3.5">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bell Button (Bubble) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_20px_rgba(234,88,12,0.5)] hover:scale-110 active:scale-95"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-orange-600 shadow-sm flex items-center justify-center">
            <span className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></span>
          </span>
        )}
      </button>
    </div>
  );
}
