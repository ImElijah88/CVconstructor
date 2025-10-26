import React, { useState } from 'react';
import { MenuIcon, PlusIcon } from './icons/Icon';
import { ProjectData } from '../types';

interface SideMenuProps {
    projects: ProjectData[];
    currentProjectId: string;
    onSwitchProject: (projectId: string) => void;
    onCreateNewProject: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ projects, currentProjectId, onSwitchProject, onCreateNewProject }) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortedProjects = [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return (
        <div
            className="fixed top-0 left-0 h-full z-40"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className={`
                absolute top-0 left-0 h-full bg-primary text-primary-foreground shadow-2xl transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
            `}>
                <div className="p-4 flex flex-col h-full">
                    <h2 className="text-xl font-bold mb-4">My Resumes</h2>
                    <ul className="space-y-2 flex-grow overflow-y-auto">
                        {sortedProjects.map(project => (
                            <li key={project.id}>
                                <button
                                    onClick={() => onSwitchProject(project.id)}
                                    className={`w-full text-left block px-3 py-2 rounded-md transition-colors ${
                                        project.id === currentProjectId
                                            ? 'bg-primary-700'
                                            : 'hover:bg-primary-900/50'
                                    }`}
                                >
                                    <p className="font-semibold truncate">{project.name}</p>
                                    <p className="text-xs text-primary-foreground/70">
                                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                                    </p>
                                </button>
                            </li>
                        ))}
                    </ul>
                     <button
                        onClick={onCreateNewProject}
                        className="w-full mt-4 flex items-center justify-center px-3 py-2 rounded-md border-2 border-dashed border-primary-foreground/50 hover:bg-primary-900/50 transition-colors"
                     >
                        <PlusIcon className="w-5 h-5 mr-2" /> New Resume
                    </button>
                </div>
            </div>
            {!isOpen && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-24 bg-primary rounded-r-lg flex items-center justify-center cursor-pointer shadow-lg">
                    <MenuIcon className="w-6 h-6 text-primary-foreground" />
                </div>
            )}
        </div>
    );
};
