import React from 'react';
import type { CVData, CustomizationOptions } from '../../types';

interface TemplateProps {
  cvData: CVData;
  customization: CustomizationOptions;
}

const DEFAULT_COLOR = '#000000';
const DEFAULT_FONT = 'sans-serif';

export const TemplateMinimal: React.FC<TemplateProps> = ({ cvData, customization }) => {
  const { personalDetails, contactInfo, workExperience, education, skills, projects } = cvData;
  
  const primaryColor = customization?.primaryColor || DEFAULT_COLOR;
  const fontFamily = customization?.fontFamily || DEFAULT_FONT;

  return (
    <div id="print-area" className="w-full bg-white shadow-lg p-8 aspect-[210/297] text-sm text-black" style={{ fontFamily }}>
      <header className="mb-8">
        <h1 className="text-5xl font-thin mb-1" style={{ color: primaryColor }}>
          {personalDetails.firstName}
        </h1>
        <h1 className="text-5xl font-bold mb-3" style={{ color: primaryColor }}>
          {personalDetails.lastName}
        </h1>
        <p className="text-lg text-gray-700 mb-4">{personalDetails.jobTitle}</p>
        <div className="text-xs space-y-1">
          {contactInfo.email && <div>{contactInfo.email}</div>}
          {contactInfo.phone && <div>{contactInfo.phone}</div>}
          {contactInfo.address && <div>{contactInfo.address}</div>}
          {contactInfo.linkedin && <div>{contactInfo.linkedin}</div>}
        </div>
      </header>

      <section className="mb-8">
        <p className="text-sm leading-relaxed">{personalDetails.professionalSummary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-black pb-1">
          Experience
        </h2>
        <div className="space-y-6">
          {workExperience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold">{exp.jobTitle}</h3>
                <span className="text-xs">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 mb-2">{exp.company}</p>
              <p className="text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-8">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-black pb-1">
            Education
          </h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-4">
              <p className="font-bold text-xs">{edu.degree}</p>
              <p className="text-xs">{edu.school}</p>
              <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-black pb-1">
            Skills
          </h2>
          <div className="space-y-1">
            {skills.map(skill => (
              <div key={skill.id} className="text-xs">{skill.name}</div>
            ))}
          </div>
        </section>

        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-black pb-1">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <h3 className="font-bold text-xs">{proj.name}</h3>
                  <p className="text-xs mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};