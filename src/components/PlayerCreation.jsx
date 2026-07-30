import React, { useState } from 'react';
import { PLAY_STYLES, COUNTRIES, HANDS, getOppositePlayStyle } from '../data/gameData';
import { User, Globe, HelpCircle, Swords, Award, Zap } from 'lucide-react';

export default function PlayerCreation({ onCreatePlayer }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handId, setHandId] = useState(HANDS[1].id); // Diestro 2H por defecto
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].code); // Argentina por defecto
  const [selectedStyle, setSelectedStyle] = useState('feroz'); // Del Potro por defecto

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert('Por favor, ingresa tu Nombre y Apellido.');
      return;
    }

    const country = COUNTRIES.find((c) => c.code === countryCode);
    const hand = HANDS.find((h) => h.id === handId);
    const styleData = PLAY_STYLES[selectedStyle];

    const newPlayer = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      hand: hand.name,
      country,
      style: selectedStyle,
      styleName: styleData.name,
      legend: styleData.legend,
      stats: { ...styleData.stats },
      bonus: { ...styleData.bonus },
      energy: 100,
      fatigue: 0,
      xpProgress: {}
    };

    // Generar Rival Némesis
    const oppositeStyleId = getOppositePlayStyle(selectedStyle);
    const oppositeStyleData = PLAY_STYLES[oppositeStyleId];

    // Escoger país diferente al del jugador
    const otherCountries = COUNTRIES.filter(c => c.code !== countryCode);
    const nemesisCountry = otherCountries[Math.floor(Math.random() * otherCountries.length)];

    // Generar un nombre y apellido procedural
    const firstNames = ['Carlos', 'Jannik', 'Holger', 'Arthur', 'Ben', 'Alex', 'Sebastian', 'Lorenzo', 'Luca', 'Diego', 'Alexander', 'Taylor', 'Casper', 'Stefanos'];
    const lastNames = ['Alcaraz', 'Sinner', 'Rune', 'Fils', 'Shelton', 'de Minaur', 'Korda', 'Musetti', 'Nardi', 'Schwartzman', 'Zverev', 'Fritz', 'Ruud', 'Tsitsipas'];
    const nemesisName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

    const newNemesis = {
      name: nemesisName,
      country: nemesisCountry,
      style: oppositeStyleId,
      styleName: oppositeStyleData.name,
      legend: oppositeStyleData.legend,
      stats: { ...oppositeStyleData.stats },
      bonus: { ...oppositeStyleData.bonus },
      energy: 100,
      fatigue: 0,
      points: 0,
      ranking: 9999
    };

    onCreatePlayer(newPlayer, newNemesis);
  };


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between py-6 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-6">
        <h1 className="text-3xl font-extrabold text-lime-400 tracking-tight flex items-center justify-center gap-2">
          <Swords className="w-8 h-8 text-lime-400" />
          TENNIS CAREER
        </h1>
        <p className="text-xs font-semibold text-lime-300/80 tracking-widest uppercase mt-1">
          Junior Edition • Manager MVP
        </p>
        <p className="text-zinc-400 text-sm mt-3">
          Forja tu leyenda desde los 14 años. Elige tu estilo de juego y embárcate en el circuito ITF Junior.
        </p>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6 flex-grow flex flex-col justify-between">
        <div className="space-y-5">
          {/* Nombre y Apellido */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-lime-400" /> Datos Personales
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={15}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={15}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition"
              />
            </div>
          </div>

          {/* Mano Hábil */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-lime-400" /> Mano Hábil / Revés
            </label>
            <select
              value={handId}
              onChange={(e) => setHandId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 rounded-xl px-3 py-2.5 text-sm text-zinc-100 outline-none transition"
            >
              {HANDS.map((hand) => (
                <option key={hand.id} value={hand.id}>
                  {hand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nacionalidad */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-lime-400" /> Nacionalidad
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 rounded-xl px-3 py-2.5 text-sm text-zinc-100 outline-none transition"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Estilo de Juego / Arquetipos */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-lime-400" /> Estilo de Juego (Leyenda)
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PLAY_STYLES).map((key) => {
                const style = PLAY_STYLES[key];
                const isSelected = selectedStyle === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedStyle(key)}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-lime-950/30 border-lime-400 text-zinc-100 ring-1 ring-lime-400/30'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span className="font-extrabold text-xs tracking-wide">
                      {style.name}
                    </span>
                    <span className="text-[10px] text-lime-400 font-semibold uppercase mt-0.5">
                      Arquetipo: {style.legend}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Estilo Detalle Card */}
            <div className="bg-zinc-950/70 border border-zinc-850 rounded-xl p-4 mt-2 space-y-3">
              <p className="text-xs text-zinc-400 italic">
                "{PLAY_STYLES[selectedStyle].description}"
              </p>
              
              {/* Bonus Pasivo */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex items-center gap-2">
                <span className="text-lime-400 font-extrabold text-xs">BONO:</span>
                <span className="text-[11px] text-zinc-200">
                  {PLAY_STYLES[selectedStyle].bonus.description}
                </span>
              </div>

              {/* Stats Clave Preview */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                <div className="flex justify-between border-b border-zinc-900 py-1">
                  <span className="text-zinc-500 font-medium">Derecha</span>
                  <span className="text-zinc-200 font-bold">{PLAY_STYLES[selectedStyle].stats.forehand}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 py-1">
                  <span className="text-zinc-500 font-medium">Servicio</span>
                  <span className="text-zinc-200 font-bold">{PLAY_STYLES[selectedStyle].stats.serve}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 py-1">
                  <span className="text-zinc-500 font-medium">Revés</span>
                  <span className="text-zinc-200 font-bold">{PLAY_STYLES[selectedStyle].stats.backhand}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 py-1">
                  <span className="text-zinc-500 font-medium">Volea</span>
                  <span className="text-zinc-200 font-bold">{PLAY_STYLES[selectedStyle].stats.volley}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 py-1">
                  <span className="text-zinc-500 font-medium">Resistencia</span>
                  <span className="text-zinc-200 font-bold">{PLAY_STYLES[selectedStyle].stats.stamina}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 py-1">
                  <span className="text-zinc-500 font-medium">Cancha Pref.</span>
                  <span className="text-lime-300 font-extrabold">{PLAY_STYLES[selectedStyle].bonus.preferredCourt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-lime-400 text-zinc-950 font-extrabold text-sm uppercase tracking-wider py-3.5 rounded-xl hover:bg-lime-300 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-lime-400/10"
        >
          Iniciar Carrera Profesional
        </button>
      </form>
    </div>
  );
}
