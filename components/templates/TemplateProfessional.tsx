import React from 'react';
import type { CVData, CustomizationOptions } from '../../types';

interface TemplateProps {
  cvData: CVData;
  customization: CustomizationOptions;
}

const DEFAULT_COLOR = '#1f2937';
const DEFAULT_FONT = 'sans-serif';

export const TemplateProfessional: React.FC<TemplateProps> = ({ cvData, customization }) => {
  const { personalDetails, contactInfo, workExperience, education, skills, projects } = cvData;
  
  const primaryColor = customization?.primaryColor || DEFAULT_COLOR;
  const fontFamily = customization?.fontFamily || DEFAULT_FONT;

  return (
    <div id="print-area" className="w-full bg-white shadow-lg p-8 aspect-[210/297] text-sm text-gray-800" style={{ fontFamily }}>
      <header className="text-center mb-8 pb-6 border-b border-gray-300">
        <h1 className="text-4xl font-light mb-2" style={{ color: primaryColor }}>
          {personalDetails.firstName} {personalDetails.lastName}
        </h1>
        <p className="text-xl text-gray-600 mb-4">{personalDetails.jobTitle}</p>
        <div className="flex justify-center space-x-6 text-xs">
          {contactInfo.email && <span>{contactInfo.email}</span>}
          {contactInfo.phone && <span>{contactInfo.phone}</span>}
          {contactInfo.address && <span>{contactInfo.address}</span>}
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-gray-200" style={{ color: primaryColor }}>
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed">{personalDetails.professionalSummary}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-gray-200" style={{ color: primaryColor }}>
          Experience
        </h2>
        <div className="space-y-4">
          {workExperience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-base">{exp.jobTitle}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-sm mt-2 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-gray-200" style={{ color: primaryColor }}>
            Education
          </h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
              <p className="font-semibold">{edu.degree}</p>
              <p className="text-gray-700">{edu.school}</p>
              <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-gray-200" style={{ color: primaryColor }}>
            Skills
          </h2>
          <div className="space-y-1">
            {skills.map(skill => (
              <div key={skill.id} className="text-sm">{skill.name}</div>
            ))}
          </div>
        </section>
      </div>

      {projects && projects.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-3 pb-1 border-b border-gray-200" style={{ color: primaryColor }}>
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map(proj => (
              <div key={proj.id}>
                <h3 className="font-semibold">{proj.name}</h3>
                <p className="text-sm mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};