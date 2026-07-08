<script lang="ts">
	import { onMount } from 'svelte';
	import { getBerryList, extractIdFromUrl } from '$lib/api/client';
	import { capitalize } from '$lib/utils';
	import SkeletonCard from '$lib/components/skeleton-card.svelte';

	interface BerryListItem {
		name: string;
		url: string;
	}

	let berries = $state<BerryListItem[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		loadBerries();
	});

	async function loadBerries() {
		try {
			loading = true;
			error = null;
			const response = await getBerryList(64, 0);
			berries = response.results;
		} catch (error) {
			error = error instanceof Error ? error.message : 'Failed to load Berries';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Pokédex - Berries</title>
</svelte:head>

<div class="container">
	<h1 class="page-title">Berries</h1>
	<p class="page-subtitle">Browse all Berries in the Pokémon world</p>

	{#if error}
		<div class="error-message" role="alert">
			<p>{error}</p>
			<button onclick={loadBerries} class="retry-btn"> Try Again </button>
		</div>
	{/if}

	{#if loading}
		<SkeletonCard count={20} />
	{:else if berries.length === 0}
		<div class="no-results">
			<p>No Berries found.</p>
		</div>
	{:else}
		<div class="results-count">
			Showing {berries.length} Berries
		</div>

		<div class="berry-grid">
			{#each berries as berry (berry.name)}
				<a href="/berries/{extractIdFromUrl(berry.url)}" class="berry-card" data-testid="berry-card-{extractIdFromUrl(berry.url)}">
					<div class="card-id">#{String(extractIdFromUrl(berry.url)).padStart(3, '0')}</div>
					<h3 class="card-name">{capitalize(berry.name)} Berry</h3>
				</a>
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
		background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
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

	.berry-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.berry-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1.5rem 1rem;
		background: var(--card-bg, #fff);
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		transition: all 0.2s ease;
		text-decoration: none;
		color: inherit;
		border: 2px solid transparent;
		min-height: 100px;
	}

	.berry-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
		border-color: #10b981;
	}

	:global(.dark) .berry-card {
		--card-bg: #1f2937;
	}

	.card-id {
		font-size: 0.875rem;
		font-weight: 600;
		color: #9ca3af;
		margin-bottom: 0.5rem;
	}

	.card-name {
		font-size: 1.125rem;
		font-weight: 700;
		text-align: center;
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
		background: #10b981;
		color: white;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
	}

	.retry-btn:hover {
		background: #059669;
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 2rem;
		}

		.berry-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 1rem;
		}
	}
</style>
