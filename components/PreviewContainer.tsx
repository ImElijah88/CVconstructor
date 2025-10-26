import React from 'react';
import type { CVData, TemplateId, DynamicTemplate, CustomizationOptions } from '../types';
import { TemplateClassic } from './templates/TemplateClassic';
import { TemplateModern } from './templates/TemplateModern';
import { DynamicTemplateRenderer } from './DynamicTemplateRenderer';
import { TemplateCompact } from './templates/TemplateCompact';
import { TemplateCreative } from './templates/TemplateCreative';
import { TemplateExecutive } from './templates/TemplateExecutive';
import { TemplateProfessional } from './templates/TemplateProfessional';
import { TemplateMinimal } from './templates/TemplateMinimal';

interface PreviewContainerProps {
  cvData: CVData;
  templateId: TemplateId;
  customTemplates: DynamicTemplate[];
  customization: CustomizationOptions;
}

export const PreviewContainer: React.FC<PreviewContainerProps> = ({ cvData, templateId, customTemplates, customization }) => {
  
  const renderTemplate = () => {
    const customTemplate = customTemplates.find(t => t.id === templateId);

    if (customTemplate) {
        return <DynamicTemplateRenderer cvData={cvData} template={customTemplate} customization={customization} />;
    }

    switch (templateId) {
      case 'classic':
        return <TemplateClassic cvData={cvData} customization={customization} />;
      case 'modern':
        return <TemplateModern cvData={cvData} customization={customization} />;
      case 'compact':
        return <TemplateCompact cvData={cvData} customization={customization} />;
      case 'creative':
        return <TemplateCreative cvData={cvData} customization={customization} />;
      case 'executive':
        return <TemplateExecutive cvData={cvData} customization={customization} />;
      case 'professional':
        return <TemplateProfessional cvData={cvData} customization={customization} />;
      case 'minimal':
        return <TemplateMinimal cvData={cvData} customization={customization} />;
      default:
        // Fallback to classic if a custom template was deleted but still selected
        return <TemplateClassic cvData={cvData} customization={customization} />;
    }
  }

  return (
    <div className="flex justify-center items-start">
        <div className="w-full max-w-[800px] transform origin-top scale-[0.8] sm:scale-[0.9] md:scale-[0.7] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100">
            {renderTemplate()}
        </div>
    </div>
  );
};