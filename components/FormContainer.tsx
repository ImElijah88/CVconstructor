import React, { useState } from 'react';
import type { CVData, CVSection, WorkExperience, Education, Skill, Project, SnippetType, SnippetData, AiSettings } from '../types';
import { CameraIcon, MagicWandIcon, TrashIcon, BookmarkIcon } from './icons/Icon';
import { generateWithGemini } from '../services/geminiService';
import { AiAssistant } from './AiAssistant';

interface FormContainerProps {
  activeSection: CVSection;
  setActiveSection: (section: CVSection) => void;
  cvData: CVData;
  onUpdate: <T extends keyof CVData>(section: T, data: CVData[T]) => void;
  aiSettings: AiSettings;
  sections: { id: CVSection; title: string }[];
  onSaveSnippet: (type: SnippetType, data: SnippetData) => void;
  onSaveSectionSnippet: (type: SnippetType, data: SnippetData[]) => void;
}

type ListSection = 'workExperience' | 'education' | 'skills' | 'projects';

const AiHelperModal: React.FC<{ prompt: string; onApply: (text: string) => void; onClose: () => void; getSuggestion: () => Promise<string> }> = ({ prompt, onApply, onClose, getSuggestion }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [suggestion, setSuggestion] = useState('');

    const fetchSuggestion = async () => {
        setIsLoading(true);
        const result = await getSuggestion();
        setSuggestion(result);
        setIsLoading(false);
    };

    React.useEffect(() => {
        fetchSuggestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prompt]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">AI Suggestion</h3>
                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                ) : (
                    <textarea value={suggestion} onChange={(e) => setSuggestion(e.target.value)} rows={8} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-4"></textarea>
                )}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded border dark:border-gray-600">Cancel</button>
                    <button onClick={() => onApply(suggestion)} className="px-4 py-2 rounded bg-blue-600 text-white" disabled={isLoading}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export const FormContainer: React.FC<FormContainerProps> = ({ activeSection, setActiveSection, cvData, onUpdate, aiSettings, sections, onSaveSnippet, onSaveSectionSnippet }) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean, prompt: string, onApply: (text: string) => void } | null>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<string | null>(null);

  const handleUpdateField = <S extends keyof CVData, F extends keyof CVData[S]>(section: S, field: F, value: CVData[S][F]) => {
      const currentData = cvData[section];
      if (typeof currentData === 'object' && !Array.isArray(currentData)) {
          const updatedSection = { ...currentData, [field]: value };
          onUpdate(section, updatedSection as CVData[S]);
      }
  };

  const handleUpdateListItem = <S extends ListSection>(section: S, id: string, field: keyof CVData[S][number], value: any) => {
    const list = cvData[section] as any[];
    const updatedList = list.map(item => (item.id === id ? { ...item, [field]: value } : item));
    onUpdate(section, updatedList as CVData[S]);
  };
  
  const handleAddListItem = (section: ListSection) => {
      let newItem;
      const id = Date.now().toString();
      switch (section) {
          case 'workExperience':
            newItem = { id, jobTitle: '', company: '', startDate: '', endDate: '', description: '' };
            break;
          case 'education':
            newItem = { id, degree: '', school: '', startDate: '', endDate: '' };
            break;
          case 'skills':
            newItem = { id, name: '' };
            break;
          case 'projects':
            newItem = { id, name: '', description: '', url: '' };
            break;
      }
      const list = cvData[section] as any[] || [];
      onUpdate(section, [...list, newItem]);
  };

  const handleRemoveListItem = (section: ListSection, id: string) => {
      const list = cvData[section] as any[];
      onUpdate(section, list.filter(item => item.id !== id));
  };
  
  const handlePrevious = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
        setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
        setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const isListSection = ['workExperience', 'education', 'skills', 'projects'].includes(activeSection);

  const handleSaveSection = () => {
    if (isListSection) {
      const dataToSave = cvData[activeSection as SnippetType] as SnippetData[];
      onSaveSectionSnippet(activeSection as SnippetType, dataToSave);
    }
  };

  const getAiSuggestion = (prompt: string) => {
    return generateWithGemini(prompt, aiSettings.model, aiSettings.apiKey);
  }

  const renderForm = () => {
    switch (activeSection) {
      case 'personalDetails':
        return (
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="First name" value={cvData.personalDetails.firstName} onChange={e => handleUpdateField('personalDetails', 'firstName', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
              <input type="text" placeholder="Last name" value={cvData.personalDetails.lastName} onChange={e => handleUpdateField('personalDetails', 'lastName', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
            </div>
            <div className="relative mb-4">
              <input type="text" placeholder="Desired job title" value={cvData.personalDetails.jobTitle} onChange={e => handleUpdateField('personalDetails', 'jobTitle', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
              <AiAssistant
                isOpen={aiAssistantOpen === 'jobTitle'}
                onToggle={() => setAiAssistantOpen(aiAssistantOpen === 'jobTitle' ? null : 'jobTitle')}
                onApply={(text) => handleUpdateField('personalDetails', 'jobTitle', text)}
                prompt={`Suggest a professional job title for someone with skills in ${cvData.skills.map(s => s.name).join(', ')}. Current title: "${cvData.personalDetails.jobTitle}"`}
                aiSettings={aiSettings}
                placeholder="AI can suggest a professional job title"
              />
            </div>
            <button className="flex items-center px-4 py-2 border-2 border-dashed rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <CameraIcon className="w-5 h-5 mr-2" /> Add photo
            </button>
          </div>
        );
      case 'contactInfo':
        // ... same as before
         return (
            <div className="space-y-4">
                <input type="email" placeholder="Email" value={cvData.contactInfo.email} onChange={e => handleUpdateField('contactInfo', 'email', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
                <input type="tel" placeholder="Phone" value={cvData.contactInfo.phone} onChange={e => handleUpdateField('contactInfo', 'phone', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
                <input type="text" placeholder="Address" value={cvData.contactInfo.address} onChange={e => handleUpdateField('contactInfo', 'address', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
                <input type="text" placeholder="LinkedIn Profile URL" value={cvData.contactInfo.linkedin} onChange={e => handleUpdateField('contactInfo', 'linkedin', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
                <input type="text" placeholder="Website/Portfolio URL" value={cvData.contactInfo.website} onChange={e => handleUpdateField('contactInfo', 'website', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
            </div>
        );
      case 'workExperience':
        // ... updated prompt
        return (
            <>
              {cvData.workExperience.map((exp) => (
                <div key={exp.id} className="p-4 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-800/50 relative group">
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleSaveSection} className="p-1.5 bg-blue-500 text-white rounded-full" aria-label="Save section"><BookmarkIcon className="w-4 h-4"/></button>
                    <button onClick={() => handleRemoveListItem('workExperience', exp.id)} className="p-1.5 bg-red-500 text-white rounded-full" aria-label="Remove experience"><TrashIcon className="w-4 h-4"/></button>
                  </div>
                  <input type="text" placeholder="Job Title" value={exp.jobTitle} onChange={e => handleUpdateListItem('workExperience', exp.id, 'jobTitle', e.target.value)} className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                  <input type="text" placeholder="Company" value={exp.company} onChange={e => handleUpdateListItem('workExperience', exp.id, 'company', e.target.value)} className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                      <input type="text" placeholder="Start Date" value={exp.startDate} onChange={e => handleUpdateListItem('workExperience', exp.id, 'startDate', e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                      <input type="text" placeholder="End Date" value={exp.endDate} onChange={e => handleUpdateListItem('workExperience', exp.id, 'endDate', e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                  </div>
                  <div className="relative">
                      <textarea placeholder="Description" value={exp.description} onChange={e => handleUpdateListItem('workExperience', exp.id, 'description', e.target.value)} rows={4} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"></textarea>
                      <AiAssistant
                        isOpen={aiAssistantOpen === `work-${exp.id}`}
                        onToggle={() => setAiAssistantOpen(aiAssistantOpen === `work-${exp.id}` ? null : `work-${exp.id}`)}
                        onApply={(text) => handleUpdateListItem('workExperience', exp.id, 'description', text)}
                        prompt={`Generate a professional job description for a ${exp.jobTitle} at ${exp.company}. Current description: "${exp.description}". Create 2-3 impactful bullet points with achievements.`}
                        aiSettings={aiSettings}
                        placeholder="AI can write impactful job descriptions"
                      />
                  </div>
                </div>
              ))}
              <button onClick={() => handleAddListItem('workExperience')} className="text-blue-600 font-semibold">+ Add experience</button>
            </>
          );
      case 'education':
        return (
          <>
            {cvData.education.map((edu) => (
              <div key={edu.id} className="p-4 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-800/50 relative group">
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleSaveSection} className="p-1.5 bg-blue-500 text-white rounded-full" aria-label="Save section"><BookmarkIcon className="w-4 h-4"/></button>
                    <button onClick={() => handleRemoveListItem('education', edu.id)} className="p-1.5 bg-red-500 text-white rounded-full" aria-label="Remove education"><TrashIcon className="w-4 h-4"/></button>
                </div>
                <input type="text" placeholder="Degree or Field of Study" value={edu.degree} onChange={e => handleUpdateListItem('education', edu.id, 'degree', e.target.value)} className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                <input type="text" placeholder="School or Institution" value={edu.school} onChange={e => handleUpdateListItem('education', edu.id, 'school', e.target.value)} className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <input type="text" placeholder="Start Date" value={edu.startDate} onChange={e => handleUpdateListItem('education', edu.id, 'startDate', e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                    <input type="text" placeholder="End Date" value={edu.endDate} onChange={e => handleUpdateListItem('education', edu.id, 'endDate', e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                </div>
              </div>
            ))}
            <button onClick={() => handleAddListItem('education')} className="text-blue-600 font-semibold">+ Add education</button>
          </>
        );
      case 'skills':
        return (
            <>
              <div className="grid grid-cols-2 gap-4">
                {cvData.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center">
                    <input type="text" placeholder="Skill" value={skill.name} onChange={e => handleUpdateListItem('skills', skill.id, 'name', e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                    <button onClick={() => handleRemoveListItem('skills', skill.id)} className="ml-2 text-red-500 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" aria-label="Remove skill"><TrashIcon className="w-5 h-5"/></button>
                  </div>
                ))}
              </div>
              <button onClick={() => handleAddListItem('skills')} className="text-blue-600 font-semibold mt-4">+ Add skill</button>
            </>
          );
      case 'projects':
        return (
            <>
              {(cvData.projects || []).map((proj) => (
                <div key={proj.id} className="p-4 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-800/50 relative group">
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleSaveSection} className="p-1.5 bg-blue-500 text-white rounded-full" aria-label="Save section"><BookmarkIcon className="w-4 h-4"/></button>
                    <button onClick={() => handleRemoveListItem('projects', proj.id)} className="p-1.5 bg-red-500 text-white rounded-full" aria-label="Remove project"><TrashIcon className="w-4 h-4"/></button>
                  </div>
                  <input type="text" placeholder="Project Name" value={proj.name} onChange={e => handleUpdateListItem('projects', proj.id, 'name', e.target.value)} className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                  <input type="text" placeholder="Project URL" value={proj.url} onChange={e => handleUpdateListItem('projects', proj.id, 'url', e.target.value)} className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600" />
                  <div className="relative">
                      <textarea placeholder="Description" value={proj.description} onChange={e => handleUpdateListItem('projects', proj.id, 'description', e.target.value)} rows={3} className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"></textarea>
                      <AiAssistant
                        isOpen={aiAssistantOpen === `project-${proj.id}`}
                        onToggle={() => setAiAssistantOpen(aiAssistantOpen === `project-${proj.id}` ? null : `project-${proj.id}`)}
                        onApply={(text) => handleUpdateListItem('projects', proj.id, 'description', text)}
                        prompt={`Write a compelling project description for "${proj.name}". Current description: "${proj.description}". Focus on technologies used and impact achieved.`}
                        aiSettings={aiSettings}
                        placeholder="AI can write compelling project descriptions"
                      />
                  </div>
                </div>
              ))}
              <button onClick={() => handleAddListItem('projects')} className="text-blue-600 font-semibold">+ Add project</button>
            </>
          );
      case 'professionalSummary':
        return (
            <div className="relative">
                <textarea 
                    value={cvData.personalDetails.professionalSummary}
                    onChange={e => handleUpdateField('personalDetails', 'professionalSummary', e.target.value)}
                    rows={8}
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
                    placeholder="Write a compelling professional summary..."
                ></textarea>
                <AiAssistant
                  isOpen={aiAssistantOpen === 'summary'}
                  onToggle={() => setAiAssistantOpen(aiAssistantOpen === 'summary' ? null : 'summary')}
                  onApply={(text) => handleUpdateField('personalDetails', 'professionalSummary', text)}
                  prompt={`Write a professional summary for a ${cvData.personalDetails.jobTitle} with skills in ${cvData.skills.map(s => s.name).join(', ')}. Current summary: "${cvData.personalDetails.professionalSummary}". Make it compelling and concise.`}
                  aiSettings={aiSettings}
                  placeholder="AI can write a compelling professional summary"
                />
            </div>
          );
      default:
        return <div>Select a section to edit.</div>;
    }
  };
  
  return (
    <div className="p-4 h-full overflow-y-auto">
        {modalState?.isOpen && (
            <AiHelperModal 
                prompt={modalState.prompt}
                getSuggestion={() => getAiSuggestion(modalState.prompt)}
                onApply={modalState.onApply}
                onClose={() => setModalState(null)}
            />
        )}
      {renderForm()}
      <div className="flex justify-end items-center gap-3 mt-8">
        <button
          onClick={handlePrevious}
          className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          disabled={sections.findIndex(s => s.id === activeSection) === 0}
        >
          Previous
        </button>
        <button 
          onClick={handleNext} 
          className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
        >
            Next
        </button>
      </div>
    </div>
  );
};