import { apiCache } from "./cache";
import { PokemonListResponseSchema, PokemonSchema, PokemonSpeciesSchema, EvolutionChainSchema, BerryListResponseSchema, BerrySchema } from './schemas';
import type { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain, Berry, BerryListResponse } from './schemas';

const BASE_URL = "https://pokeapi.co/api/v2";

async function fetchWithCache<T>(url: string, schema: any): Promise<T> {
  const cached = apiCache.get<T>(url);
  if (cached) {return cached;}

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const validated = schema.parse(data);
  apiCache.set(url, validated);

  return validated;
}

export async function getPokemonList(
  limit = 20,
  offset = 0
): Promise<PokemonListResponse> {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  return fetchWithCache<PokemonListResponse>(url, PokemonListResponseSchema);
}

export async function getPokemon(idOrName: string | number): Promise<Pokemon> {
  const url = `${BASE_URL}/pokemon/${idOrName}`;
  return fetchWithCache<Pokemon>(url, PokemonSchema);
}

export async function getPokemonSpecies(
  idOrName: string | number
): Promise<PokemonSpecies> {
  const url = `${BASE_URL}/pokemon-species/${idOrName}`;
  return fetchWithCache<PokemonSpecies>(url, PokemonSpeciesSchema);
}

export async function getEvolutionChain(id: number): Promise<EvolutionChain> {
  const url = `${BASE_URL}/evolution-chain/${id}`;
  return fetchWithCache<EvolutionChain>(url, EvolutionChainSchema);
}

export async function getBerryList(
  limit = 20,
  offset = 0
): Promise<BerryListResponse> {
  const url = `${BASE_URL}/berry?limit=${limit}&offset=${offset}`;
  return fetchWithCache<BerryListResponse>(url, BerryListResponseSchema);
}

export async function getBerry(idOrName: string | number): Promise<Berry> {
  const url = `${BASE_URL}/berry/${idOrName}`;
  return fetchWithCache<Berry>(url, BerrySchema);
}

export function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number.parseInt(parts[parts.length - 1], 10);
}

export function getGenerationRange(generation: number): {
  start: number;
  end: number;
} {
  const ranges: Record<number, { start: number; end: number }> = {
    1: { end: 151, start: 1 },
    2: { end: 251, start: 152 },
    3: { end: 386, start: 252 },
    4: { end: 493, start: 387 },
    5: { end: 649, start: 494 },
    6: { end: 721, start: 650 },
    7: { end: 809, start: 722 },
    8: { end: 905, start: 810 },
    9: { end: 1025, start: 906 },
  };
  return ranges[generation] || { end: 1025, start: 1 };
}
