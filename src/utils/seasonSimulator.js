// Simulador de Temporada Completa - Tennis Career Manager: Junior Edition
import { getTournamentsForWeek, getRankingFromPoints } from '../data/gameData.js';
import { simulateMatch, generateOpponent } from './matchEngine.js';

// Semanas de torneos a simular durante el año (18 torneos en total)
const TOURNEY_WEEKS = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 52];

// Función para obtener el promedio de stats de un personaje
function getAverageStats(stats) {
  const keys = Object.keys(stats);
  const sum = keys.reduce((acc, key) => acc + (stats[key] || 50), 0);
  return Math.round(sum / keys.length);
}

// Simula un partido rápido entre rivales no-jugadores (Némesis vs Procedural, o Procedural vs Procedural)
function simulateQuickMatch(playerA, playerB) {
  const ratingA = getAverageStats(playerA.stats);
  const ratingB = getAverageStats(playerB.stats);
  
  // Probabilidad basada en diferencia de ratings
  const diff = ratingA - ratingB;
  let winProb = 0.5 + (diff / 100);
  winProb = Math.max(0.15, Math.min(0.85, winProb)); // Límite de probabilidad

  const isAWinner = Math.random() < winProb;
  
  // Generar marcador simulado realista
  let score = '';
  if (Math.random() < 0.6) {
    // 2 sets
    const g1 = 6;
    const g2 = Math.floor(Math.random() * 5);
    const g3 = 6;
    const g4 = Math.floor(Math.random() * 5);
    score = isAWinner ? `${g1}-${g2}, ${g3}-${g4}` : `${g2}-${g1}, ${g4}-${g3}`;
  } else {
    // 3 sets
    const g1 = 6; const g2 = Math.floor(Math.random() * 5);
    const g3 = 6; const g4 = Math.floor(Math.random() * 5);
    const g5 = 6; const g6 = Math.floor(Math.random() * 5);
    score = isAWinner 
      ? `${g1}-${g2}, ${g4}-${g3}, ${g5}-${g6}` 
      : `${g2}-${g1}, ${g3}-${g4}, ${g6}-${g5}`;
  }

  return {
    winner: isAWinner ? 'A' : 'B',
    score
  };
}

export function simulateSeason({
  player,
  nemesis,
  year,
  gear,
  staff,
  currentRankingPoints,
  nemesisRankingPoints,
  currentHype,
  currentMoney
}) {
  let playerPoints = currentRankingPoints;
  let playerRanking = getRankingFromPoints(playerPoints);
  let playerHype = currentHype;
  let playerMoney = currentMoney;

  let nemesisPoints = nemesisRankingPoints;
  let nemesisRanking = getRankingFromPoints(nemesisPoints);

  // Historiales a retornar
  let seasonWins = 0;
  let seasonLosses = 0;
  let prizeMoneyEarned = 0;
  let titlesWon = [];
  let finalsReached = [];
  let nemesisH2H = [];
  let bestWin = null; // { opponentName, opponentRanking, score, tournamentName }
  let tournamentLogs = [];

  // Al inicio del año, la energía del jugador está al 100% y la fatiga al 0%
  let playerEnergy = 100;
  let playerFatigue = 0;

  // Ajustes de equipo (Gear) para toda la temporada
  const hasStrings = gear.encordado;
  const hasShoes = gear.zapatillas;
  const hasRacket = gear.raqueta;

  // Modificadores de Staff activos durante los partidos de la temporada
  const hasPsychologist = staff.psicologo;

  // Aplicar bonificaciones de items en tiempo real para las estadísticas activas en partidos
  const activePlayerStats = { ...player.stats };
  if (hasStrings) {
    activePlayerStats.forehand += 5;
    activePlayerStats.backhand += 5;
    activePlayerStats.serve += 5;
    activePlayerStats.volley += 5;
    activePlayerStats.returnOfServe += 5;
  }
  if (hasRacket) {
    activePlayerStats.power += 8;
    activePlayerStats.forehand += 5;
    activePlayerStats.backhand += 5;
  }
  if (hasPsychologist) {
    // El psicólogo añade permanentemente temple
    activePlayerStats.clutch += 8;
  }

  // Nemesis stats
  const activeNemesisStats = { ...nemesis.stats };

  // Loop de 18 torneos
  for (let tIdx = 0; tIdx < TOURNEY_WEEKS.length; tIdx++) {
    const week = TOURNEY_WEEKS[tIdx];

    // 1. Descanso entre torneos
    // Recupera energía y reduce fatiga antes del torneo
    playerEnergy = Math.min(100, playerEnergy + 30);
    playerFatigue = Math.max(0, playerFatigue - 20);

    // Si el jugador está excesivamente fatigado, sufre penalización de rendimiento
    // (Ya implementado en matchEngine.simulateMatch, pasándole el player con su energía y fatiga actualizadas)

    // 2. Selección de Torneo para el Jugador
    const playerAvailableTourneys = getTournamentsForWeek(week, playerRanking);
    // Filtrar y tomar el de mayor tier que cumpla el ranking
    let playerSelectedTourney = playerAvailableTourneys[0];
    playerAvailableTourneys.forEach(t => {
      // Comparar prioridad de tiers: JGS > J500 > J300 > J200 > J100 > J60 > J30
      const tiers = ['J30', 'J60', 'J100', 'J200', 'J300', 'J500', 'JGS'];
      const currentIdx = tiers.indexOf(playerSelectedTourney.tier);
      const newIdx = tiers.indexOf(t.tier);
      const matchesRanking = t.minRanking === 9999 || playerRanking <= t.minRanking;
      if (matchesRanking && newIdx > currentIdx) {
        playerSelectedTourney = t;
      }
    });

    // 3. Selección de Torneo para el Némesis
    const nemesisAvailableTourneys = getTournamentsForWeek(week, nemesisRanking);
    let nemesisSelectedTourney = nemesisAvailableTourneys[0];
    nemesisAvailableTourneys.forEach(t => {
      const tiers = ['J30', 'J60', 'J100', 'J200', 'J300', 'J500', 'JGS'];
      const currentIdx = tiers.indexOf(nemesisSelectedTourney.tier);
      const newIdx = tiers.indexOf(t.tier);
      const matchesRanking = t.minRanking === 9999 || nemesisRanking <= t.minRanking;
      if (matchesRanking && newIdx > currentIdx) {
        nemesisSelectedTourney = t;
      }
    });

    const isNemesisInSameTourney = playerSelectedTourney.id === nemesisSelectedTourney.id;

    // 4. Simulación del Bracket del Torneo (16 jugadores)
    // Generar oponentes procedimentales
    const strengths = playerSelectedTourney.opponentsStrength;
    const proceduralOpponents = [];
    
    // Necesitamos 14 oponentes procedimentales para completar los 16 del cuadro (junto al jugador y al Némesis/rival extra)
    const numProcedural = 14;
    for (let i = 0; i < numProcedural; i++) {
      proceduralOpponents.push(generateOpponent(playerSelectedTourney.tier, strengths, player.name));
    }

    // Estructurar participantes de la ronda de Octavos (16 jugadores)
    let roundPlayers = [];
    
    // El jugador es el index 0
    roundPlayers.push({
      type: 'player',
      name: player.name,
      stats: activePlayerStats,
      energy: playerEnergy,
      fatigue: playerFatigue,
      bonus: player.bonus
    });

    // Añadir oponentes procedimentales
    proceduralOpponents.forEach(opp => {
      roundPlayers.push({
        type: 'procedural',
        name: opp.name,
        stats: opp.stats,
        preferredCourt: opp.preferredCourt,
        styleName: opp.styleName,
        country: opp.country
      });
    });

    // Si el Némesis está, lo añadimos en la posición final para que se crucen en la Final si ambos avanzan
    if (isNemesisInSameTourney) {
      roundPlayers.push({
        type: 'nemesis',
        name: nemesis.name,
        stats: activeNemesisStats,
        preferredCourt: nemesis.preferredCourt || 'Hard',
        styleName: nemesis.styleName || 'Equilibrado',
        country: nemesis.country
      });
    } else {
      // Si no está, añadimos un rival procedimental extra al final
      const opp = generateOpponent(playerSelectedTourney.tier, strengths, player.name);
      roundPlayers.push({
        type: 'procedural',
        name: opp.name,
        stats: opp.stats,
        preferredCourt: opp.preferredCourt,
        styleName: opp.styleName,
        country: opp.country
      });
    }

    // Simular el torneo ronda por ronda
    let currentRoundPlayers = [...roundPlayers]; // 16 jugadores
    let playerRoundReached = 0; // 0: Octavos, 1: Cuartos, 2: Semis, 3: Final, 4: Campeón
    let playerEliminatedBy = null;
    let playerEliminatedScore = '';

    // Guardar si el jugador jugó contra el Némesis en este torneo
    let playedNemesisThisTourney = false;

    // Simulación de 4 rondas (16 -> 8 -> 4 -> 2 -> 1)
    for (let round = 1; round <= 4; round++) {
      let nextRoundPlayers = [];

      for (let matchIdx = 0; matchIdx < currentRoundPlayers.length; matchIdx += 2) {
        const p1 = currentRoundPlayers[matchIdx];
        const p2 = currentRoundPlayers[matchIdx + 1];

        // Verificar si alguno es el jugador humano
        const hasHuman = p1.type === 'player' || p2.type === 'player';

        if (hasHuman) {
          const humanObj = p1.type === 'player' ? p1 : p2;
          const opponentObj = p1.type === 'player' ? p2 : p1;

          // Configurar el estado dinámico del jugador para matchEngine
          const tempPlayer = {
            name: humanObj.name,
            stats: activePlayerStats,
            energy: playerEnergy,
            fatigue: playerFatigue,
            bonus: humanObj.bonus,
            style: player.style
          };

          // Simular partido real usando el motor probabilístico
          const matchResult = simulateMatch(tempPlayer, opponentObj, playerSelectedTourney.surface, {
            hasProStrings: false, // Ya sumado en activePlayerStats
            isInjured: false,
            rivalAggressive: false
          });

          // Registrar resultados
          const won = matchResult.winner === 'player';
          if (won) {
            // Avanza el jugador
            nextRoundPlayers.push(p1.type === 'player' ? p1 : p2);
            seasonWins++;
            playerRoundReached = round; // Se actualiza la ronda alcanzada

            // Disminución física por el partido
            // Reducido por zapatillas de alta gama si las posee
            const energyDecrease = hasShoes ? 16 : 20;
            const fatigueIncrease = hasShoes ? 6 : 8;
            playerEnergy = Math.max(10, playerEnergy - energyDecrease);
            playerFatigue = Math.min(100, playerFatigue + fatigueIncrease);

            // Validar si es la mejor victoria del año
            const oppAverage = getAverageStats(opponentObj.stats);
            // El ranking del oponente procedural se aproxima por su fuerza
            let oppRanking = 500 - Math.round(oppAverage * 4.5);
            if (opponentObj.type === 'nemesis') {
              oppRanking = nemesisRanking;
            }
            oppRanking = Math.max(1, oppRanking);

            if (!bestWin || oppRanking < bestWin.opponentRanking) {
              bestWin = {
                opponentName: opponentObj.name,
                opponentRanking: oppRanking,
                score: matchResult.score,
                tournamentName: playerSelectedTourney.name
              };
            }

            // Si venció al Némesis
            if (opponentObj.type === 'nemesis') {
              playedNemesisThisTourney = true;
              nemesisH2H.push({
                tournamentName: playerSelectedTourney.name,
                surface: playerSelectedTourney.surface,
                winner: 'player',
                score: matchResult.score,
                round: round === 4 ? 'Final' : round === 3 ? 'Semifinal' : 'Rondas Previas'
              });
              // Ganar Hype extra por ganarle al Némesis
              playerHype += 10;
            } else {
              playerHype += 2; // Hype base por victoria
            }
          } else {
            // Pierde el jugador
            nextRoundPlayers.push(p1.type === 'player' ? p2 : p1);
            playerEliminatedBy = opponentObj.name;
            playerEliminatedScore = matchResult.score;
            seasonLosses++;

            // Si perdió contra el Némesis
            if (opponentObj.type === 'nemesis') {
              playedNemesisThisTourney = true;
              nemesisH2H.push({
                tournamentName: playerSelectedTourney.name,
                surface: playerSelectedTourney.surface,
                winner: 'nemesis',
                score: matchResult.score,
                round: round === 4 ? 'Final' : round === 3 ? 'Semifinal' : 'Rondas Previas'
              });
              playerHype = Math.max(0, playerHype - 2);
            } else {
              playerHype = Math.max(0, playerHype - 1);
            }
          }
        } else {
          // Partido simulado rápido (Rival vs Rival)
          const result = simulateQuickMatch(p1, p2);
          const winnerObj = result.winner === 'A' ? p1 : p2;
          nextRoundPlayers.push(winnerObj);
        }
      }

      currentRoundPlayers = nextRoundPlayers;
    }

    // Verificar si el jugador fue campeón
    const isPlayerChampion = playerRoundReached === 4;

    // Calcular puntos y dinero ganados en el torneo
    let roundName = 'Octavos de Final';
    let multiplier = 0.06; // Perdió en Octavos

    if (isPlayerChampion) {
      roundName = 'Campeón';
      multiplier = 1.0;
    } else {
      switch (playerRoundReached) {
        case 3:
          roundName = 'Finalista';
          multiplier = 0.50;
          break;
        case 2:
          roundName = 'Semifinal';
          multiplier = 0.25;
          break;
        case 1:
          roundName = 'Cuartos de Final';
          multiplier = 0.12;
          break;
        default:
          break;
      }
    }

    const pointsEarned = Math.round(playerSelectedTourney.points * multiplier);
    const moneyEarned = Math.round(playerSelectedTourney.prizeMoney * multiplier);

    playerPoints += pointsEarned;
    playerMoney += moneyEarned;
    prizeMoneyEarned += moneyEarned;
    playerRanking = getRankingFromPoints(playerPoints);

    // Hype bonus por ronda lejana
    if (isPlayerChampion) {
      playerHype += playerSelectedTourney.tier === 'JGS' ? 25 : playerSelectedTourney.tier === 'J500' ? 15 : 8;
      
      titlesWon.push({
        name: playerSelectedTourney.name,
        tier: playerSelectedTourney.tier,
        surface: playerSelectedTourney.surface,
        week,
        score: isNemesisInSameTourney && playerRoundReached === 4 ? 'H2H vs Némesis' : '6-4, 6-3',
        rivalName: playerEliminatedBy || (isNemesisInSameTourney ? nemesis.name : 'Rival Procedural')
      });
    } else if (playerRoundReached === 3) {
      finalsReached.push({
        name: playerSelectedTourney.name,
        tier: playerSelectedTourney.tier,
        surface: playerSelectedTourney.surface,
        week,
        score: playerEliminatedScore,
        rivalName: playerEliminatedBy
      });
    }

    // 5. Simulación paralela del Némesis en su propio torneo (si no estaba en el mismo del jugador)
    let nemesisRoundReached = 0;
    if (!isNemesisInSameTourney) {
      const nemRating = getAverageStats(activeNemesisStats);
      const tourneyStrength = nemesisSelectedTourney.opponentsStrength;
      const avgOppRating = (tourneyStrength.min + tourneyStrength.max) / 2;

      // Simular las rondas
      let currentNemRound = 1;
      while (currentNemRound <= 4) {
        const diff = nemRating - avgOppRating;
        let winProb = 0.52 + (diff / 120); // Ligero buff al Némesis para que sea competitivo
        winProb = Math.max(0.2, Math.min(0.85, winProb));
        
        if (Math.random() < winProb) {
          nemesisRoundReached = currentNemRound;
          currentNemRound++;
        } else {
          break;
        }
      }

      let nemMultiplier = 0.06;
      if (nemesisRoundReached === 4) nemMultiplier = 1.0;
      else if (nemesisRoundReached === 3) nemMultiplier = 0.50;
      else if (nemesisRoundReached === 2) nemMultiplier = 0.25;
      else if (nemesisRoundReached === 1) nemMultiplier = 0.12;

      const nemPointsEarned = Math.round(nemesisSelectedTourney.points * nemMultiplier);
      nemesisPoints += nemPointsEarned;
      nemesisRanking = getRankingFromPoints(nemesisPoints);
    } else {
      const matchVsPlayer = nemesisH2H.find(h => h.tournamentName === playerSelectedTourney.name);
      if (matchVsPlayer) {
        if (matchVsPlayer.winner === 'nemesis') {
          const startRound = matchVsPlayer.round === 'Final' ? 4 : matchVsPlayer.round === 'Semifinal' ? 3 : 2;
          let currentNemRound = startRound + 1;
          let reached = startRound;
          const nemRating = getAverageStats(activeNemesisStats);
          const avgOppRating = (strengths.min + strengths.max) / 2;

          while (currentNemRound <= 4) {
            const diff = nemRating - avgOppRating;
            let winProb = 0.52 + (diff / 120);
            if (Math.random() < winProb) {
              reached = currentNemRound;
              currentNemRound++;
            } else {
              break;
            }
          }
          nemesisRoundReached = reached;
        } else {
          const lossRound = matchVsPlayer.round === 'Final' ? 4 : matchVsPlayer.round === 'Semifinal' ? 3 : 2;
          nemesisRoundReached = lossRound - 1;
        }
      } else {
        const nemRating = getAverageStats(activeNemesisStats);
        const avgOppRating = (strengths.min + strengths.max) / 2;
        let reached = 0;
        for (let r = 1; r <= 4; r++) {
          const diff = nemRating - avgOppRating;
          let winProb = 0.5 + (diff / 120);
          if (Math.random() < winProb) {
            reached = r;
          } else {
            break;
          }
        }
        nemesisRoundReached = reached;
      }

      let nemMultiplier = 0.06;
      if (nemesisRoundReached === 4) nemMultiplier = 1.0;
      else if (nemesisRoundReached === 3) nemMultiplier = 0.50;
      else if (nemesisRoundReached === 2) nemMultiplier = 0.25;
      else if (nemesisRoundReached === 1) nemMultiplier = 0.12;

      const nemPointsEarned = Math.round(playerSelectedTourney.points * nemMultiplier);
      nemesisPoints += nemPointsEarned;
      nemesisRanking = getRankingFromPoints(nemesisPoints);
    }

    tournamentLogs.push({
      week,
      name: playerSelectedTourney.name,
      tier: playerSelectedTourney.tier,
      surface: playerSelectedTourney.surface,
      roundReached: roundName,
      pointsEarned,
      moneyEarned,
      eliminatedBy: playerEliminatedBy,
      score: playerEliminatedScore,
      nemesisCoincided: isNemesisInSameTourney,
      nemesisRound: nemesisRoundReached === 4 ? 'Campeón' : nemesisRoundReached === 3 ? 'Finalista' : nemesisRoundReached === 2 ? 'Semifinal' : nemesisRoundReached === 1 ? 'Cuartos' : 'Octavos'
    });
  }

  // 6. Contratos de Sponsors al finalizar el año basado en Hype
  const sponsorMoney = Math.round(playerHype * 60);
  playerMoney += sponsorMoney;

  return {
    initialRanking: getRankingFromPoints(currentRankingPoints),
    finalRanking: playerRanking,
    initialPoints: currentRankingPoints,
    finalPoints: playerPoints,
    wins: seasonWins,
    losses: seasonLosses,
    prizeMoneyEarned,
    sponsorMoney,
    totalMoneyEarned: prizeMoneyEarned + sponsorMoney,
    finalHype: playerHype,
    hypeGained: playerHype - currentHype,
    titlesWon,
    finalsReached,
    nemesisH2H,
    bestWin,
    tournamentLogs,
    nemesisInitialRanking: getRankingFromPoints(nemesisRankingPoints),
    nemesisFinalRanking: nemesisRanking,
    nemesisFinalPoints: nemesisPoints
  };
}
