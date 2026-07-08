<script lang="ts">
	import type { Pokemon } from '$lib/api/schemas';
	import { TYPE_COLORS, formatPokemonId, capitalize } from '$lib/utils';
	import { Heart } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		pokemon: Pokemon;
		isFavorite?: boolean;
	}

	const { pokemon, isFavorite = false }: Props = $props();

	const dispatch = createEventDispatcher();

	const primaryType = pokemon.types.find((t) => t.slot === 1)?.type.name || 'normal';
	const artwork = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;

	function toggleFavorite(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		dispatch('toggleFavorite', { id: pokemon.id });
	}
</script>

<a
	href="/pokemon/{pokemon.name}"
	class="pokemon-card"
	style="--type-color: {TYPE_COLORS[primaryType]}"
	data-testid="pokemon-card-{pokemon.id}"
>
	<button
		class="favorite-btn"
		onclick={toggleFavorite}
		aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
		data-testid="favorite-btn-{pokemon.id}"
	>
		<Heart class={isFavorite ? 'filled' : ''} size={20} />
	</button>

	<div class="card-id">{formatPokemonId(pokemon.id)}</div>

	<div class="card-image">
		{#if artwork}
			<img src={artwork} alt={pokemon.name} loading="lazy" />
		{:else}
			<div class="no-image">?</div>
		{/if}
	</div>

	<h3 class="card-name">{capitalize(pokemon.name)}</h3>

	<div class="card-types">
		{#each pokemon.types.sort((a, b) => a.slot - b.slot) as typeSlot}
			<span class="type-badge" style="background-color: {TYPE_COLORS[typeSlot.type.name]}">
				{capitalize(typeSlot.type.name)}
			</span>
		{/each}
	</div>
</a>

<style>
	.pokemon-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem 1rem;
		background: var(--card-bg, #fff);
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		transition: all 0.2s ease;
		text-decoration: none;
		color: inherit;
		border: 2px solid transparent;
	}

	.pokemon-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
		border-color: var(--type-color);
	}

	.favorite-btn {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		background: var(--card-bg, #fff);
		border: none;
		border-radius: 50%;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		z-index: 10;
	}

	.favorite-btn:hover {
		transform: scale(1.1);
		background: #fee;
	}

	.favorite-btn :global(.filled) {
		fill: #ef4444;
		stroke: #ef4444;
	}

	.card-id {
		font-size: 0.875rem;
		font-weight: 600;
		color: #9ca3af;
		margin-bottom: 0.5rem;
	}

	.card-image {
		width: 100%;
		height: 12rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.card-image img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.no-image {
		width: 8rem;
		height: 8rem;
		border-radius: 50%;
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		color: #9ca3af;
	}

	.card-name {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 0.75rem 0;
		text-align: center;
	}

	.card-types {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.type-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
		text-transform: uppercase;
	}

	:global(.dark) .pokemon-card {
		--card-bg: #1f2937;
	}

	:global(.dark) .favorite-btn {
		background: #374151;
	}

	:global(.dark) .card-id {
		color: #6b7280;
	}

	:global(.dark) .no-image {
		background: #374151;
		color: #6b7280;
	}
</style>
