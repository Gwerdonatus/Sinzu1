import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GetTheLook() {
  return (
    <section className="px-4 mb-8 text-center">
      <h3 className="font-serif text-2xl mb-4">Get the Look</h3>
      <button className="border border-gray-800 px-10 py-2.5 text-[11px] tracking-[3px] uppercase hover:bg-gray-900 hover:text-white transition-all">
        SHOP
      </button>
      <div className="flex items-center justify-center gap-4 mt-4">
        <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer" />
        <span className="text-sm text-gray-500">1/3</span>
        <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>
    </section>
  );
}