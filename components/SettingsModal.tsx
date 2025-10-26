import React, { useState } from 'react';
import { DbSettings, DbType, AuthSettings, AiSettings } from '../types';
import { LLM_OPTIONS } from '../constants';
import { EyeIcon, EyeSlashIcon } from './icons/Icon';
import { DatabaseSelector } from './DatabaseSelector';
import { mcpService, DatabaseConfig } from '../services/mcpService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAiSettings: AiSettings;
  onSaveAiSettings: (settings: AiSettings) => void;
  currentDbSettings: DbSettings;
  onSaveDbSettings: (settings: DbSettings) => void;
  currentAuthSettings: AuthSettings;
  onSaveAuthSettings: (settings: AuthSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    currentAiSettings, onSaveAiSettings,
    currentDbSettings, onSaveDbSettings,
    currentAuthSettings, onSaveAuthSettings,
}) => {
  const [aiSettings, setAiSettings] = useState(currentAiSettings);
  const [dbSettings, setDbSettings] = useState<DbSettings>(currentDbSettings);
  const [googleClientId, setGoogleClientId] = useState(currentAuthSettings.googleClientId);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDatabaseSelector, setShowDatabaseSelector] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveAiSettings(aiSettings);
    onSaveDbSettings(dbSettings);
    onSaveAuthSettings({ googleClientId });
    onClose();
  };

  const handleDatabaseConnect = async (config: DatabaseConfig) => {
    setIsConnecting(true);
    try {
      const connected = await mcpService.connectToDatabase(config);
      if (connected) {
        setDbSettings({
          type: config.type,
          host: config.host,
          port: config.port,
          database: config.database,
          username: config.username,
          password: config.password,
          isConnected: true
        });
        setShowDatabaseSelector(false);
      }
    } catch (error) {
      console.error('Database connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectDatabase = () => {
    setDbSettings({ type: 'none', isConnected: false });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-semibold p-6 pb-4 flex-shrink-0">Settings</h3>
        
        <div className="flex-grow overflow-y-auto px-6 space-y-6">
            {/* AI Settings Section */}
            <div>
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Provider Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="ai-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        LLM Model
                    </label>
                    <select
                        id="ai-model"
                        value={aiSettings.model}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    >
                        {LLM_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.name}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        API Key
                    </label>
                    <div className="relative">
                      <input
                          id="api-key"
                          type={isApiKeyVisible ? 'text' : 'password'}
                          value={aiSettings.apiKey}
                          onChange={(e) => setAiSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                          placeholder="Enter your API key for the selected model"
                          className="w-full p-2 pr-10 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <button 
                        type="button" 
                        onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        aria-label={isApiKeyVisible ? "Hide API key" : "Show API key"}
                      >
                        {isApiKeyVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Your key is stored securely in your browser's local storage.</p>
                  </div>
                </div>
            </div>
            {/* Authentication Settings Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                 <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Authentication</h4>
                 <p className="text-xs text-gray-500 mb-3">Provide your own Google OAuth 2.0 credentials to enable the Google Sign-In functionality.</p>
                 <div>
                    <label htmlFor="google-client-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Google Client ID
                    </label>
                    <input
                        id="google-client-id"
                        type="text"
                        value={googleClientId}
                        onChange={(e) => setGoogleClientId(e.target.value)}
                        placeholder="Enter your Google OAuth Client ID"
                        className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">You must create your own OAuth 2.0 credentials in the Google Cloud Console for this feature to work.</p>
                 </div>
            </div>
            {/* Database Settings Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                 <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Database Integration (MCP)</h4>
                 <p className="text-xs text-gray-500 mb-3">Connect to your database using Model Context Protocol (MCP) servers.</p>
                 
                 {dbSettings.isConnected ? (
                   <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm font-medium text-green-800 dark:text-green-200">
                           Connected to {dbSettings.type?.toUpperCase()}
                         </p>
                         <p className="text-xs text-green-600 dark:text-green-300">
                           Database: {dbSettings.database}
                         </p>
                       </div>
                       <button
                         onClick={handleDisconnectDatabase}
                         className="text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                       >
                         Disconnect
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     {!showDatabaseSelector ? (
                       <button
                         onClick={() => setShowDatabaseSelector(true)}
                         className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                       >
                         <span className="text-sm text-gray-600 dark:text-gray-400">
                           Click to connect a database
                         </span>
                       </button>
                     ) : (
                       <div>
                         <DatabaseSelector 
                           onConnect={handleDatabaseConnect}
                           isConnecting={isConnecting}
                         />
                         <button
                           onClick={() => setShowDatabaseSelector(false)}
                           className="mt-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                         >
                           Cancel
                         </button>
                       </div>
                     )}
                   </div>
                 )}
            </div>
        </div>
        <div className="flex-shrink-0 flex justify-end gap-3 p-6 pt-4 border-t dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 rounded-md border dark:border-gray-600 font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};
