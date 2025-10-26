import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { SettingsIcon, LogoutIcon, UserCircleIcon, BookmarkIcon, SaveIcon, EyeIcon, EyeSlashIcon } from './icons/Icon';
import { DownloadButton } from './DownloadButton';

interface NavbarProps {
    user: User | null;
    theme: string;
    toggleTheme: () => void;
    onSettingsClick: () => void;
    onLogout: () => void;
    onProfileClick: () => void;
    isDirty: boolean;
    isSaving: boolean;
    showSaveConfirmation: boolean;
    onSaveProject: () => void;
    onTemplatesClick: () => void;
    isPreviewHidden: boolean;
    onHidePreview: () => void;
    onDownloadPDF: () => void;
    onSaveToGoogleDrive: () => void;
}

const UserAvatar: React.FC<{ user: User | null }> = ({ user }) => {
    if (!user) return <UserCircleIcon className="w-9 h-9 text-gray-400" />;

    if (user.isGuest || !user.avatarUrl) {
      const initials = user?.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'GU';
      return (
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm border-2 border-slate-400">
            {initials}
        </div>
      );
    }
    return <img src={user.avatarUrl} alt="User Avatar" className="w-9 h-9 rounded-full border-2 border-slate-400" />;
};


export const Navbar: React.FC<NavbarProps> = (props) => {
    const { 
        user, theme, toggleTheme, onSettingsClick, 
        onLogout, onProfileClick, isDirty, isSaving, showSaveConfirmation,
        onSaveProject, onTemplatesClick, isPreviewHidden, onHidePreview,
        onDownloadPDF, onSaveToGoogleDrive
    } = props;

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const SaveButtonText = () => {
      if (isSaving) return 'Saving...';
      if (showSaveConfirmation) return 'Saved!';
      return 'Save';
    };

    return (
        <header className="h-16 flex-shrink-0 flex justify-between items-center px-4 border-b border-slate-700 bg-slate-800">
            {/* Left Side */}
            <div className="flex items-center gap-1 md:gap-2">
                <h1 className="text-xl font-bold">CV Constructor</h1>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
                <div className="relative" ref={profileMenuRef}>
                    <button onClick={() => setIsProfileMenuOpen(p => !p)} className="flex items-center">
                       <UserAvatar user={user} />
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1">
                                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-slate-600">
                                    <p className="font-semibold">{user?.name}</p>
                                    {!user?.isGuest && <p className="text-xs truncate">{user?.email}</p>}
                                </div>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onProfileClick(); setIsProfileMenuOpen(false); }}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                                >
                                    <BookmarkIcon className="w-4 h-4" />
                                    My Snippets
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onLogout(); setIsProfileMenuOpen(false); }}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                                >
                                    <LogoutIcon className="w-4 h-4" />
                                    Logout
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                  onClick={onSaveProject} 
                  disabled={!isDirty || isSaving}
                  className={`px-4 py-2 text-sm font-semibold rounded-md flex items-center transition-colors
                    ${showSaveConfirmation ? 'bg-green-600' : 'bg-blue-600'}
                    ${!isDirty || isSaving ? 'bg-slate-500 cursor-not-allowed' : 'hover:bg-blue-700'}
                  `}
                >
                  <SaveIcon className="w-4 h-4 mr-2" /> 
                  <SaveButtonText />
                </button>
                
                <DownloadButton 
                  onDownloadPDF={onDownloadPDF}
                  onSaveToGoogleDrive={onSaveToGoogleDrive}
                />
                
                <button 
                  onClick={onTemplatesClick} 
                  className="px-4 py-2 text-sm font-medium rounded-md bg-slate-700 hover:bg-slate-600"
                >
                  Templates
                </button>

                <button 
                  onClick={onHidePreview} 
                  className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700"
                >
                    {isPreviewHidden ? 'Show Preview' : 'Hide Preview'}
                </button>
                
                <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-slate-700" aria-label="Settings">
                    <SettingsIcon className="w-5 h-5" />
                </button>

                <ThemeToggle theme={theme} toggleTheme={toggleTheme} variant="minimal" />
                 <button onClick={onLogout} className="p-2 rounded-full hover:bg-slate-700" aria-label="Logout">
                    <LogoutIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
