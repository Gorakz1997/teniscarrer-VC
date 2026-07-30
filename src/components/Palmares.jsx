import React from 'react';
import { Trophy, Award, DollarSign, Activity, Calendar, ShieldAlert, Star } from 'lucide-react';

export default function Palmares({ 
  player, 
  highestRanking, 
  matchRecord, 
  titles, 
  totalEarnings 
}) {
  const winRate = matchRecord.wins + matchRecord.losses > 0 
    ? Math.round((matchRecord.wins / (matchRecord.wins + matchRecord.losses)) * 100) 
    : 0;

  // Determinar el torneo más importante ganado
  const getMostImportantTitle = () => {
    if (!titles || titles.length === 0) return 'Ninguno';
    
    // Jerarquía de categorías
    const tierPriority = { JGS: 7, J500: 6, J300: 5, J200: 4, J100: 3, J60: 2, J30: 1 };
    
    let bestTitle = titles[0];
    titles.forEach(t => {
      const currentPriority = tierPriority[t.tier] || 0;
      const bestPriority = tierPriority[bestTitle.tier] || 0;
      if (currentPriority > bestPriority) {
        bestTitle = t;
      }
    });

    return `${bestTitle.name} (${bestTitle.tier})`;
  };

  // Asignar colores e impacto a los trofeos según tier
  const getTrophyStyle = (tier) => {
    switch (tier) {
      case 'JGS':
        return { color: 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]', label: 'Grand Slam Junior' };
      case 'J500':
      case 'J300':
        return { color: 'text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.3)]', label: `Tier ${tier}` };
      case 'J200':
      case 'J100':
        return { color: 'text-zinc-300', label: `Tier ${tier}` };
      default:
        return { color: 'text-amber-600', label: `Tier ${tier}` };
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 pt-4 space-y-5 pb-24">
      {/* Cabecera de Sección */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-lime-400 flex items-center justify-center gap-2">
          <Award className="w-6 h-6" /> Palmarés y Vitrina de Leyenda
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Visualiza los trofeos conquistados y las estadísticas históricas de tu trayectoria junior.
        </p>
      </div>

      {/* Récords y Estadísticas de Carrera */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg space-y-3.5">
        <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block border-b border-zinc-800 pb-1.5">
          RÉCORDS PERSONALES
        </span>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Mejor Ranking */}
          <div className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl">
            <span className="text-zinc-500 font-bold uppercase text-[9px] block mb-0.5">Mejor Ranking ITF</span>
            <span className="font-black text-yellow-400 text-sm flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              {highestRanking === 9999 ? 'S/R' : `#${highestRanking}`}
            </span>
          </div>

          {/* Récord de Partidos */}
          <div className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl">
            <span className="text-zinc-500 font-bold uppercase text-[9px] block mb-0.5">Récord Partidos</span>
            <span className="font-black text-zinc-200 text-sm block">
              {matchRecord.wins}V - {matchRecord.losses}D
            </span>
            <span className="text-[9px] text-zinc-400">Efectividad: {winRate}%</span>
          </div>

          {/* Torneo más importante ganado */}
          <div className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl col-span-2 flex items-center justify-between">
            <div>
              <span className="text-zinc-500 font-bold uppercase text-[9px] block mb-0.5">Torneo Más Importante</span>
              <span className="font-black text-lime-400 text-xs">
                {getMostImportantTitle()}
              </span>
            </div>
            <Star className="w-5 h-5 text-yellow-400 shrink-0 fill-yellow-400/20" />
          </div>

          {/* Total Recaudado */}
          <div className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl col-span-2 flex items-center justify-between">
            <div>
              <span className="text-zinc-500 font-bold uppercase text-[9px] block mb-0.5">Dinero Acumulado (Torneos)</span>
              <span className="font-black text-emerald-400 text-sm">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEarnings)}
              </span>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* Vitrina de Trofeos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg space-y-3">
        <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block border-b border-zinc-800 pb-1.5">
          VITRINA DE TROFEOS ({titles.length})
        </span>

        {titles.length === 0 ? (
          <div className="text-center py-6 space-y-2 bg-zinc-950/40 border border-dashed border-zinc-850 rounded-xl">
            <Trophy className="w-10 h-10 text-zinc-700 mx-auto" />
            <p className="text-xs text-zinc-500 italic">No posees trofeos en tu vitrina todavía. ¡Comienza a competir!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 max-h-80 overflow-y-auto pr-1">
            {titles.map((title, idx) => {
              const trophyStyle = getTrophyStyle(title.tier);
              return (
                <div 
                  key={idx} 
                  className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl flex items-center gap-3.5"
                >
                  <Trophy className={`w-8 h-8 shrink-0 ${trophyStyle.color}`} />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="font-extrabold text-xs text-zinc-100 truncate">{title.name}</h4>
                      <span className="text-[9px] bg-zinc-900 px-2 py-0.5 rounded font-black text-zinc-400 border border-zinc-850 shrink-0">
                        {title.tier}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Rival: <span className="text-zinc-200 font-medium">{title.rivalName}</span></span>
                      <span className="font-bold text-lime-400">{title.score}</span>
                    </div>
                    <div className="text-[9px] text-zinc-500 flex items-center justify-between">
                      <span>Superficie: {title.surface}</span>
                      <span>Año {Math.ceil(title.week / 52)}, Sem {((title.week - 1) % 52) + 1}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
