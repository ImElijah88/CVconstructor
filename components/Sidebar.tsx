import React from 'react';
import type { CVSection } from '../types';
import { PlusIcon } from './icons/Icon';
import { OPTIONAL_SECTIONS } from '../constants';

interface SidebarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onNewProject: () => void;
  onUploadResume: () => void;
  activeSection: CVSection;
  setActiveSection: (section: CVSection) => void;
  sections: { id: CVSection; title: string }[];
  onAddSection: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  projectName,
  onProjectNameChange, 
  onNewProject,
  onUploadResume,
  activeSection, 
  setActiveSection, 
  sections, 
  onAddSection 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(projectName);

  const handleSaveName = () => {
    if (editName.trim()) {
      onProjectNameChange(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditName(projectName);
      setIsEditing(false);
    }
  };
  const allOptionalSectionsAdded = OPTIONAL_SECTIONS.every(optSec => sections.some(sec => sec.id === optSec.id));

  return (
    <div className="p-4 flex flex-col h-full text-white">
      {/* Project Management */}
      <div className="border-b border-slate-700 pb-4 mb-4 flex-shrink-0">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={handleKeyPress}
            className="text-xl font-bold bg-slate-700 text-white rounded px-2 py-1 w-full"
            autoFocus
          />
        ) : (
          <h2 
            className="text-xl font-bold truncate cursor-pointer hover:text-blue-400" 
            title={`${projectName} (click to rename)`}
            onClick={() => {
              setEditName(projectName);
              setIsEditing(true);
            }}
          >
            {projectName}
          </h2>
        )}
        <div className="flex gap-4 text-sm mt-2 text-blue-400 font-medium">
          <button onClick={onNewProject} className="hover:underline">+ New Resume</button>
          <button onClick={onUploadResume} className="hover:underline">+ Upload Resume</button>
        </div>
      </div>

      {/* Section List */}
      <nav className="flex-grow overflow-y-auto space-y-2 -mr-2 pr-2">
        <ul>
          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-4 p-2.5 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-blue-600' : 'hover:bg-slate-700'
                  }`}
                >
                  <span className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm ${
                    isActive ? 'bg-white text-blue-600' : 'bg-slate-600 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="flex-grow truncate">{section.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Add Section button */}
      {!allOptionalSectionsAdded && (
        <div className="mt-4 pt-4 border-t border-slate-700 flex-shrink-0">
          <button onClick={onAddSection} className="w-full flex items-center gap-4 p-2.5 rounded-lg text-left hover:bg-slate-700 text-slate-400">
            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2 border-dashed border-slate-500">
              <PlusIcon className="w-4 h-4" />
            </span>
            <span className="font-medium">Add section</span>
          </button>
        </div>
      )}
    </div>
  );
};