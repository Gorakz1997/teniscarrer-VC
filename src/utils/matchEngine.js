// Motor de Simulación de Partidos - Tennis Career Manager: Junior Edition

import { COUNTRIES, PLAY_STYLES } from '../data/gameData.js';

const RIVAL_NAMES = [
  'Carlos', 'Jannik', 'Holger', 'Arthur', 'Joao', 'Mateo', 'Ben', 'Alex',
  'Sebastian', 'Lorenzo', 'Hugo', 'Luca', 'Tomas', 'Emilio', 'Diego', 'Felipe',
  'Alexander', 'Daniil', 'Taylor', 'Casper', 'Stefanos', 'Hubert', 'Grigor', 'Denis',
  'Jack', 'Brandon', 'Shang', 'Michelsen', 'Fonseca', 'Landaluce', 'Mensik', 'Prisnic'
];

// Genera un oponente procedural
export function generateOpponent(tier, strengthRange, excludeName = '') {
  // Elegir un país aleatorio
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  
  // Elegir un nombre que no sea el del jugador ni el excluido
  let name = '';
  do {
    const firstName = RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)];
    const lastName = RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)];
    name = `${firstName} ${lastName}`;
  } while (name === excludeName);

  // Determinar nivel promedio basado en la fuerza de la categoría
  const baseMin = strengthRange.min;
  const baseMax = strengthRange.max;
  
  const generateStat = () => {
    return Math.floor(baseMin + Math.random() * (baseMax - baseMin + 1));
  };

  // Asignar stats de manera que tenga cierta coherencia táctica
  const styleRandom = Math.random();
  let preferredCourt = 'Hard';
  let styleName = 'Equilibrado';

  if (styleRandom < 0.25) {
    preferredCourt = 'Hard';
    styleName = 'Atacante';
  } else if (styleRandom < 0.5) {
    preferredCourt = 'Clay';
    styleName = 'Defensivo';
  } else if (styleRandom < 0.75) {
    preferredCourt = 'Grass';
    styleName = 'Saque y Volea';
  }

  return {
    name,
    country,
    styleName,
    preferredCourt,
    stats: {
      forehand: generateStat(),
      backhand: generateStat(),
      serve: generateStat() + (styleName === 'Saque y Volea' ? 5 : 0),
      volley: generateStat() + (styleName === 'Saque y Volea' ? 7 : 0),
      returnOfServe: generateStat() + (styleName === 'Defensivo' ? 5 : 0),
      power: generateStat() + (styleName === 'Atacante' ? 6 : 0),
      speed: generateStat(),
      stamina: generateStat() + (styleName === 'Defensivo' ? 6 : 0),
      agility: generateStat(),
      flexibility: generateStat(),
      aggressiveness: generateStat() + (styleName === 'Atacante' ? 8 : -5),
      clutch: generateStat(),
      focus: generateStat(),
      adaptability: generateStat()
    }
  };
}

// Simula un partido completo entre el jugador y un oponente
// Retorna: { winner, score, sets, stats, log }
export function simulateMatch(player, opponent, surface, equipment = {}) {
  // Ajustes de estadísticas basados en la tienda/inventario
  const playerStats = { ...player.stats };

  // 1. Encordado Pro: +5 a estadísticas técnicas
  const hasProStrings = equipment.hasProStrings;
  if (hasProStrings) {
    playerStats.forehand += 5;
    playerStats.backhand += 5;
    playerStats.serve += 5;
    playerStats.volley += 5;
    playerStats.returnOfServe += 5;
  }

  // 2. Psicólogo Deportivo: +15 a Temple (Clutch) si fue comprado (ya está sumado en el estado del jugador de forma permanente, pero lo validamos)

  // Factores ambientales y cansancio
  // El cansancio disminuye las estadísticas del jugador
  const energyFactor = player.energy / 100;
  const playerFatiguePenalty = player.fatigue * 0.15; // Máximo -15 en estadísticas si fatiga es 100

  const isInjured = equipment.isInjured;
  const rivalAggressive = equipment.rivalAggressive;

  const adjustPlayerStat = (val) => {
    let stat = val * (0.8 + 0.2 * energyFactor) - playerFatiguePenalty;
    if (player.energy < 40) {
      stat -= 15; // Penalizaciones si la Energía del jugador es < 40%
    }
    if (isInjured) {
      stat -= 20; // Penalización por jugar LESIONADO (-20 a stats)
    }
    if (rivalAggressive) {
      stat += 15; // Bono de agresividad contra el Némesis (+15 a stats)
    }
    return Math.max(10, Math.round(stat));
  };

  const activePlayerStats = {
    forehand: adjustPlayerStat(playerStats.forehand),
    backhand: adjustPlayerStat(playerStats.backhand),
    serve: adjustPlayerStat(playerStats.serve),
    volley: adjustPlayerStat(playerStats.volley),
    returnOfServe: adjustPlayerStat(playerStats.returnOfServe),
    power: adjustPlayerStat(playerStats.power),
    speed: adjustPlayerStat(playerStats.speed),
    stamina: adjustPlayerStat(playerStats.stamina),
    agility: adjustPlayerStat(playerStats.agility),
    flexibility: adjustPlayerStat(playerStats.flexibility),
    aggressiveness: playerStats.aggressiveness, // No se penaliza por cansancio
    clutch: playerStats.clutch,
    focus: adjustPlayerStat(playerStats.focus),
    adaptability: adjustPlayerStat(playerStats.adaptability)
  };

  const activeOpponentStats = { ...opponent.stats };

  // Modificadores de Superficie
  const applySurfaceMod = (stats, prefCourt) => {
    const isPreferred = prefCourt.toLowerCase().includes(surface.toLowerCase()) || 
                        (prefCourt === 'Grass' && surface === 'Grass') ||
                        (prefCourt === 'Clay' && surface === 'Clay') ||
                        (prefCourt === 'Hard' && surface === 'Hard');
    if (isPreferred) {
      stats.speed += 3;
      stats.focus += 3;
    }
  };

  applySurfaceMod(activePlayerStats, player.bonus.preferredCourt);
  applySurfaceMod(activeOpponentStats, opponent.preferredCourt);

  // Inicializar estadísticas del partido
  const matchStats = {
    player: { aces: 0, dfs: 0, winners: 0, ues: 0, bpWon: 0, bpTotal: 0, firstServeIn: 0, firstServeTotal: 0, pointsWon: 0 },
    opponent: { aces: 0, dfs: 0, winners: 0, ues: 0, bpWon: 0, bpTotal: 0, firstServeIn: 0, firstServeTotal: 0, pointsWon: 0 }
  };

  let log = [];
  let sets = [];
  let currentSetScore = { player: 0, opponent: 0 };
  let setHistory = [];

  // Decidir quién saca primero (50% de probabilidad)
  let playerServes = Math.random() < 0.5;

  log.push(`🎾 ¡Comienza el partido sobre la superficie de ${surface}!`);
  let statusText = '';
  if (isInjured) statusText += ' ⚠️ [JUGANDO LESIONADO -20]';
  if (rivalAggressive) statusText += ' 🔥 [MODO AGRESIVO +15]';
  log.push(`👤 ${player.name}${statusText} vs 👤 ${opponent.name} (${opponent.styleName}, Court: ${opponent.preferredCourt})`);

  // Simulación de Sets (Mejor de 3)
  let setsWon = { player: 0, opponent: 0 };
  let setIndex = 1;

  while (setsWon.player < 2 && setsWon.opponent < 2 && setIndex <= 3) {
    log.push(`\n🏁 --- Inicia el Set ${setIndex} ---`);
    currentSetScore = { player: 0, opponent: 0 };
    let gamesList = [];

    // Simulación de juegos dentro del set
    while (true) {
      const isTiebreak = currentSetScore.player === 6 && currentSetScore.opponent === 6;
      let gameResult;

      if (isTiebreak) {
        log.push(`🚨 ¡Llegamos al Tie-Break en el Set ${setIndex}!`);
        gameResult = simulateTiebreak(activePlayerStats, activeOpponentStats, playerServes, matchStats, player.style, opponent.styleName);
      } else {
        gameResult = simulateGame(activePlayerStats, activeOpponentStats, playerServes, matchStats, player.style, opponent.styleName, surface);
      }

      if (gameResult.winner === 'player') {
        currentSetScore.player++;
      } else {
        currentSetScore.opponent++;
      }

      // Bitácora rápida del juego
      const serverName = playerServes ? player.name : opponent.name;
      const receiverName = playerServes ? opponent.name : player.name;
      
      if (isTiebreak) {
        log.push(`📊 Tie-break: ${gameResult.scoreText}. Ganador del set: ${gameResult.winner === 'player' ? player.name : opponent.name}`);
      } else {
        const breakText = gameResult.isBreak ? `💥 ¡QUIEBRE DE SERVICIO!` : `Mantiene servicio.`;
        log.push(`Juego (${serverName} al saque): ${currentSetScore.player}-${currentSetScore.opponent}. ${breakText}`);
      }

      // Cambiar servidor para el siguiente juego
      playerServes = !playerServes;

      // Verificar si el set ha terminado
      if (!isTiebreak) {
        if (currentSetScore.player >= 6 && currentSetScore.player - currentSetScore.opponent >= 2) {
          setsWon.player++;
          setHistory.push(`${currentSetScore.player}-${currentSetScore.opponent}`);
          break;
        }
        if (currentSetScore.opponent >= 6 && currentSetScore.opponent - currentSetScore.player >= 2) {
          setsWon.opponent++;
          setHistory.push(`${currentSetScore.player}-${currentSetScore.opponent}`);
          break;
        }
      } else {
        // En tie-break termina directamente el set
        if (gameResult.winner === 'player') {
          setsWon.player++;
          setHistory.push(`7-6(${gameResult.opponentPoints})`);
        } else {
          setsWon.opponent++;
          setHistory.push(`6-7(${gameResult.playerPoints})`);
        }
        break;
      }
    }

    setIndex++;
  }

  const matchWinner = setsWon.player === 2 ? 'player' : 'opponent';
  log.push(`\n🏆 ¡PARTIDO FINALIZADO! Ganador: ${matchWinner === 'player' ? player.name : opponent.name}`);
  log.push(`Score final: ${setHistory.join(', ')}`);

  return {
    winner: matchWinner,
    score: setHistory.join(', '),
    sets: setHistory,
    stats: matchStats,
    log: log
  };
}

// Simulación de un Game (Juego) individual
function simulateGame(player, opponent, playerServes, matchStats, playerStyle, opponentStyleName, surface) {
  let score = { player: 0, opponent: 0 }; // 0, 15, 30, 40 (representados como 0, 1, 2, 3)
  let pointsLog = [];
  let isBreak = false;

  // Servidor y receptor
  const server = playerServes ? player : opponent;
  const receiver = playerServes ? opponent : player;
  
  const serverKey = playerServes ? 'player' : 'opponent';
  const receiverKey = playerServes ? 'opponent' : 'player';

  while (true) {
    // Es Break Point?
    // Un break point es cuando el receptor está a un punto de ganar el juego (ej. 0-40, 15-40, 30-40 o ventaja receptor)
    const isBP = !playerServes && (score.opponent === 3 && score.player < 3) || 
                 (score.opponent > 3 && score.opponent - score.player === 1);
                 
    const isPlayerBP = playerServes && (score.opponent === 3 && score.player < 3); // Oponente tiene break point

    // Simular punto individual
    const pointWinner = simulatePoint(player, opponent, playerServes, isBP || isPlayerBP, playerStyle, opponentStyleName, surface, matchStats);
    
    if (pointWinner === 'player') {
      score.player++;
      matchStats.player.pointsWon++;
    } else {
      score.opponent++;
      matchStats.opponent.pointsWon++;
    }

    // Registrar Break Point Total y Ganado
    if (isBP) {
      matchStats.opponent.bpTotal++;
      if (pointWinner === 'opponent') {
        matchStats.opponent.bpWon++;
      }
    } else if (isPlayerBP) {
      matchStats.player.bpTotal++;
      if (pointWinner === 'player') {
        matchStats.player.bpWon++;
      }
    }

    // Verificar ganador del juego
    if (score.player >= 4 && score.player - score.opponent >= 2) {
      isBreak = !playerServes; // Si el receptor gana, es quiebre
      return { winner: 'player', isBreak };
    }
    if (score.opponent >= 4 && score.opponent - score.player >= 2) {
      isBreak = playerServes; // Si el receptor gana, es quiebre
      return { winner: 'opponent', isBreak };
    }

    // Si llegan a Deuce (40-40, que representamos como 3-3)
    if (score.player >= 3 && score.opponent >= 3 && score.player === score.opponent) {
      score.player = 3;
      score.opponent = 3;
    }
  }
}

// Simulación de un Tie-Break
function simulateTiebreak(player, opponent, playerServes, matchStats, playerStyle, opponentStyleName) {
  let score = { player: 0, opponent: 0 };
  let pointsServed = 0;
  let currentServer = playerServes; // Quién saca en este punto

  while (true) {
    const isBP = true; // Todo punto en tie-break es decisivo y bajo presión
    const pointWinner = simulatePoint(player, opponent, currentServer, isBP, playerStyle, opponentStyleName, 'Hard', matchStats);

    if (pointWinner === 'player') {
      score.player++;
      matchStats.player.pointsWon++;
    } else {
      score.opponent++;
      matchStats.opponent.pointsWon++;
    }

    pointsServed++;

    // En tiebreak, el primer saca 1 vez, luego cada uno saca 2 veces alternativamente
    if (pointsServed === 1 || (pointsServed - 1) % 2 === 0) {
      currentServer = !currentServer;
    }

    // Verificar ganador del tie-break (mínimo 7 puntos con ventaja de 2)
    if (score.player >= 7 && score.player - score.opponent >= 2) {
      return { winner: 'player', scoreText: `${score.player}-${score.opponent}`, opponentPoints: score.opponent };
    }
    if (score.opponent >= 7 && score.opponent - score.player >= 2) {
      return { winner: 'opponent', scoreText: `${score.player}-${score.opponent}`, playerPoints: score.player };
    }
  }
}

// Simulación de un Punto Individual
function simulatePoint(player, opponent, playerServes, isBreakPoint, playerStyle, opponentStyleName, surface, matchStats) {
  const server = playerServes ? player : opponent;
  const receiver = playerServes ? opponent : player;
  
  const serverStyle = playerServes ? playerStyle : opponentStyleName;
  const receiverStyle = playerServes ? opponentStyleName : playerStyle;

  // 1. Simulación del Primer Servicio
  const serveTotalKey = playerServes ? 'player' : 'opponent';
  matchStats[serveTotalKey].firstServeTotal++;

  // Probabilidad del primer saque en base al atributo de servicio
  const firstServeProb = 0.50 + (server.serve / 250); // Rango típico 0.50 - 0.90
  const isFirstServeIn = Math.random() < firstServeProb;

  let isSecondServe = false;
  if (isFirstServeIn) {
    matchStats[serveTotalKey].firstServeIn++;
  } else {
    // Segundo servicio
    isSecondServe = true;
    const doubleFaultProb = 0.15 - (server.serve / 1000); // 0.05 - 0.12 aprox.
    const isDoubleFault = Math.random() < doubleFaultProb;
    
    if (isDoubleFault) {
      matchStats[serveTotalKey].dfs++;
      // Punto para el receptor
      return playerServes ? 'opponent' : 'player';
    }
  }

  // 2. Probabilidad de ganar el punto en base a las estadísticas
  // Calculemos el poder de ataque del servidor
  let serverAttack = server.serve * 0.35 + server.power * 0.25 + server.forehand * 0.20 + server.focus * 0.20;
  if (!isSecondServe) {
    serverAttack += 12; // Ventaja por primer saque
  }

  // Si es atacante feroz, tiene bonus del 15% en potencia de ataque (winners)
  if (serverStyle === 'feroz') {
    serverAttack *= 1.15;
  }

  // Calculemos la defensa del receptor
  let receiverDefense = receiver.returnOfServe * 0.35 + receiver.speed * 0.25 + receiver.agility * 0.20 + receiver.focus * 0.20;
  
  // Si el receptor tiene el estilo metrónomo (Djokovic), neutraliza 25% del servicio del rival
  if (receiverStyle === 'metronomo' || receiverStyle === 'Metrónomo') {
    serverAttack -= (server.serve * 0.25);
  }

  // Ajustes por superficie
  if (surface === 'Clay') {
    // La arcilla hace la defensa más efectiva y reduce el impacto del saque
    receiverDefense += 10;
    serverAttack -= 5;
  } else if (surface === 'Grass') {
    // El césped premia el ataque y el saque
    serverAttack += 10;
    receiverDefense -= 5;
  }

  // Ajuste de Clutch (Temple bajo presión)
  if (isBreakPoint) {
    // El temple influye enormemente en break points
    let serverClutchMod = server.clutch * 0.3;
    let receiverClutchMod = receiver.clutch * 0.3;

    // Muro (Nadal) recibe un 20% adicional de efectividad en break points
    if (playerServes && playerStyle === 'muro') {
      serverClutchMod *= 1.20;
    } else if (!playerServes && playerStyle === 'muro') {
      receiverClutchMod *= 1.20;
    }

    serverAttack += serverClutchMod;
    receiverDefense += receiverClutchMod;
  }

  // Calcular probabilidad final de ganar el punto
  // Generalmente el servidor tiene una base mayor de ganar el saque
  const baseServeAdvantage = 15;
  const ratio = (serverAttack + baseServeAdvantage) / (serverAttack + baseServeAdvantage + receiverDefense);
  
  const serverWins = Math.random() < ratio;

  // Registrar estadísticas adicionales (Aces, Winners, Errores no forzados)
  const winnerKey = serverWins ? (playerServes ? 'player' : 'opponent') : (playerServes ? 'opponent' : 'player');
  const loserKey = serverWins ? (playerServes ? 'opponent' : 'player') : (playerServes ? 'player' : 'opponent');

  const randomOutcome = Math.random();
  if (serverWins) {
    if (!isSecondServe && randomOutcome < 0.12) {
      matchStats[winnerKey].aces++;
    } else if (randomOutcome < 0.40) {
      matchStats[winnerKey].winners++;
    } else {
      matchStats[loserKey].ues++;
    }
  } else {
    if (randomOutcome < 0.25) {
      matchStats[winnerKey].winners++;
    } else {
      matchStats[loserKey].ues++;
    }
  }

  return serverWins ? (playerServes ? 'player' : 'opponent') : (playerServes ? 'opponent' : 'player');
}
