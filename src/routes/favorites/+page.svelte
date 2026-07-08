<script lang="ts">
	import { onMount } from 'svelte';
	import { getPokemon } from '$lib/api/client';
	import type { Pokemon } from '$lib/api/schemas';
	import PokemonCard from '$lib/components/pokemon-card.svelte';
	import SkeletonCard from '$lib/components/skeleton-card.svelte';
	import { Heart } from '@lucide/svelte';

	let favoritePokemon = $state<Pokemon[]>([]);
	let favorites = $state<Set<number>>(new Set());
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		loadFavorites();
	});

	async function loadFavorites() {
		try {
			loading = true;
			error = null;

			const stored = localStorage.getItem('favorites');
			const ids: number[] = stored ? JSON.parse(stored) : [];
			favorites = new Set(ids);

			if (ids.length === 0) {
				favoritePokemon = [];
				return;
			}

			const pokemonPromises = ids.map((id) => getPokemon(id));
			favoritePokemon = await Promise.all(pokemonPromises);
		} catch (error) {
			error = error instanceof Error ? error.message : 'Failed to load favorites';
		} finally {
			loading = false;
		}
	}

	function toggleFavorite(event: CustomEvent<{ id: number }>) {
		const { id } = event.detail;
		const newFavorites = new Set(favorites);

		if (newFavorites.has(id)) {
			newFavorites.delete(id);
		} else {
			newFavorites.add(id);
		}

		favorites = newFavorites;
		localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
		favoritePokemon = favoritePokemon.filter((p) => newFavorites.has(p.id));
	}
</script>

<svelte:head>
	<title>Pokédex - Favorites</title>
</svelte:head>

<div class="container">
	<h1 class="page-title">Favorites</h1>
	<p class="page-subtitle">Your favorited Pokémon</p>

	{#if error}
		<div class="error-message" role="alert">
			<p>{error}</p>
			<button onclick={loadFavorites} class="retry-btn"> Try Again </button>
		</div>
	{/if}

	{#if loading}
		<SkeletonCard count={8} />
	{:else if favoritePokemon.length === 0}
		<div class="empty-state">
			<Heart size={48} />
			<p class="empty-title">No favorites yet</p>
			<p class="empty-subtitle">Tap the heart on any Pokémon to add it here.</p>
			<a href="/" class="browse-btn">Browse Pokémon</a>
		</div>
	{:else}
		<div class="results-count">
			{favoritePokemon.length} favorite{favoritePokemon.length === 1 ? '' : 's'}
		</div>

		<div class="pokemon-grid">
			{#each favoritePokemon as pokemon (pokemon.id)}
				<PokemonCard {pokemon} isFavorite={favorites.has(pokemon.id)} on:toggleFavorite={toggleFavorite} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		width: 100%;
	}

	.page-title {
		font-size: 2.5rem;
		font-weight: 800;
		text-align: center;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.page-subtitle {
		text-align: center;
		color: #6b7280;
		font-size: 1.125rem;
		margin-bottom: 2rem;
	}

	:global(.dark) .page-subtitle {
		color: #9ca3af;
	}

	.results-count {
		text-align: center;
		color: #6b7280;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	:global(.dark) .results-count {
		color: #9ca3af;
	}

	.pokemon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 4rem 2rem;
		color: #9ca3af;
		text-align: center;
	}

	.empty-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: #374151;
		margin-top: 0.5rem;
	}

	:global(.dark) .empty-title {
		color: #f3f4f6;
	}

	.empty-subtitle {
		color: #6b7280;
		margin-bottom: 1rem;
	}

	:global(.dark) .empty-subtitle {
		color: #9ca3af;
	}

	.browse-btn {
		margin-top: 0.5rem;
		padding: 0.5rem 1.5rem;
		background: #ef4444;
		color: white;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.browse-btn:hover {
		background: #dc2626;
	}

	.error-message {
		background: #fee2e2;
		border: 1px solid #fecaca;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 2rem;
		text-align: center;
	}

	:global(.dark) .error-message {
		background: #7f1d1d;
		border-color: #991b1b;
	}

	.retry-btn {
		margin-top: 0.5rem;
		padding: 0.5rem 1rem;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
	}

	.retry-btn:hover {
		background: #dc2626;
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.pokemon-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 1rem;
		}
	}
</style>
