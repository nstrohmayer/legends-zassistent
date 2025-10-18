import type * as React from 'react';

// === Journaling ===
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

// FIX: Add missing type definitions.
// === Gemini & AI ===
export interface GeminiComplexGoalResponseItem {
  goalText: string;
  pokemonName?: string;
  pokemonId?: number;
}

// === Story & Goals ===
export interface StoryGoal {
    id: string;
    text: string;
    isCompleted: boolean;
}

// === Team & Pokémon Management ===
export interface TeamMember {
  id:string;
  species: string;
  nickname?: string;
  level: number;
  pokemonId?: number;
  heldItem?: string;
  moves?: string[];
  isShiny?: boolean;
  types: string[];
}

export interface AddTeamMemberData {
  species: string;
  level: number;
  nickname?: string;

  pokemonId?: number;
  initialMove?: string;
  types: string[];
}

export type CaughtStatusMap = Record<string, boolean>;
export type LikedPokemonMap = Record<string, boolean>;
export type HuntingListMap = Record<string, { pokemonId: number; pokemonName: string }[]>;

// === Component Props ===

// --- App Structure ---
export interface JournalSidebarProps {
    entries: JournalEntry[];
    selectedEntryId: string | null;
    onSelectEntry: (id: string) => void;
    onAddEntry: () => void;
    onDeleteEntry: (id: string) => void;
}

export interface JournalEntryDisplayProps {
    entry: JournalEntry | null;
    onUpdate: (id: string, title: string, content: string) => void;
    onOpenPokemonDetail: (pokemonNameOrId: string | number) => void;
}

export interface TeamManagerProps {
  team: TeamMember[];
  setTeam: (team: TeamMember[]) => void;
  onRemoveTeamMember: (id: string) => void;
  IconPokeball: React.ElementType;
  onUpdateTeamMemberNickname: (memberId: string, nickname: string) => void;
  onUpdateTeamMemberLevel: (memberId: string, level: number) => void;
  onUpdateTeamMemberItem: (memberId: string, item: string) => void;
  onUpdateTeamMemberMove: (memberId: string, moveIndex: number, moveName: string) => void;
  onToggleTeamMemberShiny: (memberId: string) => void;
}

// --- Detail Display Bar ---
export interface DetailDisplayControllerProps {
  activeView: 'pokemon' | 'ability' | 'move' | null;
  pokemonData: PokemonDetailData | null;
  abilityData: AbilityDetailData | null;
  moveData: FullMoveDetailData | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onBackToPokemon?: () => void;
  pokemonContextForDetailViewName?: string | null;
  isCaught: boolean;
  onToggleCaught: (pokemonId: number) => void;
  onAddToTeam: (speciesName: string, pokemonId: number, types: string[]) => void;
  onAddToHuntingList: (pokemonId: number, pokemonName: string, area: string) => void;
  onStageMove: (pokemonId: number, moveName: string, moveDetails: PokemonMoveInfo) => void;
  stagedMoveNameForThisPokemon: string | null;
  onPokemonNameClickForEvolution: (pokemonNameOrId: string | number) => void;
  onAbilityNameClick: (abilityName: string) => void;
  onMoveNameClick: (moveDisplayName: string, rawMoveName: string) => void;
}

export interface PokemonDetailBarProps {
  pokemonData: PokemonDetailData;
  isCaught: boolean;
  onToggleCaught: (pokemonId: number) => void;
  onAddToTeam: (speciesName: string, pokemonId: number, types: string[]) => void;
  onAddToHuntingList: (pokemonId: number, pokemonName: string, area: string) => void;
  onPokemonNameClickForEvolution: (pokemonNameOrId: string | number) => void;
  onAbilityNameClick: (abilityName: string) => void;
  onMoveNameClick: (moveDisplayName: string, rawMoveName: string) => void;
  onStageMove: (pokemonId: number, moveName: string, moveDetails: PokemonMoveInfo) => void;
  stagedMoveNameForThisPokemon: string | null;
  onClose: () => void;
}

export interface AbilityDetailDisplayProps {
  abilityData: AbilityDetailData;
  onPokemonNameClick?: (pokemonNameOrId: string | number) => void;
}

export interface MoveDetailDisplayProps {
  moveData: FullMoveDetailData;
  onPokemonNameClick?: (pokemonNameOrId: string | number) => void;
}

// --- Navigator & Formatted Response ---
export interface NavigatorDisplayProps {
  initialPromptValue: string;
  onPromptSubmit: (prompt: string) => void;
  isLoading: boolean;
  apiResponse: string | null;
  apiError: string | null;
  onReset: () => void;
  onPokemonNameClick: (pokemonName: string) => void;
}

export interface FormattedResponseProps {
  responseText: string;
  onPokemonNameClick: (pokemonName: string) => void;
}

// --- Collections Displays ---
export interface LikedPokemonDisplayProps {
    likedPokemonIds: number[];
    onPokemonClick: (pokemonId: number) => void;
}

export interface HuntingListDisplayProps {
    huntingList: HuntingListMap;
    onPokemonClick: (pokemonId: number) => void;
    onRemoveFromHunt: (pokemonId: number, area: string) => void;
}

// --- Team Prospector ---
export interface TeamProspectorProps {
    team: TeamMember[];
    onAbilityClick: (abilityName: string) => void;
    likedPokemonMap: LikedPokemonMap;
    onToggleLiked: (pokemonId: number) => void;
    onPokemonClick: (pokemonId: number) => void;
    onAddToTeam: (data: AddTeamMemberData) => void;
}

export interface ProspectorFilters {
    type: string | null;
    isFullyEvolvedOnly: boolean;
    hasMegaEvolution: boolean;
}

export interface ProspectorState {
    prospectList: { name: string; id: number }[];
    currentIndex: number;
    prospect: PokemonDetailData | null;
    isLoading: boolean;
    error: string | null;
}

// --- Pokemon Detail Lookup ---
export interface PokemonDetailLookupProps {
    onAbilityClick: (abilityName: string) => void;
    onMoveClick: (moveName: string, rawMoveName: string) => void;
}

// === Detailed Data Structures (from APIs) ===

// --- App-Internal Pokémon Detail Structure ---
// FIX: Add GenerationInsights interface for Kalos-specific data.
export interface GenerationInsights {
  availability: { area: string; notes: string }[];
}

export interface PokemonDetailData {
  id: number;
  name: string;
  spriteUrl: string | null;
  shinySpriteUrl: string | null;
  genus: string;
  types: string[];
  abilities: { displayName: string; rawName: string; isHidden: boolean }[];
  baseStats: PokemonBaseStat[];
  evolutions: {
    currentStage: { name: string; id: number; spriteUrl: string | null };
    previousStage?: { name: string; id: number; spriteUrl: string | null };
    nextStages: PokemonEvolutionStep[];
  } | null;
  flavorText: string;
  moves: PokemonMoveInfo[];
  // FIX: Add optional generationInsights property to hold Kalos availability data.
  generationInsights?: GenerationInsights | null;
}

export interface PokemonBaseStat {
  name: string;
  value: number;
}

export interface PokemonEvolutionStep {
  name: string;
  id: number;
  spriteUrl: string | null;
  trigger: string;
  conditions: string[];
}

export interface PokemonMoveInfo {
  rawName: string;
  name: string;
  levelLearnedAt: number;
  learnMethod: string;
  power: number | null;
  accuracy: number | null;
  pp?: number;
  moveType?: string;
  damageClass?: string;
  shortEffect?: string;
}

export interface AbilityDetailData {
    id: number;
    name: string;
    effect: string;
    shortEffect: string;
    flavorText: string;
    pokemonWithAbility: { name: string; isHidden: boolean; id: string }[];
}

export interface FullMoveDetailData {
    id: number;
    name: string;
    accuracy: number | null;
    power: number | null;
    pp: number;
    type: string;
    damageClass: string;
    effect: string;
    effectChance: number | null | undefined;
    flavorText: string;
    target: string;
    learnedByPokemon: { name: string; id: string }[];
}

// FIX: Add missing PokeAPI type definitions.
// --- PokeAPI Raw Data Structures ---
export interface PokeApiResource {
  name: string;
  url: string;
}

export interface PokeApiPokemon {
  id: number;
  name: string;
  species: PokeApiResource;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: PokeApiResource;
  }[];
  types: {
    type: PokeApiResource;
  }[];
  abilities: {
    ability: PokeApiResource;
    is_hidden: boolean;
  }[];
  moves: {
    move: PokeApiResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: PokeApiResource;
      version_group: PokeApiResource;
    }[];
  }[];
}

export interface PokeApiSpecies {
  evolution_chain: {
    url: string;
  } | null;
  flavor_text_entries: {
    flavor_text: string;
    language: PokeApiResource;
    version: PokeApiResource;
  }[];
  genera: {
    genus: string;
    language: PokeApiResource;
  }[];
}

export interface PokeApiEvolutionChain {
  chain: PokeApiEvolutionChainLink;
}

export interface PokeApiEvolutionChainLink {
  species: PokeApiResource;
  evolves_to: PokeApiEvolutionChainLink[];
  evolution_details: PokeApiEvolutionDetail[];
}

export interface PokeApiEvolutionDetail {
  trigger: PokeApiResource | null;
  min_level: number | null;
  item: PokeApiResource | null;
  gender: number | null;
  held_item: PokeApiResource | null;
  known_move: PokeApiResource | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  time_of_day: string;
  location: PokeApiResource | null;
  needs_overworld_rain: boolean;
  party_species: PokeApiResource | null;
  trade_species: PokeApiResource | null;
  turn_upside_down: boolean;
}

export interface PokeApiMoveData {
  effect_entries: {
    effect: string;
    short_effect: string;
    language: PokeApiResource;
  }[];
  power: number | null;
  accuracy: number | null;
  pp: number;
  type: PokeApiResource;
  damage_class: PokeApiResource;
  effect_chance: number | null;
}

export interface FullPokeApiMoveData extends PokeApiMoveData {
    id: number;
    // FIX: Add missing 'name' property to match PokeAPI response.
    name: string;
    flavor_text_entries: {
        flavor_text: string;
        language: PokeApiResource;
        version_group: PokeApiResource;
    }[];
    target: PokeApiResource;
    learned_by_pokemon: PokeApiResource[];
}

export interface PokeApiAbility {
  id: number;
  name: string;
  names: {
    name: string;
    language: PokeApiResource;
  }[];
  effect_entries: {
    effect: string;
    short_effect: string;
    language: PokeApiResource;
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: PokeApiResource;
    version_group: PokeApiResource;
  }[];
  pokemon: {
    pokemon: PokeApiResource;
    is_hidden: boolean;
  }[];
}

// === Wild Zone Explorer ===
export interface WildPokemon {
  name: string;
  id: number;
  conditions?: string;
}

export interface WildZone {
  id: string;
  name: string;
  pokemon: WildPokemon[];
}

export interface WildZoneExplorerProps {
    zones: WildZone[];
    onPokemonClick: (pokemonId: number) => void;
}