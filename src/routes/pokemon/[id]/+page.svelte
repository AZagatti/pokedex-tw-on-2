<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getPokemon } from '$lib/api/client';
	import type { Pokemon } from '$lib/api/schemas';
	import { getTypeColor, capitalize } from '$lib/utils';
	import { Heart, ArrowLeft } from '@lucide/svelte';

	let pokemon = $state<Pokemon | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let isFavorite = $state(false);
	let audioPlaying = $state(false);
	let audioElement = $state<HTMLAudioElement>();

	const id = $derived($page.params.id);

	onMount(async () => {
		const stored = localStorage.getItem('favorites');
		if (stored) {
			const favs = JSON.parse(stored);
			isFavorite = favs.includes(Number.parseInt(id ?? '0'));
		}

		try {
			if (id) {
				pokemon = await getPokemon(id);
			}
		} catch (error) {
			error = error instanceof Error ? error.message : 'Failed to load Pokémon';
		} finally {
			loading = false;
		}
	});

	function toggleFavorite() {
		if (!pokemon) {return;}
		const stored = localStorage.getItem('favorites');
		const favs = stored ? JSON.parse(stored) : [];

		if (isFavorite) {
			const index = favs.indexOf(pokemon.id);
			if (index !== -1) {favs.splice(index, 1);}
		} else {
			favs.push(pokemon.id);
		}

		localStorage.setItem('favorites', JSON.stringify(favs));
		isFavorite = !isFavorite;
	}

	function playCry() {
		if (audioElement && pokemon) {
			audioPlaying = true;
			audioElement.play();
		}
	}
</script>

<svelte:head>
	<title>{pokemon ? `${capitalize(pokemon.name)} - Pokédex` : 'Loading...'}</title>
</svelte:head>

<div class="container">
	<div class="header">
		<a href="/" class="back-btn">
			<ArrowLeft size={20} />
			Back
		</a>
	</div>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if pokemon}
		<div class="detail-card">
			<div class="header-row">
				<h1 class="pokemon-name">{capitalize(pokemon.name)}</h1>
				<button
					onclick={toggleFavorite}
					class="favorite-btn"
					aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
				>
					<Heart fill={isFavorite ? 'currentColor' : 'none'} />
				</button>
			</div>

			<div class="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</div>

			<div class="content-grid">
				<div class="image-section">
					<img
						src={pokemon.sprites.other?.['official-artwork']?.front_default ?? ''}
						alt={pokemon.name}
						class="pokemon-image"
					/>

					{#if pokemon.cries?.latest}
						<button onclick={playCry} class="cry-btn" disabled={audioPlaying}>
							{audioPlaying ? 'Playing...' : 'Play Cry'}
						</button>
						<audio
							bind:this={audioElement}
							src={pokemon.cries.latest}
							onended={() => (audioPlaying = false)}
						></audio>
					{/if}
				</div>

				<div class="info-section">
					<div class="types">
						{#each pokemon.types as typeSlot}
							<span
								class="type-badge"
								style="background-color: {getTypeColor(typeSlot.type.name)}"
							>
								{capitalize(typeSlot.type.name)}
							</span>
						{/each}
					</div>

					<div class="stats-grid">
						<div class="stat-item">
							<span class="stat-label">Height</span>
							<span class="stat-value">{pokemon.height / 10}m</span>
						</div>
						<div class="stat-item">
							<span class="stat-label">Weight</span>
							<span class="stat-value">{pokemon.weight / 10}kg</span>
						</div>
					</div>

					<div class="section">
						<h2>Stats</h2>
						<div class="stats-list">
							{#each pokemon.stats as stat}
								<div class="stat-row">
									<span class="stat-name">{capitalize(stat.stat.name)}</span>
									<div class="stat-bar">
										<div
											class="stat-fill"
											style="width: {Math.min((stat.base_stat / 255) * 100, 100)}%"
										></div>
									</div>
									<span class="stat-number">{stat.base_stat}</span>
								</div>
							{/each}
						</div>
					</div>

					<div class="section">
						<h2>Abilities</h2>
						<div class="abilities-list">
							{#each pokemon.abilities as abilitySlot}
								<span class="ability-badge">
									{capitalize(abilitySlot.ability.name.replace('-', ' '))}
								</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.back-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		color: #374151;
		text-decoration: none;
		font-weight: 500;
	}

	.back-btn:hover {
		background: #f9fafb;
	}

	:global(.dark) .back-btn {
		background: #1f2937;
		border-color: #374151;
		color: #f3f4f6;
	}

	.detail-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .detail-card {
		background: #1f2937;
	}

	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.pokemon-name {
		font-size: 2.5rem;
		font-weight: 800;
		background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.favorite-btn {
		padding: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		color: #ef4444;
		transition: transform 0.2s;
	}

	.favorite-btn:hover {
		transform: scale(1.1);
	}

	.pokemon-id {
		color: #6b7280;
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 2rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 3rem;
	}

	.image-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.pokemon-image {
		width: 100%;
		max-width: 400px;
		height: auto;
	}

	.cry-btn {
		padding: 0.75rem 1.5rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
	}

	.cry-btn:hover:not(:disabled) {
		background: #2563eb;
	}

	.cry-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.types {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.type-badge {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		color: white;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.875rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-item {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		text-align: center;
	}

	:global(.dark) .stat-item {
		background: #111827;
	}

	.stat-label {
		display: block;
		color: #6b7280;
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
	}

	.stat-value {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}

	:global(.dark) .stat-value {
		color: #f3f4f6;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	:global(.dark) .section h2 {
		color: #f3f4f6;
	}

	.stats-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.stat-row {
		display: grid;
		grid-template-columns: 120px 1fr 60px;
		align-items: center;
		gap: 1rem;
	}

	.stat-name {
		font-weight: 600;
		color: #4b5563;
		text-transform: capitalize;
	}

	:global(.dark) .stat-name {
		color: #9ca3af;
	}

	.stat-bar {
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
	}

	:global(.dark) .stat-bar {
		background: #374151;
	}

	.stat-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		transition: width 0.3s;
	}

	.stat-number {
		font-weight: 700;
		color: #1f2937;
		text-align: right;
	}

	:global(.dark) .stat-number {
		color: #f3f4f6;
	}

	.abilities-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.ability-badge {
		padding: 0.5rem 1rem;
		background: #dbeafe;
		color: #1e40af;
		border-radius: 0.5rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	:global(.dark) .ability-badge {
		background: #1e3a8a;
		color: #bfdbfe;
	}

	.loading,
	.error {
		text-align: center;
		padding: 3rem;
		font-size: 1.25rem;
	}

	.error {
		color: #ef4444;
	}

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.pokemon-name {
			font-size: 2rem;
		}

		.stat-row {
			grid-template-columns: 100px 1fr 50px;
		}
	}
</style>
