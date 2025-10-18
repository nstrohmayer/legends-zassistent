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
import { ActiveMainPanelType, useNavigator } from './hooks/useNavigator';
import { useDetailBar } from './hooks/useDetailBar';
import { usePokemonCollections } from './hooks/usePokemonCollections';
import { useJournal } from './hooks/useJournal';


// Placeholder icons - can be moved if they grow
const IconPokeball = () => <span className="text-red-500">◉</span>;

const App: React.FC = () => {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState<boolean>(true); 
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'journal' | 'zones'>('journal');
  
  // State for Team Builder tabs
  const [teamBuilderActiveTab, setTeamBuilderActiveTab] = useState<'management' | 'navigator' | 'details'>('management');
  
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
    setActiveMainPanel('teamBuilder');
    setTeamBuilderActiveTab('management');
    if (isMobileView) {
      setIsLeftSidebarCollapsed(true);
    }
  }, [isMobileView]);

  const {
    activeMainPanel,
    setActiveMainPanel, 
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
  
  const handleSwitchToTeamBuilderAndCollapse = useCallback(() => {
    setActiveMainPanel('teamBuilder');
    setSelectedEntryId(null); // Deselect any journal entry
    setTeamBuilderActiveTab('management'); // Reset to management tab
    if (isMobileView) {
      setIsLeftSidebarCollapsed(true);
    }
  }, [setActiveMainPanel, isMobileView]);
  
  const handleSelectJournalEntry = useCallback((id: string) => {
    setSelectedEntryId(id);
    setActiveMainPanel('journalEntry');
     if (isMobileView) {
      setIsLeftSidebarCollapsed(true);
    }
  }, [setActiveMainPanel, isMobileView]);

  const handleAddJournalEntry = useCallback(() => {
    const newId = addJournalEntry();
    handleSelectJournalEntry(newId);
  }, [addJournalEntry, handleSelectJournalEntry]);

  const handleDeleteJournalEntry = useCallback((id: string) => {
    deleteJournalEntry(id);
    if (selectedEntryId === id) {
        setSelectedEntryId(null);
        setActiveMainPanel('teamBuilder'); // Go back to a default view
    }
  }, [deleteJournalEntry, selectedEntryId, setActiveMainPanel]);

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
    switch (activeMainPanel) {
      case 'journalEntry':
          return <JournalEntryDisplay entry={selectedJournalEntry} />;
      case 'teamBuilder':
        return (
          <div className="animate-fadeIn">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">
                  Pokémon Tools
              </h1>
                {/* Top Level Tabs */}
                <div className="flex space-x-1 border-b-2 border-slate-700 mt-4 mb-6">
                    <button
                        onClick={() => setTeamBuilderActiveTab('management')}
                        className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                            teamBuilderActiveTab === 'management' ? 'bg-slate-800 text-sky-300 border-b-2 border-sky-400' : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                    >
                        Team
                    </button>
                     <button
                        onClick={() => setTeamBuilderActiveTab('details')}
                        className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                            teamBuilderActiveTab === 'details' ? 'bg-slate-800 text-sky-300 border-b-2 border-sky-400' : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                    >
                        Pokédex
                    </button>
                    <button
                        onClick={() => setTeamBuilderActiveTab('navigator')}
                        className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                            teamBuilderActiveTab === 'navigator' ? 'bg-slate-800 text-sky-300 border-b-2 border-sky-400' : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                    >
                        Navigator
                    </button>
                </div>

                {/* Content for Top Level Tabs */}
                {teamBuilderActiveTab === 'management' && (
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
                )}
                
                {teamBuilderActiveTab === 'details' && (
                     <div className="animate-fadeIn">
                        <PokemonDetailLookup 
                            onAbilityClick={handleAbilityNameClick}
                            onMoveClick={handleMoveNameClick}
                        />
                    </div>
                )}

                {teamBuilderActiveTab === 'navigator' && (
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
                )}
          </div>
        );
      default:
        // Default to a placeholder if no entry is selected
        return <JournalEntryDisplay entry={null} />;
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
            <div className={`pt-4 space-y-1 flex-grow overflow-y-auto flex flex-col ${isLeftSidebarCollapsed ? 'hidden' : 'block'}`}>
              <button
                onClick={handleSwitchToTeamBuilderAndCollapse}
                className="w-full text-left px-4 py-3 transition-colors text-slate-300 hover:bg-slate-700/50 font-medium bg-slate-800/50"
              >
                Pokémon
              </button>
               
                <div className="px-2 pt-2">
                    <div className="flex bg-slate-800 rounded-lg p-1 mb-3">
                        <button
                            onClick={() => setActiveSidebarTab('journal')}
                            className={`flex-1 text-center text-sm font-semibold py-1.5 rounded-md transition-colors ${
                                activeSidebarTab === 'journal' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            Journal
                        </button>
                        <button
                            onClick={() => setActiveSidebarTab('zones')}
                            className={`flex-1 text-center text-sm font-semibold py-1.5 rounded-md transition-colors ${
                                activeSidebarTab === 'zones' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            Wild Zones
                        </button>
                    </div>
                </div>

                {activeSidebarTab === 'journal' && (
                    <JournalSidebar
                        entries={journalEntries}
                        selectedEntryId={selectedEntryId}
                        onSelectEntry={handleSelectJournalEntry}
                        onAddEntry={handleAddJournalEntry}
                        onDeleteEntry={handleDeleteJournalEntry}
                    />
                )}
                {activeSidebarTab === 'zones' && (
                  <WildZoneExplorer
                    zones={KALOS_WILD_ZONES}
                    onPokemonClick={handlePokemonClickAndCollapse}
                  />
                )}
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