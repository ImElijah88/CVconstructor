import React, { useState, useEffect, useCallback } from 'react';
import { CvBuilder } from './components/CvBuilder';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { ThemeToggle } from './components/ThemeToggle';
import { AppView, ProjectData, DbSettings, DynamicTemplate, CVData, User, AuthSettings, CVSnippet, SnippetType, SnippetData, AiSettings } from './types';
import { MOCK_CV_DATA, MOCK_CV_DATA_2, LLM_OPTIONS } from './constants';
import { AiTemplateModal } from './components/AiTemplateModal';

// Simple UUID generator fallback if crypto is not available
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [isAiTemplateModalOpen, setAiTemplateModalOpen] = useState(false);
  
  // Settings State
  const [aiSettings, setAiSettings] = useState<AiSettings>(() => {
    const saved = localStorage.getItem('ai-settings');
    return saved ? JSON.parse(saved) : { model: LLM_OPTIONS[0].value, apiKey: '' };
  });
  const [dbSettings, setDbSettings] = useState<DbSettings>(() => {
    const saved = localStorage.getItem('db-settings');
    return saved ? JSON.parse(saved) : { type: 'none', isConnected: false };
  });
  const [authSettings, setAuthSettings] = useState<AuthSettings>(() => {
    const saved = localStorage.getItem('auth-settings');
    return saved ? JSON.parse(saved) : { googleClientId: '' };
  });

  // Project and Template State
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [customTemplates, setCustomTemplates] = useState<DynamicTemplate[]>(() => {
    const saved = localStorage.getItem('custom-templates');
    return saved ? JSON.parse(saved) : [];
  });
  const [cvSnippets, setCvSnippets] = useState<CVSnippet[]>(() => {
    const saved = localStorage.getItem('cv-snippets');
    return saved ? JSON.parse(saved) : [];
  });

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Settings effects
  useEffect(() => {
    localStorage.setItem('ai-settings', JSON.stringify(aiSettings));
  }, [aiSettings]);

  useEffect(() => {
    localStorage.setItem('db-settings', JSON.stringify(dbSettings));
  }, [dbSettings]);

  useEffect(() => {
    localStorage.setItem('auth-settings', JSON.stringify(authSettings));
  }, [authSettings]);
  
  useEffect(() => {
    localStorage.setItem('custom-templates', JSON.stringify(customTemplates));
  }, [customTemplates]);

  useEffect(() => {
    localStorage.setItem('cv-snippets', JSON.stringify(cvSnippets));
  }, [cvSnippets]);


  // Load projects on initial mount
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('cv-projects');
      
      if (savedProjects) {
        // User has existing projects, load them
        const parsedProjects = JSON.parse(savedProjects) as ProjectData[];
        const savedCurrentProjectId = localStorage.getItem('current-project-id');
        setProjects(parsedProjects);
        if (savedCurrentProjectId && parsedProjects.some((p: ProjectData) => p.id === savedCurrentProjectId)) {
          setCurrentProjectId(savedCurrentProjectId);
        } else if (parsedProjects.length > 0) {
          // Fallback to the most recently updated project if current one is invalid
          const sorted = [...parsedProjects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          setCurrentProjectId(sorted[0].id);
        }
      } else {
        // First-time user, create example projects
        const exampleProject1: ProjectData = {
          id: uuidv4(),
          name: 'Example: Frontend Developer',
          templateId: 'classic',
          cvData: MOCK_CV_DATA,
          updatedAt: new Date().toISOString(),
        };
        const exampleProject2: ProjectData = {
          id: uuidv4(),
          name: 'Example: Project Manager',
          templateId: 'modern',
          cvData: MOCK_CV_DATA_2,
          updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        };
        
        const initialProjects = [exampleProject1, exampleProject2];
        setProjects(initialProjects);
        setCurrentProjectId(exampleProject1.id);
        saveProjectsToLocalStorage(initialProjects, exampleProject1.id);
      }
    } catch (error) {
      console.error("Failed to initialize projects from localStorage", error);
      setProjects([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProjectsToLocalStorage = (updatedProjects: ProjectData[], projectId: string | null) => {
    localStorage.setItem('cv-projects', JSON.stringify(updatedProjects));
    if (projectId) {
      localStorage.setItem('current-project-id', projectId);
    }
  };

  const handleUpdateProject = (updatedProjectData: ProjectData) => {
    const updatedProjects = projects.map(p => p.id === updatedProjectData.id ? updatedProjectData : p);
    setProjects(updatedProjects);
    saveProjectsToLocalStorage(updatedProjects, currentProjectId);
  };

  const handleCreateNewProject = () => {
    const newProject: ProjectData = {
      id: uuidv4(),
      name: 'Untitled Resume',
      templateId: 'classic',
      cvData: MOCK_CV_DATA,
      updatedAt: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setCurrentProjectId(newProject.id);
    saveProjectsToLocalStorage(updatedProjects, newProject.id);
  };
  
  const handleImportJsonResume = (cvData: CVData) => {
    const name = (cvData.personalDetails.firstName || cvData.personalDetails.lastName) 
      ? `${cvData.personalDetails.firstName} ${cvData.personalDetails.lastName}'s Resume`.trim()
      : 'Imported Resume';

    const newProject: ProjectData = {
      id: uuidv4(),
      name: name,
      templateId: 'classic', // Default template for imported resumes
      cvData: cvData,
      updatedAt: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setCurrentProjectId(newProject.id);
    saveProjectsToLocalStorage(updatedProjects, newProject.id);
  };

  const handleAddCustomTemplate = (template: DynamicTemplate) => {
    setCustomTemplates(prev => [...prev, template]);
  };
  
  const handleUpdateCustomTemplate = (updatedTemplate: DynamicTemplate) => {
    setCustomTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };
  
  const handleDeleteCustomTemplate = (templateId: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleSaveSnippet = (type: SnippetType, data: SnippetData) => {
    const name = window.prompt("Enter a name for this snippet:", "My Saved Snippet");
    if (name) {
      const newSnippet: CVSnippet = {
        id: uuidv4(),
        name,
        type,
        data,
      };
      setCvSnippets(prev => [...prev, newSnippet]);
    }
  };

  const handleSaveSectionSnippet = (type: SnippetType, data: SnippetData[]) => {
    if (!data || data.length === 0) {
      alert("There is no content in this section to save.");
      return;
    }
    const name = window.prompt(`Enter a name for this section snippet:`, `My ${type} Section`);
    if (name) {
      const newSnippet: CVSnippet = {
        id: uuidv4(),
        name,
        type,
        data,
      };
      setCvSnippets(prev => [...prev, newSnippet]);
    }
  };

  const handleDeleteSnippet = (snippetId: string) => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      setCvSnippets(prev => prev.filter(s => s.id !== snippetId));
    }
  };


  const currentProject = projects.find(p => p.id === currentProjectId);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const handleLogin = useCallback(() => {
    const mockUser: User = {
        name: 'Demo User',
        email: 'demo@user.com',
        avatarUrl: 'https://i.pravatar.cc/40?u=demo@user.com', // Using a placeholder avatar service
        isGuest: false,
    };
    setUser(mockUser);
    setCurrentView(AppView.BUILDER);
    if (!currentProject && projects.length === 0) {
      handleCreateNewProject();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, currentProject]);

  const handleContinueAsGuest = useCallback(() => {
     const guestUser: User = {
        name: 'Guest User',
        email: '',
        avatarUrl: null,
        isGuest: true,
    };
    setUser(guestUser);
    setCurrentView(AppView.BUILDER);
    if (!currentProject && projects.length === 0) {
      handleCreateNewProject();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, currentProject]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentView(AppView.LANDING);
  }, []);


  const renderContent = () => {
    if (!user) {
        switch (currentView) {
            case AppView.LANDING:
                return <LandingPage 
                    onLoginClick={() => setCurrentView(AppView.LOGIN)} 
                    onGuestClick={handleContinueAsGuest} 
                />;
            case AppView.LOGIN:
                return <LoginPage onLogin={handleLogin} />;
            default:
                return <LandingPage 
                    onLoginClick={() => setCurrentView(AppView.LOGIN)} 
                    onGuestClick={handleContinueAsGuest} 
                />;
        }
    }

    if (!currentProject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <p className="mb-4 text-lg">No resume projects found.</p>
                <button onClick={handleCreateNewProject} className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Create Your First Resume
                </button>
            </div>
        );
    }
    
    return (
      <CvBuilder 
        key={currentProject.id}
        // Project props
        projectData={currentProject}
        onUpdateProject={handleUpdateProject}
        allProjects={projects}
        onSwitchProject={setCurrentProjectId}
        onCreateNewProject={handleCreateNewProject}
        onImportJsonResume={handleImportJsonResume}
        // User prop
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        // Settings props
        aiSettings={aiSettings}
        onSetAiSettings={setAiSettings}
        dbSettings={dbSettings}
        onSetDbSettings={setDbSettings}
        authSettings={authSettings}
        onSetAuthSettings={setAuthSettings}
        // Template props
        customTemplates={customTemplates}
        onAddCustomTemplate={handleAddCustomTemplate}
        onOpenAiTemplateModal={() => setAiTemplateModalOpen(true)}
        onUpdateCustomTemplate={handleUpdateCustomTemplate}
        onDeleteCustomTemplate={handleDeleteCustomTemplate}
        // Snippet props
        cvSnippets={cvSnippets}
        onSaveSnippet={handleSaveSnippet}
        onSaveSectionSnippet={handleSaveSectionSnippet}
        onDeleteSnippet={handleDeleteSnippet}
        // Theme props
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {currentView !== AppView.BUILDER && (
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      )}
      {renderContent()}
       <AiTemplateModal 
        isOpen={isAiTemplateModalOpen} 
        onClose={() => setAiTemplateModalOpen(false)} 
        onTemplateCreated={handleAddCustomTemplate} 
        aiSettings={aiSettings}
      />
    </div>
  );
}

export default App;