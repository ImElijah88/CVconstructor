import React from 'react';
import { ChevronLeftIcon } from './icons/Icon';
import { CustomizationOptions } from '../types';
import { FONT_OPTIONS } from '../constants';

interface TemplateCustomizerProps {
  customization: CustomizationOptions;
  onUpdateCustomization: (options: CustomizationOptions) => void;
  onBack: () => void;
  onBackToTemplates: () => void;
}

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({ 
    customization, 
    onUpdateCustomization, 
    onBack,
    onBackToTemplates
}) => {

  const handleUpdate = (field: keyof CustomizationOptions, value: string) => {
    onUpdateCustomization({ ...customization, [field]: value });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <header className="mb-4">
        <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to editor
        </button>
      </header>
      <h2 className="text-xl font-bold mb-1">Customize</h2>
      <p className="text-sm text-gray-500 mb-4">Fine-tune your template's style.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Accent Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customization.primaryColor || '#000000'}
              onChange={(e) => handleUpdate('primaryColor', e.target.value)}
              className="w-10 h-10 p-0 border-none rounded-md cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={customization.primaryColor || ''}
              onChange={(e) => handleUpdate('primaryColor', e.target.value)}
              placeholder="#2563eb"
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Font Family
          </label>
          <select
            id="font-family"
            value={customization.fontFamily || ''}
            onChange={(e) => handleUpdate('fontFamily', e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Default</option>
            {FONT_OPTIONS.map(font => (
                <option key={font.name} value={font.value}>{font.name}</option>
            ))}
          </select>
        </div>
      </div>

       <button onClick={onBackToTemplates} className="mt-auto text-center text-sm font-semibold text-blue-600 hover:underline">
          Choose a different template
      </button>

    </div>
  );
};
