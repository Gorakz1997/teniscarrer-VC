import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Swords, DollarSign, Calendar, Zap, Award, 
  Activity, ArrowRight, ShieldAlert, Sparkles, ShoppingBag, 
  Flame, TrendingUp, User, Play, RefreshCw, BarChart2, Star,
  Compass, AlertCircle, Heart, UserPlus, HeartHandshake
} from 'lucide-react';
import Shop from './Shop';

export default function Dashboard({ 
  player, 
  nemesis, 
  year, 
  money, 
  rankingPoints, 
  ranking, 
  hype, 
  nemesisRankingPoints, 
  nemesisRanking, 
  activeGear, 
  activeStaff, 
  seasonReport, 
  isSimulatingSeason, 
  setIsSimulatingSeason, 
  showYearEndReport, 
  setShowYearEndReport, 
  activeTab, 
  setActiveTab, 
  onSimulateYear, 
  onProceedToNextYear, 
  onBuyItem,
  history 
}) {
  const age = 14 + (year - 1);

  // Estados locales para la animación del ticker de simulación
  const [animatedIndex, setAnimatedIndex] = useState(-1);
  const [showSummaryButton, setShowSummaryButton] = useState(false);
  const logEndRef = useRef(null);

  // Estado local para las subpestañas del reporte de fin de año
  const [summaryTab, setSummaryTab] = useState('metrics'); // 'metrics', 'nemesis', 'palmares', 'upgrades'

  // Formateador de dinero
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  // Ticker de simulación
  useEffect(() => {
    if (isSimulatingSeason && seasonReport) {
      setAnimatedIndex(0);
      setShowSummaryButton(false);
      
      const interval = setInterval(() => {
        setAnimatedIndex((prev) => {
          if (prev >= seasonReport.tournamentLogs.length - 1) {
            clearInterval(interval);
            setShowSummaryButton(true);
            return prev;
          }
          return prev + 1;
        });
      }, 250); // Muestra un torneo cada 250ms
      
      return () => clearInterval(interval);
    }
  }, [isSimulatingSeason, seasonReport]);

  // Auto scroll para la bitácora de simulación
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [animatedIndex]);

  // Si se presiona el botón para ir a los reportes
  const handleOpenReport = () => {
    setIsSimulatingSeason(false);
    setShowYearEndReport(true);
    setSummaryTab('metrics');
  };

  // Color de badge de superficie
  const getSurfaceBadge = (surf) => {
    switch (surf) {
      case 'Clay': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Grass': return 'bg-lime-500/10 text-lime-400 border-lime-500/20';
      case 'Hard': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  // --- MODO A: SIMULACIÓN DE TEMPORADA EN PROGRESO (Bitácora Ticker) ---
  if (isSimulatingSeason && seasonReport) {
    const progressPercent = Math.min(100, Math.round(((animatedIndex + 1) / seasonReport.tournamentLogs.length) * 100));
    const activeLogs = seasonReport.tournamentLogs.slice(0, animatedIndex + 1);

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between py-6 px-4">
        <div className="max-w-md mx-auto w-full space-y-4 flex-grow flex flex-col justify-between">
          
          {/* Header de Simulación */}
          <div className="text-center space-y-1">
            <span className="text-xs bg-lime-400/10 text-lime-400 border border-lime-400/20 font-black tracking-widest px-3 py-1 rounded-full uppercase inline-block">
              Simulando Año {year}
            </span>
            <h2 className="text-2xl font-black text-zinc-100 tracking-tight flex items-center justify-center gap-1.5 pt-1">
              <RefreshCw className="w-6 h-6 text-lime-400 animate-spin" /> PROCESANDO TEMPORADA
            </h2>
            <p className="text-zinc-400 text-xs leading-relaxed">
              El motor está simulando la temporada junior de ~18 torneos basándose en tu ranking y equipamiento contratado.
            </p>
          </div>

          {/* Barra de Progreso */}
          <div className="bg-zinc-900 border border-zinc-850 p-3 rounded-2xl space-y-2">
            <div className="flex justify-between text-xs font-bold text-zinc-400">
              <span>Semana {animatedIndex >= 0 ? seasonReport.tournamentLogs[animatedIndex].week : 0} de 52</span>
              <span className="text-lime-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-md shadow-lime-400/20"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Bitácora de Torneos en Tiempo Real */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex-grow max-h-[360px] min-h-[300px] overflow-y-auto space-y-2.5 shadow-inner">
            {activeLogs.map((log, idx) => {
              const isWin = log.roundReached === 'Campeón';
              const isFinal = log.roundReached === 'Finalista';
              const hasNemesisMatch = log.nemesisCoincided && (log.roundReached === 'Campeón' || log.roundReached === 'Finalista' || log.nemesisRound === 'Finalista' || log.nemesisRound === 'Campeón');

              return (
                <div 
                  key={idx} 
                  className={`border p-3 rounded-xl space-y-1.5 transition-all animate-in slide-in-from-bottom-2 duration-200 ${
                    isWin 
                      ? 'bg-lime-950/20 border-lime-500/30' 
                      : isFinal 
                        ? 'bg-amber-950/15 border-amber-500/20' 
                        : 'bg-zinc-950 border-zinc-850'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">
                        Semana {log.week} • {log.tier}
                      </span>
                      <h4 className="font-extrabold text-xs text-zinc-100">{log.name}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getSurfaceBadge(log.surface)}`}>
                      {log.surface}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-zinc-900/50">
                    <span className="text-zinc-400 flex items-center gap-1">
                      Resultado: 
                      <span className={`font-black uppercase ${
                        isWin ? 'text-lime-400' : isFinal ? 'text-amber-400' : 'text-zinc-200'
                      }`}>
                        {log.roundReached}
                      </span>
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {log.pointsEarned > 0 && `+${log.pointsEarned} pts`}
                    </span>
                  </div>

                  {/* Highlights de cruces con el Némesis */}
                  {log.nemesisCoincided && (
                    <div className="bg-zinc-950 border border-zinc-850 p-2 rounded-lg text-[10px] flex justify-between items-center text-zinc-300">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Swords className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        {nemesis.name} jugó este torneo
                      </span>
                      <span className="text-zinc-400">
                        Llegó a: <span className="font-bold text-zinc-200">{log.nemesisRound}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>

          {/* Botón final para ver el resumen */}
          <div className="pt-2">
            {showSummaryButton ? (
              <button
                onClick={handleOpenReport}
                className="w-full bg-gradient-to-r from-lime-400 to-emerald-400 text-zinc-950 font-black text-sm uppercase tracking-wider py-4 rounded-xl hover:from-lime-300 hover:to-emerald-300 active:scale-[0.99] transition cursor-pointer shadow-lg shadow-lime-400/20 animate-bounce"
              >
                Ver Resumen de Fin de Año
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-zinc-800 text-zinc-500 border border-zinc-700 font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                Simulando Temporada...
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // --- MODO B: PANTALLA DE RESUMEN DE FIN DE AÑO (Year End Dashboard) ---
  if (showYearEndReport && seasonReport) {
    const isLastYear = year === 4;
    const winsTotal = seasonReport.wins;
    const lossesTotal = seasonReport.losses;
    const winRate = winsTotal + lossesTotal > 0 ? Math.round((winsTotal / (winsTotal + lossesTotal)) * 100) : 0;

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between py-6 px-4">
        <div className="max-w-md mx-auto w-full space-y-4 flex-grow flex flex-col justify-between">
          
          {/* Header del Reporte */}
          <div className="text-center space-y-0.5">
            <span className="text-[10px] text-lime-400 font-black tracking-widest uppercase block">REPORTES DE TEMPORADA</span>
            <h2 className="text-2xl font-black text-zinc-100 tracking-tight flex items-center justify-center gap-1.5">
              🏆 FIN DEL AÑO {year}
            </h2>
            <p className="text-zinc-400 text-[11px]">
              Revisa tus logros, la rivalidad con tu Némesis e invierte tus ganancias antes del siguiente año.
            </p>
          </div>

          {/* Subpestañas del Reporte */}
          <div className="grid grid-cols-4 gap-1.5 bg-zinc-900 border border-zinc-850 p-1 rounded-xl">
            <button
              onClick={() => setSummaryTab('metrics')}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                summaryTab === 'metrics' ? 'bg-zinc-800 text-lime-400 border border-zinc-750' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Métricas
            </button>
            <button
              onClick={() => setSummaryTab('palmares')}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                summaryTab === 'palmares' ? 'bg-zinc-800 text-lime-400 border border-zinc-750' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hitos
            </button>
            <button
              onClick={() => setSummaryTab('nemesis')}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                summaryTab === 'nemesis' ? 'bg-zinc-800 text-lime-400 border border-zinc-750' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Némesis
            </button>
            <button
              onClick={() => setSummaryTab('upgrades')}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
                summaryTab === 'upgrades' ? 'bg-zinc-800 text-lime-400 border border-zinc-750' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShoppingBag className="w-3 h-3" /> Mejoras
            </button>
          </div>

          {/* Contenedor Principal de la Pestaña */}
          <div className="flex-grow min-h-[340px] max-h-[460px] overflow-y-auto bg-zinc-900/50 border border-zinc-850 rounded-2xl p-4 space-y-4">
            
            {/* SUBPESTAÑA 1: MÉTRICAS CLAVE */}
            {summaryTab === 'metrics' && (
              <div className="space-y-4">
                
                {/* Comparativa de Ranking */}
                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Ranking ITF Junior</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-zinc-400 text-xs">Inicial:</span>
                      <span className="font-bold text-zinc-300">#{seasonReport.initialRanking === 9999 ? 'S/R' : seasonReport.initialRanking}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-zinc-400 text-xs">Final:</span>
                      <span className="text-lg font-black text-yellow-400">#{seasonReport.finalRanking === 9999 ? 'S/R' : seasonReport.finalRanking}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-400/10 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>

                {/* Récord W/L y Hype */}
                <div className="grid grid-cols-2 gap-3">
                  {/* W/L */}
                  <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl text-left">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Récord Season</span>
                    <span className="text-lg font-black text-zinc-200">
                      {winsTotal}V - {lossesTotal}D
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Efectividad: {winRate}%</span>
                  </div>

                  {/* Hype */}
                  <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl text-left flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Hype & Fama</span>
                      <span className="text-lg font-black text-lime-400 flex items-center gap-0.5">
                        <Flame className="w-4.5 h-4.5 text-lime-400" />
                        {seasonReport.finalHype}
                      </span>
                    </div>
                    <span className="text-[9px] text-zinc-500">+{seasonReport.hypeGained} este año</span>
                  </div>
                </div>

                {/* Dinero Ganado */}
                <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl space-y-2 text-left">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-900 pb-1">
                    Balance Financiero Anual
                  </span>
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Premios por Torneos:</span>
                    <span className="font-bold text-zinc-200">{formatMoney(seasonReport.prizeMoneyEarned)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Contratos Sponsor (Hype):</span>
                    <span className="font-bold text-zinc-200">{formatMoney(seasonReport.sponsorMoney)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black border-t border-zinc-900 pt-1.5">
                    <span className="text-zinc-200">Total Ingresado:</span>
                    <span className="text-emerald-400">{formatMoney(seasonReport.totalMoneyEarned)}</span>
                  </div>
                </div>

              </div>
            )}

            {/* SUBPESTAÑA 2: VITRINA Y HITOS */}
            {summaryTab === 'palmares' && (
              <div className="space-y-4 text-left">
                
                {/* Títulos ganados */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 font-black tracking-wider uppercase block">
                    TÍTULOS CONQUISTADOS ({seasonReport.titlesWon.length})
                  </span>
                  
                  {seasonReport.titlesWon.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic bg-zinc-950/40 p-3 border border-dashed border-zinc-850 rounded-xl text-center">
                      No ganaste torneos este año. ¡Hay que entrenar más!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {seasonReport.titlesWon.map((t, idx) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
                            <div>
                              <h4 className="font-bold text-xs text-zinc-200">{t.name}</h4>
                              <p className="text-[9px] text-zinc-400">{t.tier} • {t.surface}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-lime-450/10 text-lime-400 px-2 py-0.5 rounded font-bold">
                            Campeón
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Finales Disputadas */}
                {seasonReport.finalsReached.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 font-black tracking-wider uppercase block">
                      FINALES DISPUTADAS ({seasonReport.finalsReached.length})
                    </span>
                    <div className="space-y-2">
                      {seasonReport.finalsReached.map((t, idx) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-zinc-400 shrink-0" />
                            <div>
                              <h4 className="font-semibold text-xs text-zinc-300">{t.name}</h4>
                              <p className="text-[9px] text-zinc-500">{t.tier} • {t.surface}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold">
                            Finalista
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mejor Partido del Año */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 font-black tracking-wider uppercase block">
                    MEJOR VICTORIA DEL AÑO
                  </span>
                  {seasonReport.bestWin ? (
                    <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-lime-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-lime-400/20" />
                          {seasonReport.bestWin.opponentName}
                        </span>
                        <span className="text-[10px] text-yellow-400 font-bold bg-yellow-400/5 px-2 py-0.5 rounded">
                          Ranking #{seasonReport.bestWin.opponentRanking}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Logrado en <span className="font-semibold text-zinc-200">{seasonReport.bestWin.tournamentName}</span>
                      </p>
                      <p className="text-[10px] text-lime-300 font-bold">
                        Marcador: {seasonReport.bestWin.score}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic bg-zinc-950/40 p-3 border border-dashed border-zinc-850 rounded-xl text-center">
                      No se registraron victorias significativas.
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* SUBPESTAÑA 3: SISTEMA NÉMESIS */}
            {summaryTab === 'nemesis' && (
              <div className="space-y-4 text-left">
                
                {/* Ficha Némesis Comparativa */}
                <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-3.5 space-y-3">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-900 pb-1.5">
                    Comparativa de Ranking ITF
                  </span>
                  
                  <div className="space-y-2.5">
                    {/* Jugador */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-lime-400">{player.name}</span>
                        <span className="text-[9px] bg-zinc-900 px-1.5 py-0.2 rounded text-zinc-400">Tú</span>
                      </div>
                      <span className="font-bold text-zinc-200">
                        #{seasonReport.finalRanking === 9999 ? 'S/R' : seasonReport.finalRanking}
                      </span>
                    </div>

                    {/* Barra de progreso comparativa */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-500">Tú</span>
                      <div className="flex-grow bg-zinc-900 h-2 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-lime-400 h-full rounded-l-full" 
                          style={{ width: `${Math.max(10, Math.min(90, (10000 - seasonReport.finalPoints) / 100))}%` }}
                        ></div>
                        <div 
                          className="bg-red-500 h-full rounded-r-full" 
                          style={{ width: `${Math.max(10, Math.min(90, (10000 - seasonReport.nemesisFinalPoints) / 100))}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] text-zinc-500">Rival</span>
                    </div>

                    {/* Némesis */}
                    <div className="flex justify-between items-center border-t border-zinc-900 pt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-red-400">{nemesis.name}</span>
                        <span className="text-[9px] bg-zinc-900 px-1.5 py-0.2 rounded text-zinc-400">
                          {nemesis.country.flag} {nemesis.styleName}
                        </span>
                      </div>
                      <span className="font-bold text-zinc-200">
                        #{seasonReport.nemesisFinalRanking === 9999 ? 'S/R' : seasonReport.nemesisFinalRanking}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Historial Directo H2H */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 font-black tracking-wider uppercase block">
                    HISTORIAL HEAD-TO-HEAD ESTE AÑO
                  </span>
                  
                  {seasonReport.nemesisH2H.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic bg-zinc-950/40 p-3 border border-dashed border-zinc-850 rounded-xl text-center">
                      No coincidieron en rondas directas de ningún cuadro este año.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {seasonReport.nemesisH2H.map((h, idx) => {
                        const playerWon = h.winner === 'player';
                        return (
                          <div 
                            key={idx} 
                            className={`bg-zinc-950 border p-3 rounded-xl space-y-1 ${
                              playerWon ? 'border-lime-500/20' : 'border-red-500/20'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs text-zinc-200">{h.tournamentName}</span>
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                playerWon ? 'bg-lime-500/10 text-lime-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {playerWon ? 'Ganaste' : 'Perdiste'}
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px] text-zinc-400">
                              <span>Ronda: {h.round}</span>
                              <span className="font-bold text-zinc-200">{h.score}</span>
                            </div>
                            <span className="text-[9px] text-zinc-500 block">Superficie: {h.surface}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SUBPESTAÑA 4: COMPRAS / MEJORAS */}
            {summaryTab === 'upgrades' && (
              <div className="space-y-2">
                <Shop
                  money={money}
                  inventory={{
                    encordado: activeGear.encordado,
                    zapatillas: activeGear.zapatillas,
                    raqueta: activeGear.raqueta,
                    preparador: activeStaff.preparador,
                    psicologo: activeStaff.psicologo,
                    entrenador: activeStaff.entrenador
                  }}
                  onBuyItem={(item) => {
                    // Restar dinero localmente para refrescar UI
                    // (Llama a handleBuyItem de App.jsx que maneja la persistencia)
                    onBuyItem(item);
                    // Para evitar bugs, manejamos la tienda con el callback del padre
                    // y el componente se redibuja gracias al estado global
                  }}
                />
              </div>
            )}

          </div>

          {/* Botón Final del Reporte */}
          <div className="pt-2">
            <button
              onClick={onProceedToNextYear}
              className="w-full bg-lime-400 text-zinc-950 font-black text-sm uppercase tracking-wider py-4 rounded-xl hover:bg-lime-300 active:scale-[0.99] transition cursor-pointer shadow-lg shadow-lime-400/10"
            >
              {isLastYear ? 'Ver Legado de Carrera' : `Avanzar al Año ${year + 1}`}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- MODO C: PANTALLA DASHBOARD PRINCIPAL (Menú Anual) ---
  const isYearSimulated = !!seasonReport;
  const showSimulateButton = !isYearSimulated && !isSimulatingSeason;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      
      {/* 1. Header / Status Bar Superior (Persistente) */}
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800 px-4 py-3 shadow-md">
        <div className="max-w-md mx-auto space-y-2">
          
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-lime-400">{player.name}</span>
                <span className="text-xs bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded-full">
                  {age} años
                </span>
                <span className="text-xs">{player.country.flag}</span>
              </div>
              <p className="text-[10px] text-zinc-400 tracking-wide uppercase font-semibold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-lime-400" /> {player.styleName} ({player.legend})
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">ITF JUNIOR</span>
              <span className="text-sm font-black text-yellow-400 flex items-center justify-end gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {ranking === 9999 ? 'S/R' : `#${ranking}`}
              </span>
              <span className="text-[10px] text-zinc-400 block font-medium">({rankingPoints} pts)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-zinc-850">
            {/* Dinero */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-center flex flex-col justify-center">
              <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Presupuesto</span>
              <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-0.5">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                {formatMoney(money)}
              </span>
            </div>

            {/* Hype */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-center flex flex-col justify-center">
              <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Hype & Fama</span>
              <span className="text-xs font-black text-lime-400 flex items-center justify-center gap-0.5">
                <Flame className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                {hype}
              </span>
            </div>

            {/* Calendario */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-center flex flex-col justify-center">
              <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">Etapa Carrera</span>
              <span className="text-xs font-black text-lime-400 flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-lime-400" />
                Año {year}/4
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Content Container */}
      <div className="max-w-md mx-auto w-full px-4 pt-4 flex-grow space-y-4">
        
        {/* Tarjeta del Rival Némesis */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg space-y-3">
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
            <Swords className="w-4 h-4 text-red-400" /> Rival Némesis
          </h3>
          <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl flex justify-between items-center">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-zinc-200">{nemesis.name}</span>
                <span className="text-xs">{nemesis.country.flag}</span>
              </div>
              <p className="text-[10px] text-zinc-400 uppercase font-semibold">
                Estilo opuesto: {nemesis.styleName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-zinc-500 font-bold block uppercase">RANKING ITF</span>
              <span className="font-black text-red-400 text-sm">
                #{nemesisRanking === 9999 ? 'S/R' : nemesisRanking}
              </span>
              <span className="text-[9px] text-zinc-400 block font-medium">({nemesisRankingPoints} pts)</span>
            </div>
          </div>
        </div>

        {/* Tarjeta del Próximo Evento / Simulación */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Temporada del Año {year}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              El motor simulará automáticamente una temporada completa de 18 torneos Junior. No se cobrarán tasas de inscripción. Competirás directamente contra los mejores juniors y tu Némesis.
            </p>
          </div>

          {/* Estatus de equipamiento contratado */}
          <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl space-y-2">
            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-900 pb-1">
              Beneficios Activos para esta Temporada
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex justify-between items-center p-1 bg-zinc-900/30 rounded border border-zinc-850/50">
                <span className="text-zinc-400">Encordado Pro:</span>
                <span className={`font-bold ${activeGear.encordado ? 'text-lime-400' : 'text-zinc-650'}`}>
                  {activeGear.encordado ? 'Activo (+5)' : 'Inactivo'}
                </span>
              </div>
              <div className="flex justify-between items-center p-1 bg-zinc-900/30 rounded border border-zinc-850/50">
                <span className="text-zinc-400">Zapatillas Premium:</span>
                <span className={`font-bold ${activeGear.zapatillas ? 'text-lime-400' : 'text-zinc-650'}`}>
                  {activeGear.zapatillas ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex justify-between items-center p-1 bg-zinc-900/30 rounded border border-zinc-850/50">
                <span className="text-zinc-400">Raqueta Grafeno:</span>
                <span className={`font-bold ${activeGear.raqueta ? 'text-lime-400' : 'text-zinc-650'}`}>
                  {activeGear.raqueta ? 'Activo (+8/+5)' : 'Inactivo'}
                </span>
              </div>
              <div className="flex justify-between items-center p-1 bg-zinc-900/30 rounded border border-zinc-850/50 text-left">
                <span className="text-zinc-400 truncate">Preparador Físico:</span>
                <span className={`font-bold ${activeStaff.preparador ? 'text-lime-400 font-black' : 'text-zinc-650'}`}>
                  {activeStaff.preparador ? 'Contratado' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center p-1 bg-zinc-900/30 rounded border border-zinc-850/50 text-left col-span-2">
                <span className="text-zinc-400">Entrenador Técnico:</span>
                <span className={`font-bold ${activeStaff.entrenador ? 'text-lime-400 font-black' : 'text-zinc-650'}`}>
                  {activeStaff.entrenador ? 'Contratado (+4 al año)' : 'No'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setActiveTab('shop')}
              className="w-full text-center py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-bold rounded-lg text-[10px] transition cursor-pointer"
            >
              Ir a la tienda a contratar Staff o comprar Gear
            </button>
          </div>

          <button
            onClick={onSimulateYear}
            className="w-full py-4 bg-lime-400 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-xl hover:bg-lime-300 active:scale-[0.99] transition cursor-pointer shadow-lg shadow-lime-400/10 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-zinc-950 text-zinc-950 shrink-0" />
            Simular Año de Carrera
          </button>
        </div>

        {/* Ficha de Habilidades / Estadísticas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-lime-400" /> Ficha de Atributos del Jugador
          </h3>

          <div className="space-y-3.5">
            {/* 1. Técnica */}
            <div>
              <div className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider mb-1.5">Técnica</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-zinc-950 p-2.5 rounded-xl border border-zinc-850">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Derecha</span>
                  <span className="font-bold text-zinc-200">{player.stats.forehand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Revés</span>
                  <span className="font-bold text-zinc-200">{player.stats.backhand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Servicio</span>
                  <span className="font-bold text-zinc-200">{player.stats.serve}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Volea</span>
                  <span className="font-bold text-zinc-200">{player.stats.volley}</span>
                </div>
                <div className="flex justify-between col-span-2 pt-1 border-t border-zinc-900">
                  <span className="text-zinc-400">Resto</span>
                  <span className="font-bold text-zinc-200">{player.stats.returnOfServe}</span>
                </div>
              </div>
            </div>

            {/* 2. Físico */}
            <div>
              <div className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider mb-1.5">Físico</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-zinc-950 p-2.5 rounded-xl border border-zinc-850">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Fuerza</span>
                  <span className="font-bold text-zinc-200">{player.stats.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Velocidad</span>
                  <span className="font-bold text-zinc-200">{player.stats.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Resistencia</span>
                  <span className="font-bold text-zinc-200">{player.stats.stamina}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Agilidad</span>
                  <span className="font-bold text-zinc-200">{player.stats.agility}</span>
                </div>
                <div className="flex justify-between col-span-2 pt-1 border-t border-zinc-900">
                  <span className="text-zinc-400">Flexibilidad</span>
                  <span className="font-bold text-zinc-200">{player.stats.flexibility}</span>
                </div>
              </div>
            </div>

            {/* 3. Mental */}
            <div>
              <div className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider mb-1.5">Mental</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-zinc-950 p-2.5 rounded-xl border border-zinc-850">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Agresividad</span>
                  <span className="font-bold text-zinc-200">{player.stats.aggressiveness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Temple (Clutch)</span>
                  <span className="font-bold text-zinc-200">{player.stats.clutch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Concentración</span>
                  <span className="font-bold text-zinc-200">{player.stats.focus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Adaptabilidad</span>
                  <span className="font-bold text-zinc-200">{player.stats.adaptability}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
