<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getBerry } from '$lib/api/client';
	import type { Berry } from '$lib/api/schemas';
	import { capitalize } from '$lib/utils';
	import { ArrowLeft } from '@lucide/svelte';

	let berry = $state<Berry | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	const id = $derived($page.params.id);

	onMount(async () => {
		try {
			if (id) {
				berry = await getBerry(Number.parseInt(id));
			}
		} catch (error) {
			error = error instanceof Error ? error.message : 'Failed to load berry';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{berry ? `${capitalize(berry.name)} Berry - Pokédex` : 'Loading...'}</title>
</svelte:head>

<div class="container">
	<div class="header">
		<a href="/berries" class="back-btn">
			<ArrowLeft size={20} />
			Back to Berries
		</a>
	</div>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if berry}
		<div class="detail-card">
			<h1 class="berry-name">{capitalize(berry.name)} Berry</h1>

			<div class="info-grid">
				<div class="info-item">
					<span class="label">Firmness</span>
					<span class="value">{capitalize(berry.firmness.name)}</span>
				</div>
				<div class="info-item">
					<span class="label">Size</span>
					<span class="value">{berry.size}mm</span>
				</div>
				<div class="info-item">
					<span class="label">Growth Time</span>
					<span class="value">{berry.growth_time}h</span>
				</div>
				<div class="info-item">
					<span class="label">Max Harvest</span>
					<span class="value">{berry.max_harvest}</span>
				</div>
				<div class="info-item">
					<span class="label">Smoothness</span>
					<span class="value">{berry.smoothness}</span>
				</div>
			</div>

			<div class="section">
				<h2>Flavors</h2>
				<div class="flavors-list">
					{#each berry.flavors.filter((f) => f.potency > 0) as flavor}
						<div class="flavor-item">
							<span class="flavor-name">{capitalize(flavor.flavor.name)}</span>
							<div class="flavor-bar">
								<div
									class="flavor-fill"
									style="width: {(flavor.potency / 40) * 100}%"
								></div>
							</div>
							<span class="flavor-potency">{flavor.potency}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
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

	.berry-name {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 2rem;
		background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.info-item {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		text-align: center;
	}

	:global(.dark) .info-item {
		background: #111827;
	}

	.label {
		display: block;
		color: #6b7280;
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
	}

	.value {
		display: block;
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	:global(.dark) .value {
		color: #f3f4f6;
	}

	.section {
		margin-top: 2rem;
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

	.flavors-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.flavor-item {
		display: grid;
		grid-template-columns: 100px 1fr 50px;
		align-items: center;
		gap: 1rem;
	}

	.flavor-name {
		font-weight: 600;
		color: #4b5563;
		text-transform: capitalize;
	}

	:global(.dark) .flavor-name {
		color: #9ca3af;
	}

	.flavor-bar {
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
	}

	:global(.dark) .flavor-bar {
		background: #374151;
	}

	.flavor-fill {
		height: 100%;
		background: linear-gradient(90deg, #10b981, #3b82f6);
		transition: width 0.3s;
	}

	.flavor-potency {
		font-weight: 700;
		color: #1f2937;
		text-align: right;
	}

	:global(.dark) .flavor-potency {
		color: #f3f4f6;
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
</style>
