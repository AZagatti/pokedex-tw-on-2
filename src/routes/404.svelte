<script lang="ts">
	import { Home } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Pokédex - Page Not Found</title>
</svelte:head>

<div class="container">
	<p class="status-code">404</p>
	<h1 class="title">This Pokémon fled!</h1>
	<p class="subtitle">The page you're looking for doesn't exist.</p>
	<a href="/" class="home-btn">
		<Home size={20} />
		Back to Home
	</a>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 6rem 2rem;
		min-height: 60vh;
	}

	.status-code {
		font-size: 6rem;
		font-weight: 800;
		line-height: 1;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.title {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #6b7280;
		font-size: 1.125rem;
		margin-bottom: 2rem;
	}

	:global(.dark) .subtitle {
		color: #9ca3af;
	}

	.home-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: #ef4444;
		color: white;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.home-btn:hover {
		background: #dc2626;
	}
</style>
