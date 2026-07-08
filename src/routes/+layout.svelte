<script lang="ts">
	import './layout.css';
	import { Moon, Sun, Home, Cherry, Heart } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	const { children } = $props();

	let isDark = $state(false);

	onMount(() => {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			isDark = true;
			document.documentElement.classList.add('dark');
		}
	});

	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<svelte:head>
	<title>Pokédex - Gotta Catch 'Em All!</title>
	<meta name="description" content="A modern Pokédex built with SvelteKit" />
</svelte:head>

<div class="app">
	<nav class="navbar">
		<div class="nav-content">
			<h1 class="nav-title">Pokédex</h1>
			<div class="nav-links">
				<a href="{base}/" class="nav-link" aria-label="Home">
					<Home size={20} />
					<span>Home</span>
				</a>
				<a href="{base}/berries" class="nav-link" aria-label="Berries">
					<Cherry size={20} />
					<span>Berries</span>
				</a>
				<a href="{base}/favorites" class="nav-link" aria-label="Favorites">
					<Heart size={20} />
					<span>Favorites</span>
				</a>
				<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
					{#if isDark}
						<Sun size={20} />
					{:else}
						<Moon size={20} />
					{/if}
				</button>
			</div>
		</div>
	</nav>

	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f9fafb;
		color: #111827;
		transition: background-color 0.2s, color 0.2s;
	}

	:global(.dark body) {
		background: #111827;
		color: #f9fafb;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.navbar {
		background: #fff;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	:global(.dark) .navbar {
		background: #1f2937;
	}

	.nav-content {
		max-width: 1280px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-title {
		font-size: 1.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.nav-links {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		text-decoration: none;
		color: inherit;
		transition: background-color 0.2s;
	}

	.nav-link:hover {
		background: #f3f4f6;
	}

	:global(.dark) .nav-link:hover {
		background: #374151;
	}

	.theme-toggle {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 0.5rem;
		color: inherit;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
	}

	.theme-toggle:hover {
		background: #f3f4f6;
	}

	:global(.dark) .theme-toggle:hover {
		background: #374151;
	}

	.main-content {
		flex: 1;
		max-width: 1280px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	@media (max-width: 640px) {
		.nav-link span {
			display: none;
		}

		.nav-title {
			font-size: 1.25rem;
		}
	}
</style>

