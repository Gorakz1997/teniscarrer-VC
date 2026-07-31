import React, { useState } from 'react';
import PlayerCreation from './components/PlayerCreation';
import Dashboard from './components/Dashboard';
import Shop from './components/Shop';
import Palmares from './components/Palmares';
import { getRankingFromPoints } from './data/gameData';
import { simulateSeason } from './utils/seasonSimulator';
import { Trophy, Award, DollarSign, Activity, Calendar, Zap, Swords, ArrowLeft, ShoppingBag } from 'lucide-react';
import Footer from './components/Footer';

export default function App() {
  // 1. Estado Global del Juego
  const [player, setPlayer] = useState(null); // null = Creación de Jugador
  const [nemesis, setNemesis] = useState(null); // Rival Némesis
  const [year, setYear] = useState(1); // 1 a 4 años
  const [money, setMoney] = useState(5000); // Dinero inicial ($5000 USD)
  const [rankingPoints, setRankingPoints] = useState(0);
  const [ranking, setRanking] = useState(9999); // S/R
  const [hype, setHype] = useState(10); // Hype / Popularidad inicial
  
  const [nemesisRankingPoints, setNemesisRankingPoints] = useState(0);
  const [nemesisRanking, setNemesisRanking] = useState(9999);

  // Equipamiento activo en el año actual (se resetea cada año)
  const [activeGear, setActiveGear] = useState({
    encordado: false,
    zapatillas: false,
    raqueta: false
  });

  // Staff técnico contratado (es permanente una vez comprado)
  const [activeStaff, setActiveStaff] = useState({
    preparador: false,
    psicologo: false,
    entrenador: false
  });

  const [history, setHistory] = useState([]); // Historial de años simulados
  const [activeTab, setActiveTab] = useState('dashboard'); // Tabs: 'dashboard', 'palmares', 'shop'

  // Estadísticas acumuladas de carrera
  const [highestRanking, setHighestRanking] = useState(9999);
  const [matchRecord, setMatchRecord] = useState({ wins: 0, losses: 0 });
  const [titles, setTitles] = useState([]); // Vitrina de Trofeos acumulada
  const [totalEarnings, setTotalEarnings] = useState(0); // Total de ganancias en premios

  // Estados de simulación y reportes
  const [seasonReport, setSeasonReport] = useState(null);
  const [isSimulatingSeason, setIsSimulatingSeason] = useState(false);
  const [showYearEndReport, setShowYearEndReport] = useState(false);

  // Inicializar jugador y némesis al crear perfil
  const handleCreatePlayer = (playerData, nemesisData) => {
    setPlayer(playerData);
    setNemesis(nemesisData);
    setMoney(5000);
    setRankingPoints(0);
    setRanking(9999);
    setHype(10);
    setNemesisRankingPoints(0);
    setNemesisRanking(9999);
    setActiveGear({ encordado: false, zapatillas: false, raqueta: false });
    setActiveStaff({ preparador: false, psicologo: false, entrenador: false });
    setSeasonReport(null);
    setIsSimulatingSeason(false);
    setShowYearEndReport(false);
    setHistory([]);
    setHighestRanking(9999);
    setMatchRecord({ wins: 0, losses: 0 });
    setTitles([]);
    setTotalEarnings(0);
    setActiveTab('dashboard');
  };

  // Compra de artículos en la tienda
  const handleBuyItem = (item) => {
    if (money < item.price) return;

    setMoney((prev) => prev - item.price);
    const updatedGear = { ...activeGear };
    const updatedStaff = { ...activeStaff };
    const updatedPlayer = { ...player };

    if (item.category === 'gear') {
      updatedGear[item.id] = true;
    } else if (item.category === 'staff') {
      updatedStaff[item.id] = true;
      if (item.id === 'psicologo') {
        // Incremento inmediato y permanente al atributo temple
        updatedPlayer.stats.clutch = Math.min(99, updatedPlayer.stats.clutch + 8);
        setPlayer(updatedPlayer);
      }
    }

    setActiveGear(updatedGear);
    setActiveStaff(updatedStaff);
  };

  // Ejecuta la simulación completa de la temporada
  const handleSimulateYear = () => {
    setIsSimulatingSeason(true);
    
    // Llamar al motor de simulación de temporada
    const report = simulateSeason({
      player,
      nemesis,
      year,
      gear: activeGear,
      staff: activeStaff,
      currentRankingPoints: rankingPoints,
      nemesisRankingPoints,
      currentHype: hype,
      currentMoney: money
    });

    // Guardar el reporte. Dashboard se encargará de la animación paso a paso
    setSeasonReport(report);
  };

  // Aplica la mejora de stats anual (crecimiento natural decreciente + staff técnico)
  const applyYearEndProgression = (currentPlayer, currentStaff, currentAge) => {
    const nextPlayer = { ...currentPlayer };

    // 1. Crecimiento natural según la edad
    let ageGrowth = 5;
    if (currentAge === 15) ageGrowth = 4;
    else if (currentAge === 16) ageGrowth = 3;
    else if (currentAge >= 17) ageGrowth = 2;

    const technicalStats = ['forehand', 'backhand', 'serve', 'volley', 'returnOfServe'];
    const physicalStats = ['power', 'speed', 'stamina', 'agility', 'flexibility'];
    const mentalStats = ['aggressiveness', 'clutch', 'focus', 'adaptability'];

    // Crecimiento base a todos los atributos
    const allStats = [...technicalStats, ...physicalStats, ...mentalStats];
    allStats.forEach(stat => {
      nextPlayer.stats[stat] = Math.min(99, nextPlayer.stats[stat] + ageGrowth);
    });

    // 2. Bonos del Staff contratado
    if (currentStaff.entrenador) {
      technicalStats.forEach(stat => {
        nextPlayer.stats[stat] = Math.min(99, nextPlayer.stats[stat] + 4);
      });
    }
    if (currentStaff.preparador) {
      physicalStats.forEach(stat => {
        nextPlayer.stats[stat] = Math.min(99, nextPlayer.stats[stat] + 4);
      });
    }
    if (currentStaff.psicologo) {
      mentalStats.forEach(stat => {
        nextPlayer.stats[stat] = Math.min(99, nextPlayer.stats[stat] + 4);
      });
    }

    return nextPlayer;
  };

  const applyNemesisYearEndProgression = (currentNemesis, currentAge) => {
    const nextNemesis = { ...currentNemesis };
    let growth = 5;
    if (currentAge === 15) growth = 4;
    else if (currentAge === 16) growth = 3;
    else if (currentAge >= 17) growth = 2;

    Object.keys(nextNemesis.stats).forEach(stat => {
      nextNemesis.stats[stat] = Math.min(99, nextNemesis.stats[stat] + growth);
    });

    return nextNemesis;
  };

  // Clic de confirmación para pasar al año siguiente
  const handleProceedToNextYear = () => {
    if (!seasonReport) return;

    const age = 14 + (year - 1);
    
    // Aplicar progresiones de estadísticas
    const updatedPlayer = applyYearEndProgression(player, activeStaff, age);
    const updatedNemesis = applyNemesisYearEndProgression(nemesis, age);

    // Actualizar estados
    setPlayer(updatedPlayer);
    setNemesis(updatedNemesis);
    
    setRankingPoints(seasonReport.finalPoints);
    setRanking(seasonReport.finalRanking);
    setHype(seasonReport.finalHype);
    setNemesisRankingPoints(seasonReport.nemesisFinalPoints);
    setNemesisRanking(seasonReport.nemesisFinalRanking);
    setMoney(money + seasonReport.totalMoneyEarned);

    // Acumular carrera
    setMatchRecord((prev) => ({
      wins: prev.wins + seasonReport.wins,
      losses: prev.losses + seasonReport.losses
    }));
    setTitles((prev) => [...prev, ...seasonReport.titlesWon]);
    setTotalEarnings((prev) => prev + seasonReport.prizeMoneyEarned);

    if (seasonReport.finalRanking < highestRanking) {
      setHighestRanking(seasonReport.finalRanking);
    }

    // Registrar en el historial
    setHistory((prev) => [
      ...prev,
      {
        year,
        report: seasonReport,
        playerStats: { ...player.stats },
        nemesisStats: { ...nemesis.stats }
      }
    ]);

    // Vaciar el equipamiento consumible/anual comprado
    setActiveGear({
      encordado: false,
      zapatillas: false,
      raqueta: false
    });

    // Incrementar año
    setYear((prev) => prev + 1);

    // Limpiar reportes
    setSeasonReport(null);
    setIsSimulatingSeason(false);
    setShowYearEndReport(false);
    setActiveTab('dashboard');
  };

  // Reiniciar partida
  const handleResetGame = () => {
    setPlayer(null);
    setNemesis(null);
    setYear(1);
    setMoney(5000);
    setRankingPoints(0);
    setRanking(9999);
    setHype(10);
    setNemesisRankingPoints(0);
    setNemesisRanking(9999);
    setActiveGear({ encordado: false, zapatillas: false, raqueta: false });
    setActiveStaff({ preparador: false, psicologo: false, entrenador: false });
    setHistory([]);
    setHighestRanking(9999);
    setMatchRecord({ wins: 0, losses: 0 });
    setTitles([]);
    setTotalEarnings(0);
    setSeasonReport(null);
    setIsSimulatingSeason(false);
    setShowYearEndReport(false);
    setActiveTab('dashboard');
  };

  const isGameOver = year > 4;

  // --- MODO: GAME OVER (Carrera terminada tras simular el Año 4) ---
  if (player && isGameOver) {
    const winRate = matchRecord.wins + matchRecord.losses > 0 
      ? Math.round((matchRecord.wins / (matchRecord.wins + matchRecord.losses)) * 100) 
      : 0;

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between py-8 px-4 sm:px-6">
        <div className="max-w-md mx-auto w-full text-center space-y-5">
          <div className="space-y-1.5">
            <span className="text-lime-400 font-extrabold text-xs tracking-widest uppercase block">CARRERA JUVENIL COMPLETADA</span>
            <h1 className="text-3xl font-black tracking-tight text-zinc-100 flex items-center justify-center gap-1.5">
              <Award className="w-8 h-8 text-yellow-400" /> RESUMEN DE LEYENDA
            </h1>
            <p className="text-zinc-400 text-sm">
              Has culminado tus 4 años de carrera junior (Edades 14 a 18). ¡Este es el legado final de {player.name}!
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="border-b border-zinc-800 pb-3 flex justify-between items-center text-left">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-100">{player.name}</h3>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                  {player.country.flag} {player.country.name} • {player.styleName}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase">Mejor Ranking</span>
                <span className="text-lg font-black text-yellow-400">
                  {highestRanking === 9999 ? 'S/R' : `#${highestRanking}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs text-left">
              <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl">
                <span className="text-zinc-500 font-bold uppercase text-[9px] block mb-1">Récord de Partidos</span>
                <span className="font-black text-zinc-200 text-sm">
                  {matchRecord.wins}V - {matchRecord.losses}D
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Efectividad: {winRate}%</span>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl">
                <span className="text-zinc-500 font-bold uppercase text-[9px] block mb-1">Títulos ITF</span>
                <span className="font-black text-lime-400 text-sm flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                  {titles.length} {titles.length === 1 ? 'Título' : 'Títulos'}
                </span>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl col-span-2 flex justify-between items-center">
                <div>
                  <span className="text-zinc-500 font-bold uppercase text-[9px] block mb-0.5">Premios Totales Ganados</span>
                  <span className="font-black text-emerald-400 text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEarnings)}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">Hype Final: {hype}</span>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-3.5 text-left space-y-2">
              <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block">Estadísticas Finales</span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-400">Derecha</span>
                  <span className="font-bold text-zinc-200">{player.stats.forehand}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-400">Servicio</span>
                  <span className="font-bold text-zinc-200">{player.stats.serve}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-400">Revés</span>
                  <span className="font-bold text-zinc-200">{player.stats.backhand}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-400">Volea</span>
                  <span className="font-bold text-zinc-200">{player.stats.volley}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-400">Fuerza</span>
                  <span className="font-bold text-zinc-200">{player.stats.power}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-400">Velocidad</span>
                  <span className="font-bold text-zinc-200">{player.stats.speed}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1 col-span-3">
                  <span className="text-zinc-400">Temple (Clutch)</span>
                  <span className="font-bold text-zinc-200">{player.stats.clutch}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleResetGame}
            className="w-full bg-lime-400 text-zinc-950 font-extrabold text-sm uppercase tracking-wider py-4 rounded-xl hover:bg-lime-300 active:scale-[0.99] transition cursor-pointer shadow-lg shadow-lime-400/10"
          >
            Nueva Partida (Reiniciar)
          </button>
        </div>
        <div className="mt-8">
          <Footer />
        </div>
      </div>
    );
  }

  // --- MODO: CREACIÓN DE JUGADOR ---
  if (!player) {
    return <PlayerCreation onCreatePlayer={handleCreatePlayer} />;
  }

  // Mapear inventario para pasarlo a Shop
  const mappedInventory = {
    encordado: activeGear.encordado,
    zapatillas: activeGear.zapatillas,
    raqueta: activeGear.raqueta,
    preparador: activeStaff.preparador,
    psicologo: activeStaff.psicologo,
    entrenador: activeStaff.entrenador
  };

  // --- MODO: TABS REGULARES ---
  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col">
      <div className="flex-grow relative">
      {/* Tab: Dashboard (Muestra el menú del año y la simulación) */}
      {activeTab === 'dashboard' && (
        <Dashboard
          player={player}
          nemesis={nemesis}
          year={year}
          money={money}
          rankingPoints={rankingPoints}
          ranking={ranking}
          hype={hype}
          nemesisRankingPoints={nemesisRankingPoints}
          nemesisRanking={nemesisRanking}
          activeGear={activeGear}
          activeStaff={activeStaff}
          seasonReport={seasonReport}
          isSimulatingSeason={isSimulatingSeason}
          setIsSimulatingSeason={setIsSimulatingSeason}
          showYearEndReport={showYearEndReport}
          setShowYearEndReport={setShowYearEndReport}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSimulateYear={handleSimulateYear}
          onProceedToNextYear={handleProceedToNextYear}
          onBuyItem={handleBuyItem}
          history={history}
        />
      )}

      {/* Tab: Palmarés */}
      {activeTab === 'palmares' && (
        <div>
          <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <div className="text-right">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">Mejor Ranking</span>
              <span className="text-xs font-black text-yellow-400">
                {highestRanking === 9999 ? 'S/R' : `#${highestRanking}`}
              </span>
            </div>
          </div>
          <Palmares
            player={player}
            highestRanking={highestRanking}
            matchRecord={matchRecord}
            titles={titles}
            totalEarnings={totalEarnings}
          />
        </div>
      )}

      {/* Tab: Tienda */}
      {activeTab === 'shop' && (
        <div>
          <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <div className="text-right">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">PRESUPUESTO</span>
              <span className="text-xs font-black text-emerald-400">
                ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(money)}
              </span>
            </div>
          </div>
          <Shop
            money={money}
            inventory={mappedInventory}
            onBuyItem={handleBuyItem}
          />
        </div>
      )}
      </div>

      <Footer hasBottomNav={true} />

      {/* Barra de Navegación Inferior */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 py-2.5 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-3 text-center">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'dashboard' ? 'text-lime-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Simulación</span>
          </button>

          <button 
            onClick={() => setActiveTab('palmares')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'palmares' ? 'text-lime-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Palmarés</span>
          </button>

          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'shop' ? 'text-lime-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Tienda</span>
          </button>
        </div>
      </div>
    </div>
  );
}


