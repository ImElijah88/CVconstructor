import React, { useRef } from 'react';
import { ChevronLeftIcon, MagicWandIcon, DocumentIcon } from './icons/Icon';
import { TEMPLATES } from '../constants';
import { TemplateId, DynamicTemplate } from '../types';

interface TemplateSidebarProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onBack: () => void;
  onAiCreate: () => void;
  customTemplates: DynamicTemplate[];
  onAddCustomTemplate: (template: DynamicTemplate) => void;
}

export const TemplateSidebar: React.FC<TemplateSidebarProps> = ({ 
  selectedTemplate, 
  onSelectTemplate, 
  onBack, 
  onAiCreate,
  customTemplates,
  onAddCustomTemplate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const template = JSON.parse(content);
            // TODO: Add more robust validation here
            if (template.id && template.name && template.layout) {
              onAddCustomTemplate(template);
            } else {
              alert('Invalid template file format.');
            }
          }
        } catch (error) {
          console.error("Error parsing template file:", error);
          alert('Failed to read or parse the template file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerFileImport = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="p-4 h-full flex flex-col">
      <header className="mb-4">
        <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to editor
        </button>
      </header>
      <h2 className="text-xl font-bold mb-1">Templates</h2>
      <p className="text-sm text-gray-500 mb-4">Choose a style for your resume.</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={onAiCreate} className="flex flex-col items-center justify-center p-3 text-sm font-medium rounded-lg border-2 border-dashed border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50">
          <MagicWandIcon className="w-6 h-6 mb-1"/>
          Create with AI
        </button>
        <button onClick={triggerFileImport} className="flex flex-col items-center justify-center p-3 text-sm font-medium rounded-lg border-2 border-dashed border-gray-400 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
          <DocumentIcon className="w-6 h-6 mb-1"/>
          Import Template
        </button>
        <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileImport} className="hidden" />
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 -mr-2 pr-2">
        {customTemplates.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 text-sm mb-2">My Templates</h3>
            {customTemplates.map(template => (
              <div key={template.id} className="mb-4">
                <h4 className="font-semibold mb-1 truncate">{template.name}</h4>
                <button
                  onClick={() => onSelectTemplate(template.id)}
                  className={`w-full h-28 p-1 rounded-lg transition-all duration-200 border ${
                    selectedTemplate === template.id ? 'ring-4 ring-blue-500 border-transparent' : 'border-gray-300 dark:border-gray-600 hover:ring-2 hover:ring-blue-400'
                  }`}
                  style={{ backgroundColor: '#f0f0f0' /* A generic background for custom thumbs */}}
                >
                  <div className="w-full h-full bg-white rounded-md flex items-center justify-center text-center p-2">
                    <p className="text-xs text-gray-600">Custom Template: <br/> <span className="font-bold">{template.name}</span></p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-gray-500 dark:text-gray-400 text-sm mb-2">Built-in Templates</h3>
          {TEMPLATES.map(template => (
            <div key={template.id} className="mb-4">
              <h4 className="font-semibold mb-1">{template.name}</h4>
              <button
                onClick={() => onSelectTemplate(template.id)}
                className={`w-full h-32 p-1 rounded-lg transition-all duration-200 ${
                  selectedTemplate === template.id ? 'ring-4 ring-blue-500' : 'ring-1 ring-transparent hover:ring-2 hover:ring-blue-400'
                }`}
              >
                {template.thumbnail}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};