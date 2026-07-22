'use client';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
export default function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(); target.setDate(target.getDate() + 30);
    const iv = setInterval(() => {
      const d = target.getTime() - new Date().getTime();
      if (d > 0) setTime({ days: Math.floor(d/(1000*60*60*24)), hours: Math.floor((d%(1000*60*60*24))/(1000*60*60)), minutes: Math.floor((d%(1000*60*60))/(1000*60)), seconds: Math.floor((d%(1000*60))/1000) });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const fmt = (n: number) => n.toString().padStart(2, '0');
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><span className="text-lg">🥳</span><span className="font-serif text-sm font-semibold">ARIES COLLECTION</span></div>
        <Clock className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center justify-center gap-1.5">
        {[{v:time.days,l:'days'},{v:time.hours,l:'hours'},{v:time.minutes,l:'minutes'},{v:time.seconds,l:'seconds'}].map((t,i) => (
          <div key={t.l} className="flex items-center gap-1.5">
            {i>0 && <span className="text-xl font-bold text-gray-300">:</span>}
            <div className="text-center"><div className="countdown-digit"><span className="font-mono text-lg font-bold">{fmt(t.v)}</span></div><span className="text-[9px] text-gray-500 uppercase">{t.l}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
