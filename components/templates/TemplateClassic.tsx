import React from 'react';
import type { CVData, CustomizationOptions } from '../../types';

interface TemplateProps {
  cvData: CVData;
  customization: CustomizationOptions;
}

const DEFAULT_COLOR = '#1d4ed8'; // blue-800
const DEFAULT_FONT = 'sans-serif';

const withHttp = (url: string) => {
    if (!url) return '#';
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export const TemplateClassic: React.FC<TemplateProps> = ({ cvData, customization }) => {
  const { personalDetails, contactInfo, workExperience, education, skills, projects } = cvData;
  
  const primaryColor = customization?.primaryColor || DEFAULT_COLOR;
  const fontFamily = customization?.fontFamily || DEFAULT_FONT;

  return (
    <div id="print-area" className="w-full bg-white dark:bg-gray-800 shadow-lg p-8 aspect-[210/297] text-sm text-gray-800 dark:text-gray-200" style={{ fontFamily }}>
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold" style={{ color: primaryColor }}>{personalDetails.firstName} {personalDetails.lastName}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">{personalDetails.jobTitle}</p>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 border-r pr-6 border-gray-200 dark:border-gray-600">
          {personalDetails.photo && <img src={personalDetails.photo} alt="Profile" className="rounded-full w-32 h-32 mx-auto mb-6 object-cover" />}
          
          <h2 className="text-lg font-bold border-b-2 pb-1 mb-3" style={{ color: primaryColor, borderColor: primaryColor }}>CONTACT</h2>
          <ul className="space-y-2 text-xs break-words">
            {contactInfo.email && <li><strong>Email:</strong> {contactInfo.email}</li>}
            {contactInfo.phone && <li><strong>Phone:</strong> {contactInfo.phone}</li>}
            {contactInfo.address && <li><strong>Address:</strong> {contactInfo.address}</li>}
            {contactInfo.linkedin && <li><strong>LinkedIn:</strong> {contactInfo.linkedin}</li>}
            {contactInfo.website && <li><strong>Website:</strong> <a href={withHttp(contactInfo.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{contactInfo.website}</a></li>}
          </ul>

          <h2 className="text-lg font-bold border-b-2 pb-1 mt-6 mb-3" style={{ color: primaryColor, borderColor: primaryColor }}>SKILLS</h2>
          <ul className="space-y-1 text-xs list-disc list-inside">
            {skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
          </ul>

          <h2 className="text-lg font-bold border-b-2 pb-1 mt-6 mb-3" style={{ color: primaryColor, borderColor: primaryColor }}>EDUCATION</h2>
          {education.map(edu => (
            <div key={edu.id} className="text-xs mb-2">
              <p className="font-bold">{edu.degree}</p>
              <p className="text-gray-600 dark:text-gray-400">{edu.school}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </div>

        <div className="col-span-2">
          <h2 className="text-lg font-bold border-b-2 pb-1 mb-4" style={{ color: primaryColor, borderColor: primaryColor }}>SUMMARY</h2>
          <p className="text-xs mb-6 whitespace-pre-wrap">{personalDetails.professionalSummary}</p>

          <h2 className="text-lg font-bold border-b-2 pb-1 mb-4" style={{ color: primaryColor, borderColor: primaryColor }}>WORK EXPERIENCE</h2>
          <div className="space-y-4">
            {workExperience.map(exp => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.jobTitle}</h3>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="italic text-gray-600 dark:text-gray-400">{exp.company}</p>
                <p className="mt-1 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>

          {(projects && projects.length > 0) && (
            <>
              <h2 className="text-lg font-bold border-b-2 pb-1 mt-6 mb-4" style={{ color: primaryColor, borderColor: primaryColor }}>PROJECTS</h2>
              <div className="space-y-4">
                {projects.map(proj => (
                  <div key={proj.id} className="text-xs">
                    <h3 className="font-bold">{proj.name}</h3>
                    {proj.url && <p className="italic text-gray-600 dark:text-gray-400">{proj.url}</p>}
                    <p className="mt-1 whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};