import { describe, it, expect, beforeEach, vi } from "vitest";

import { apiCache } from "./cache";
import { getPokemon, getPokemonList, getBerry } from "./client";

vi.stubGlobal("fetch", async (url: string) => {
  if (typeof url === "string") {
    if (url.includes("/pokemon/1")) {
      return {
        json: async () => ({
          id: 1,
          name: "bulbasaur",
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/bulbasaur.png",
              },
            },
          },
          types: [
            {
              type: { name: "grass" },
            },
          ],
          stats: [{ base_stat: 45, stat: { name: "hp" } }],
          abilities: [{ ability: { name: "overgrow" } }],
          height: 7,
          weight: 69,
          species: { url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
        }),
        ok: true,
      } as Response;
    }
    if (url.includes("/pokemon?limit")) {
      return {
        json: async () => ({
          count: 1302,
          next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
          previous: null,
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          ],
        }),
        ok: true,
      } as Response;
    }
    if (url.includes("/berry/1")) {
      return {
        json: async () => ({
          id: 1,
          name: "cheri",
          firmness: { name: "soft" },
          flavors: [{ potency: 10, flavor: { name: "spicy" } }],
          growth_time: 3,
          max_harvest: 5,
          natural_gift_power: 60,
          natural_gift_type: { name: "fire" },
          size: 20,
          smoothness: 25,
        }),
        ok: true,
      } as Response;
    }
  }
  throw new Error("Not implemented");
});

describe("API Client", () => {
  beforeEach(() => {
    apiCache.clear();
  });

  it("fetches and caches pokemon", async () => {
    const pokemon = await getPokemon("bulbasaur");
    expect(pokemon.name).toBe("bulbasaur");
    expect(pokemon.id).toBe(1);

    const cached = await getPokemon("bulbasaur");
    expect(cached).toEqual(pokemon);
  });

  it("fetches pokemon list", async () => {
    const list = await getPokemonList(20, 0);
    expect(list.results).toHaveLength(1);
    expect(list.count).toBe(1302);
  });

  it("fetches berry", async () => {
    const berry = await getBerry(1);
    expect(berry.name).toBe("cheri");
    expect(berry.firmness.name).toBe("soft");
  });
});
