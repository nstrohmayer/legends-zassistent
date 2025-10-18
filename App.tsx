
import React, { useState, useEffect, useCallback } from 'react';
import { AddTeamMemberData, TeamMember, JournalEntry } from './types';
import { KALOS_WILD_ZONES } from './constants';
import { TeamManager } from './components/TeamManager';
import { DetailDisplayController } from './components/DetailDisplayController';
import { NavigatorDisplay } from './components/NavigatorDisplay';
import { TeamProspector } from './components/TeamProspector';
import { LikedPokemonDisplay } from './components/LikedPokemonDisplay';
import { HuntingListDisplay } from './components/HuntingListDisplay';
import { PokemonDetailLookup } from './components/PokemonDetailLookup';
import { WildZoneExplorer } from './components/WildZoneExplorer';
import { JournalSidebar } from './components/JournalSidebar';
import { JournalEntryDisplay } from './components/JournalEntryDisplay';


import { useTeamManager } from './hooks/useTeamManager';
import { useNavigator } from './hooks/useNavigator';
import { useDetailBar } from './hooks/useDetailBar';
import { usePokemonCollections } from './hooks/usePokemonCollections';
import { useJournal } from './hooks/useJournal';


// Placeholder icons - can be moved if they grow
const IconPokeball = () => <span className="text-red-500">◉</span>;

type ActiveView = 'team' | 'pokedex' | 'navigator' | 'zones' | 'journal';

const App: React.FC = () => {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState<boolean>(true); 
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>('team');
  
  // New state for selected journal entry
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)'); // Tailwind's 'md' breakpoint
    
    const handleMediaQueryChange = () => {
      const isNowMobile = !mediaQuery.matches;
      setIsMobileView(isNowMobile); 
      if (!isNowMobile) { // If now desktop
        setIsLeftSidebarCollapsed(false); // Default to expanded on desktop
      } else { // If now mobile
        setIsLeftSidebarCollapsed(true);
      }
    };

    handleMediaQueryChange(); 
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);


  const {
    team,
    setTeam, 
    caughtPokemon,
    handleToggleCaughtStatus,
    addTeamMember,
    removeTeamMember,
    handleUpdateTeamMemberNickname,
    handleUpdateTeamMemberLevel,
    handleUpdateTeamMemberItem,
    handleUpdateTeamMemberMove,
    handleToggleTeamMemberShiny,
  } = useTeamManager();

  const {
    likedPokemonMap,
    huntingList,
    toggleLikedPokemon,
    addToHuntingList,
    removeFromHuntingList
  } = usePokemonCollections();
  
  const {
    entries: journalEntries,
    addEntry: addJournalEntry,
    updateEntry: updateJournalEntry,
    deleteEntry: deleteJournalEntry,
  } = useJournal();
  

  const handleHuntSuccess = useCallback(() => {
    setActiveView('team');
    if (isMobileView) {
      setIsLeftSidebarCollapsed(true);
    }
  }, [isMobileView]);

  const {
    navigatorUserPrompt,
    navigatorGeminiResponse,
    isLoadingNavigatorQuery,
    navigatorError,
    handleNavigatorSubmit,
    handleNavigatorReset,
  } = useNavigator({ onHuntSuccess: handleHuntSuccess });

  const {
    activeBottomBarView,
    selectedPokemonDetailData,
    selectedAbilityDetailData,
    selectedMoveDetailData,
    pokemonContextForDetailView,
    isLoadingDetail,
    detailError,
    selectedMoveForAssignment,
    setSelectedMoveForAssignment, 
    handleOpenPokemonDetail,
    handleAbilityNameClick,
    handleMoveNameClick,
    handleBackToPokemonDetail,
    handleCloseBottomBar,
    handleStageMove,
  } = useDetailBar();

  // Global keydown listener for 'Escape' key
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeBottomBarView) {
          handleCloseBottomBar();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [activeBottomBarView, handleCloseBottomBar]);

  const handlePokemonClickAndCollapse = useCallback((pokemonId: number) => {
    handleOpenPokemonDetail(pokemonId);
    if (isMobileView) {
      setIsLeftSidebarCollapsed(true);
    }
  }, [handleOpenPokemonDetail, isMobileView]);
  
  const handleSelectJournalEntry = useCallback((id: string) => {
    setSelectedEntryId(id);
    setActiveView('journal');
     if (isMobileView) {
      setIsLeftSidebarCollapsed(true);
    }
  }, [isMobileView]);

  const handleAddJournalEntry = useCallback(() => {
    const newId = addJournalEntry();
    handleSelectJournalEntry(newId);
  }, [addJournalEntry, handleSelectJournalEntry]);

  const handleDeleteJournalEntry = useCallback((id: string) => {
    deleteJournalEntry(id);
    if (selectedEntryId === id) {
        setSelectedEntryId(null);
        setActiveView('team'); // Go back to a default view
    }
  }, [deleteJournalEntry, selectedEntryId]);
  
  const handleViewChange = (view: ActiveView) => {
      setActiveView(view);
      if (view !== 'journal') {
        setSelectedEntryId(null);
      }
      if (isMobileView) {
          setIsLeftSidebarCollapsed(true);
      }
  };

  useEffect(() => {
    if (selectedMoveForAssignment) {
      const targetPokemonId = selectedMoveForAssignment.pokemonId;
      const moveNameToAssign = selectedMoveForAssignment.moveName;
      const teamMemberIndex = team.findIndex(member => member.pokemonId === targetPokemonId);
      if (teamMemberIndex !== -1) {
        setTeam(prevTeam => {
          const updatedTeam = [...prevTeam];
          const memberToUpdate = { ...updatedTeam[teamMemberIndex] };
          let currentMoves = [...(memberToUpdate.moves || ['', '', '', ''])];
          if (currentMoves.includes(moveNameToAssign)) {
            setSelectedMoveForAssignment(null);
            return prevTeam;
          }
          let assigned = false;
          for (let i = 0; i < 4; i++) {
            if (!currentMoves[i] || currentMoves[i] === "") {
              currentMoves[i] = moveNameToAssign;
              assigned = true;
              break;
            }
          }
          if (!assigned) { currentMoves[0] = moveNameToAssign; } 
          memberToUpdate.moves = currentMoves;
          updatedTeam[teamMemberIndex] = memberToUpdate;
          return updatedTeam;
        });
        setSelectedMoveForAssignment(null); 
      }
    }
  }, [selectedMoveForAssignment, team, setTeam, setSelectedMoveForAssignment]);

  const handleAddPokemonToTeamFromDetailCallback = useCallback((speciesName: string, pokemonId: number, types: string[]) => {
    let initialMoveName: string | undefined = undefined;
    if (selectedMoveForAssignment && selectedMoveForAssignment.pokemonId === pokemonId) {
        initialMoveName = selectedMoveForAssignment.moveName;
    }
    
    const success = addTeamMember({ species: speciesName, level: 5, pokemonId: pokemonId, initialMove: initialMoveName, types: types });

    if (success) {
        if (!caughtPokemon[pokemonId.toString()]) { handleToggleCaughtStatus(pokemonId); }
        if (initialMoveName) { setSelectedMoveForAssignment(null); } 
    }
  }, [addTeamMember, caughtPokemon, handleToggleCaughtStatus, selectedMoveForAssignment, setSelectedMoveForAssignment]);


  const stagedMoveNameForCurrentPokemon =
    selectedPokemonDetailData && activeBottomBarView === 'pokemon' && selectedMoveForAssignment && selectedMoveForAssignment.pokemonId === selectedPokemonDetailData.id
    ? selectedMoveForAssignment.moveName
    : null;

  const selectedJournalEntry = journalEntries.find(e => e.id === selectedEntryId) || null;

  const renderMainPanel = () => {
    switch (activeView) {
        case 'journal':
            return <JournalEntryDisplay entry={selectedJournalEntry} onUpdate={updateJournalEntry} onOpenPokemonDetail={handleOpenPokemonDetail} />;
        case 'zones':
            return (
                 <div className="flex items-center justify-center h-full text-center animate-fadeIn">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-400">Wild Zones</h1>
                        <p className="text-slate-500 mt-2">Select a Pokémon from a zone in the sidebar to view its details.</p>
                    </div>
                </div>
            );
        case 'team':
             return (
                 <div className="animate-fadeIn space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-sky-300 mb-4">My Party</h2>
                        <TeamManager
                            team={team}
                            setTeam={setTeam as (team: TeamMember[]) => void}
                            onRemoveTeamMember={removeTeamMember}
                            IconPokeball={IconPokeball}
                            onUpdateTeamMemberNickname={handleUpdateTeamMemberNickname}
                            onUpdateTeamMemberLevel={handleUpdateTeamMemberLevel}
                            onUpdateTeamMemberItem={handleUpdateTeamMemberItem}
                            onUpdateTeamMemberMove={handleUpdateTeamMemberMove}
                            onToggleTeamMemberShiny={handleToggleTeamMemberShiny}
                        />
                    </section>
                    
                    <div className="border-t-2 border-slate-700/50"></div>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-sky-300 mb-4">Liked Pokémon</h2>
                         <LikedPokemonDisplay 
                            likedPokemonIds={Object.keys(likedPokemonMap).filter(id => likedPokemonMap[id]).map(Number)}
                            onPokemonClick={handleOpenPokemonDetail}
                         />
                    </section>

                    <div className="border-t-2 border-slate-700/50"></div>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-sky-300 mb-4">Hunting List</h2>
                        <HuntingListDisplay
                            huntingList={huntingList}
                            onPokemonClick={handleOpenPokemonDetail}
                            onRemoveFromHunt={removeFromHuntingList}
                        />
                    </section>

                    <div className="border-t-2 border-slate-700/50"></div>

                    <section>
                        <h2 className="text-2xl font-bold text-sky-300 mb-4">Prospector</h2>
                        <TeamProspector 
                            team={team}
                            onAbilityClick={handleAbilityNameClick}
                            likedPokemonMap={likedPokemonMap}
                            onToggleLiked={toggleLikedPokemon}
                            onPokemonClick={handleOpenPokemonDetail}
                            onAddToTeam={addTeamMember}
                        />
                    </section>
                </div>
            );
        case 'pokedex':
            return (
                 <div className="animate-fadeIn">
                    <PokemonDetailLookup 
                        onAbilityClick={handleAbilityNameClick}
                        onMoveClick={handleMoveNameClick}
                    />
                </div>
            );
        case 'navigator':
            return (
                <div className="animate-fadeIn">
                     <NavigatorDisplay
                        initialPromptValue={navigatorUserPrompt}
                        onPromptSubmit={handleNavigatorSubmit}
                        isLoading={isLoadingNavigatorQuery}
                        apiResponse={navigatorGeminiResponse}
                        apiError={navigatorError}
                        onReset={handleNavigatorReset}
                        onPokemonNameClick={handleOpenPokemonDetail}
                    />
                </div>
            );
        default:
            return <JournalEntryDisplay entry={null} onUpdate={updateJournalEntry} onOpenPokemonDetail={handleOpenPokemonDetail} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0A101F] text-slate-100 overflow-hidden">
       <aside className={`bg-slate-900/80 backdrop-blur-sm flex flex-col transition-all duration-300 ease-in-out ${isLeftSidebarCollapsed ? 'w-0 md:w-16' : 'w-64'} z-30 shadow-2xl border-r border-slate-700/50`}>
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h1 className={`font-extrabold text-lg text-slate-100 uppercase tracking-[0.2em] transition-opacity flex items-center gap-2 ${isLeftSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-sky-300 text-2xl">☰</span>
                    <span>Menu</span>
                </h1>
                <button onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)} className="p-1 rounded-md hover:bg-slate-700 text-2xl text-slate-300">
                     {isLeftSidebarCollapsed ? '›' : '‹'}
                </button>
            </div>
            <div className={`pt-4 flex-grow overflow-y-auto flex flex-col ${isLeftSidebarCollapsed ? 'hidden' : 'block'}`}>
                <div className="px-4 space-y-2 mb-4">
                    <button
                        onClick={() => handleViewChange('team')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                            activeView === 'team' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-lg' : 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
                        }`}
                    >
                        Team
                    </button>
                    <button
                        onClick={() => handleViewChange('pokedex')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                            activeView === 'pokedex' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-lg' : 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
                        }`}
                    >
                        Pokédex
                    </button>
                    <button
                        onClick={() => handleViewChange('journal')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                            activeView === 'journal' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-lg' : 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
                        }`}
                    >
                        Journal
                    </button>
                    <button
                        onClick={() => handleViewChange('navigator')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                            activeView === 'navigator' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-lg' : 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
                        }`}
                    >
                        Navigator
                    </button>
                    <button
                        onClick={() => handleViewChange('zones')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                            activeView === 'zones' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-lg' : 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
                        }`}
                    >
                        Wild Zones
                    </button>
                </div>

                <div className="border-t border-slate-700 mx-4 mb-2"></div>

                <div className="flex-grow overflow-y-auto">
                    {activeView === 'journal' && (
                        <JournalSidebar
                            entries={journalEntries}
                            selectedEntryId={selectedEntryId}
                            onSelectEntry={handleSelectJournalEntry}
                            onAddEntry={handleAddJournalEntry}
                            onDeleteEntry={handleDeleteJournalEntry}
                        />
                    )}
                    {activeView === 'zones' && (
                      <WildZoneExplorer
                        zones={KALOS_WILD_ZONES}
                        onPokemonClick={handlePokemonClickAndCollapse}
                      />
                    )}
                </div>
            </div>
       </aside>
      
      <main 
        className="flex-1 flex flex-col bg-cover bg-center"
        style={{ backgroundImage: "url('https://storage.googleapis.com/aistudio-assets/pokemon-za-bg.jpg')" }}
      >
        <div className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-sm">
            {renderMainPanel()}
        </div>
      </main>

      {activeBottomBarView && (
        <DetailDisplayController
          activeView={activeBottomBarView}
          pokemonData={selectedPokemonDetailData}
          abilityData={selectedAbilityDetailData}
          moveData={selectedMoveDetailData}
          isLoading={isLoadingDetail}
          error={detailError}
          onClose={handleCloseBottomBar}
          onBackToPokemon={handleBackToPokemonDetail}
          pokemonContextForDetailViewName={pokemonContextForDetailView?.name}

          isCaught={selectedPokemonDetailData ? !!caughtPokemon[selectedPokemonDetailData.id.toString()] : false}
          onToggleCaught={handleToggleCaughtStatus}
          onAddToTeam={handleAddPokemonToTeamFromDetailCallback}
          onAddToHuntingList={addToHuntingList}
          onStageMove={handleStageMove}
          stagedMoveNameForThisPokemon={stagedMoveNameForCurrentPokemon}

          onPokemonNameClickForEvolution={handleOpenPokemonDetail}
          onAbilityNameClick={handleAbilityNameClick}
          onMoveNameClick={handleMoveNameClick}
        />
      )}
    </div>
  );
};

export default App;
