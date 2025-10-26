import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { CVSection, CVData, ProjectData, TemplateId, DbSettings, DynamicTemplate, CustomizationOptions, User, AuthSettings, CVSnippet, SnippetType, SnippetData, AiSettings } from '../types';
import { SECTIONS, OPTIONAL_SECTIONS } from '../constants';
import { Sidebar } from './Sidebar';
import { FormContainer } from './FormContainer';
import { ChevronLeftIcon, BookmarkIcon, SaveIcon } from './icons/Icon';
import { SettingsModal } from './SettingsModal';
import { TemplateSidebar } from './TemplateSidebar';
import { mapJsonResumeToCvData } from '../services/jsonResumeService';
import { mapTextResumeToCvData } from '../services/textResumeService';
import { ProfileSidebar } from './ProfileSidebar';
import { Navbar } from './Navbar';
import { PreviewContainer } from './PreviewContainer';


interface CvBuilderProps {
  projectData: ProjectData;
  onUpdateProject: (project: ProjectData) => void;
  allProjects: ProjectData[];
  onSwitchProject: (projectId: string) => void;
  onCreateNewProject: () => void;
  onImportJsonResume: (cvData: CVData) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  aiSettings: AiSettings;
  onSetAiSettings: (settings: AiSettings) => void;
  dbSettings: DbSettings;
  onSetDbSettings: (settings: DbSettings) => void;
  authSettings: AuthSettings;
  onSetAuthSettings: (settings: AuthSettings) => void;
  customTemplates: DynamicTemplate[];
  onAddCustomTemplate: (template: DynamicTemplate) => void;
  onOpenAiTemplateModal: () => void;
  onUpdateCustomTemplate: (template: DynamicTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  cvSnippets: CVSnippet[];
  onSaveSnippet: (type: SnippetType, data: SnippetData) => void;
  onSaveSectionSnippet: (type: SnippetType, data: SnippetData[]) => void;
  onDeleteSnippet: (snippetId: string) => void;
  theme: string;
  toggleTheme: () => void;
}

type LeftPanelView = 'sections' | 'templates';

const SECTION_DESCRIPTIONS: Record<CVSection, string> = {
  personalDetails: 'Start with the basics. Your name, title, and a brief, powerful summary.',
  contactInfo: 'Provide your contact details so recruiters can easily reach you.',
  professionalSummary: 'Write a short summary of your skills and experience.',
  workExperience: 'Showcase your professional history and accomplishments.',
  education: 'List your educational background.',
  skills: 'Highlight your key skills and proficiencies.',
  projects: 'Showcase your personal or professional projects to demonstrate your skills.',
};

export const CvBuilder: React.FC<CvBuilderProps> = (props) => {
  const { 
    user,
    onLogout,
    aiSettings, onSetAiSettings,
    projectData, onUpdateProject, 
    onCreateNewProject, onImportJsonResume,
    dbSettings, onSetDbSettings,
    authSettings, onSetAuthSettings,
    customTemplates, onAddCustomTemplate, onOpenAiTemplateModal,
    cvSnippets, onSaveSnippet, onSaveSectionSnippet, onDeleteSnippet,
    theme, toggleTheme
  } = props;

  // Component State
  const [activeSection, setActiveSection] = useState<CVSection>(SECTIONS[0].id);
  const [cvData, setCvData] = useState<CVData>(projectData.cvData);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(SECTIONS);
  const [leftPanelView, setLeftPanelView] = useState<LeftPanelView>('sections');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(projectData.templateId);
  const [customization, setCustomization] = useState<CustomizationOptions>(projectData.customization || {});
  
  const [projectName, setProjectName] = useState(projectData.name);
  
  // UI State
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isLeftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [isPreviewHidden, setPreviewHidden] = useState(false);


  const savingTimeoutRef = useRef<number | null>(null);
  const confirmationTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    setProjectName(projectData.name);
    setCvData(projectData.cvData);
    setSelectedTemplate(projectData.templateId);
    setCustomization(projectData.customization || {});
  }, [projectData]);


  const handleSaveProject = useCallback(() => {
    if (!isDirty || isSaving) return;
    setIsSaving(true);
    setShowSaveConfirmation(false);
    if (confirmationTimeoutRef.current) clearTimeout(confirmationTimeoutRef.current);
    if (savingTimeoutRef.current) clearTimeout(savingTimeoutRef.current);

    const updatedProject = {
      ...projectData,
      name: projectName,
      cvData,
      templateId: selectedTemplate,
      customization,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);

    savingTimeoutRef.current = window.setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setShowSaveConfirmation(true);
      confirmationTimeoutRef.current = window.setTimeout(() => {
        setShowSaveConfirmation(false);
      }, 2000);
    }, 1000);
  }, [isDirty, isSaving, projectData, cvData, selectedTemplate, customization, onUpdateProject, projectName]);

  useEffect(() => {
    return () => {
        if (savingTimeoutRef.current) clearTimeout(savingTimeoutRef.current);
        if (confirmationTimeoutRef.current) clearTimeout(confirmationTimeoutRef.current);
    };
  }, []);


  const handleUpdate = useCallback(<T extends keyof CVData>(section: T, data: CVData[T]) => {
    setCvData(prev => ({ ...prev, [section]: data }));
    setIsDirty(true);
    setShowSaveConfirmation(false);
    if (confirmationTimeoutRef.current) clearTimeout(confirmationTimeoutRef.current);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type);
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            let importedCvData: CVData | null = null;
            
            if (file.name.endsWith('.json')) {
                const jsonData = JSON.parse(content);
                if (!jsonData.basics && !jsonData.work && !jsonData.education) {
                    throw new Error("File does not appear to be in JSON Resume format.");
                }
                importedCvData = mapJsonResumeToCvData(jsonData);
                console.log('JSON resume imported:', importedCvData);
            } else if (file.name.endsWith('.txt')) {
                console.log('Processing text file:', content.substring(0, 200));
                importedCvData = mapTextResumeToCvData(content);
                console.log('Text resume imported:', importedCvData);
            }

            if (importedCvData) {
                // Ensure the imported data has a proper name
                if (!importedCvData.personalDetails.firstName && !importedCvData.personalDetails.lastName) {
                    importedCvData.personalDetails.firstName = 'Imported';
                    importedCvData.personalDetails.lastName = 'Resume';
                }
                onImportJsonResume(importedCvData);
                alert('Resume imported successfully! You can now edit and customize it.');
            } else {
                 throw new Error(`Unsupported file type: ${file.name}. Please use .json or .txt.`);
            }

        } catch (error) {
            console.error("Error importing resume file:", error);
            alert(`Failed to import resume. Please ensure the file is a valid format. Details: ${(error as Error).message}`);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    
    if (file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        alert(`Parsing ${file.name.split('.').pop()?.toUpperCase()} files directly in the browser is a complex feature under development. For best results, please import from a .json or .txt file.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }

    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddSection = () => {
    const sectionToAdd = OPTIONAL_SECTIONS[0];
    if (sectionToAdd && !visibleSections.some(s => s.id === sectionToAdd.id)) {
        setVisibleSections([...visibleSections, sectionToAdd]);
        if (sectionToAdd.id === 'projects' && !cvData.projects) {
            setCvData(prev => ({...prev, projects: [] }));
        }
    }
  };
  
  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setIsDirty(true);
  };

  const handleProjectNameChange = (name: string) => {
    setProjectName(name);
    setIsDirty(true);
  };

  const handleTemplatesClick = () => {
    setLeftPanelView('templates');
    if (isLeftPanelCollapsed) {
      setLeftPanelCollapsed(false);
    }
  };

  const activeSectionDetails = [...SECTIONS, ...OPTIONAL_SECTIONS].find(s => s.id === activeSection);

  const handleSaveSection = () => {
    const isListSection = ['workExperience', 'education', 'skills', 'projects'].includes(activeSection);
    if (isListSection) {
      const dataToSave = cvData[activeSection as SnippetType] as SnippetData[];
      if (dataToSave && dataToSave.length > 0) {
        onSaveSectionSnippet(activeSection as SnippetType, dataToSave);
      } else {
        alert("There is no content in this section to save.");
      }
    } else {
      // FIX: The logic to save non-list sections as snippets was flawed and caused a type error.
      // The types do not support saving sections like 'Personal Details' as snippets.
      // The original code caused a type error by trying to treat an array as a single object.
      // This has been corrected to inform the user that this action is not supported for the current section.
      alert(`Saving snippets is not supported for the "${activeSectionDetails?.title || 'current'}" section.`);
    }
  };
  
  const activeSectionTitle = activeSectionDetails?.title || '';
  const activeSectionDescription = SECTION_DESCRIPTIONS[activeSection as CVSection] || '';

  const handleDownloadPDF = () => {
    const printArea = document.getElementById('print-area');
    if (printArea) {
      const originalContents = document.body.innerHTML;
      const printContents = printArea.outerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleSaveToGoogleDrive = () => {
    alert('Google Drive integration coming soon! For now, use Download PDF and upload manually.');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Navbar 
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onLogout={onLogout}
        onProfileClick={() => setProfileSidebarOpen(true)}
        isDirty={isDirty}
        isSaving={isSaving}
        showSaveConfirmation={showSaveConfirmation}
        onSaveProject={handleSaveProject}
        onTemplatesClick={handleTemplatesClick}
        isPreviewHidden={isPreviewHidden}
        onHidePreview={() => setPreviewHidden(p => !p)}
        onDownloadPDF={handleDownloadPDF}
        onSaveToGoogleDrive={handleSaveToGoogleDrive}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          currentAiSettings={aiSettings}
          onSaveAiSettings={onSetAiSettings}
          currentDbSettings={dbSettings} 
          onSaveDbSettings={onSetDbSettings} 
          currentAuthSettings={authSettings} 
          onSaveAuthSettings={onSetAuthSettings} />
        <ProfileSidebar 
          isOpen={isProfileSidebarOpen}
          onClose={() => setProfileSidebarOpen(false)}
          snippets={cvSnippets}
          onInsertSnippet={() => {}} // handleInsertSnippet needs to be defined
          onDeleteSnippet={onDeleteSnippet}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".json,.txt"
        />

        {/* Left Panel */}
        <aside className={`bg-slate-800 flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col relative ${isLeftPanelCollapsed ? 'w-0' : 'w-80'}`}>
          <div className={`flex-1 overflow-hidden transition-opacity duration-200 ${isLeftPanelCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`h-full transition-opacity duration-200 ${leftPanelView === 'sections' ? 'opacity-100' : 'opacity-0'}`}>
              <Sidebar 
                projectName={projectName}
                onProjectNameChange={handleProjectNameChange}
                onNewProject={onCreateNewProject}
                onUploadResume={handleUploadClick}
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                sections={visibleSections} 
                onAddSection={handleAddSection} 
              />
            </div>
             <div className={`absolute inset-0 bg-slate-800 transition-opacity duration-200 ${leftPanelView === 'templates' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <TemplateSidebar 
                  selectedTemplate={selectedTemplate} 
                  onSelectTemplate={handleTemplateSelect} 
                  onBack={() => setLeftPanelView('sections')}
                  onAiCreate={onOpenAiTemplateModal}
                  customTemplates={customTemplates}
                  onAddCustomTemplate={onAddCustomTemplate}
              />
            </div>
          </div>
        </aside>

        <button 
          onClick={() => setLeftPanelCollapsed(prev => !prev)} 
          className="absolute top-1/2 z-20 -translate-y-1/2 bg-slate-600 hover:bg-slate-500 p-1 rounded-full transition-all duration-300 ease-in-out"
          style={{left: isLeftPanelCollapsed ? '0.5rem' : '19.5rem' }}
        >
          <ChevronLeftIcon className={`w-4 h-4 transition-transform ${isLeftPanelCollapsed ? 'rotate-180' : ''}`} />
        </button>


        {/* Center Panel (Editor) */}
        <main className="flex-1 flex flex-col bg-slate-900 p-6 md:p-8 overflow-y-auto">
            <div className="flex justify-end items-center gap-4 mb-4">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50">
                    <BookmarkIcon className="w-4 h-4" /> Load Section ({cvSnippets.filter(s => s.type === activeSection).length})
                </button>
                <button onClick={handleSaveSection} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700">
                    <SaveIcon className="w-4 h-4" /> Save Section
                </button>
            </div>
            <div className="flex-1">
                <h2 className="text-3xl font-bold">{activeSectionTitle}</h2>
                <p className="text-gray-400 mt-1 mb-6 text-sm">{activeSectionDescription}</p>
                <FormContainer 
                    activeSection={activeSection} 
                    setActiveSection={setActiveSection} 
                    cvData={cvData} 
                    onUpdate={handleUpdate} 
                    aiSettings={aiSettings} 
                    sections={visibleSections} 
                    onSaveSnippet={onSaveSnippet}
                    onSaveSectionSnippet={onSaveSectionSnippet} />
            </div>
        </main>

        {/* Right Panel (Preview) */}
        <aside className={`bg-slate-900 flex-shrink-0 p-4 transition-all duration-300 ease-in-out overflow-y-auto ${isPreviewHidden ? 'w-0 p-0' : 'w-[45%]'}`}>
          {!isPreviewHidden && (
            <div className="bg-gray-800/50 rounded-lg p-2 h-full">
              <PreviewContainer cvData={cvData} templateId={selectedTemplate} customTemplates={customTemplates} customization={customization} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};