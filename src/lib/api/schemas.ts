import { z } from "zod";

export const PokemonTypeSchema = z.enum([
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "stellar",
  "unknown",
]);

export const NamedAPIResourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const PokemonSpriteSchema = z.object({
  back_default: z.string().url().nullable(),
  back_female: z.string().url().nullable(),
  back_shiny: z.string().url().nullable(),
  back_shiny_female: z.string().url().nullable(),
  front_default: z.string().url().nullable(),
  front_female: z.string().url().nullable(),
  front_shiny: z.string().url().nullable(),
  front_shiny_female: z.string().url().nullable(),
  other: z
    .object({
      "official-artwork": z
        .object({
          front_default: z.string().url().nullable(),
          front_shiny: z.string().url().nullable(),
        })
        .optional(),
      dream_world: z
        .object({
          front_default: z.string().url().nullable(),
          front_female: z.string().url().nullable(),
        })
        .optional(),
      home: z
        .object({
          front_default: z.string().url().nullable(),
          front_female: z.string().url().nullable(),
          front_shiny: z.string().url().nullable(),
          front_shiny_female: z.string().url().nullable(),
        })
        .optional(),
    })
    .optional(),
});

export const PokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const PokemonListResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(PokemonListItemSchema),
});

export const PokemonStatSchema = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: NamedAPIResourceSchema,
});

export const PokemonTypeSlotSchema = z.object({
  slot: z.number(),
  type: NamedAPIResourceSchema,
});

export const PokemonAbilitySchema = z.object({
  ability: NamedAPIResourceSchema,
  is_hidden: z.boolean(),
  slot: z.number(),
});

export const PokemonMoveSchema = z.object({
  move: NamedAPIResourceSchema,
  version_group_details: z.array(
    z.object({
      level_learned_at: z.number(),
      move_learn_method: NamedAPIResourceSchema,
      version_group: NamedAPIResourceSchema,
    })
  ),
});

export const PokemonCriesSchema = z.object({
  latest: z.string().url(),
  legacy: z.string().url().optional(),
});

export const PokemonSchema = z.object({
  abilities: z.array(PokemonAbilitySchema),
  base_experience: z.number().nullable(),
  cries: PokemonCriesSchema.optional(),
  height: z.number(),
  id: z.number(),
  is_default: z.boolean(),
  moves: z.array(PokemonMoveSchema),
  name: z.string(),
  order: z.number(),
  species: NamedAPIResourceSchema,
  sprites: PokemonSpriteSchema,
  stats: z.array(PokemonStatSchema),
  types: z.array(PokemonTypeSlotSchema),
  weight: z.number(),
});

export const EvolutionChainLinkSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    evolution_details: z.array(
      z.object({
        min_level: z.number().nullable(),
        trigger: NamedAPIResourceSchema,
        item: NamedAPIResourceSchema.nullable(),
        gender: z.number().nullable(),
        held_item: NamedAPIResourceSchema.nullable(),
        known_move: NamedAPIResourceSchema.nullable(),
        known_move_type: NamedAPIResourceSchema.nullable(),
        location: NamedAPIResourceSchema.nullable(),
        min_happiness: z.number().nullable(),
        min_beauty: z.number().nullable(),
        min_affection: z.number().nullable(),
        needs_overworld_rain: z.boolean(),
        party_species: NamedAPIResourceSchema.nullable(),
        party_type: NamedAPIResourceSchema.nullable(),
        relative_physical_stats: z.number().nullable(),
        time_of_day: z.string(),
        trade_species: NamedAPIResourceSchema.nullable(),
        turn_upside_down: z.boolean(),
      })
    ),
    evolves_to: z.array(EvolutionChainLinkSchema),
    is_baby: z.boolean(),
    species: NamedAPIResourceSchema,
  })
);

export const EvolutionChainSchema = z.object({
  baby_trigger_item: NamedAPIResourceSchema.nullable(),
  chain: EvolutionChainLinkSchema,
  id: z.number(),
});

export const PokemonSpeciesSchema = z.object({
  base_happiness: z.number().nullable(),
  capture_rate: z.number(),
  color: NamedAPIResourceSchema,
  egg_groups: z.array(NamedAPIResourceSchema),
  evolution_chain: z.object({
    url: z.string().url(),
  }),
  evolves_from_species: NamedAPIResourceSchema.nullable(),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: NamedAPIResourceSchema,
      version: NamedAPIResourceSchema,
    })
  ),
  form_descriptions: z.array(
    z.object({
      description: z.string(),
      language: NamedAPIResourceSchema,
    })
  ),
  forms_switchable: z.boolean(),
  gender_rate: z.number(),
  genera: z.array(
    z.object({
      genus: z.string(),
      language: NamedAPIResourceSchema,
    })
  ),
  generation: NamedAPIResourceSchema,
  growth_rate: NamedAPIResourceSchema,
  habitat: NamedAPIResourceSchema.nullable(),
  has_gender_differences: z.boolean(),
  hatch_counter: z.number().nullable(),
  id: z.number(),
  is_baby: z.boolean(),
  is_legendary: z.boolean(),
  is_mythical: z.boolean(),
  name: z.string(),
  names: z.array(
    z.object({
      name: z.string(),
      language: NamedAPIResourceSchema,
    })
  ),
  order: z.number(),
  pokedex_numbers: z.array(
    z.object({
      entry_number: z.number(),
      pokedex: NamedAPIResourceSchema,
    })
  ),
  shape: NamedAPIResourceSchema.nullable(),
  varieties: z.array(
    z.object({
      is_default: z.boolean(),
      pokemon: NamedAPIResourceSchema,
    })
  ),
});

export const BerrySchema = z.object({
  firmness: NamedAPIResourceSchema,
  flavors: z.array(
    z.object({
      potency: z.number(),
      flavor: NamedAPIResourceSchema,
    })
  ),
  growth_time: z.number(),
  id: z.number(),
  item: NamedAPIResourceSchema,
  max_harvest: z.number(),
  name: z.string(),
  natural_gift_power: z.number(),
  natural_gift_type: NamedAPIResourceSchema,
  size: z.number(),
  smoothness: z.number(),
  soil_dryness: z.number(),
});

export const BerryListResponseSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(PokemonListItemSchema),
});

export type PokemonType = z.infer<typeof PokemonTypeSchema>;
export type NamedAPIResource = z.infer<typeof NamedAPIResourceSchema>;
export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonListResponse = z.infer<typeof PokemonListResponseSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type Berry = z.infer<typeof BerrySchema>;
export type BerryListResponse = z.infer<typeof BerryListResponseSchema>;
