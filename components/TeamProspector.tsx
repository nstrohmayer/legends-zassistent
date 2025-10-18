import React, { useState, useEffect, useCallback } from 'react';
import { PokemonDetailData, PokemonBaseStat, TeamProspectorProps } from '../types';
import { fetchAllPokemonNames, fetchPokemonDetails } from '../services/pokeApiService';
import { MEGA_EVOLUTIONS_KALOS } from '../constants';

const calculateStrengthPotential = (stats: PokemonBaseStat[]): number => {
    const total = stats.reduce((acc, stat) => acc + stat.value, 0);
    if (total > 580) return 5;
    if (total > 500) return 4;
    if (total > 410) return 3;
    if (total > 320) return 2;
    return 1;
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex justify-center my-1" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-slate-600'}`} role="presentation">★</span>
        ))}
    </div>
);

const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
    const typeColors: Record<string, string> = {
        Normal: 'bg-gray-400 text-black', Fighting: 'bg-red-700 text-white', Flying: 'bg-sky-300 text-black',
        Poison: 'bg-purple-600 text-white', Ground: 'bg-yellow-600 text-black', Rock: 'bg-yellow-700 text-white',
        Bug: 'bg-lime-500 text-white', Ghost: 'bg-indigo-700 text-white', Steel: 'bg-slate-400 text-white', Fire: 'bg-orange-500 text-white',
        Water: 'bg-blue-500 text-white', Grass: 'bg-green-500 text-white', Electric: 'bg-yellow-400 text-black',
        Psychic: 'bg-pink-500 text-white', Ice: 'bg-cyan-300 text-black', Dragon: 'bg-indigo-500 text-white',
        Dark: 'bg-neutral-700 text-white', Fairy: 'bg-pink-300 text-black',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[type] || 'bg-gray-500 text-white'}`}>{type}</span>;
}

export const TeamProspector: React.FC<TeamProspectorProps> = ({ 
    onAbilityClick, 
    likedPokemonMap, 
    onToggleLiked,
    onPokemonClick,
    onAddToTeam
}) => {
    // Local State
    const [prospect, setProspect] = useState<PokemonDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Reworked state for sprite toggling
    const [megaFormIndex, setMegaFormIndex] = useState(-1); // -1 for normal, 0+ for mega forms
    const [showShiny, setShowShiny] = useState(false);
    
    // State for Search Input
    const [lookupQuery, setLookupQuery] = useState('');
    const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

    // New state for the mega filter
    const [isMegaFilterActive, setIsMegaFilterActive] = useState(false);
    const [megaListIndex, setMegaListIndex] = useState(0);

    useEffect(() => {
        const loadAllNames = async () => {
            try {
                const names = await fetchAllPokemonNames();
                setAllPokemonNames(names);
            } catch (err) {
                console.error("Failed to fetch pokemon names list", err);
            }
        };
        loadAllNames();
    }, []);

    // Effect for handling Escape key to close suggestions
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSuggestionsVisible(false);
            }
        };
        if (isSuggestionsVisible) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSuggestionsVisible]);

    // --- Handlers ---
    const handleSearch = useCallback(async (pokemonNameOrId: string | number) => {
        if (!pokemonNameOrId) return;
        
        setIsLoading(true);
        setError(null);
        setProspect(null);
        if (typeof pokemonNameOrId === 'string') {
            setLookupQuery(pokemonNameOrId);
        }
        setSuggestions([]);
        setIsSuggestionsVisible(false);

        try {
            const details = await fetchPokemonDetails(pokemonNameOrId);
            setProspect(details);
            setMegaFormIndex(-1); // Reset to normal form
            setShowShiny(false);
        } catch (err) {
            const nameForError = typeof pokemonNameOrId === 'string' ? pokemonNameOrId : `ID #${pokemonNameOrId}`;
            setError(err instanceof Error ? err.message : `Could not find details for "${nameForError}".`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLookupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setLookupQuery(query);
        if (query.length > 1) {
            setSuggestions(allPokemonNames.filter(name => name.toLowerCase().includes(query.toLowerCase())).slice(0, 5));
            setIsSuggestionsVisible(true);
        } else {
            setSuggestions([]);
            setIsSuggestionsVisible(false);
        }
    };

    const handleLookupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!lookupQuery.trim() || isLoading) return;
        handleSearch(lookupQuery.trim());
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setLookupQuery(suggestion);
        handleSearch(suggestion);
    };

    const handleMegaFilterClick = useCallback(() => {
        const willBeActive = !isMegaFilterActive;
        setIsMegaFilterActive(willBeActive);

        if (willBeActive) {
            setMegaListIndex(0);
            setLookupQuery('');
            setError(null);
            handleSearch(MEGA_EVOLUTIONS_KALOS[0].id);
        } else {
            setProspect(null);
            setError(null);
        }
    }, [isMegaFilterActive, handleSearch]);

    const handleMegaNavigate = useCallback((direction: 'next' | 'prev') => {
        if (!isMegaFilterActive) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (megaListIndex + 1) % MEGA_EVOLUTIONS_KALOS.length;
        } else {
            newIndex = (megaListIndex - 1 + MEGA_EVOLUTIONS_KALOS.length) % MEGA_EVOLUTIONS_KALOS.length;
        }
        
        setMegaListIndex(newIndex);
        handleSearch(MEGA_EVOLUTIONS_KALOS[newIndex].id);
    }, [isMegaFilterActive, megaListIndex, handleSearch]);

    const handleLike = () => {
        if (prospect && !isLoading) {
            onToggleLiked(prospect.id);
        }
    };
    
    const handleAddToTeam = () => {
        if (prospect && !isLoading) {
            onAddToTeam({
                species: prospect.name,
                pokemonId: prospect.id,
                level: 1, // Default level, can be changed later
                types: prospect.types,
            });
        }
    };

    const renderCardContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-400"></div>
                    <p className="mt-4 text-slate-300">Summoning Pokémon Data...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="text-red-400 font-semibold">{error}</p>
                    <button onClick={() => handleSearch(lookupQuery || (isMegaFilterActive ? MEGA_EVOLUTIONS_KALOS[megaListIndex].id : ''))} className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md">
                        Retry
                    </button>
                </div>
            );
        }

        if (prospect) {
            const strength = calculateStrengthPotential(prospect.baseStats);
            const isLiked = !!likedPokemonMap[prospect.id];

            const megaDataList = MEGA_EVOLUTIONS_KALOS.filter(p => p.id === prospect.id);
            
            let currentSprite = prospect.spriteUrl;
            if (megaFormIndex !== -1 && megaDataList.length > 0) {
                currentSprite = megaDataList[megaFormIndex].spriteUrl;
            } else if (showShiny) {
                currentSprite = prospect.shinySpriteUrl;
            }

            const handleMegaToggle = () => {
                const nextIndex = megaFormIndex + 1;
                if (nextIndex >= megaDataList.length) {
                    setMegaFormIndex(-1); // Cycle back to normal form
                } else {
                    setMegaFormIndex(nextIndex);
                    setShowShiny(false); // Ensure shiny is off when viewing mega
                }
            };

            const handleShinyToggle = () => {
                setShowShiny(prev => !prev);
                setMegaFormIndex(-1); // Ensure mega is off when viewing shiny
            };

            return (
                 <div className="flex flex-col items-center justify-between h-full p-4 relative group animate-fadeIn">
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleLike} className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-rose-500/80 text-white' : 'bg-slate-600/80 text-rose-300 hover:bg-slate-500/80'}`} aria-label={isLiked ? "Unlike Pokémon" : "Like Pokémon"}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={handleAddToTeam} className="p-2 rounded-full bg-slate-600/80 text-emerald-300 hover:bg-slate-500/80 transition-colors" aria-label="Add to Team">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative">
                             <img 
                                src={currentSprite || '/favicon.png'} 
                                alt={prospect.name} 
                                className="w-32 h-32 pixelated-sprite cursor-pointer" 
                                onClick={() => onPokemonClick(prospect.id)}
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    if (target.src !== (prospect.spriteUrl || '/favicon.png')) {
                                        target.src = prospect.spriteUrl || '/favicon.png';
                                    }
                                }}
                            />
                            <div className="absolute -top-1 -right-2 flex flex-col gap-1.5">
                                {megaDataList.length > 0 && (
                                    <button
                                        onClick={handleMegaToggle}
                                        className="p-1 rounded-full text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800"
                                        title={
                                            megaFormIndex === -1 ? `Show ${megaDataList[0].formName}`
                                            : megaFormIndex < megaDataList.length - 1 ? `Show ${megaDataList[megaFormIndex + 1].formName}`
                                            : "Show normal form"
                                        }
                                    >
                                        <span className={`px-1 text-[0.6rem] font-bold rounded-full transition-colors ${megaFormIndex !== -1 ? 'bg-purple-500 text-white' : 'bg-slate-600 text-purple-300'}`}>
                                            MEGA
                                        </span>
                                    </button>
                                )}
                                <button
                                    onClick={handleShinyToggle}
                                    className="p-1 rounded-full text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800"
                                    title={showShiny ? "Show normal variant" : "Show shiny variant"}
                                >
                                    <span className={`${showShiny ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}>
                                        🌟
                                    </span>
                                </button>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mt-2 text-sky-300 cursor-pointer" onClick={() => onPokemonClick(prospect.id)}>{prospect.name}</h3>
                        <p className="text-sm text-slate-400 italic mb-2">{prospect.genus}</p>
                        <div className="flex gap-2">{prospect.types.map(t => <TypeBadge key={t} type={t} />)}</div>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-200">Strength Potential</p>
                        <StarRating rating={strength} />
                    </div>

                    <div className="text-center w-full">
                        <h4 className="text-sm font-semibold text-slate-200">Abilities</h4>
                        <ul className="text-xs text-slate-300 space-y-0.5 mt-1">
                            {prospect.abilities.map(ability => (
                                <li key={ability.rawName}>
                                    <button onClick={() => onAbilityClick(ability.rawName)} className="hover:text-sky-400 hover:underline transition-colors">
                                        {ability.displayName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-slate-400">{isMegaFilterActive ? "Loading Mega Evolutions..." : "Search for a Pokémon to see its details."}</p>
            </div>
        );
    };

    return (
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <form onSubmit={handleLookupSubmit} className="relative w-full sm:w-2/3">
                    <input
                        type="text"
                        value={lookupQuery}
                        onChange={handleLookupChange}
                        onFocus={() => setIsSuggestionsVisible(true)}
                        onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 200)}
                        placeholder="Search for any Pokémon..."
                        className="bg-slate-700 text-lg rounded-full w-full py-2 pl-5 pr-5 border border-slate-600 focus:ring-2 focus:ring-sky-500 outline-none text-center disabled:bg-slate-800 disabled:cursor-not-allowed"
                        aria-label="Search for a Pokémon"
                        disabled={isMegaFilterActive}
                    />
                    {isSuggestionsVisible && suggestions.length > 0 && (
                        <ul className="absolute top-full mt-1 w-full bg-slate-600 border border-slate-500 rounded-md shadow-lg z-10 overflow-hidden">
                        {suggestions.map(s => (
                            <li key={s} onMouseDown={() => handleSuggestionClick(s)} className="px-4 py-2 text-sm text-slate-200 hover:bg-sky-600 cursor-pointer">
                                {s}
                            </li>
                        ))}
                        </ul>
                    )}
                </form>
                <button
                    onClick={handleMegaFilterClick}
                    className={`px-4 py-2.5 rounded-full font-semibold transition-colors w-full sm:w-auto ${isMegaFilterActive ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-600 text-slate-200 hover:bg-slate-500'}`}
                >
                    Has Mega Evolution
                </button>
            </div>
            
            <div className="w-full h-[420px] bg-slate-700/50 rounded-lg shadow-inner overflow-hidden border border-slate-600/50 relative">
                {isMegaFilterActive && !isLoading && prospect && (
                    <>
                        <button onClick={() => handleMegaNavigate('prev')} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-slate-800/50 hover:bg-slate-700/80 rounded-full text-white text-2xl leading-none" aria-label="Previous Pokémon">‹</button>
                        <button onClick={() => handleMegaNavigate('next')} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-slate-800/50 hover:bg-slate-700/80 rounded-full text-white text-2xl leading-none" aria-label="Next Pokémon">›</button>
                    </>
                )}
                {renderCardContent()}
            </div>
        </div>
    );
};