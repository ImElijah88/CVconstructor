import { CVData, WorkExperience, Education, Skill, Project } from '../types';

// A type for the JSON Resume schema (a simplified version)
interface JsonResume {
    basics?: {
        name?: string;
        label?: string;
        image?: string;
        picture?: string;
        email?: string;
        phone?: string;
        url?: string;
        summary?: string;
        location?: {
            address?: string;
            postalCode?: string;
            city?: string;
            countryCode?: string;
            region?: string;
        };
        profiles?: {
            network?: string;
            username?: string;
            url?: string;
        }[];
    };
    work?: {
        name?: string; // Company name
        company?: string; // Alias for name
        position?: string;
        website?: string;
        startDate?: string;
        endDate?: string;
        summary?: string;
        highlights?: string[];
    }[];
    education?: {
        institution?: string;
        area?: string;
        studyType?: string;
        startDate?: string;
        endDate?: string;
    }[];
    skills?: {
        name?: string;
        keywords?: string[];
    }[];
    projects?: {
        name?: string;
        description?: string;
        highlights?: string[];
        url?: string;
    }[];
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    // JSON resume can have just a year, or YYYY-MM-DD.
    // If it's just a number, assume it's a year.
    if (/^\d{4}$/.test(dateStr)) {
        return dateStr;
    }
    try {
        const date = new Date(dateStr);
        return date.getFullYear().toString();
    } catch (e) {
        return dateStr;
    }
};

export const mapJsonResumeToCvData = (jsonResume: JsonResume): CVData => {
    const basics = jsonResume.basics || {};
    const nameParts = basics.name?.split(' ') || ['',''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const addressParts = [
        basics.location?.address,
        basics.location?.city,
        basics.location?.region,
        basics.location?.postalCode,
    ].filter(Boolean);
    const address = addressParts.join(', ');
    
    const linkedinProfile = basics.profiles?.find(p => p.network?.toLowerCase() === 'linkedin');

    const cvData: CVData = {
        personalDetails: {
            firstName: firstName,
            lastName: lastName,
            jobTitle: basics.label || '',
            photo: basics.image || basics.picture || null,
            professionalSummary: basics.summary || '',
        },
        contactInfo: {
            email: basics.email || '',
            phone: basics.phone || '',
            address: address,
            linkedin: linkedinProfile?.url || '',
            website: basics.url || '',
        },
        workExperience: (jsonResume.work || []).map((w): WorkExperience => ({
            id: uuidv4(),
            jobTitle: w.position || '',
            company: w.name || w.company || '',
            startDate: formatDate(w.startDate),
            endDate: formatDate(w.endDate),
            description: [w.summary, ...(w.highlights || [])].filter(Boolean).join('\n- '),
        })),
        education: (jsonResume.education || []).map((e): Education => ({
            id: uuidv4(),
            degree: [e.studyType, e.area].filter(Boolean).join(' in '),
            school: e.institution || '',
            startDate: formatDate(e.startDate),
            endDate: formatDate(e.endDate),
        })),
        skills: (jsonResume.skills || []).reduce((acc: Skill[], s) => {
            if (s.name) {
                acc.push({ id: uuidv4(), name: s.name });
            }
            if (s.keywords) {
                s.keywords.forEach(kw => acc.push({ id: uuidv4(), name: kw }));
            }
            return acc;
        }, []),
        projects: (jsonResume.projects || []).map((p): Project => ({
            id: uuidv4(),
            name: p.name || '',
            url: p.url || '',
            description: [p.description, ...(p.highlights || [])].filter(Boolean).join('\n- '),
        })),
    };

    return cvData;
};