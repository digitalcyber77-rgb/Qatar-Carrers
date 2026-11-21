export interface JobPosition {
  id: string;
  title: string;
  location: string;
  jobFamily: string;
  subCategory: string;
  employmentType: string;
  postedDate: string;
  referenceCode: string;
  summary: string;
}

export interface DirectApplicationSubmission {
  id: string;
  type: 'direct';
  fullName: string;
  email: string;
  phoneNumbers: string[];
  cvFileName: string;
  cvFileSize: number;
  coverLetter: string;
  submittedAt: string;
}

export interface ModalApplicationSubmission {
  id: string;
  type: 'position';
  positionTitle: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  applicationLetterFileName: string;
  applicationLetterFileSize: number;
  cvFileName: string;
  cvFileSize: number;
  submittedAt: string;
}

export type ApplicationSubmission = DirectApplicationSubmission | ModalApplicationSubmission;

export const OPEN_POSITIONS: JobPosition[] = [
  {
    id: 'pos-cabin-crew-doha',
    title: 'Cabin Crew — International Fleet',
    location: 'Doha, Qatar',
    jobFamily: 'Cabin Crew',
    subCategory: 'Inflight Cabin Service',
    employmentType: 'Full-time',
    postedDate: '2026-11-18',
    referenceCode: 'QR-CC-4821',
    summary:
      'Deliver five-star hospitality and uphold cabin safety standards across international long-haul and regional routes.',
  },
  {
    id: 'pos-cabin-senior',
    title: 'Senior Cabin Crew Lead',
    location: 'London, United Kingdom',
    jobFamily: 'Cabin Crew',
    subCategory: 'Premium Cabin Operations',
    employmentType: 'Full-time',
    postedDate: '2026-11-15',
    referenceCode: 'QR-CC-4790',
    summary:
      'Lead onboard service briefings, mentor junior cabin crew members, and oversee premium-cabin guest experience.',
  },
  {
    id: 'pos-flight-ops',
    title: 'First Officer — A350 Fleet',
    location: 'Doha, Qatar',
    jobFamily: 'Flight Operations',
    subCategory: 'Widebody Flight Deck',
    employmentType: 'Full-time',
    postedDate: '2026-11-12',
    referenceCode: 'QR-FO-3104',
    summary:
      'Operate long-range A350 schedules with strict adherence to international aviation safety and fuel-efficiency protocols.',
  },
  {
    id: 'pos-ground-services',
    title: 'Airport Customer Services Agent',
    location: 'Dubai, UAE',
    jobFamily: 'Customer Service',
    subCategory: 'Airport & Lounge Operations',
    employmentType: 'Full-time',
    postedDate: '2026-11-10',
    referenceCode: 'QR-CS-2298',
    summary:
      'Coordinate seamless passenger check-in, lounge hospitality, and priority boarding for departing international travelers.',
  },
  {
    id: 'pos-engineering',
    title: 'Licensed Aircraft Maintenance Engineer',
    location: 'Singapore',
    jobFamily: 'Engineering',
    subCategory: 'Line & Base Maintenance',
    employmentType: 'Full-time',
    postedDate: '2026-11-05',
    referenceCode: 'QR-EN-1940',
    summary:
      'Perform scheduled inspections, avionics diagnostics, and line turnaround certifications in compliance with EASA standards.',
  },
];

export const LOCATIONS = [
  'Doha, Qatar',
  'London, United Kingdom',
  'Dubai, UAE',
  'Singapore',
  'Nairobi, Kenya',
  'New York, United States',
];

export const JOB_FAMILIES = [
  'Cabin Crew',
  'Flight Operations',
  'Customer Service',
  'Engineering',
  'Corporate & Commercial',
];

export const JOB_SUB_CATEGORIES = [
  'Inflight Cabin Service',
  'Premium Cabin Operations',
  'Widebody Flight Deck',
  'Airport & Lounge Operations',
  'Line & Base Maintenance',
  'Talent & Operations',
];

export const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Bahrain',
  'Bangladesh',
  'Belgium',
  'Brazil',
  'Canada',
  'China',
  'Colombia',
  'Denmark',
  'Egypt',
  'Ethiopia',
  'Finland',
  'France',
  'Germany',
  'Ghana',
  'Greece',
  'India',
  'Indonesia',
  'Ireland',
  'Italy',
  'Japan',
  'Jordan',
  'Kenya',
  'Kuwait',
  'Lebanon',
  'Malaysia',
  'Morocco',
  'Netherlands',
  'New Zealand',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Saudi Arabia',
  'Singapore',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sweden',
  'Switzerland',
  'Tanzania',
  'Thailand',
  'Turkey',
  'Uganda',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Vietnam',
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
