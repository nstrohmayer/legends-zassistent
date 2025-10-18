import React, { useState, useEffect, useRef } from 'react';
import { JournalEntryDisplayProps } from '../types';
import { marked } from 'marked';

// --- Toolbar Icons ---
const PokemonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 416c-88.2 0-160-71.8-160-160c0-88.2 71.8-160 160-160c88.2 0 160 71.8 160 160c0 88.2-71.8 160-160 160zM256 208c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48z" />
        <path d="M256 464c-114.9 0-208-93.1-208-208S141.1 48 256 48s208 93.1 208 208S370.9 464 256 464zM256 96c-88.4 0-160 71.6-160 160s71.6 160 160 160s160-71.6 160-160S344.4 96 256 96zM256 320c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z" />
        <path d="M256,112c-79.5,0-144,64.5-144,144s64.5,144,144,144s144-64.5,144-144S335.5,112,256,112z M256,336 c-44.2,0-80-35.8-80-80s35.8-80,80-80s80,35.8,80,80S300.2,336,256,336z" />
        <path d="M352,256c0,53-43,96-96,96s-96-43-96-96s43-96,96-96S352,203,352,256z M112,256c0-79.5,64.5-144,144-144s144,64.5,144,144 s-64.5,144-144,144S112,335.5,112,256z" />
    </svg>
);
const BoldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true"><path d="M8 11h4.5a2.5 2.5 0 100-5H8v5zm10 4.5a4.5 4.5 0 01-4.5 4.5H6V4h6.5a4.5 4.5 0 013.256 7.597A4.5 4.5 0 0118 15.5zM8 13v5h5.5a2.5 2.5 0 000-5H8z"/></svg>;
const ItalicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true"><path d="M10 5h3l-4 14h-3l4-14zM14 5h3l-4 14h-3l4-14z"/></svg>;
const UnorderedListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true"><path d="M4 4a2 2 0 100 4 2 2 0 000-4zM4 10a2 2 0 100 4 2 2 0 000-4zM4 16a2 2 0 100 4 2 2 0 000-4zM9 5h11a1 1 0 010 2H9a1 1 0 010-2zM9 11h11a1 1 0 010 2H9a1 1 0 010-2zM9 17h11a1 1 0 010 2H9a1 1 0 010-2z"/></svg>;
const OrderedListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true"><path d="M5 4h2a1 1 0 010 2H6v1h1a1 1 0 010 2H5a1 1 0 010-2h1V6H5a1 1 0 110-2zM4 11a1 1 0 011-1h2a1 1 0 010 2h-1v3a1 1 0 01-2 0v-4zM5 16a1 1 0 01.993.883L6 17v1h1a1 1 0 010 2H5a1 1 0 01-1-1v-2a1 1 0 011-1zM9 5h11a1 1 0 010 2H9a1 1 0 010-2zM9 11h11a1 1 0 010 2H9a1 1 0 010-2zM9 17h11a1 1 0 010 2H9a1 1 0 010-2z"/></svg>;
const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true"><path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm0 2v4h4V6H4zm6 0v4h4V6h-4zm6 0v4h4V6h-4zM4 12v6h4v-6H4zm6 0v6h4v-6h-4zm6 0v6h4v-6h-4z"/></svg>;


const MarkdownToolbar: React.FC<{ onInsert: (tag: 'pokemon' | 'bold' | 'italic' | 'ul' | 'ol' | 'table') => void }> = ({ onInsert }) => {
    return (
        <div className="bg-slate-800 p-1.5 rounded-t-lg border-b border-slate-600 flex items-center gap-1">
            <button onClick={() => onInsert('bold')} className="p-2 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Bold"><BoldIcon /></button>
            <button onClick={() => onInsert('italic')} className="p-2 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Italic"><ItalicIcon /></button>
            <div className="w-px h-5 bg-slate-600 mx-1"></div>
            <button onClick={() => onInsert('ul')} className="p-2 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Bulleted List"><UnorderedListIcon /></button>
            <button onClick={() => onInsert('ol')} className="p-2 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Numbered List"><OrderedListIcon /></button>
            <button onClick={() => onInsert('table')} className="p-2 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Insert Table"><TableIcon /></button>
            <div className="w-px h-5 bg-slate-600 mx-1"></div>
            <button
                onClick={() => onInsert('pokemon')}
                className="p-2 rounded-md hover:bg-slate-700 text-slate-300 hover:text-sky-300 transition-colors"
                title="Insert Pokémon Link"
            >
                <PokemonIcon />
            </button>
        </div>
    );
};

export const JournalEntryDisplay: React.FC<JournalEntryDisplayProps> = ({ entry, onUpdate, onOpenPokemonDetail }) => {
    const [currentTitle, setCurrentTitle] = useState(entry?.title || '');
    const [currentContent, setCurrentContent] = useState(entry?.content || '');
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (entry) {
            setCurrentTitle(entry.title);
            setCurrentContent(entry.content);
            setViewMode('edit');
        }
    }, [entry]);

    useEffect(() => {
        if (!entry || (currentTitle === entry.title && currentContent === entry.content)) {
            return;
        }
        const handler = setTimeout(() => {
            onUpdate(entry.id, currentTitle, currentContent);
        }, 500);
        return () => clearTimeout(handler);
    }, [currentTitle, currentContent, entry, onUpdate]);

    useEffect(() => {
        if (viewMode === 'edit' && contentRef.current) {
            contentRef.current.focus();
        }
    }, [viewMode]);
    
    useEffect(() => {
        const container = previewContainerRef.current;
        if (!container || !onOpenPokemonDetail) return;
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'BUTTON' && target.classList.contains('pokemon-link')) {
                const pokemonName = target.dataset.pokemonName;
                if (pokemonName) {
                    onOpenPokemonDetail(pokemonName);
                }
            }
        };
        container.addEventListener('click', handleClick);
        return () => {
            container.removeEventListener('click', handleClick);
        };
    }, [onOpenPokemonDetail, viewMode]);

    const preprocessMarkdown = (text: string): string => {
        const regex = /\{\{pokemon:(.*?)\}\}/g;
        return text.replace(regex, (_match, pokemonName) => {
            const cleanName = pokemonName.trim();
            return `<button class="pokemon-link" data-pokemon-name="${cleanName}">${cleanName}</button>`;
        });
    };

    const handleInsertMarkdown = (tag: 'pokemon' | 'bold' | 'italic' | 'ul' | 'ol' | 'table') => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const selectedText = value.substring(start, end);

        const wrapOrInsert = (prefix: string, suffix: string, placeholder: string) => {
            let newContent: string;
            if (selectedText) {
                newContent = `${value.substring(0, start)}${prefix}${selectedText}${suffix}${value.substring(end)}`;
                setCurrentContent(newContent);
                setTimeout(() => {
                    textarea.focus();
                    const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
            } else {
                newContent = `${value.substring(0, start)}${prefix}${placeholder}${suffix}${value.substring(end)}`;
                setCurrentContent(newContent);
                setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(start + prefix.length, start + prefix.length + placeholder.length);
                }, 0);
            }
        };

        const insertBlock = (block: string) => {
            const separator = (start > 0 && value[start - 1] !== '\n') ? '\n\n' : '\n';
            const newContent = `${value.substring(0, start)}${separator}${block}${value.substring(end)}`;
            setCurrentContent(newContent);
            setTimeout(() => {
                textarea.focus();
                const newCursorPos = start + separator.length + block.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        };
        
        switch (tag) {
            case 'pokemon': wrapOrInsert('{{pokemon:', '}}', 'NAME'); break;
            case 'bold': wrapOrInsert('**', '**', 'BOLD'); break;
            case 'italic': wrapOrInsert('*', '*', 'ITALIC'); break;
            case 'ul': insertBlock('- List Item'); break;
            case 'ol': insertBlock('1. List Item'); break;
            case 'table':
                const tableTemplate = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |';
                insertBlock(tableTemplate);
                break;
        }
    };

    if (!entry) {
        return (
            <div className="flex items-center justify-center h-full text-center animate-fadeIn">
                <div>
                    <h1 className="text-3xl font-bold text-slate-400">Select a note</h1>
                    <p className="text-slate-500 mt-2">Choose a note from the journal to view or edit it, or create a new one.</p>
                </div>
            </div>
        );
    }
    
    const preprocessedContent = preprocessMarkdown(currentContent);
    const renderedMarkdown = { __html: marked(preprocessedContent, { breaks: true, gfm: true }) as string };

    return (
        <div className="animate-fadeIn h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b-2 border-slate-700 pb-2">
                 <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    placeholder="Note Title"
                    className="w-full bg-transparent text-4xl font-extrabold text-sky-300 outline-none focus:border-sky-400 transition-colors"
                    aria-label="Note title"
                 />
                 <div className="flex bg-slate-800 rounded-lg p-1 ml-4">
                     <button
                         onClick={() => setViewMode('edit')}
                         className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${viewMode === 'edit' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                     >
                         Edit
                     </button>
                     <button
                         onClick={() => setViewMode('preview')}
                         className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${viewMode === 'preview' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                     >
                         Preview
                     </button>
                 </div>
             </div>
             
             {viewMode === 'edit' ? (
                 <div className="flex flex-col flex-grow">
                    <MarkdownToolbar onInsert={handleInsertMarkdown} />
                    <textarea
                        ref={contentRef}
                        value={currentContent}
                        onChange={(e) => setCurrentContent(e.target.value)}
                        placeholder="Start writing your notes here... Supports Markdown! Use {{pokemon:Pikachu}} to link."
                        className="w-full flex-grow bg-slate-800/50 p-4 rounded-b-lg border border-t-0 border-slate-700 text-slate-300 placeholder-slate-500 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none"
                        aria-label="Note content"
                    />
                 </div>
             ) : (
                 <div
                    ref={previewContainerRef}
                    className="w-full flex-grow bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-slate-300 overflow-y-auto markdown-content"
                    dangerouslySetInnerHTML={renderedMarkdown}
                 />
             )}
        </div>
    );
};
