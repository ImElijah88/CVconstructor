import React from 'react';
import type { CVData, CustomizationOptions } from '../../types';

interface TemplateProps {
  cvData: CVData;
  customization: CustomizationOptions;
}

const DEFAULT_COLOR = '#374151';
const DEFAULT_FONT = 'serif';

const withHttp = (url: string) => {
    if (!url) return '#';
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export const TemplateExecutive: React.FC<TemplateProps> = ({ cvData, customization }) => {
  const { personalDetails, contactInfo, workExperience, education, skills, projects } = cvData;
  
  const primaryColor = customization?.primaryColor || DEFAULT_COLOR;
  const fontFamily = customization?.fontFamily || DEFAULT_FONT;

  return (
    <div id="print-area" className="w-full bg-white shadow-lg p-8 aspect-[210/297] text-sm text-gray-800" style={{ fontFamily }}>
      <header className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
          {personalDetails.firstName} {personalDetails.lastName}
        </h1>
        <p className="text-lg text-gray-600 mt-1 uppercase tracking-wider">{personalDetails.jobTitle}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-xs">
          {contactInfo.email && <span>{contactInfo.email}</span>}
          {contactInfo.phone && <span>{contactInfo.phone}</span>}
          {contactInfo.address && <span>{contactInfo.address}</span>}
          {contactInfo.linkedin && <span>{contactInfo.linkedin}</span>}
        </div>
      </header>

      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wide mb-2" style={{ color: primaryColor }}>Executive Summary</h2>
        <p className="text-sm leading-relaxed">{personalDetails.professionalSummary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wide mb-3" style={{ color: primaryColor }}>Professional Experience</h2>
        <div className="space-y-4">
          {workExperience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base">{exp.jobTitle}</h3>
                <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="font-semibold text-gray-700 mb-2">{exp.company}</p>
              <p className="text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide mb-3" style={{ color: primaryColor }}>Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
              <p className="font-bold">{edu.degree}</p>
              <p className="text-gray-700">{edu.school}</p>
              <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide mb-3" style={{ color: primaryColor }}>Core Competencies</h2>
          <div className="grid grid-cols-2 gap-1">
            {skills.map(skill => (
              <div key={skill.id} className="text-sm">• {skill.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};