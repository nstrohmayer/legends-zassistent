import React from 'react';
import { JournalEntry } from '../types';

interface JournalEntryDisplayProps {
    entry: JournalEntry | null;
}

export const JournalEntryDisplay: React.FC<JournalEntryDisplayProps> = ({ entry }) => {
    if (!entry) {
        return (
            <div className="flex items-center justify-center h-full text-center animate-fadeIn">
                <div>
                    <h1 className="text-3xl font-bold text-slate-500">Select a note</h1>
                    <p className="text-slate-400 mt-2">Choose a note from the journal to view it, or create a new one.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 animate-fadeIn">
             <h1 className="text-4xl font-extrabold text-sky-300 mb-6">
                {entry.title}
             </h1>
             <div className="bg-slate-800/60 p-6 rounded-lg border border-slate-700">
                <p className="text-slate-300">This is a placeholder for the content of your note titled "{entry.title}".</p>
                <p className="text-slate-400 italic mt-4 text-sm">Full editing functionality will be added here soon!</p>
             </div>
        </div>
    );
};