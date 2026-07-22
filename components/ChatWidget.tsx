'use client';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '16124878228'; // +1 (612) 487-8228, digits only, no leading +

export default function ChatWidget() {
  return (
    <div className="chat-widget">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex items-center gap-2 bg-black text-white px-4 py-3 rounded-full shadow-lg hover:bg-black/80 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Chat with us</span>
      </a>
    </div>
  );
}