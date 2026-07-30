// Definición de datos estáticos del juego "Tennis Career Manager: Junior Edition"

export const PLAY_STYLES = {
  feroz: {
    id: 'feroz',
    name: 'Atacante Feroz',
    legend: 'Del Potro',
    description: 'Basa su juego en tiros ultra potentes y un saque demoledor para acortar los puntos.',
    stats: {
      forehand: 80,
      backhand: 55,
      serve: 75,
      volley: 50,
      returnOfServe: 50,
      power: 80,
      speed: 55,
      stamina: 60,
      agility: 55,
      flexibility: 50,
      aggressiveness: 85,
      clutch: 65,
      focus: 60,
      adaptability: 55
    },
    bonus: {
      description: '+15% tiros ganadores (winners) en rallies cortos',
      preferredCourt: 'Hard',
      key: 'feroz_bonus'
    }
  },
  mago: {
    id: 'mago',
    name: 'Variedad & Mago Todo Terreno',
    legend: 'Federer',
    description: 'Juego elegante, variedad de efectos, subidas a la red y excelente lectura de juego.',
    stats: {
      forehand: 75,
      backhand: 65,
      serve: 75,
      volley: 80,
      returnOfServe: 60,
      power: 60,
      speed: 65,
      stamina: 60,
      agility: 75,
      flexibility: 70,
      aggressiveness: 65,
      clutch: 75,
      focus: 80,
      adaptability: 85
    },
    bonus: {
      description: '-15% consumo de energía en todas las actividades',
      preferredCourt: 'Grass',
      key: 'mago_bonus'
    }
  },
  muro: {
    id: 'muro',
    name: 'Muro Intensivo & Topspin',
    legend: 'Nadal',
    description: 'Defensa impenetrable, golpes con mucho topspin y un espíritu indomable que pelea cada bola.',
    stats: {
      forehand: 75,
      backhand: 60,
      serve: 60,
      volley: 60,
      returnOfServe: 80,
      power: 75,
      speed: 85,
      stamina: 85,
      agility: 80,
      flexibility: 75,
      aggressiveness: 70,
      clutch: 90,
      focus: 85,
      adaptability: 70
    },
    bonus: {
      description: '+20% rendimiento/efectividad en Break Points',
      preferredCourt: 'Clay',
      key: 'muro_bonus'
    }
  },
  metronomo: {
    id: 'metronomo',
    name: 'Metrónomo Elástico & Devolución',
    legend: 'Djokovic',
    description: 'Movilidad extrema, defensa de contragolpe perfecta y la mejor devolución del circuito.',
    stats: {
      forehand: 70,
      backhand: 80,
      serve: 65,
      volley: 55,
      returnOfServe: 85,
      power: 60,
      speed: 80,
      stamina: 80,
      agility: 80,
      flexibility: 90,
      aggressiveness: 60,
      clutch: 85,
      focus: 85,
      adaptability: 80
    },
    bonus: {
      description: 'Neutraliza 25% de la efectividad del saque rival',
      preferredCourt: 'Hard',
      key: 'metronomo_bonus'
    }
  }
};

export const COUNTRIES = [
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'GB', name: 'Gran Bretaña', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'JP', name: 'Japón', flag: '🇯🇵' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭' }
];

export const HANDS = [
  { id: 'diestro_1h', name: 'Diestro (Revés 1 mano)' },
  { id: 'diestro_2h', name: 'Diestro (Revés 2 manos)' },
  { id: 'zurdo_1h', name: 'Zurdo (Revés 1 mano)' },
  { id: 'zurdo_2h', name: 'Zurdo (Revés 2 manos)' }
];

export const SHOP_ITEMS = [
  {
    id: 'encordado',
    name: 'Contrato Encordado Pro',
    category: 'gear',
    price: 300,
    icon: 'Activity',
    description: 'Contrato de encordado para todo el año. Otorga +5 a todas las estadísticas técnicas en los partidos de la temporada.',
    modifier: { stats: { forehand: 5, backhand: 5, serve: 5, volley: 5, returnOfServe: 5 } },
    consumable: false
  },
  {
    id: 'zapatillas',
    name: 'Zapatillas Alta Gama',
    category: 'gear',
    price: 600,
    icon: 'Footprints',
    description: 'Equipamiento premium anual. Reduce el desgaste de energía en un 20% y mitiga la acumulación de fatiga en un 25% por torneo simulado.',
    modifier: { energyReduction: 0.20, fatigueReduction: 0.25 },
    consumable: false
  },
  {
    id: 'raqueta',
    name: 'Raqueta de Grafeno',
    category: 'gear',
    price: 1000,
    icon: 'ShoppingBag',
    description: 'Potencia y precisión premium para toda la temporada. Otorga +8 de Potencia y +5 a Derecha y Revés en todos los partidos.',
    modifier: { stats: { power: 8, forehand: 5, backhand: 5 } },
    consumable: false
  },
  {
    id: 'preparador',
    name: 'Preparador Físico Pro',
    category: 'staff',
    price: 1800,
    icon: 'UserPlus',
    description: 'Preparador físico personal contratado. Otorga un +4 adicional a todos los atributos físicos al finalizar la temporada.',
    modifier: { physicalAnnualBonus: 4 },
    consumable: false
  },
  {
    id: 'psicologo',
    name: 'Psicólogo Deportivo',
    category: 'staff',
    price: 1500,
    icon: 'Brain',
    description: 'Mentor mental permanente. Otorga +8 Temple Mental (Clutch) permanente de forma inmediata y +4 a todos los atributos mentales al finalizar la temporada.',
    modifier: { mentalAnnualBonus: 4, stats: { clutch: 8 } },
    consumable: false
  },
  {
    id: 'entrenador',
    name: 'Entrenador Técnico Principal',
    category: 'staff',
    price: 2000,
    icon: 'UserPlus',
    description: 'Entrenador técnico dedicado. Otorga un +4 adicional a todos los atributos técnicos al finalizar la temporada.',
    modifier: { technicalAnnualBonus: 4 },
    consumable: false
  }
];

export function getOppositePlayStyle(styleId) {
  const opposites = {
    feroz: 'muro',
    muro: 'feroz',
    mago: 'metronomo',
    metronomo: 'mago'
  };
  return opposites[styleId] || 'metronomo';
}

export function getRankingFromPoints(points) {
  if (points <= 0) return 9999;
  if (points < 5) return 1000 - points * 10;
  if (points < 15) return 750 - (points - 5) * 25; // 750 a 501
  if (points < 40) return 500 - (points - 15) * 10; // 500 a 301
  if (points < 80) return 300 - Math.round((points - 40) * 2.5); // 300 a 201
  if (points < 150) return 200 - Math.round((points - 80) * 1.4); // 200 a 101
  if (points < 300) return 100 - Math.round((points - 150) * 0.33); // 100 a 51
  if (points < 500) return 50 - Math.round((points - 300) * 0.1); // 50 a 31
  if (points < 800) return 30 - Math.round((points - 500) * 0.046); // 30 a 16
  if (points < 1200) return 15 - Math.round((points - 800) * 0.022); // 15 a 6
  return Math.max(1, Math.round(5 - (points - 1200) * 0.005)); // 5 a 1
}



export const TRAINING_CATEGORIES = {
  tecnica: {
    name: 'Técnica',
    description: 'Mejora golpes básicos y precisión.',
    energyCost: 25,
    fatigueCost: 5,
    statsAffected: ['forehand', 'backhand', 'serve', 'volley', 'returnOfServe'],
    xpMin: 3,
    xpMax: 6
  },
  fisico: {
    name: 'Físico',
    description: 'Mejora fuerza, velocidad, resistencia y movilidad.',
    energyCost: 30,
    fatigueCost: 10,
    statsAffected: ['power', 'speed', 'stamina', 'agility', 'flexibility'],
    xpMin: 3,
    xpMax: 7
  },
  mental: {
    name: 'Mental',
    description: 'Mejora la fortaleza bajo presión y concentración.',
    energyCost: 20,
    fatigueCost: 3,
    statsAffected: ['aggressiveness', 'clutch', 'focus', 'adaptability'],
    xpMin: 3,
    xpMax: 6
  }
};

// Generador de torneos deterministas basados en la semana actual y año.
export function getTournamentsForWeek(week, ranking) {
  const yearWeek = ((week - 1) % 52) + 1;
  const yearNum = Math.ceil(week / 52);

  // Ciudades y Superficies disponibles
  const cities = {
    Hard: ['Miami', 'Pekín', 'Tokio', 'Dubái', 'Toronto', 'Melbourne', 'Nueva York', 'Shanghái', 'Sídney', 'Auckland'],
    Clay: ['París', 'Roma', 'Madrid', 'Montecarlo', 'Buenos Aires', 'Río de Janeiro', 'Santiago', 'Barcelona', 'Gstaad'],
    Grass: ['Londres', 'Halle', 'Queen\'s', 'Eastbourne', 'Stuttgart', 'Mallorca', 'Newport', 'Rosmalen']
  };

  const getCity = (surface, seed) => {
    const list = cities[surface];
    const index = Math.abs(seed) % list.length;
    return list[index];
  };

  const tournaments = [];

  // Determinación de superficies para las distintas semanas de la temporada junior
  let mainSurface = 'Hard';
  if (yearWeek >= 16 && yearWeek <= 24) mainSurface = 'Clay';
  else if (yearWeek >= 25 && yearWeek <= 29) mainSurface = 'Grass';
  else if (yearWeek >= 45) mainSurface = 'Clay';

  const altSurface = mainSurface === 'Hard' ? 'Clay' : 'Hard';

  // 1. Torneos J30 / J60 (Siempre disponibles, sin requisitos)
  tournaments.push({
    id: `j30_${week}`,
    name: `J30 ${getCity(mainSurface, week * 7)}`,
    tier: 'J30',
    surface: mainSurface,
    minRanking: 9999, // Abierto
    entryFee: 200,
    points: 30,
    prizeMoney: 150,
    opponentsStrength: { min: 40, max: 55 }
  });

  tournaments.push({
    id: `j60_${week}`,
    name: `J60 ${getCity(altSurface, week * 13)}`,
    tier: 'J60',
    surface: altSurface,
    minRanking: 9999, // Abierto
    entryFee: 350,
    points: 60,
    prizeMoney: 300,
    opponentsStrength: { min: 48, max: 62 }
  });

  // 2. Torneos J100 / J200 (Req: Ranking <= 300)
  tournaments.push({
    id: `j100_${week}`,
    name: `J100 ${getCity(mainSurface, week * 19)}`,
    tier: 'J100',
    surface: mainSurface,
    minRanking: 300,
    entryFee: 600,
    points: 100,
    prizeMoney: 600,
    opponentsStrength: { min: 58, max: 72 }
  });

  if (yearWeek % 2 === 0) {
    tournaments.push({
      id: `j200_${week}`,
      name: `J200 ${getCity(altSurface, week * 31)}`,
      tier: 'J200',
      surface: altSurface,
      minRanking: 300,
      entryFee: 850,
      points: 200,
      prizeMoney: 1000,
      opponentsStrength: { min: 65, max: 78 }
    });
  }

  // 3. Torneos J300 / J500 (Req: Ranking <= 100)
  if (yearWeek % 3 === 1) {
    tournaments.push({
      id: `j300_${week}`,
      name: `J300 ${getCity(mainSurface, week * 43)}`,
      tier: 'J300',
      surface: mainSurface,
      minRanking: 100,
      entryFee: 1300,
      points: 300,
      prizeMoney: 1600,
      opponentsStrength: { min: 72, max: 84 }
    });
  }

  if (yearWeek % 4 === 2) {
    tournaments.push({
      id: `j500_${week}`,
      name: `J500 ${getCity(mainSurface, week * 57)}`,
      tier: 'J500',
      surface: mainSurface,
      minRanking: 100,
      entryFee: 1700,
      points: 500,
      prizeMoney: 2500,
      opponentsStrength: { min: 78, max: 88 }
    });
  }

  // 4. Junior Grand Slams (Semanas específicas, Req: Ranking <= 30)
  if (yearWeek === 3) {
    tournaments.push({
      id: `jgs_${week}_ao`,
      name: 'Australian Open Junior',
      tier: 'JGS',
      surface: 'Hard',
      minRanking: 30,
      entryFee: 2500,
      points: 1000,
      prizeMoney: 5000,
      opponentsStrength: { min: 84, max: 96 }
    });
  } else if (yearWeek === 22) {
    tournaments.push({
      id: `jgs_${week}_rg`,
      name: 'Roland Garros Junior',
      tier: 'JGS',
      surface: 'Clay',
      minRanking: 30,
      entryFee: 2500,
      points: 1000,
      prizeMoney: 5000,
      opponentsStrength: { min: 84, max: 96 }
    });
  } else if (yearWeek === 27) {
    tournaments.push({
      id: `jgs_${week}_wim`,
      name: 'Wimbledon Junior',
      tier: 'JGS',
      surface: 'Grass',
      minRanking: 30,
      entryFee: 2500,
      points: 1000,
      prizeMoney: 5000,
      opponentsStrength: { min: 84, max: 96 }
    });
  } else if (yearWeek === 36) {
    tournaments.push({
      id: `jgs_${week}_uso`,
      name: 'US Open Junior',
      tier: 'JGS',
      surface: 'Hard',
      minRanking: 30,
      entryFee: 2500,
      points: 1000,
      prizeMoney: 5000,
      opponentsStrength: { min: 84, max: 96 }
    });
  }

  return tournaments;
}
