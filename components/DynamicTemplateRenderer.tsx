import React from 'react';
import type { CVData, DynamicTemplate, CVSection, SectionArea, CustomizationOptions } from '../types';
import { TemplateExecutive } from './templates/TemplateExecutive';
import { TemplateProfessional } from './templates/TemplateProfessional';
import { TemplateMinimal } from './templates/TemplateMinimal';

interface DynamicTemplateRendererProps {
  cvData: CVData;
  template: DynamicTemplate;
  customization: CustomizationOptions;
}

const SectionWrapper: React.FC<{ title: string; primaryColor: string; subheadingSize: string; children: React.ReactNode }> = ({ title, primaryColor, subheadingSize, children }) => (
  <section className="mb-6">
    <h2 className={`font-bold uppercase tracking-wider pb-1 border-b-2 mb-3 ${subheadingSize}`} style={{ borderColor: primaryColor, color: primaryColor }}>
      {title}
    </h2>
    {children}
  </section>
);

const withHttp = (url: string) => {
    if (!url) return '#';
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

const renderSectionComponent = (component: string, cvData: CVData, template: DynamicTemplate, primaryColor: string) => {
    const { workExperience, education, skills, projects, contactInfo, personalDetails } = cvData;
    const bodyTextStyle = template.styles.bodySize + ' whitespace-pre-wrap';

    switch (component) {
        case 'default-summary':
            return <p className={bodyTextStyle}>{personalDetails.professionalSummary}</p>;
        case 'default-experience':
            return (
                <div className="space-y-4">
                    {workExperience.map(exp => (
                        <div key={exp.id} className={bodyTextStyle}>
                            <div className="flex justify-between items-baseline">
                                <h3 className={`font-bold ${template.styles.bodySize}`}>{exp.jobTitle}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="italic text-gray-600 dark:text-gray-400">{exp.company}</p>
                            <p className="mt-1">{exp.description}</p>
                        </div>
                    ))}
                </div>
            );
        case 'default-education':
             return (
                <div className="space-y-3">
                    {education.map(edu => (
                        <div key={edu.id} className={bodyTextStyle}>
                        <p className={`font-bold ${template.styles.bodySize}`}>{edu.degree}</p>
                        <p className="text-gray-600 dark:text-gray-400">{edu.school}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </div>
             );
        case 'compact-skills':
             return (
                <ul className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <li key={skill.id} className={`text-xs font-medium px-2.5 py-1 rounded-full`} style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>{skill.name}</li>
                    ))}
                </ul>
             );
        case 'default-projects':
             return (
                <div className="space-y-4">
                    {(projects || []).map(proj => (
                        <div key={proj.id} className={bodyTextStyle}>
                            <h3 className={`font-bold ${template.styles.bodySize}`}>{proj.name}</h3>
                            {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="italic text-gray-600 dark:text-gray-400 hover:underline" style={{ color: primaryColor }}>{proj.url}</a>}
                            <p className="mt-1">{proj.description}</p>
                        </div>
                    ))}
                </div>
             );
        case 'default-contact':
            return (
                <ul className={`space-y-2 break-words ${bodyTextStyle}`}>
                    {contactInfo.email && <li><strong>Email:</strong> {contactInfo.email}</li>}
                    {contactInfo.phone && <li><strong>Phone:</strong> {contactInfo.phone}</li>}
                    {contactInfo.address && <li><strong>Address:</strong> {contactInfo.address}</li>}
                    {contactInfo.linkedin && <li><strong>LinkedIn:</strong> {contactInfo.linkedin}</li>}
                    {contactInfo.website && <li><strong>Website:</strong> <a href={withHttp(contactInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: primaryColor }}>{contactInfo.website}</a></li>}
                </ul>
            );
        default:
            return null;
    }
};

export const DynamicTemplateRenderer: React.FC<DynamicTemplateRendererProps> = ({ cvData, template, customization }) => {
    const { personalDetails } = cvData;
    
    // Prioritize project-level customization over template's default styles
    const primaryColor = customization?.primaryColor || template.styles.primaryColor;
    const fontFamily = customization?.fontFamily || `'${template.font}', sans-serif`;
    
    // We can't dynamically change tailwind classes, so font family needs to be an inline style
    const fontNameForGoogleFonts = template.font.replace(' ', '+');


    const renderArea = (area: SectionArea) => {
        // FIX: Added a type guard to correctly type the 'config' object and filter out undefined values.
        // This resolves the errors where properties like 'area' or 'order' could not be found on type 'unknown'.
        const areaSections = Object.entries(template.sections)
            .filter((entry): entry is [CVSection, NonNullable<DynamicTemplate['sections'][CVSection]>] => {
                const config = entry[1];
                return !!config && config.area === area;
            })
            .sort(([, a], [, b]) => a.order - b.order);
        
        return (
            <div>
                {areaSections.map(([sectionId, config]) => (
                    <SectionWrapper key={sectionId} title={config.title || sectionId} primaryColor={primaryColor} subheadingSize={template.styles.subheadingSize}>
                        {renderSectionComponent(config.component, cvData, template, primaryColor)}
                    </SectionWrapper>
                ))}
            </div>
        );
    };

    return (
        <>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=${fontNameForGoogleFonts}:wght@400;700&display=swap');`}
            </style>
            <div id="print-area" className="w-full bg-white dark:bg-gray-800 shadow-lg p-8 aspect-[210/297] text-gray-800 dark:text-gray-200" style={{ fontFamily }}>
                <header className="text-center mb-8">
                    <h1 className={`font-bold ${template.styles.headingSize}`} style={{ color: primaryColor }}>{personalDetails.firstName} {personalDetails.lastName}</h1>
                    <p className={`text-gray-600 dark:text-gray-400 mt-1 ${template.styles.subheadingSize}`}>{personalDetails.jobTitle}</p>
                </header>

                {template.layout.type === 'single-column' && renderArea('main')}

                {template.layout.type === 'two-column' && (
                    <div className={`grid grid-cols-3 ${template.layout.gap || 'gap-8'}`}>
                        <div className="col-span-2">
                           {renderArea('main')}
                        </div>
                        <div className="col-span-1">
                           {renderArea('sidebar')}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};