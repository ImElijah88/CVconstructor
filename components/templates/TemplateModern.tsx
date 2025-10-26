import React from 'react';
import type { CVData, CustomizationOptions } from '../../types';

interface TemplateProps {
  cvData: CVData;
  customization: CustomizationOptions;
}

const DEFAULT_COLOR = '#2563eb'; // blue-600
const DEFAULT_FONT = 'sans-serif';

const withHttp = (url: string) => {
    if (!url) return '#';
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export const TemplateModern: React.FC<TemplateProps> = ({ cvData, customization }) => {
  const { personalDetails, contactInfo, workExperience, education, skills, projects } = cvData;
  
  const primaryColor = customization?.primaryColor || DEFAULT_COLOR;
  const fontFamily = customization?.fontFamily || DEFAULT_FONT;


  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">{title}</h2>
      {children}
    </section>
  );

  return (
    <div id="print-area" className="w-full bg-white dark:bg-gray-800 shadow-lg p-8 aspect-[210/297] text-gray-800 dark:text-gray-200 text-xs leading-relaxed" style={{ fontFamily }}>
      {/* Header */}
      <header className="flex items-center mb-8">
        {personalDetails.photo && <img src={personalDetails.photo} alt="Profile" className="rounded-full w-24 h-24 mr-6 object-cover" />}
        <div>
          <h1 className="text-4xl font-bold">{personalDetails.firstName} {personalDetails.lastName}</h1>
          <p className="text-lg mt-1" style={{ color: primaryColor }}>{personalDetails.jobTitle}</p>
        </div>
      </header>
      
      <div className="mb-6 border-b border-gray-200 dark:border-gray-600 pb-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {contactInfo.email && <li className="flex-shrink-0"><strong>Email:</strong> {contactInfo.email}</li>}
            {contactInfo.phone && <li className="flex-shrink-0"><strong>Phone:</strong> {contactInfo.phone}</li>}
            {contactInfo.linkedin && <li className="flex-shrink-0"><strong>LinkedIn:</strong> {contactInfo.linkedin}</li>}
            {contactInfo.website && <li className="flex-shrink-0"><strong>Website:</strong> <a href={withHttp(contactInfo.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{contactInfo.website}</a></li>}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="col-span-2">
          <Section title="Profile">
            <p className="whitespace-pre-wrap">{personalDetails.professionalSummary}</p>
          </Section>
          
          <Section title="Experience">
            <div className="space-y-5">
              {workExperience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-sm">{exp.jobTitle}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <p className="italic text-gray-600 dark:text-gray-400">{exp.company}</p>
                  <p className="mt-1 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </Section>

           {(projects && projects.length > 0) && (
            <Section title="Projects">
              <div className="space-y-4">
                {projects.map(proj => (
                  <div key={proj.id}>
                    <h3 className="font-bold text-sm">{proj.name}</h3>
                    {proj.url && <p className="italic text-gray-600 dark:text-gray-400">{proj.url}</p>}
                    <p className="mt-1 whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </Section>
           )}
        </div>
        
        {/* Right Column (Details) */}
        <div className="col-span-1">
          <Section title="Skills">
            <ul className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <li key={skill.id} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>{skill.name}</li>
              ))}
            </ul>
          </Section>
          
          <Section title="Education">
            {education.map(edu => (
              <div key={edu.id} className="mb-3">
                <p className="font-bold text-sm">{edu.degree}</p>
                <p className="text-gray-600 dark:text-gray-400">{edu.school}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
};