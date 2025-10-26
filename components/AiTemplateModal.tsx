import React, { useState } from 'react';
import type { DynamicTemplate, AiSettings } from '../types';
import { generateTemplateJson } from '../services/geminiService';
import { SparklesIcon } from './icons/Icon';
import { DEFAULT_DYNAMIC_TEMPLATE } from '../constants';

interface AiTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: DynamicTemplate) => void;
  aiSettings: AiSettings;
}

export const AiTemplateModal: React.FC<AiTemplateModalProps> = ({ isOpen, onClose, onTemplateCreated, aiSettings }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
        setError('Please enter a description for your template.');
        return;
    }
    setIsLoading(true);
    setError(null);
    
    const result = await generateTemplateJson(prompt, aiSettings.model, aiSettings.apiKey);

    setIsLoading(false);
    if ('error' in result) {
        setError(result.error);
    } else {
        // Here you might want to merge with a default template to ensure all fields are present
        const finalTemplate = { ...DEFAULT_DYNAMIC_TEMPLATE, ...result, id: result.id, name: result.name };
        onTemplateCreated(finalTemplate as DynamicTemplate);
        onClose();
        setPrompt('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-2">Create Template with AI</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Describe the resume template you want to create. Be descriptive! Try things like:
          <em className="block my-1 text-xs">"A clean, single-column template with a modern green accent color and a professional serif font like 'Merriweather'."</em>
        </p>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A minimalist two-column layout with a dark sidebar and orange highlights..."
            rows={4}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-md border dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleGenerate} 
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center w-36 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Generate
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};