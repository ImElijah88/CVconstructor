import React, { useState } from 'react';
import { DownloadIcon, GoogleDriveIcon } from './icons/Icon';

interface DownloadButtonProps {
  onDownloadPDF: () => void;
  onSaveToGoogleDrive: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownloadPDF, onSaveToGoogleDrive }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center"
      >
        <DownloadIcon className="w-4 h-4 mr-2" />
        Download
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1">
            <button
              onClick={() => {
                onDownloadPDF();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 w-full text-left"
            >
              <DownloadIcon className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => {
                onSaveToGoogleDrive();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 w-full text-left"
            >
              <GoogleDriveIcon className="w-4 h-4" />
              Save to Google Drive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};