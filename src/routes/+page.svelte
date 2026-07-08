<script lang="ts">
	import { onMount } from 'svelte';
	import { getPokemon, getPokemonList } from '$lib/api/client';
	import type { Pokemon } from '$lib/api/schemas';
	import PokemonCard from '$lib/components/pokemon-card.svelte';
	import SkeletonCard from '$lib/components/skeleton-card.svelte';
	import SearchBar from '$lib/components/search-bar.svelte';

	let allPokemon = $state<Pokemon[]>([]);
	let filteredPokemon = $state<Pokemon[]>([]);
	let displayedPokemon = $state<Pokemon[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let favorites = $state<Set<number>>(new Set());

	let searchQuery = $state('');
	let selectedGeneration = $state('all');
	let selectedTypes = $state<string[]>([]);
	let sortBy = $state('id-asc');

	let displayCount = $state(20);
	let observerTarget = $state<HTMLDivElement>();

	const LOAD_MORE_COUNT = 20;

	const GENERATION_RANGES: Record<string, [number, number]> = {
		'1': [1, 151],
		'2': [152, 251],
		'3': [252, 386],
		'4': [387, 493],
		'5': [494, 649],
		'6': [650, 721],
		'7': [722, 809],
		'8': [810, 905],
		'9': [906, 1025],
		'all': [1, 1025],
	};

	onMount(() => {
		const stored = localStorage.getItem('favorites');
		if (stored) {
			favorites = new Set(JSON.parse(stored));
		}

		loadAllPokemon();

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && displayedPokemon.length < filteredPokemon.length) {
					displayCount += LOAD_MORE_COUNT;
					updateDisplayedPokemon();
				}
			},
			{ threshold: 0.1 }
		);

		if (observerTarget) {
			observer.observe(observerTarget);
		}

		return () => {
			if (observerTarget) {
				observer.unobserve(observerTarget);
			}
		};
	});

	async function loadAllPokemon() {
		try {
			loading = true;
			error = null;
			const response = await getPokemonList(1025, 0);

			const pokemonPromises = response.results.map((item) =>
				getPokemon(item.name)
			);

			allPokemon = await Promise.all(pokemonPromises);
			applyFilters();
		} catch (error) {
			error = error instanceof Error ? error.message : 'Failed to load Pokémon';
		} finally {
			loading = false;
		}
	}

	function applyFilters() {
		let result = [...allPokemon];

		if (selectedGeneration !== 'all') {
			const [min, max] = GENERATION_RANGES[selectedGeneration];
			result = result.filter(p => p.id >= min && p.id <= max);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(p =>
				p.name.toLowerCase().includes(query) ||
				p.id.toString().includes(query)
			);
		}

		if (selectedTypes.length > 0) {
			result = result.filter(p =>
				p.types.some(t => selectedTypes.includes(t.type.name))
			);
		}

		result.sort((a, b) => {
			switch (sortBy) {
				case 'id-asc': {
					return a.id - b.id;
				}
				case 'id-desc': {
					return b.id - a.id;
				}
				case 'name-asc': {
					return a.name.localeCompare(b.name);
				}
				case 'name-desc': {
					return b.name.localeCompare(a.name);
				}
				default: {
					return 0;
				}
			}
		});

		filteredPokemon = result;
		displayCount = LOAD_MORE_COUNT;
		updateDisplayedPokemon();
	}

	function updateDisplayedPokemon() {
		displayedPokemon = filteredPokemon.slice(0, displayCount);
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
	}
</script>

<svelte:head>
	<title>Pokédex - Home</title>
</svelte:head>

<div class="container">
	<h1 class="page-title">Pokédex</h1>
	<p class="page-subtitle">Discover all Pokémon species</p>

	{#if !loading}
		<SearchBar
			search={searchQuery}
			generation={selectedGeneration}
			types={selectedTypes}
			{sortBy}
			on:search={(e) => { searchQuery = e.detail; applyFilters(); }}
			on:generationChange={(e) => { selectedGeneration = e.detail; applyFilters(); }}
			on:typeChange={(e) => { selectedTypes = e.detail; applyFilters(); }}
			on:sortChange={(e) => { sortBy = e.detail; applyFilters(); }}
		/>
	{/if}

	{#if error}
		<div class="error-message" role="alert">
			<p>{error}</p>
			<button onclick={loadAllPokemon} class="retry-btn">
				Try Again
			</button>
		</div>
	{/if}

	{#if loading}
		<SkeletonCard count={20} />
	{:else if displayedPokemon.length === 0}
		<div class="no-results">
			<p>No Pokémon found matching your filters.</p>
		</div>
	{:else}
		<div class="results-count">
			Showing {displayedPokemon.length} of {filteredPokemon.length} Pokémon
		</div>

		<div class="pokemon-grid">
			{#each displayedPokemon as pokemon (pokemon.id)}
				<PokemonCard
					{pokemon}
					isFavorite={favorites.has(pokemon.id)}
					on:toggleFavorite={toggleFavorite}
				/>
			{/each}
		</div>

		{#if displayedPokemon.length < filteredPokemon.length}
			<div bind:this={observerTarget} class="observer-target">
				<p class="load-more-text">Loading more...</p>
			</div>
		{:else}
			<p class="end-message">You've seen all filtered Pokémon!</p>
		{/if}
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

	.pokemon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.observer-target {
		min-height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.load-more-text {
		color: #6b7280;
		font-style: italic;
	}

	:global(.dark) .load-more-text {
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

	.no-results {
		text-align: center;
		padding: 4rem 2rem;
		color: #6b7280;
		font-size: 1.125rem;
	}

	:global(.dark) .no-results {
		color: #9ca3af;
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

	.end-message {
		text-align: center;
		color: #6b7280;
		font-size: 1.125rem;
		padding: 2rem;
	}

	:global(.dark) .end-message {
		color: #9ca3af;
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

