import { WildZone } from './types';

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

// --- Local Storage Keys ---
export const TEAM_STORAGE_KEY = 'nuzlocke-lza-team';
export const CAUGHT_POKEMON_STORAGE_KEY = 'nuzlocke-lza-caught-pokemon';
export const COMPLETED_BATTLES_STORAGE_KEY = 'nuzlocke-lza-completed-battles';
export const LIKED_POKEMON_STORAGE_KEY = 'nuzlocke-lza-liked-pokemon';
export const HUNTING_LIST_STORAGE_KEY = 'nuzlocke-lza-hunting-list';
export const JOURNAL_STORAGE_KEY = 'nuzlocke-lza-journal-entries';
// FIX: Export missing constant for story goals.
export const CUSTOM_GOALS_STORAGE_KEY = 'nuzlocke-lza-custom-goals';


export const GENERATION_BOUNDARIES = [
  { gen: 1, start: 1, end: 151 },
  { gen: 2, start: 152, end: 251 },
  { gen: 3, start: 252, end: 386 },
  { gen: 4, start: 387, end: 493 },
  { gen: 5, start: 494, end: 649 },
  { gen: 6, start: 650, end: 721 },
  { gen: 7, start: 722, end: 809 },
  { gen: 8, start: 810, end: 905 },
  { gen: 9, start: 906, end: 1025 },
];


// LEGENDS_ZA_STARTERS constant removed as the starter selection component is being deleted.


export const MEGA_EVOLUTIONS_KALOS: { name: string; formName: string; id: number; spriteUrl: string; }[] = [
  { name: 'Venusaur', formName: 'Mega Venusaur', id: 3, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10033.png' },
  { name: 'Charizard', formName: 'Mega Charizard X', id: 6, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10034.png' },
  { name: 'Charizard', formName: 'Mega Charizard Y', id: 6, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10035.png' },
  { name: 'Blastoise', formName: 'Mega Blastoise', id: 9, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10036.png' },
  { name: 'Beedrill', formName: 'Mega Beedrill', id: 15, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10090.png' },
  { name: 'Pidgeot', formName: 'Mega Pidgeot', id: 18, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10073.png' },
  { name: 'Alakazam', formName: 'Mega Alakazam', id: 65, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10037.png' },
  { name: 'Slowbro', formName: 'Mega Slowbro', id: 80, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10071.png' },
  { name: 'Gengar', formName: 'Mega Gengar', id: 94, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10038.png' },
  { name: 'Kangaskhan', formName: 'Mega Kangaskhan', id: 115, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10039.png' },
  { name: 'Pinsir', formName: 'Mega Pinsir', id: 127, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10040.png' },
  { name: 'Gyarados', formName: 'Mega Gyarados', id: 130, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10041.png' },
  { name: 'Aerodactyl', formName: 'Mega Aerodactyl', id: 142, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10042.png' },
  { name: 'Mewtwo', formName: 'Mega Mewtwo X', id: 150, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10043.png' },
  { name: 'Mewtwo', formName: 'Mega Mewtwo Y', id: 150, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10044.png' },
  { name: 'Ampharos', formName: 'Mega Ampharos', id: 181, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10045.png' },
  { name: 'Steelix', formName: 'Mega Steelix', id: 208, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10070.png' },
  { name: 'Scizor', formName: 'Mega Scizor', id: 212, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10046.png' },
  { name: 'Heracross', formName: 'Mega Heracross', id: 214, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10047.png' },
  { name: 'Houndoom', formName: 'Mega Houndoom', id: 229, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10048.png' },
  { name: 'Tyranitar', formName: 'Mega Tyranitar', id: 248, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10049.png' },
  { name: 'Sceptile', formName: 'Mega Sceptile', id: 254, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10065.png' },
  { name: 'Blaziken', formName: 'Mega Blaziken', id: 257, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10050.png' },
  { name: 'Swampert', formName: 'Mega Swampert', id: 260, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10068.png' },
  { name: 'Gardevoir', formName: 'Mega Gardevoir', id: 282, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10051.png' },
  { name: 'Sableye', formName: 'Mega Sableye', id: 302, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10062.png' },
  { name: 'Mawile', formName: 'Mega Mawile', id: 303, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10052.png' },
  { name: 'Aggron', formName: 'Mega Aggron', id: 306, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10053.png' },
  { name: 'Medicham', formName: 'Mega Medicham', id: 308, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10054.png' },
  { name: 'Manectric', formName: 'Mega Manectric', id: 310, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10055.png' },
  { name: 'Sharpedo', formName: 'Mega Sharpedo', id: 319, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10063.png' },
  { name: 'Camerupt', formName: 'Mega Camerupt', id: 323, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10087.png' },
  { name: 'Altaria', formName: 'Mega Altaria', id: 334, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10064.png' },
  { name: 'Banette', formName: 'Mega Banette', id: 354, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10056.png' },
  { name: 'Absol', formName: 'Mega Absol', id: 359, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10057.png' },
  { name: 'Glalie', formName: 'Mega Glalie', id: 362, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10072.png' },
  { name: 'Salamence', formName: 'Mega Salamence', id: 373, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10089.png' },
  { name: 'Metagross', formName: 'Mega Metagross', id: 376, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10076.png' },
  { name: 'Latias', formName: 'Mega Latias', id: 380, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10066.png' },
  { name: 'Latios', formName: 'Mega Latios', id: 381, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10067.png' },
  { name: 'Rayquaza', formName: 'Mega Rayquaza', id: 384, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10077.png' },
  { name: 'Lopunny', formName: 'Mega Lopunny', id: 428, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10088.png' },
  { name: 'Garchomp', formName: 'Mega Garchomp', id: 445, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10059.png' },
  { name: 'Lucario', formName: 'Mega Lucario', id: 448, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10060.png' },
  { name: 'Abomasnow', formName: 'Mega Abomasnow', id: 460, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10061.png' },
  { name: 'Gallade', formName: 'Mega Gallade', id: 475, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10069.png' },
  { name: 'Audino', formName: 'Mega Audino', id: 531, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10074.png' },
  { name: 'Diancie', formName: 'Mega Diancie', id: 719, spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10075.png' },
];


// --- Type Calculation Data ---
export const POKEMON_TYPES = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'] as const;

export const TYPE_EFFECTIVENESS_CHART: Record<string, Partial<Record<string, number>>> = {
  // Attacker -> Defender -> Multiplier
  Normal:   { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire:     { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water:    { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Grass:    { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Ice:      { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison:   { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground:   { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying:   { Grass: 2, Electric: 0.5, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug:      { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock:     { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost:    { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon:   { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark:     { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel:    { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy:    { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};

export const KALOS_WILD_ZONES: WildZone[] = [
  {
    id: 'zone-1',
    name: 'Zone 1',
    pokemon: [
      { name: 'Weedle', id: 13, conditions: 'Both' },
      { name: 'Pidgey', id: 16, conditions: 'Both' },
      { name: 'Pichu', id: 172, conditions: 'Both' },
      { name: 'Mareep', id: 179, conditions: 'Both' },
      { name: 'Bunnelby', id: 659, conditions: 'Both' },
      { name: 'Fletchling', id: 661, conditions: 'Both' },
      { name: 'Scatterbug', id: 664, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-2',
    name: 'Zone 2',
    pokemon: [
      { name: 'Kakuna', id: 14, conditions: 'Both' },
      { name: 'Patrat', id: 504, conditions: 'Both' },
      { name: 'Binacle', id: 688, conditions: 'Both' },
      { name: 'Staryu', id: 120, conditions: 'Night only' },
      { name: 'Magikarp', id: 129, conditions: 'Both' },
      { name: 'Budew', id: 406, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-3',
    name: 'Zone 3',
    pokemon: [
      { name: 'Skiddo', id: 672, conditions: 'Both' },
      { name: 'Pancham', id: 674, conditions: 'Both' },
      { name: 'Litleo', id: 667, conditions: 'Both' },
      { name: 'Espurr', id: 677, conditions: 'Both' },
      { name: 'Flabébé', id: 669, conditions: 'Both' },
      { name: 'Pikachu', id: 25, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-4',
    name: 'Zone 4',
    pokemon: [
      { name: 'Patrat', id: 504, conditions: 'Both' },
      { name: 'Gastly', id: 92, conditions: 'Both' },
      { name: 'Honedge', id: 679, conditions: 'Night only' },
      { name: 'Spewpa', id: 665, conditions: 'Day only' },
      { name: 'Ekans', id: 23, conditions: 'Day only' },
      { name: 'Spinarak', id: 167, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-5',
    name: 'Zone 5',
    pokemon: [
      { name: 'Pidgey', id: 16, conditions: 'Both' },
      { name: 'Pidgeotto', id: 17, conditions: 'Both' },
      { name: 'Abra', id: 63, conditions: 'Both' },
      { name: 'Bellsprout', id: 69, conditions: 'Both' },
      { name: 'Electrike', id: 309, conditions: 'Both' },
      { name: 'Venipede', id: 543, conditions: 'Both' },
      { name: 'Bunnelby', id: 659, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-6',
    name: 'Zone 6',
    pokemon: [
      { name: 'Magikarp', id: 129, conditions: 'Both' },
      { name: 'Flaaffy', id: 180, conditions: 'Both' },
      { name: 'Houndour', id: 228, conditions: 'Both' },
      { name: 'Meditite', id: 307, conditions: 'Day only' },
      { name: 'Swablu', id: 333, conditions: 'Both' },
      { name: 'Buneary', id: 427, conditions: 'Both' },
      { name: 'Binacle', id: 688, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-7',
    name: 'Zone 7',
    pokemon: [
      { name: 'Kakuna', id: 14, conditions: 'Both' },
      { name: 'Roselia', id: 315, conditions: 'Both' },
      { name: 'Shuppet', id: 353, conditions: 'Night only' },
      { name: 'Hippopotas', id: 449, conditions: 'Day only' },
      { name: 'Audino', id: 531, conditions: 'Both' },
      { name: 'Floette', id: 670, conditions: 'Both' },
      { name: 'Vanillite', id: 582, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-8',
    name: 'Zone 8',
    pokemon: [
      { name: 'Machop', id: 66, conditions: 'Both' },
      { name: 'Numel', id: 322, conditions: 'Both' },
      { name: 'Gible', id: 443, conditions: 'Both' },
      { name: 'Drilbur', id: 529, conditions: 'Both' },
      { name: 'Sandile', id: 551, conditions: 'Both' },
      { name: 'Krokorok', id: 552, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-9',
    name: 'Zone 9',
    pokemon: [
      { name: 'Carbink', id: 703, conditions: 'Both' },
      { name: 'Espurr', id: 677, conditions: 'Both' },
      { name: 'Fletchinder', id: 662, conditions: 'Both' },
      { name: 'Kadabra', id: 64, conditions: 'Both' },
      { name: 'Sableye', id: 302, conditions: 'Both' },
      { name: 'Mawile', id: 303, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-10',
    name: 'Zone 10',
    pokemon: [
      { name: 'Arbok', id: 24, conditions: 'Both' },
      { name: 'Bellsprout', id: 69, conditions: 'Both' },
      { name: 'Slowpoke', id: 79, conditions: 'Both' },
      { name: 'Staryu', id: 120, conditions: 'Both' },
      { name: 'Carvanha', id: 318, conditions: 'Both' },
      { name: 'Watchog', id: 505, conditions: 'Both' },
      { name: 'Tynamo', id: 602, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-11',
    name: 'Zone 11',
    pokemon: [
      { name: 'Slowpoke', id: 79, conditions: 'Both' },
      { name: 'Gyarados', id: 130, conditions: 'Both' },
      { name: 'Stunfisk', id: 618, conditions: 'Both' },
      { name: 'Furfrou', id: 676, conditions: 'Both' },
      { name: 'Inkay', id: 686, conditions: 'Both' },
      { name: 'Clauncher', id: 692, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-12',
    name: 'Zone 12',
    pokemon: [
      { name: 'Machop', id: 66, conditions: 'Both' },
      { name: 'Machoke', id: 67, conditions: 'Both' },
      { name: 'Snorunt', id: 361, conditions: 'Both' },
      { name: 'Snover', id: 459, conditions: 'Both' },
      { name: 'Gogoat', id: 673, conditions: 'Both' },
      { name: 'Bergmite', id: 712, conditions: 'Both' },
      { name: 'Vanillite', id: 582, conditions: 'Both' },
      { name: 'Delibird', id: 225, conditions: 'Both' },
    ],
  },
  {
    id: 'zone-13',
    name: 'Zone 13',
    pokemon: [
      { name: 'Weepinbell', id: 70, conditions: 'Day only' },
      { name: 'Scyther', id: 123, conditions: 'Both' },
      { name: 'Pinsir', id: 127, conditions: 'Both' },
      { name: 'Phantump', id: 708, conditions: 'Night only' },
      { name: 'Vivillon', id: 666, conditions: 'Both' },
      { name: 'Heracross', id: 214, conditions: 'Both' },
    ],
  },
];