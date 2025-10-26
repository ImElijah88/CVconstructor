import { CVData, WorkExperience, Education, Skill, Project } from '../types';
import { MOCK_CV_DATA } from '../constants'; // For default structure

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// A simple parser for plain text resumes.
// This is a best-effort parser and may not be perfect.
export const mapTextResumeToCvData = (text: string): CVData => {
    console.log('Starting text parsing for:', text.substring(0, 100));
    
    const cvData: CVData = JSON.parse(JSON.stringify(MOCK_CV_DATA)); // Deep copy of a default structure
    // Clear arrays from mock data
    cvData.workExperience = [];
    cvData.education = [];
    cvData.skills = [];
    cvData.projects = [];
    cvData.personalDetails.professionalSummary = '';
    cvData.personalDetails.photo = null; // Remove photo for uploaded resumes

    const lines = text.split('\n').map(line => line.trim());

    // Extract name and title from the top
    if (lines[0]) {
        const nameParts = lines[0].split(' ');
        cvData.personalDetails.firstName = nameParts[0] || '';
        cvData.personalDetails.lastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Look for job title in first few lines
    for (let i = 1; i < Math.min(5, lines.length); i++) {
        const line = lines[i];
        if (line && !line.includes('@') && !line.includes('phone') && !line.includes('linkedin')) {
            cvData.personalDetails.jobTitle = line;
            break;
        }
    }

    const sectionHeaders = [
        'summary', 'profile', 'objective', 'about',
        'experience', 'work experience', 'employment', 'career',
        'education', 'academic', 'qualifications',
        'skills', 'technical skills', 'competencies', 'abilities',
        'projects', 'portfolio',
        'contact', 'contact information'
    ];
    
    let sections: { [key: string]: string[] } = {};
    let currentSection = 'header';
    sections[currentSection] = [];

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        
        let isHeader = false;
        for (const header of sectionHeaders) {
            if (lowerLine.includes(header) || lowerLine.startsWith(header)) {
                currentSection = header
                    .replace('work experience', 'experience')
                    .replace('employment', 'experience')
                    .replace('career', 'experience')
                    .replace('technical skills', 'skills')
                    .replace('competencies', 'skills')
                    .replace('abilities', 'skills')
                    .replace('academic', 'education')
                    .replace('qualifications', 'education')
                    .replace('portfolio', 'projects')
                    .replace('contact information', 'contact')
                    .replace('objective', 'summary')
                    .replace('about', 'summary');
                sections[currentSection] = [];
                isHeader = true;
                break;
            }
        }
        if (!isHeader && line) {
            if (!sections[currentSection]) sections[currentSection] = [];
            sections[currentSection].push(line);
        }
    }

    // Populate CVData from parsed sections
    const summary = sections['summary'] || sections['profile'];
    if (summary) {
        cvData.personalDetails.professionalSummary = summary.join('\n');
    }

    // Extract contact info from any section
    const allText = text.toLowerCase();
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    const phoneMatch = text.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/g);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w\-]+/gi);
    
    if (emailMatch) cvData.contactInfo.email = emailMatch[0];
    if (phoneMatch) cvData.contactInfo.phone = phoneMatch[0].replace(/[^\d\+\-\(\)\s]/g, '');
    if (linkedinMatch) cvData.contactInfo.linkedin = linkedinMatch[0];
    
    const contact = sections['contact'];
    if (contact) {
        contact.forEach(line => {
            if (line.toLowerCase().includes('email') && line.includes(':')) {
                cvData.contactInfo.email = line.split(':')[1]?.trim() || cvData.contactInfo.email;
            }
            if (line.toLowerCase().includes('phone') && line.includes(':')) {
                cvData.contactInfo.phone = line.split(':')[1]?.trim() || cvData.contactInfo.phone;
            }
            if (line.toLowerCase().includes('linkedin') && line.includes(':')) {
                cvData.contactInfo.linkedin = line.split(':')[1]?.trim() || cvData.contactInfo.linkedin;
            }
        });
    }

    const experience = sections['experience'];
    if (experience && experience.length > 0) {
        // Try to parse individual job entries
        let currentJob: Partial<WorkExperience> = {};
        let jobDescription: string[] = [];
        
        for (const line of experience) {
            // Look for job title patterns (usually first line or contains keywords)
            if (line.match(/^[A-Z][\w\s]+(?:Manager|Developer|Engineer|Analyst|Specialist|Director|Lead|Senior|Junior)/i)) {
                if (currentJob.jobTitle) {
                    // Save previous job
                    cvData.workExperience.push({
                        id: uuidv4(),
                        jobTitle: currentJob.jobTitle || 'Position',
                        company: currentJob.company || 'Company',
                        startDate: currentJob.startDate || '',
                        endDate: currentJob.endDate || '',
                        description: jobDescription.join('\n'),
                    });
                    jobDescription = [];
                }
                currentJob = { jobTitle: line };
            } else if (line.match(/\d{4}/) && !currentJob.startDate) {
                // Extract dates
                const dates = line.match(/\d{4}/g);
                if (dates) {
                    currentJob.startDate = dates[0];
                    currentJob.endDate = dates[1] || 'Present';
                }
            } else if (line && !currentJob.company && !line.match(/^[•\-\*]/)) {
                // Likely company name
                currentJob.company = line;
            } else if (line) {
                // Job description
                jobDescription.push(line);
            }
        }
        
        // Add the last job
        if (currentJob.jobTitle) {
            cvData.workExperience.push({
                id: uuidv4(),
                jobTitle: currentJob.jobTitle || 'Position',
                company: currentJob.company || 'Company',
                startDate: currentJob.startDate || '',
                endDate: currentJob.endDate || '',
                description: jobDescription.join('\n'),
            });
        }
        
        // Fallback: if no structured jobs found, create one entry
        if (cvData.workExperience.length === 0) {
            cvData.workExperience.push({
                id: uuidv4(),
                jobTitle: 'Imported Experience',
                company: 'Company',
                startDate: '',
                endDate: '',
                description: experience.join('\n'),
            });
        }
    }

    const education = sections['education'];
    if (education) {
        // FIX: Replaced spread of a string with property assignment.
        cvData.education.push({
            id: uuidv4(),
            degree: education.join('\n'),
            school: '',
            startDate: '',
            endDate: '',
        });
    }

    const skills = sections['skills'];
    if (skills && skills.length > 0) {
        // Split by common delimiters
        const allSkillsText = skills.join(' ');
        const skillsList = allSkillsText
            .split(/[,•\-\*\n]|\s{2,}/)
            .map(s => s.trim())
            .filter(s => s && s.length > 1 && s.length < 30)
            .slice(0, 20); // Limit to 20 skills
            
        cvData.skills = skillsList.map(skillName => ({
            id: uuidv4(),
            name: skillName,
        }));
    }
    
    const projects = sections['projects'];
    if (projects) {
         cvData.projects.push({
            id: uuidv4(),
            name: 'Imported Project',
            url: '',
            description: projects.join('\n'),
        });
    }

    console.log('Final parsed CV data:', cvData);
    return cvData;
};