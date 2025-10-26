import React from 'react';
import type { CVData, CustomizationOptions } from '../../types';

interface TemplateProps {
  cvData: CVData;
  customization: CustomizationOptions;
}

const DEFAULT_COLOR = '#0d9488'; // teal-600
const DEFAULT_FONT = 'sans-serif';

const withHttp = (url: string) => {
    if (!url) return '#';
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export const TemplateCreative: React.FC<TemplateProps> = ({ cvData, customization }) => {
  const { personalDetails, contactInfo, workExperience, education, skills, projects } = cvData;
  
  const primaryColor = customization?.primaryColor || DEFAULT_COLOR;
  const fontFamily = customization?.fontFamily || DEFAULT_FONT;

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>{title}</h2>
      {children}
    </section>
  );

  return (
    <div id="print-area" className="w-full bg-white dark:bg-gray-800 shadow-lg aspect-[210/297] text-gray-800 dark:text-gray-200 text-xs leading-relaxed" style={{ fontFamily }}>
      {/* Header */}
      <header className="p-8 flex justify-between items-center" style={{ backgroundColor: primaryColor }}>
        <div>
          <h1 className="text-4xl font-bold text-white">{personalDetails.firstName}</h1>
          <h1 className="text-4xl font-bold text-white">{personalDetails.lastName}</h1>
          <p className="text-lg mt-2 text-white/90">{personalDetails.jobTitle}</p>
        </div>
        {personalDetails.photo && <img src={personalDetails.photo} alt="Profile" className="rounded-full w-28 h-28 object-cover border-4 border-white/50" />}
      </header>
      
      <main className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column (Main Content) */}
          <div className="col-span-2">
            <Section title="About Me">
              <p className="whitespace-pre-wrap">{personalDetails.professionalSummary}</p>
            </Section>
            
            <Section title="Experience">
              <div className="space-y-5">
                {workExperience.map(exp => (
                  <div key={exp.id} className="relative pl-4">
                     <div className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></div>
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
            <Section title="Contact">
                <ul className="space-y-2 text-xs break-words">
                    {contactInfo.email && <li><strong>Email:</strong> {contactInfo.email}</li>}
                    {contactInfo.phone && <li><strong>Phone:</strong> {contactInfo.phone}</li>}
                    {contactInfo.address && <li><strong>Address:</strong> {contactInfo.address}</li>}
                    {contactInfo.linkedin && <li><strong>LinkedIn:</strong> {contactInfo.linkedin}</li>}
                    {contactInfo.website && <li><strong>Website:</strong> <a href={withHttp(contactInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: primaryColor }}>{contactInfo.website}</a></li>}
                </ul>
            </Section>

            <Section title="Skills">
              <ul className="space-y-1">
                {skills.map(skill => (
                  <li key={skill.id}>{skill.name}</li>
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
      </main>
    </div>
  );
};
