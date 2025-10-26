import React from 'react';
import { CVSnippet, SnippetType, WorkExperience, Education, Project } from '../types';
import { PlusIcon, TrashIcon, ChevronRightIcon } from './icons/Icon';

interface ProfileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    snippets: CVSnippet[];
    onInsertSnippet: (snippet: CVSnippet) => void;
    onDeleteSnippet: (snippetId: string) => void;
}

const SnippetPreview: React.FC<{ snippet: CVSnippet }> = ({ snippet }) => {
    if (Array.isArray(snippet.data)) {
        const count = snippet.data.length;
        const itemLabel = count === 1 ? 'item' : 'items';
        return <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{count} {itemLabel} in this section</p>;
    }

    switch (snippet.type) {
        case 'workExperience':
            const work = snippet.data as WorkExperience;
            return <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{work.jobTitle} at {work.company}</p>;
        case 'education':
            const edu = snippet.data as Education;
            return <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{edu.degree} at {edu.school}</p>;
        case 'projects':
            const proj = snippet.data as Project;
            return <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{proj.name}</p>;
        default:
            return null;
    }
};

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
    isOpen, 
    onClose, 
    snippets,
    onInsertSnippet,
    onDeleteSnippet
}) => {
    const groupedSnippets = snippets.reduce((acc, snippet) => {
        const type = snippet.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(snippet);
        return acc;
    }, {} as Record<SnippetType, CVSnippet[]>);
    
    const sectionTitles: Record<SnippetType, string> = {
        workExperience: 'Work Experience',
        education: 'Education',
        projects: 'Projects',
        skills: 'Skills',
    };

    return (
        <>
            <div 
              className={`fixed inset-0 bg-black/40 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={onClose}
            ></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold">My Snippets</h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </header>
                    <div className="flex-grow overflow-y-auto p-4">
                        {snippets.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <p>No snippets saved yet.</p>
                                <p className="text-sm mt-1">Click the bookmark icon on an item to save it here.</p>
                            </div>
                        ) : (
                            Object.entries(groupedSnippets).map(([type, snippetList]) => (
                                <div key={type} className="mb-6">
                                    <h4 className="font-semibold uppercase text-xs text-gray-400 dark:text-gray-500 tracking-wider mb-2">
                                        {sectionTitles[type as SnippetType]}
                                    </h4>
                                    <ul className="space-y-2">
                                        {snippetList.map(snippet => (
                                            <li key={snippet.id} className="group p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-transparent hover:border-blue-500">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-sm">{snippet.name}</p>
                                                        <SnippetPreview snippet={snippet} />
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                          onClick={() => onInsertSnippet(snippet)} 
                                                          className="p-1.5 text-blue-600 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200"
                                                          title="Insert into resume"
                                                        >
                                                            <PlusIcon className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                          onClick={() => onDeleteSnippet(snippet.id)} 
                                                          className="p-1.5 text-red-600 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200"
                                                          title="Delete snippet"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};