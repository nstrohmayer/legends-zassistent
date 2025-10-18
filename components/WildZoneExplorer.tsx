import React, { useState } from 'react';
import { WildZoneExplorerProps } from '../types';

const ConditionBadge: React.FC<{ conditions?: string }> = ({ conditions }) => {
  if (!conditions || conditions.toLowerCase() === 'both') {
    return null;
  }

  let icon = "";
  let bgColor = "bg-slate-600";
  let textColor = "text-slate-100";
  let text = conditions;

  const lowerConditions = conditions.toLowerCase();

  if (lowerConditions.includes("day")) { icon = "☀️"; bgColor = "bg-yellow-500/30"; textColor = "text-yellow-200"; text="Day"; }
  else if (lowerConditions.includes("night")) { icon = "🌙"; bgColor = "bg-indigo-500/30"; textColor = "text-indigo-200"; text="Night"; }
  
  if (!icon) return null; // Only render if we have a specific icon

  return (
    <span 
        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor} inline-flex items-center whitespace-nowrap`}
        title={conditions} 
    >
      {icon} <span className="ml-1">{text}</span>
    </span>
  );
};


export const WildZoneExplorer: React.FC<WildZoneExplorerProps> = ({ zones, onPokemonClick }) => {
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);

  const toggleZone = (zoneId: string) => {
    setExpandedZoneId(prevId => (prevId === zoneId ? null : zoneId));
  };

  return (
    <nav className="space-y-1 px-2">
      {zones.map(zone => {
        const isExpanded = expandedZoneId === zone.id;
        return (
          <div key={zone.id}>
            <button
              onClick={() => toggleZone(zone.id)}
              className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-expanded={isExpanded}
            >
              <span className="font-medium text-slate-300">{zone.name}</span>
              <span className={`transform transition-transform duration-200 text-sky-400 ${isExpanded ? 'rotate-90' : ''}`}>
                ›
              </span>
            </button>
            {isExpanded && (
              <ul className="pl-4 pr-2 pb-3 mt-1 border-l border-slate-700 ml-4 space-y-1 animate-fadeIn">
                {zone.pokemon.length > 0 ? zone.pokemon.map(p => (
                  <li key={p.id}>
                    <button
                      onClick={() => onPokemonClick(p.id)}
                      className="w-full text-left flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-700 transition-colors"
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                        alt=""
                        className="w-8 h-8 pixelated-sprite"
                        aria-hidden="true"
                        loading="lazy"
                      />
                      <span className="text-sm text-slate-300">{p.name}</span>
                      <ConditionBadge conditions={p.conditions} />
                    </button>
                  </li>
                )) : (
                    <li className="text-sm text-slate-400 italic text-center p-2">No Pokémon data for this zone.</li>
                )}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
};