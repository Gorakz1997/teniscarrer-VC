import React from 'react';
import { SHOP_ITEMS } from '../data/gameData';
import { 
  ShoppingBag, DollarSign, Activity, Footprints, 
  UserPlus, Brain, CheckCircle2, AlertCircle, ShoppingCart 
} from 'lucide-react';

export default function Shop({ 
  money, 
  inventory, 
  onBuyItem 
}) {

  // Mapear string a icono de Lucide
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-6 h-6 text-cyan-400" />;
      case 'Footprints':
        return <Footprints className="w-6 h-6 text-lime-400" />;
      case 'UserPlus':
        return <UserPlus className="w-6 h-6 text-yellow-400" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-purple-400" />;
      default:
        return <ShoppingBag className="w-6 h-6 text-zinc-400" />;
    }
  };

  const isItemOwned = (item) => {
    return !!inventory[item.id];
  };

  const handlePurchase = (item) => {
    if (money < item.price) {
      alert('¡Presupuesto insuficiente! No puedes costear este artículo.');
      return;
    }

    onBuyItem(item);
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 pt-4 space-y-5 pb-24">
      {/* Cabecera de Sección */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-lime-400 flex items-center justify-center gap-2">
          <ShoppingBag className="w-6 h-6" /> Tienda y Patrocinio Junior
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Invierte tu presupuesto en equipamiento de alta calidad y personal técnico para potenciar tu carrera.
        </p>
      </div>

      {/* Tarjeta de Presupuesto */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-lime-400" />
          <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest">Presupuesto Disponible:</span>
        </div>
        <span className="text-xl font-black text-emerald-400 flex items-center">
          <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(money)}
        </span>
      </div>

      {/* Listado de Artículos */}
      <div className="space-y-4">
        {SHOP_ITEMS.map((item) => {
          const owned = isItemOwned(item);
          const isAffordable = money >= item.price;
          const isEquipment = item.category === 'gear';

          return (
            <div 
              key={item.id} 
              className={`bg-zinc-900 border rounded-2xl p-4 transition-all duration-200 ${
                owned && !item.consumable
                  ? 'border-zinc-800 opacity-70 bg-zinc-950/20' 
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl shrink-0 mt-0.5">
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-sm text-zinc-100">{item.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 bg-zinc-800 text-zinc-400 rounded-full">
                        {isEquipment ? 'Equipamiento' : 'Staff Técnico'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{item.description}</p>
                    
                    {/* Indicación de posesión para consumibles */}
                    {item.consumable && inventory.encordado > 0 && (
                      <span className="inline-block mt-2 text-[10px] bg-cyan-950/30 text-cyan-400 border border-cyan-500/25 px-2 py-0.5 rounded font-bold">
                        Posees: {inventory.encordado} torneos restantes
                      </span>
                    )}
                  </div>
                </div>

                {/* Precio */}
                <div className="text-right shrink-0 font-black text-sm text-emerald-400 flex items-center">
                  <DollarSign className="w-3.5 h-3.5" />
                  {item.price}
                </div>
              </div>

              {/* Botón de Acción */}
              <div className="mt-4">
                {owned && !item.consumable ? (
                  <button 
                    disabled 
                    className="w-full bg-zinc-800 text-zinc-500 font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl border border-zinc-750/30 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-zinc-600" /> Ya Adquirido
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!isAffordable}
                    className={`w-full font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition cursor-pointer active:scale-[0.98] ${
                      !isAffordable
                        ? 'bg-zinc-800 text-zinc-500 border border-zinc-750/30 cursor-not-allowed'
                        : 'bg-lime-400 text-zinc-950 hover:bg-lime-300 shadow-md shadow-lime-400/5'
                    }`}
                  >
                    {item.consumable && inventory.encordado > 0 ? 'Comprar Cargas Extras' : 'Adquirir / Contratar'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
