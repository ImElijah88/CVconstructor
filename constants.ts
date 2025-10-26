import type { CVData, CVSection, TemplateId, DynamicTemplate } from './types';
import React from 'react';

export const SECTIONS: { id: CVSection; title: string }[] = [
  { id: 'personalDetails', title: 'Personal details' },
  { id: 'contactInfo', title: 'Contact info' },
  { id: 'professionalSummary', title: 'Professional summary' },
  { id: 'workExperience', title: 'Work experience' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
];

export const OPTIONAL_SECTIONS: { id: CVSection; title: string }[] = [
    { id: 'projects', title: 'Projects' },
];

export const FONT_OPTIONS = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
];

export const LLM_OPTIONS = [
  { name: 'Gemini 2.5 Flash (Default)', value: 'gemini-2.5-flash' },
  { name: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
  { name: 'OpenAI GPT-4o', value: 'gpt-4o' },
  { name: 'OpenAI GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  { name: 'Anthropic Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20240620' },
  { name: 'Anthropic Claude 3 Haiku', value: 'claude-3-haiku-20240307' },
  { name: 'Groq Llama3 8B', value: 'llama3-8b-8192' },
  { name: 'Groq Mixtral 8x7B', value: 'mixtral-8x7b-32768' },
  { name: 'Cohere Command R+', value: 'command-r-plus' },
  { name: 'Mistral Large', value: 'mistral-large-latest' },
];


// FIX: Replaced JSX with React.createElement to support .ts file extension.
// The file contained JSX syntax which is only allowed in .tsx files.
export const TEMPLATES: { id: TemplateId; name: string; thumbnail: React.ReactNode }[] = [
    { 
        id: 'classic', 
        name: 'Classic',
        thumbnail: React.createElement('div', { className: "w-full h-full bg-white border-2 border-blue-500 rounded-md flex" },
            React.createElement('div', { className: "w-1/3 h-full bg-gray-800" }),
            React.createElement('div', { className: "w-2/3 h-full bg-white" })
        )
    },
    { 
        id: 'modern', 
        name: 'Modern',
        thumbnail: React.createElement('div', { className: "w-full h-full bg-gray-100 border-2 border-gray-300 rounded-md p-1 space-y-1" },
            React.createElement('div', { className: "w-full h-3 bg-blue-500 rounded-sm" }),
            React.createElement('div', { className: "w-3/4 h-1 bg-gray-400" }),
            React.createElement('div', { className: "w-1/2 h-1 bg-gray-400" })
        )
    },
    {
        id: 'compact',
        name: 'Compact',
        thumbnail: React.createElement('div', { className: "w-full h-full bg-white border-2 border-gray-400 rounded-md p-2 space-y-1 flex flex-col items-center" },
            React.createElement('div', { className: "w-8 h-8 bg-gray-400 rounded-full" }),
            React.createElement('div', { className: "w-1/2 h-2 my-1 bg-gray-600" }),
            React.createElement('div', { className: "w-3/4 h-1 bg-gray-500" }),
            React.createElement('div', { className: "w-full h-px bg-gray-300 my-1" }),
            React.createElement('div', { className: "w-3/4 h-1 bg-gray-400" }),
            React.createElement('div', { className: "w-full h-1 bg-gray-400" }),
            React.createElement('div', { className: "w-full h-1 bg-gray-400" }),
        )
    },
    {
        id: 'creative',
        name: 'Creative',
        thumbnail: React.createElement('div', { className: "w-full h-full bg-white border-2 border-teal-500 rounded-md flex flex-col" },
            React.createElement('div', { className: "w-full h-1/3 bg-teal-500 flex items-center justify-end p-2" },
                React.createElement('div', {className: "text-right" },
                  React.createElement('div', { className: "w-12 h-2 bg-white rounded-sm" }),
                  React.createElement('div', { className: "w-8 h-1 mt-1 bg-white/80 rounded-sm" }),
                )
            ),
            React.createElement('div', { className: "p-2 space-y-2 flex-grow" },
                React.createElement('div', { className: "w-3/4 h-1 bg-gray-400" }),
                React.createElement('div', { className: "w-1/2 h-1 bg-gray-400" }),
            )
        )
    },
    {
        id: 'executive',
        name: 'Executive',
        thumbnail: React.createElement('div', { className: "w-full h-full bg-white border-2 border-gray-800 rounded-md p-2" },
            React.createElement('div', { className: "border-b-2 border-gray-800 pb-1 mb-2" },
                React.createElement('div', { className: "w-3/4 h-2 bg-gray-800 mb-1" }),
                React.createElement('div', { className: "w-1/2 h-1 bg-gray-600" })
            ),
            React.createElement('div', { className: "space-y-1" },
                React.createElement('div', { className: "w-full h-1 bg-gray-400" }),
                React.createElement('div', { className: "w-5/6 h-1 bg-gray-400" }),
                React.createElement('div', { className: "w-4/5 h-1 bg-gray-400" })
            )
        )
    },
    {
        id: 'professional',
        name: 'Professional',
        thumbnail: React.createElement('div', { className: "w-full h-full bg-white border border-gray-300 rounded-md p-2 text-center" },
            React.createElement('div', { className: "border-b border-gray-300 pb-2 mb-2" },
                React.createElement('div', { className: "w-3/4 h-2 bg-gray-700 mx-auto mb-1" }),
                React.createElement('div', { className: "w-1/2 h-1 bg-gray-500 mx-auto" })
            ),
            React.createElement('div', { className: "space-y-1" },
                React.createElement('div', { className: "w-full h-1 bg-gray-400" }),
                React.createElement('div', { className: "w-5/6 h-1 bg-gray-400 mx-auto" }),
                React.createElement('div', { className: "w-4/5 h-1 bg-gray-400 mx-auto" })
            )
        )
    },
    {
        id: 'minimal',
        name: 'Minimal',
        thumbnail: React.createElement('div', { className: "w-full h-full bg-white border border-black rounded-md p-2" },
            React.createElement('div', { className: "mb-2" },
                React.createElement('div', { className: "w-1/2 h-3 bg-black mb-1" }),
                React.createElement('div', { className: "w-1/3 h-1 bg-gray-600" })
            ),
            React.createElement('div', { className: "space-y-1" },
                React.createElement('div', { className: "w-full h-px bg-black mb-1" }),
                React.createElement('div', { className: "w-full h-1 bg-gray-400" }),
                React.createElement('div', { className: "w-5/6 h-1 bg-gray-400" })
            )
        )
    }
];

export const MOCK_CV_DATA: CVData = {
  personalDetails: {
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Senior Frontend Developer',
    photo: 'https://picsum.photos/200/200',
    professionalSummary: 'Creative and detail-oriented Senior Frontend Developer with over 8 years of experience in building and maintaining responsive web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Passionate about creating intuitive user interfaces and collaborating with cross-functional teams to deliver high-quality products.'
  },
  contactInfo: {
    email: 'jane.doe@example.com',
    phone: '+1 234 567 890',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janedoe',
    website: 'janedoe.dev'
  },
  workExperience: [
    {
      id: 'work1',
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      startDate: '2019',
      endDate: 'Present',
      description: 'Led the development of a new client-facing dashboard using React and TypeScript, resulting in a 20% increase in user engagement. Mentored junior developers and conducted code reviews to maintain high code quality.'
    },
    {
      id: 'work2',
      jobTitle: 'Frontend Developer',
      company: 'Web Innovators',
      startDate: '2016',
      endDate: '2019',
      description: 'Developed and maintained user interfaces for various client websites using HTML, CSS, and JavaScript. Collaborated with designers to implement pixel-perfect designs.'
    }
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      startDate: '2012',
      endDate: '2016'
    }
  ],
  skills: [
    { id: 'skill1', name: 'React' },
    { id: 'skill2', name: 'TypeScript' },
    { id: 'skill3', name: 'JavaScript (ES6+)' },
    { id: 'skill4', name: 'Tailwind CSS' },
    { id: 'skill5', name: 'Node.js' },
    { id: 'skill6', name: 'UI/UX Design' },
  ],
  projects: [
    {
      id: 'proj1',
      name: 'Interactive Resume Builder',
      url: 'github.com/jane-doe/resume-builder',
      description: 'A web application built with React and TypeScript that allows users to create, customize, and download professional resumes. Features AI-powered suggestions for content optimization.'
    }
  ]
};

export const MOCK_CV_DATA_2: CVData = {
  personalDetails: {
    firstName: 'John',
    lastName: 'Smith',
    jobTitle: 'Agile Project Manager',
    photo: 'https://picsum.photos/seed/p2/200/200',
    professionalSummary: 'Results-driven Agile Project Manager with 5+ years of experience leading cross-functional teams to deliver complex projects on time and within budget. Certified ScrumMaster with a proven ability to improve team velocity and stakeholder satisfaction. Expert in JIRA, Confluence, and modern project management methodologies.'
  },
  contactInfo: {
    email: 'john.smith@example.com',
    phone: '+1 987 654 321',
    address: 'Austin, TX',
    linkedin: 'linkedin.com/in/johnsmithpm',
    website: 'johnsmith.io'
  },
  workExperience: [
    {
      id: 'work1_pm',
      jobTitle: 'Project Manager',
      company: 'Innovate Corp.',
      startDate: '2020',
      endDate: 'Present',
      description: 'Managed a portfolio of 5-7 software development projects simultaneously, utilizing Agile and Scrum frameworks. Coordinated with product owners, developers, and QA to ensure clear communication and timely delivery of features. Increased team productivity by 30% by implementing new sprint planning and review processes.'
    },
    {
      id: 'work2_pm',
      jobTitle: 'Scrum Master',
      company: 'Dev Solutions',
      startDate: '2018',
      endDate: '2020',
      description: 'Facilitated all Scrum ceremonies for two development teams. Removed impediments and coached the team on Agile principles, leading to a 15% improvement in sprint velocity.'
    }
  ],
  education: [
    {
      id: 'edu1_pm',
      degree: 'MBA, Project Management',
      school: 'University of Texas at Austin',
      startDate: '2016',
      endDate: '2018'
    }
  ],
  skills: [
    { id: 'skill1_pm', name: 'Agile & Scrum' },
    { id: 'skill2_pm', name: 'JIRA & Confluence' },
    { id: 'skill3_pm', name: 'Risk Management' },
    { id: 'skill4_pm', name: 'Stakeholder Communication' },
    { id: 'skill5_pm', name: 'Budgeting & Forecasting' },
    { id: 'skill6_pm', name: 'Team Leadership' },
  ],
  projects: [
    {
      id: 'proj1_pm',
      name: 'Mobile App Launch',
      url: 'github.com/john-smith/mobile-launch',
      description: 'Led the successful launch of a new flagship mobile application, coordinating marketing, development, and support teams. The project was completed 2 weeks ahead of schedule and achieved 150% of its initial user acquisition goals in the first month.'
    }
  ]
};


export const DEFAULT_DYNAMIC_TEMPLATE: Omit<DynamicTemplate, 'id' | 'name'> = {
  font: 'Inter',
  layout: {
    type: 'two-column',
    mainWidth: 'w-2/3',
    gap: 'gap-8',
  },
  sections: {
    professionalSummary: { area: 'main', order: 1, component: 'default-summary', title: 'Summary' },
    workExperience: { area: 'main', order: 2, component: 'default-experience', title: 'Work Experience' },
    projects: { area: 'main', order: 3, component: 'default-projects', title: 'Projects' },
    contactInfo: { area: 'sidebar', order: 1, component: 'default-contact', title: 'Contact' },
    skills: { area: 'sidebar', order: 2, component: 'compact-skills', title: 'Skills' },
    education: { area: 'sidebar', order: 3, component: 'default-education', title: 'Education' },
  },
  styles: {
    primaryColor: '#2563eb', // blue-600
    headingSize: 'text-3xl',
    subheadingSize: 'text-lg',
    bodySize: 'text-sm',
  }
};