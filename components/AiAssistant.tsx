import React, { useState } from 'react';
import { generateWithGemini } from '../services/geminiService';
import { AiSettings } from '../types';

interface AiAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onApply: (text: string) => void;
  prompt: string;
  aiSettings: AiSettings;
  placeholder?: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ 
  isOpen, 
  onToggle, 
  onApply, 
  prompt, 
  aiSettings,
  placeholder = "AI will help you write this section..."
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleGenerate = async () => {
    if (!aiSettings.apiKey) {
      alert('Please set your AI API key in Settings first.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await generateWithGemini(prompt, aiSettings.model, aiSettings.apiKey);
      setSuggestion(result);
    } catch (error) {
      console.error('AI generation failed:', error);
      setSuggestion('Failed to generate suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    onApply(suggestion);
    setSuggestion('');
    onToggle();
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="absolute top-2 right-2 p-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        title="Get AI help"
      >
        <img src="./logo.png" alt="AI" className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="absolute top-0 right-0 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src="./logo.png" alt="AI" className="w-5 h-5" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <button onClick={onToggle} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          ✕
        </button>
      </div>

      {!suggestion && !isLoading && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{placeholder}</p>
          <button
            onClick={handleGenerate}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
          >
            Generate with AI
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mb-3">
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>
      )}

      {suggestion && !isLoading && (
        <div className="mb-3">
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            rows={6}
            className="w-full p-2 text-sm border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleApply}
              className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
            >
              Apply
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};