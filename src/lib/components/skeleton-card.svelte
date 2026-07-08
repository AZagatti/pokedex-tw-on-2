<script lang="ts">
	const { count = 4 } = $props();
</script>

<div class="skeleton-grid">
	{#each Array(count) as _, i}
		<div class="skeleton-card" data-testid="skeleton-card-{i}">
			<div class="skeleton-id"></div>
			<div class="skeleton-image"></div>
			<div class="skeleton-name"></div>
			<div class="skeleton-types">
				<div class="skeleton-type"></div>
				<div class="skeleton-type"></div>
			</div>
		</div>
	{/each}
</div>

<style>
	.skeleton-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
		width: 100%;
	}

	.skeleton-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem 1rem;
		background: var(--card-bg, #fff);
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.skeleton-id,
	.skeleton-image,
	.skeleton-name,
	.skeleton-type {
		background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 0.5rem;
	}

	.skeleton-id {
		width: 4rem;
		height: 1rem;
		margin-bottom: 0.5rem;
	}

	.skeleton-image {
		width: 10rem;
		height: 10rem;
		margin-bottom: 1rem;
		border-radius: 50%;
	}

	.skeleton-name {
		width: 8rem;
		height: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.skeleton-types {
		display: flex;
		gap: 0.5rem;
	}

	.skeleton-type {
		width: 4rem;
		height: 1.5rem;
		border-radius: 9999px;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	:global(.dark) .skeleton-card {
		--card-bg: #1f2937;
	}

	:global(.dark) .skeleton-id,
	:global(.dark) .skeleton-image,
	:global(.dark) .skeleton-name,
	:global(.dark) .skeleton-type {
		background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
		background-size: 200% 100%;
	}
</style>
