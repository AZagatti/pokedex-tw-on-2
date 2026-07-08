<script lang="ts">
	import { Search, X, ChevronDown } from '@lucide/svelte';
	import { TYPE_COLORS, capitalize } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		search?: string;
		generation?: string;
		types?: string[];
		sortBy?: string;
	}

	let { search = '', generation = 'all', types = [], sortBy = 'id-asc' }: Props = $props();

	const dispatch = createEventDispatcher();

	const GENERATIONS = [
		{ label: 'All Generations', range: [1, 1025], value: 'all' },
		{ label: 'Generation I', range: [1, 151], value: '1' },
		{ label: 'Generation II', range: [152, 251], value: '2' },
		{ label: 'Generation III', range: [252, 386], value: '3' },
		{ label: 'Generation IV', range: [387, 493], value: '4' },
		{ label: 'Generation V', range: [494, 649], value: '5' },
		{ label: 'Generation VI', range: [650, 721], value: '6' },
		{ label: 'Generation VII', range: [722, 809], value: '7' },
		{ label: 'Generation VIII', range: [810, 905], value: '8' },
		{ label: 'Generation IX', range: [906, 1025], value: '9' },
	];

	const POKEMON_TYPES = [
		'normal', 'fire', 'water', 'electric', 'grass', 'ice',
		'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
		'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
	];

	const SORT_OPTIONS = [
		{ label: 'ID (Ascending)', value: 'id-asc' },
		{ label: 'ID (Descending)', value: 'id-desc' },
		{ label: 'Name (A-Z)', value: 'name-asc' },
		{ label: 'Name (Z-A)', value: 'name-desc' },
	];

	let searchInput = $state(search);
	let showTypeDropdown = $state(false);
	let searchDebounce: ReturnType<typeof setTimeout>;

	function handleSearchInput(e: Event) {
		const {value} = (e.target as HTMLInputElement);
		searchInput = value;

		clearTimeout(searchDebounce);
		searchDebounce = setTimeout(() => {
			dispatch('search', value);
		}, 300);
	}

	function toggleType(type: string) {
		const newTypes = types.includes(type)
			? types.filter(t => t !== type)
			: [...types, type];
		dispatch('typeChange', newTypes);
	}

	function clearFilters() {
		searchInput = '';
		dispatch('search', '');
		dispatch('generationChange', 'all');
		dispatch('typeChange', []);
		dispatch('sortChange', 'id-asc');
	}
</script>

<div class="search-toolbar">
	<div class="search-input-wrapper">
		<Search size={20} class="search-icon" />
		<input
			type="text"
			placeholder="Search Pokémon..."
			value={searchInput}
			oninput={handleSearchInput}
			class="search-input"
			data-testid="search-input"
		/>
		{#if searchInput}
			<button
				onclick={() => {
					searchInput = '';
					dispatch('search', '');
				}}
				class="clear-search"
				aria-label="Clear search"
			>
				<X size={16} />
			</button>
		{/if}
	</div>

	<label for="generation-select" class="visually-hidden">Filter by generation</label>
	<select
		id="generation-select"
		value={generation}
		onchange={(e) => dispatch('generationChange', (e.target as HTMLSelectElement).value)}
		class="filter-select"
		data-testid="generation-select"
	>
		{#each GENERATIONS as gen}
			<option value={gen.value}>{gen.label}</option>
		{/each}
	</select>

	<div class="type-filter">
		<button
			onclick={() => showTypeDropdown = !showTypeDropdown}
			class="type-dropdown-btn"
			data-testid="type-filter-btn"
		>
			Types
			{#if types.length > 0}
				<span class="type-count">{types.length}</span>
			{/if}
			<ChevronDown size={16} />
		</button>

		{#if showTypeDropdown}
			<div class="type-dropdown">
				{#each POKEMON_TYPES as type}
					<label class="type-option">
						<input
							type="checkbox"
							checked={types.includes(type)}
							onchange={() => toggleType(type)}
						/>
						<span class="type-label" style="background-color: {TYPE_COLORS[type]}">
							{capitalize(type)}
						</span>
					</label>
				{/each}
			</div>
		{/if}
	</div>

	<label for="sort-select" class="visually-hidden">Sort by</label>
	<select
		id="sort-select"
		value={sortBy}
		onchange={(e) => dispatch('sortChange', (e.target as HTMLSelectElement).value)}
		class="filter-select"
		data-testid="sort-select"
	>
		{#each SORT_OPTIONS as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>

	<button onclick={clearFilters} class="clear-btn" data-testid="clear-filters-btn">
		Clear All
	</button>
</div>

<style>
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.search-toolbar {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: #fff;
		border-radius: 1rem;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
		position: sticky;
		top: 73px;
		z-index: 50;
	}

	:global(.dark) .search-toolbar {
		background: #1f2937;
	}

	.search-input-wrapper {
		position: relative;
		flex: 1;
		min-width: 200px;
	}

	.search-icon {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		color: #9ca3af;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 3rem 0.75rem 3rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		background: #fff;
		color: inherit;
	}

	:global(.dark) .search-input {
		background: #374151;
		border-color: #4b5563;
	}

	.search-input:focus {
		outline: none;
		border-color: #ef4444;
		box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
	}

	.clear-search {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: #9ca3af;
		padding: 0.25rem;
		display: flex;
		align-items: center;
	}

	.filter-select {
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		background: #fff;
		color: inherit;
		cursor: pointer;
	}

	:global(.dark) .filter-select {
		background: #374151;
		border-color: #4b5563;
	}

	.type-filter {
		position: relative;
	}

	.type-dropdown-btn {
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		background: #fff;
		color: inherit;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.dark) .type-dropdown-btn {
		background: #374151;
		border-color: #4b5563;
	}

	.type-count {
		background: #ef4444;
		color: white;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.type-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		background: #fff;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		padding: 0.5rem;
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
		min-width: 250px;
		z-index: 100;
	}

	:global(.dark) .type-dropdown {
		background: #1f2937;
		border-color: #4b5563;
	}

	.type-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.type-option input {
		cursor: pointer;
	}

	.type-label {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
		text-transform: capitalize;
		flex: 1;
		text-align: center;
	}

	.clear-btn {
		padding: 0.75rem 1rem;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
	}

	.clear-btn:hover {
		background: #dc2626;
	}

	@media (max-width: 768px) {
		.search-toolbar {
			top: 65px;
		}

		.search-input-wrapper {
			width: 100%;
		}

		.filter-select,
		.type-dropdown-btn {
			flex: 1;
		}
	}
</style>
