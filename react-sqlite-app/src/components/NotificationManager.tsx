"use client";

import { useState } from "react";

export function NotificationManager() {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const testEmail = async () => {
    setIsSending(true);
    setStatus("idle");
    try {
      const res = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Test de Notification 🚀',
          text: 'Bravo ! Votre système de notifications par email fonctionne parfaitement. Vous pouvez maintenant brancher ce système sur vos rappels de tâches.',
        })
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        console.error("Erreur serveur", await res.text());
      }
    } catch (err) {
      console.error("Failed to send email", err);
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={testEmail}
        disabled={isSending}
        className={`text-xs border px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
          status === "success" 
            ? "bg-emerald-900/40 text-emerald-400 border-emerald-900/50 hover:bg-emerald-900/60"
            : status === "error"
            ? "bg-red-900/40 text-red-400 border-red-900/50 hover:bg-red-900/60"
            : "bg-blue-900/40 text-blue-400 border-blue-900/50 hover:bg-blue-900/60 disabled:opacity-50"
        }`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {isSending ? "Envoi..." : status === "success" ? "Email envoyé !" : "Tester Email"}
      </button>
    </div>
  );
}
