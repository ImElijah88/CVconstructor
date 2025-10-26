import React from 'react';
import type { CVData, CustomizationOptions } from '../../types';
import { MailIcon, PhoneIcon, LinkIcon, GlobeAltIcon } from '../icons/Icon';

interface TemplateProps {
  cvData: CVData;
  customization: CustomizationOptions;
}

const DEFAULT_COLOR = '#374151'; // gray-700
const DEFAULT_FONT = 'sans-serif';

const withHttp = (url: string) => {
    if (!url) return '#';
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export const TemplateCompact: React.FC<TemplateProps> = ({ cvData, customization }) => {
  const { personalDetails, contactInfo, workExperience, education, skills, projects } = cvData;
  
  const primaryColor = customization?.primaryColor || DEFAULT_COLOR;
  const fontFamily = customization?.fontFamily || DEFAULT_FONT;

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-3 border-b-2" style={{ borderColor: primaryColor }}>
        {title}
      </h2>
      <div className="text-xs">{children}</div>
    </section>
  );

  return (
    <div id="print-area" className="w-full bg-white dark:bg-gray-800 shadow-lg p-8 aspect-[210/297] text-gray-800 dark:text-gray-200" style={{ fontFamily }}>
      <header className="text-center mb-6">
        {personalDetails.photo && <img src={personalDetails.photo} alt="Profile" className="rounded-full w-24 h-24 mx-auto mb-4 object-cover" />}
        <h1 className="text-3xl font-bold">{personalDetails.firstName} {personalDetails.lastName}</h1>
        <p className="text-md mt-1" style={{ color: primaryColor }}>{personalDetails.jobTitle}</p>
      </header>

      <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mb-6 text-xs text-gray-600 dark:text-gray-400">
        {contactInfo.email && <div className="flex items-center gap-1"><MailIcon className="w-3 h-3" /> {contactInfo.email}</div>}
        {contactInfo.phone && <div className="flex items-center gap-1"><PhoneIcon className="w-3 h-3" /> {contactInfo.phone}</div>}
        {contactInfo.linkedin && <div className="flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {contactInfo.linkedin}</div>}
        {contactInfo.website && <div className="flex items-center gap-1"><GlobeAltIcon className="w-3 h-3" /> <a href={withHttp(contactInfo.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{contactInfo.website}</a></div>}
      </div>

      <div className="space-y-5">
        <Section title="Summary">
          <p className="whitespace-pre-wrap">{personalDetails.professionalSummary}</p>
        </Section>

        <Section title="Experience">
          <div className="space-y-4">
            {workExperience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.jobTitle} at {exp.company}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="mt-1 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-2 gap-6">
            <div className="col-span-1">
                <Section title="Education">
                    <div className="space-y-3">
                    {education.map(edu => (
                        <div key={edu.id}>
                        <p className="font-bold">{edu.degree}</p>
                        <p className="text-gray-600 dark:text-gray-400">{edu.school}</p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                    </div>
                </Section>
            </div>
            <div className="col-span-1">
                 <Section title="Skills">
                    <ul className="list-disc list-inside">
                        {skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
                    </ul>
                </Section>
            </div>
        </div>

        {(projects && projects.length > 0) && (
          <Section title="Projects">
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <h3 className="font-bold">{proj.name}</h3>
                  {proj.url && <p className="italic text-gray-600 dark:text-gray-400">{proj.url}</p>}
                  <p className="mt-1 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};
