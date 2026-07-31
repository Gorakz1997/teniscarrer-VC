import React from 'react';
import { Coffee } from 'lucide-react';

export default function Footer({ hasBottomNav = false }) {
  return (
    <footer className={`bg-zinc-950 border-t border-zinc-850 mt-8 py-8 px-4 text-center space-y-5 ${hasBottomNav ? 'pb-24' : 'pb-8'}`}>
      <div className="max-w-md mx-auto space-y-5">
        <p className="text-zinc-400 text-sm font-medium leading-relaxed">
          ¿Te gusta el juego? Apoya el desarrollo independiente invitándome un cafecito ☕
        </p>
        
        <a
          href="https://cafecito.app/tenismanager"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#00A3FF] hover:bg-[#0092E6] text-white font-black text-sm py-3.5 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#00A3FF]/20 mx-auto w-full sm:w-auto"
        >
          <Coffee className="w-5 h-5 fill-white/20" />
          <span>Invítame un Cafecito</span>
        </a>
        
        <div className="text-[10px] text-zinc-600 font-semibold pt-4">
          Tenis Manager Web &copy; 2026 - Desarrollado por un Dev Indie.
        </div>
      </div>
    </footer>
  );
}
