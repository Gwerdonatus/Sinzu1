'use client';
import { useEffect, useState } from 'react';
interface Piece { id: number; x: number; delay: number; duration: number; color: string; shape: string; size: number; }
export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  useEffect(() => {
    const colors = ['#FF1493','#FF69B4','#FFA500','#FFD700','#9370DB','#FF6347','#FF4500','#DA70D6','#00CED1','#32CD32'];
    const shapes = ['❤️','⭐','●','▲','■','◆','✦','✿'];
    setPieces(Array.from({ length: 50 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 6, duration: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)], shape: shapes[Math.floor(Math.random() * shapes.length)], size: 10 + Math.random() * 18,
    })));
  }, []);
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{ left: `${p.x}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, fontSize: `${p.size}px`, color: p.color }}>{p.shape}</div>
      ))}
    </div>
  );
}
