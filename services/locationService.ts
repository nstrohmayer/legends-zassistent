import { KALOS_WILD_ZONES } from '../constants';

export interface PokemonLocation {
  zoneName: string;
  conditions?: string;
}

/**
 * Finds all wild zones where a specific Pokémon can be found.
 * @param pokemonId The National Pokédex ID of the Pokémon to find.
 * @returns An array of location objects with zone name and encounter conditions.
 */
export function findPokemonInWildZones(pokemonId: number): PokemonLocation[] {
  const locations: PokemonLocation[] = [];

  for (const zone of KALOS_WILD_ZONES) {
    for (const pokemon of zone.pokemon) {
      if (pokemon.id === pokemonId) {
        locations.push({
          zoneName: zone.name,
          conditions: pokemon.conditions,
        });
        // A pokemon can be in multiple zones, so we don't break here.
      }
    }
  }

  return locations;
}
