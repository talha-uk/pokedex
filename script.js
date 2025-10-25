// Global variables
let allPokemon = [];
let filteredPokemon = [];
let selectedTypes = ['all']; // Array to store selected types
let totalPokemon = 0;
let loadedPokemon = 0;
let evolutionCache = new Map(); // Cache for evolution chains
let useAnimated = false; // Default to static images

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadAllPokemon();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    
    // Type filters
    document.querySelectorAll('.type-filter').forEach(btn => {
        btn.addEventListener('click', handleTypeFilter);
    });
    
    // Animation toggle
    document.getElementById('animationToggle').addEventListener('click', toggleAnimation);
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Toggle animation mode
function toggleAnimation() {
    useAnimated = !useAnimated;
    const toggle = document.getElementById('animationToggle');
    const icon = toggle.querySelector('.toggle-icon');
    
    if (useAnimated) {
        toggle.classList.add('active');
        icon.classList.remove('fa-image');
        icon.classList.add('fa-film');
    } else {
        toggle.classList.remove('active');
        icon.classList.remove('fa-film');
        icon.classList.add('fa-image');
    }
    
    renderPokemon();
    
    // If modal is open, update modal content
    const modal = document.getElementById('pokemonModal');
    if (!modal.classList.contains('hidden')) {
        // Get current Pokemon ID from modal and re-render
        const pokemonId = parseInt(modal.querySelector('.text-gray-400').textContent.replace('#', ''));
        const pokemon = allPokemon.find(p => p.id === pokemonId);
        if (pokemon) {
            showPokemonDetails(pokemon.id);
        }
    }
}

// Load all Pokemon
async function loadAllPokemon() {
    showLoading(true);
    document.getElementById('loadingStatus').classList.remove('hidden');
    document.getElementById('progressContainer').classList.remove('hidden');
    
    try {
        // First, get total count of Pokemon
        const countResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
        const countData = await countResponse.json();
        totalPokemon = countData.count;
        
        // Load all Pokemon in batches
        const batchSize = 50;
        const batches = Math.ceil(totalPokemon / batchSize);
        
        for (let i = 0; i < batches; i++) {
            const offset = i * batchSize;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${batchSize}&offset=${offset}`);
            const data = await response.json();
            
            const pokemonDetails = await Promise.all(
                data.results.map(pokemon => fetchPokemonDetails(pokemon.url))
            );
            
            allPokemon = [...allPokemon, ...pokemonDetails];
            loadedPokemon += pokemonDetails.length;
            
            // Update progress
            updateProgress();
            updatePokemonCount();
            
            // Show grid after first batch
            if (i === 0) {
                document.getElementById('loadingSpinner').classList.add('hidden');
                document.getElementById('pokemonGrid').classList.remove('hidden');
                // Initial render
                applyFilters();
            }
        }
        
        // Final render after all data is loaded
        applyFilters();
        
    } catch (error) {
        console.error('Error loading Pokemon:', error);
    } finally {
        showLoading(false);
        document.getElementById('loadingStatus').classList.add('hidden');
        document.getElementById('progressContainer').classList.add('hidden');
    }
}

// Update progress bar
function updateProgress() {
    const progress = (loadedPokemon / totalPokemon) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// Fetch Pokemon details
async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    const data = await response.json();
    
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    
    // Get both animated and static sprites
    let animatedSprite = null;
    let staticSprite = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;
    
    // For Pokemon ID 650 and above, animated sprites might not be available in the same location
    // Check multiple locations for animated sprites
    if (data.id < 650) {
        animatedSprite = data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default;
    } else {
        // For newer Pokemon, check other possible locations
        animatedSprite = data.sprites.versions?.['generation-viii']?.['sword-shield']?.animated?.front_default ||
                       data.sprites.versions?.['generation-vii']?.['ultra-sun-ultra-moon']?.animated?.front_default ||
                       data.sprites.versions?.['generation-vi']?.['x-y']?.animated?.front_default;
    }
    
    // Get Turkish description first, fallback to English
    const turkishDescription = speciesData.flavor_text_entries?.find(entry => entry.language.name === 'tr')?.flavor_text || '';
    const englishDescription = speciesData.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text || '';
    
    return {
        id: data.id,
        name: data.name,
        staticImage: staticSprite,
        animatedImage: animatedSprite,
        types: data.types.map(type => type.type.name),
        height: data.height,
        weight: data.weight,
        stats: data.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat
        })),
        abilities: data.abilities.map(ability => ability.ability.name),
        description: turkishDescription || englishDescription,
        evolutionChain: speciesData.evolution_chain?.url
    };
}

// Get current image based on animation mode
function getCurrentImage(pokemon) {
    if (useAnimated && pokemon.animatedImage) {
        return pokemon.animatedImage;
    }
    return pokemon.staticImage;
}

// Apply all filters (search and type)
function applyFilters() {
    // Start with all Pokemon
    let result = [...allPokemon];
    
    // Apply search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        result = result.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm) ||
            pokemon.id.toString().includes(searchTerm)
        );
    }
    
    // Apply type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
        if (selectedTypes.length === 1) {
            result = result.filter(pokemon => pokemon.types.includes(selectedTypes[0]));
        } else {
            result = result.filter(pokemon => 
                selectedTypes.every(type => pokemon.types.includes(type))
            );
        }
    }
    
    filteredPokemon = result;
    renderPokemon();
}

// Render Pokemon cards
function renderPokemon() {
    const grid = document.getElementById('pokemonGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredPokemon.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    
    grid.innerHTML = filteredPokemon.map((pokemon, index) => {
        const currentImage = getCurrentImage(pokemon);
        const isAnimated = useAnimated && pokemon.animatedImage;
        
        return `
            <div class="pokemon-card rounded-xl p-4 cursor-pointer slide-in" 
                 style="animation-delay: ${index * 0.05}s"
                 onclick="showPokemonDetails(${pokemon.id})">
                <div class="relative">
                    <img src="${currentImage}" 
                         alt="${pokemon.name}" 
                         class="pokemon-image w-full h-40 object-contain mb-3 ${isAnimated ? 'floating' : ''}">
                    <span class="pokemon-number">#${String(pokemon.id).padStart(3, '0')}</span>
                </div>
                <h3 class="text-lg font-bold capitalize mb-2">${pokemon.name}</h3>
                <div class="flex flex-wrap gap-1">
                    ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Show Pokemon details in modal
async function showPokemonDetails(id) {
    const pokemon = allPokemon.find(p => p.id === id);
    if (!pokemon) return;
    
    const modal = document.getElementById('pokemonModal');
    const modalContent = document.getElementById('modalContent');
    
    const currentImage = getCurrentImage(pokemon);
    const isAnimated = useAnimated && pokemon.animatedImage;
    
    modalContent.innerHTML = `
        <div class="relative">
            <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
                <i class="fas fa-times text-2xl"></i>
            </button>
            
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                <div class="text-center mb-6">
                    <img src="${currentImage}" 
                         alt="${pokemon.name}" 
                         class="w-48 h-48 object-contain mx-auto mb-4 ${isAnimated ? 'floating glow' : ''}">
                    <h2 class="text-3xl font-bold capitalize mb-2">${pokemon.name}</h2>
                    <p class="text-gray-400">#${String(pokemon.id).padStart(3, '0')}</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-xl font-semibold mb-3">Türler</h3>
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
                        </div>
                        
                        <h3 class="text-xl font-semibold mb-3">Özellikler</h3>
                        <div class="space-y-2 text-gray-300">
                            <p><span class="font-semibold">Boy:</span> ${(pokemon.height / 10).toFixed(1)} m</p>
                            <p><span class="font-semibold">Ağırlık:</span> ${(pokemon.weight / 10).toFixed(1)} kg</p>
                        </div>
                        
                        <h3 class="text-xl font-semibold mb-3 mt-6">Yetenekler</h3>
                        <div class="flex flex-wrap gap-2">
                            ${pokemon.abilities.map(ability => `
                                <span class="px-3 py-1 bg-gray-700 rounded-full text-sm capitalize">${ability}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold mb-3">İstatistikler</h3>
                        <div class="space-y-3">
                            ${pokemon.stats.map(stat => `
                                <div>
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="capitalize">${stat.name.replace('-', ' ')}</span>
                                        <span>${stat.value}</span>
                                    </div>
                                    <div class="stat-bar">
                                        <div class="stat-fill" style="width: ${(stat.value / 255) * 100}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                ${pokemon.description ? `
                    <div class="mt-6 pt-6 border-t border-gray-700">
                        <h3 class="text-xl font-semibold mb-3">Açıklama</h3>
                        <p class="text-gray-300 italic">${pokemon.description.replace(/\f/g, ' ')}</p>
                    </div>
                ` : ''}
                
                ${pokemon.evolutionChain ? `
                    <div class="mt-6 pt-6 border-t border-gray-700">
                        <h3 class="text-xl font-semibold mb-4">Evrim Çizelgesi</h3>
                        <div id="evolutionChainContainer">
                            <div class="evolution-loading">
                                <div class="loading-spinner"></div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Load evolution chain if available
    if (pokemon.evolutionChain) {
        loadEvolutionChain(pokemon.evolutionChain);
    }
}

// Load evolution chain
async function loadEvolutionChain(evolutionChainUrl) {
    try {
        // Check cache first
        if (evolutionCache.has(evolutionChainUrl)) {
            renderEvolutionChain(evolutionCache.get(evolutionChainUrl));
            return;
        }
        
        const response = await fetch(evolutionChainUrl);
        const data = await response.json();
        
        // Cache the evolution chain
        evolutionCache.set(evolutionChainUrl, data);
        
        renderEvolutionChain(data);
    } catch (error) {
        console.error('Error loading evolution chain:', error);
        document.getElementById('evolutionChainContainer').innerHTML = `
            <div class="text-center text-gray-400 py-4">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p>Evrim çizelgesi yüklenemedi</p>
            </div>
        `;
    }
}

// Render evolution chain
function renderEvolutionChain(evolutionData) {
    const container = document.getElementById('evolutionChainContainer');
    const stages = parseEvolutionChain(evolutionData.chain);
    
    if (stages.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-4">
                <p>Bu Pokemon'un evrimi bulunmamaktadır</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="flex flex-col items-center space-y-8">';
    
    stages.forEach((stage, stageIndex) => {
        html += `<div class="evolution-stage flex justify-center gap-4 flex-wrap">`;
        
        stage.forEach(pokemon => {
            const pokemonData = allPokemon.find(p => p.name === pokemon.name);
            const evolutionMethod = pokemon.evolution_method || '';
            
            if (pokemonData) {
                const currentImage = getCurrentImage(pokemonData);
                const isAnimated = useAnimated && pokemonData.animatedImage;
                
                html += `
                    <div class="evolution-card" onclick="showPokemonDetails(${pokemonData.id})">
                        <img src="${currentImage}" 
                             alt="${pokemonData.name}" 
                             class="w-24 h-24 object-contain mx-auto mb-2 ${isAnimated ? 'floating' : ''}">
                        <p class="text-sm font-semibold capitalize">${pokemonData.name}</p>
                        <div class="flex flex-wrap justify-center gap-1 mt-1">
                            ${pokemonData.types.map(type => `<span class="type-badge type-${type}" style="font-size: 10px; padding: 2px 6px;">${type}</span>`).join('')}
                        </div>
                        ${evolutionMethod ? `<p class="evolution-method">${evolutionMethod}</p>` : ''}
                    </div>
                `;
            } else {
                html += `
                    <div class="evolution-card">
                        <div class="w-24 h-24 bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span class="text-xs">?</span>
                        </div>
                        <p class="text-sm font-semibold capitalize">${pokemon.name}</p>
                        ${evolutionMethod ? `<p class="evolution-method">${evolutionMethod}</p>` : ''}
                    </div>
                `;
            }
        });
        
        html += '</div>';
        
        // Add arrow if not the last stage
        if (stageIndex < stages.length - 1) {
            html += '<i class="fas fa-arrow-down evolution-arrow"></i>';
        }
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Parse evolution chain
function parseEvolutionChain(chain) {
    const stages = [];
    
    function traverse(node, depth) {
        if (!stages[depth]) {
            stages[depth] = [];
        }
        
        // Add current Pokemon with evolution method
        const evolutionMethod = getEvolutionMethod(node);
        stages[depth].push({
            name: node.species.name,
            evolution_method: evolutionMethod
        });
        
        // Traverse evolutions
        if (node.evolves_to && node.evolves_to.length > 0) {
            node.evolves_to.forEach(evolution => {
                traverse(evolution, depth + 1);
            });
        }
    }
    
    traverse(chain, 0);
    return stages;
}

// Get evolution method
function getEvolutionMethod(node) {
    if (!node.evolution_details || node.evolution_details.length === 0) {
        return '';
    }
    
    const details = node.evolution_details[0];
    let method = '';
    
    if (details.min_level) {
        method = `Seviye ${details.min_level}`;
    } else if (details.item) {
        method = `${details.item.name} kullan`;
    } else if (details.trigger.name === 'trade') {
        method = 'Takas et';
    } else if (details.happiness) {
        method = 'Mutluluk';
    } else if (details.time_of_day) {
        method = details.time_of_day === 'day' ? 'Gündüz' : 'Gece';
    } else if (details.known_move) {
        method = `${details.known_move.name} öğren`;
    } else if (details.known_move_type) {
        method = `${details.known_move_type.name} türü hareket öğren`;
    } else if (details.min_happiness) {
        method = `Mutluluk ${details.min_happiness}`;
    } else if (details.min_beauty) {
        method = `Güzellik ${details.min_beauty}`;
    } else if (details.min_affection) {
        method = `Sevgi ${details.min_affection}`;
    } else if (details.relative_physical_stats) {
        if (details.relative_physical_stats > 0) {
            method = 'Saldırı > Savunma';
        } else if (details.relative_physical_stats < 0) {
            method = 'Savunma > Saldırı';
        } else {
            method = 'Saldırı = Savunma';
        }
    } else if (details.party_species) {
        method = `Ekip ${details.party_species.name}`;
    } else if (details.party_type) {
        method = `Ekip ${details.party_type.name} türü`;
    } else if (details.trade_species) {
        method = `${details.trade_species.name} ile takas`;
    } else if (details.needs_overworld_rain) {
        method = 'Yağmurlu hava';
    } else if (details.turn_upside_down) {
        method = 'Ters çevir';
    }
    
    return method;
}

// Close modal
function closeModal() {
    document.getElementById('pokemonModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Handle type filter
function handleTypeFilter(e) {
    const type = e.target.dataset.type;
    
    if (type === 'all') {
        // If "Tümü" is clicked, clear all selections
        selectedTypes = ['all'];
        updateFilterButtons();
        updateSelectedTypesInfo();
        applyFilters();
        return;
    }
    
    // Remove 'all' from selection if any other type is selected
    if (selectedTypes.includes('all')) {
        selectedTypes = selectedTypes.filter(t => t !== 'all');
    }
    
    // Toggle type selection
    const typeIndex = selectedTypes.indexOf(type);
    if (typeIndex > -1) {
        // Remove type if already selected
        selectedTypes.splice(typeIndex, 1);
    } else {
        // Add type if not selected and limit not reached
        if (selectedTypes.length < 2) {
            selectedTypes.push(type);
        } else {
            // Show notification that max 2 types can be selected
            showNotification('En fazla 2 tür seçebilirsiniz!');
            return;
        }
    }
    
    // If no types selected, default to 'all'
    if (selectedTypes.length === 0) {
        selectedTypes = ['all'];
    }
    
    updateFilterButtons();
    updateSelectedTypesInfo();
    applyFilters();
}

// Update filter buttons visual state
function updateFilterButtons() {
    document.querySelectorAll('.type-filter').forEach(btn => {
        const type = btn.dataset.type;
        if (selectedTypes.includes(type)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// Update selected types info display
function updateSelectedTypesInfo() {
    const infoDiv = document.getElementById('selectedTypesInfo');
    const textSpan = document.getElementById('selectedTypesText');
    const dualTypeIndicator = document.getElementById('dualTypeIndicator');
    
    if (selectedTypes.includes('all') || selectedTypes.length === 0) {
        infoDiv.classList.add('hidden');
        dualTypeIndicator.classList.add('hidden');
    } else {
        infoDiv.classList.remove('hidden');
        const typeNames = selectedTypes.map(type => {
            const typeNamesMap = {
                'normal': 'Normal', 'fire': 'Ateş', 'water': 'Su', 'electric': 'Elektrik',
                'grass': 'Çimen', 'ice': 'Buz', 'fighting': 'Dövüş', 'poison': 'Zehir',
                'ground': 'Yer', 'flying': 'Uçan', 'psychic': 'Psikik', 'bug': 'Böcek',
                'rock': 'Kaya', 'ghost': 'Hayalet', 'dragon': 'Ejderha', 'dark': 'Karanlık',
                'steel': 'Çelik', 'fairy': 'Peri'
            };
            return typeNamesMap[type] || type;
        });
        textSpan.textContent = typeNames.join(' + ');
        
        // Show dual type indicator if 2 types selected
        if (selectedTypes.length === 2) {
            dualTypeIndicator.classList.remove('hidden');
        } else {
            dualTypeIndicator.classList.add('hidden');
        }
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Update Pokemon count
function updatePokemonCount() {
    document.getElementById('pokemonCount').textContent = `${loadedPokemon} Pokemon`;
}

// Show/hide loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}