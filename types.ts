export interface PersonalDetails {
  firstName: string;
  lastName: string;
  jobTitle: string;
  photo: string | null;
  professionalSummary: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Project {
  id:string;
  name: string;
  description: string;
  url: string;
}

export interface CVData {
  personalDetails: PersonalDetails;
  contactInfo: ContactInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export type CVSection = 'personalDetails' | 'contactInfo' | 'workExperience' | 'skills' | 'education' | 'professionalSummary' | 'projects';

export enum AppView {
    LANDING,
    LOGIN,
    BUILDER
}

export interface User {
  name: string;
  email: string;
  avatarUrl: string | null;
  isGuest: boolean;
}

export type TemplateId = 'classic' | 'modern' | string; // Allow custom template IDs

export interface CustomizationOptions {
  primaryColor?: string;
  fontFamily?: string;
}

export interface ProjectData {
    id: string;
    name: string;
    cvData: CVData;
    templateId: TemplateId;
    updatedAt: string;
    customization?: CustomizationOptions;
}

// Settings for database connection
export type DbType = 'none' | 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';

export interface DbSettings {
    type: DbType;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    connectionString?: string;
    isConnected?: boolean;
}

// Settings for Authentication providers
export interface AuthSettings {
    googleClientId: string;
}

// Settings for AI Provider
export interface AiSettings {
  model: string;
  apiKey: string;
}

// Reusable CV content snippets
export type SnippetData = WorkExperience | Education | Skill | Project;
export type SnippetType = 'workExperience' | 'education' | 'skills' | 'projects';

export interface CVSnippet {
  id: string;
  name: string;
  type: SnippetType;
  data: SnippetData | SnippetData[];
}

// Schema for AI-generated dynamic templates
export type TemplateLayout = 'single-column' | 'two-column';
export type SectionArea = 'main' | 'sidebar';
export type SectionComponent = 'default-summary' | 'default-experience' | 'default-education' | 'compact-skills' | 'default-projects' | 'default-contact'

export interface DynamicTemplate {
    id: string;
    name: string;
    font: string; // e.g., 'Inter', 'Roboto', 'Lato'
    layout: {
        type: TemplateLayout;
        mainWidth?: string; // e.g., 'w-2/3'
        gap?: string; // e.g., 'gap-8'
    };
    sections: {
        [key in CVSection]?: {
            area: SectionArea;
            order: number;
            component: SectionComponent;
            title?: string;
        }
    };
    styles: {
        primaryColor: string; // hex, e.g., '#3b82f6'
        headingSize: string; // tailwind class, e.g., 'text-2xl'
        subheadingSize: string; // tailwind class, e.g., 'text-lg'
        bodySize: string; // tailwind class, e.g., 'text-sm'
    }
}