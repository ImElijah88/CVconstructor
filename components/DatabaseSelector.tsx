import React, { useState } from 'react';
import { DatabaseConfig } from '../services/mcpService';

interface DatabaseSelectorProps {
  onConnect: (config: DatabaseConfig) => void;
  isConnecting: boolean;
}

export const DatabaseSelector: React.FC<DatabaseSelectorProps> = ({ onConnect, isConnecting }) => {
  const [selectedType, setSelectedType] = useState<DatabaseConfig['type']>('postgresql');
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: 'cv_database',
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect({ ...config, type: selectedType });
  };

  const updateConfig = (field: keyof DatabaseConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Connect Database</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Database Type</label>
          <select 
            value={selectedType}
            onChange={(e) => {
              const type = e.target.value as DatabaseConfig['type'];
              setSelectedType(type);
              setConfig(prev => ({ 
                ...prev, 
                type,
                port: type === 'postgresql' ? 5432 : type === 'mysql' ? 3306 : type === 'mongodb' ? 27017 : undefined
              }));
            }}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
            <option value="mongodb">MongoDB</option>
          </select>
        </div>

        {selectedType !== 'sqlite' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Host</label>
              <input
                type="text"
                value={config.host || ''}
                onChange={(e) => updateConfig('host', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="localhost"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Port</label>
              <input
                type="number"
                value={config.port || ''}
                onChange={(e) => updateConfig('port', parseInt(e.target.value))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={config.username || ''}
                onChange={(e) => updateConfig('username', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={config.password || ''}
                onChange={(e) => updateConfig('password', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            {selectedType === 'sqlite' ? 'Database File' : 'Database Name'}
          </label>
          <input
            type="text"
            value={config.database}
            onChange={(e) => updateConfig('database', e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            placeholder={selectedType === 'sqlite' ? 'cv_data.db' : 'cv_database'}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isConnecting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect Database'}
        </button>
      </form>
    </div>
  );
};