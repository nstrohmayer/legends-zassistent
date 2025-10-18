import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '../types';
import { JOURNAL_STORAGE_KEY } from '../constants';

export const useJournal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>(() => {
        try {
            const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
            // Sort by creation date descending on initial load
            return stored ? JSON.parse(stored).sort((a: JournalEntry, b: JournalEntry) => b.createdAt - a.createdAt) : [];
        } catch (e) {
            console.error("Failed to load journal entries from localStorage", e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
        } catch (e) {
            console.error("Failed to save journal entries to localStorage", e);
        }
    }, [entries]);

    const addEntry = useCallback(() => {
        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            title: 'New Note',
            content: '',
            createdAt: Date.now(),
        };
        const newEntries = [newEntry, ...entries];
        setEntries(newEntries);
        return newEntry.id; // Return new ID so it can be selected immediately
    }, [entries]);

    const updateEntry = useCallback((id: string, title: string, content: string) => {
        setEntries(prev =>
            prev.map(entry =>
                entry.id === id ? { ...entry, title, content } : entry
            )
        );
    }, []);

    const deleteEntry = useCallback((id: string) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
    }, []);

    return {
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
    };
};
