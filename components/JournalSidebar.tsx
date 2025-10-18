import React from 'react';
import { JournalEntry } from '../types';

interface JournalSidebarProps {
    entries: JournalEntry[];
    selectedEntryId: string | null;
    onSelectEntry: (id: string) => void;
    onAddEntry: () => void;
    onDeleteEntry: (id: string) => void;
}

export const JournalSidebar: React.FC<JournalSidebarProps> = ({
    entries,
    selectedEntryId,
    onSelectEntry,
    onAddEntry,
    onDeleteEntry,
}) => {
    
    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this note?')) {
            onDeleteEntry(id);
        }
    };
    
    return (
        <div className="flex flex-col h-full px-2">
            <button
                onClick={onAddEntry}
                className="w-full text-center px-4 py-3 mb-3 rounded-lg transition-colors bg-sky-600/80 hover:bg-sky-700/80 text-white font-semibold"
            >
                + New Note
            </button>
            <nav className="space-y-1 flex-grow overflow-y-auto">
                {entries.length > 0 ? (
                    entries.map(entry => (
                        <button
                            key={entry.id}
                            onClick={() => onSelectEntry(entry.id)}
                             className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group relative
                                ${selectedEntryId === entry.id
                                  ? 'bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white shadow-lg font-bold'
                                  : 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-300'
                                }
                              `}
                              aria-current={selectedEntryId === entry.id ? "page" : undefined}
                        >
                             <p className="font-medium truncate pr-6">{entry.title}</p>
                             <p className={`text-xs ${selectedEntryId === entry.id ? 'text-slate-200' : 'text-slate-400'}`}>{new Date(entry.createdAt).toLocaleDateString()}</p>
                             <button 
                                onClick={(e) => handleDelete(e, entry.id)}
                                className="absolute top-1/2 -translate-y-1/2 right-2 p-1 rounded-full text-red-400 hover:bg-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Note"
                                aria-label={`Delete note titled ${entry.title}`}
                             >
                                &times;
                             </button>
                        </button>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 italic text-center py-3">No notes yet. Create one!</p>
                )}
            </nav>
        </div>
    );
};