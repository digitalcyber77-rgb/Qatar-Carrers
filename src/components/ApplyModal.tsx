import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import {
  COUNTRIES,
  JobPosition,
  ModalApplicationSubmission,
  formatFileSize,
} from '../data/careersData';
import { FileAttachmentField } from './FileAttachmentField';

interface ApplyModalProps {
  isOpen: boolean;
  position: JobPosition | null;
  onClose: () => void;
  onSubmitApplication: (submission: ModalApplicationSubmission) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  applicationLetter?: string;
  cv?: string;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  position,
  onClose,
  onSubmitApplication,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [applicationLetterFile, setApplicationLetterFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedRecord, setSubmittedRecord] = useState<ModalApplicationSubmission | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSubmittedRecord(null);
      setErrors({});
    }
  }, [isOpen, position?.id]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!phoneNumber.trim() || phoneNumber.replace(/[^\d+]/g, '').length < 7) {
      nextErrors.phoneNumber = 'Please enter a valid phone number.';
    }
    if (!country) {
      nextErrors.country = 'Please select your country of residence.';
    }
    if (!applicationLetterFile) {
      nextErrors.applicationLetter = 'Please attach your application letter.';
    }
    if (!cvFile) {
      nextErrors.cv = 'Please attach your CV.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !applicationLetterFile || !cvFile) return;

    const record: ModalApplicationSubmission = {
      id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'position',
      positionTitle: position ? position.title : 'General Candidate Application',
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      country,
      applicationLetterFileName: applicationLetterFile.name,
      applicationLetterFileSize: applicationLetterFile.size,
      cvFileName: cvFile.name,
      cvFileSize: cvFile.size,
      submittedAt: new Date().toISOString(),
    };

    onSubmitApplication(record);
    setSubmittedRecord(record);
    setName('');
    setEmail('');
    setPhoneNumber('');
    setCountry('');
    setApplicationLetterFile(null);
    setCvFile(null);
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[600px] bg-white rounded-xl border border-[#E6E8EC] shadow-xl my-auto overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-7 pt-6 pb-5 border-b border-[#ECEEF2]">
          <div>
            <p className="text-xs font-medium text-[#5A606B] mb-1">
              {position ? `${position.location} · ${position.referenceCode}` : 'Open Candidate Pool'}
            </p>
            <h2
              id="apply-modal-title"
              className="font-display text-[26px] leading-tight text-[#22252A]"
            >
              {position ? `Apply — ${position.title}` : 'Apply for Open Positions'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close application dialog"
            className="p-2 -mr-2 text-[#5A606B] hover:text-[#22252A] rounded-full hover:bg-[#F3F2F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E1945]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedRecord ? (
          <div className="p-7 space-y-5">
            <div className="flex items-start gap-3.5 p-4 rounded-xl border border-[#D8DCE3] bg-[#FAFAFC]">
              <CheckCircle2 className="w-5 h-5 text-[#067647] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-base font-semibold text-[#22252A]">
                  Application submitted successfully
                </h3>
                <p className="text-sm text-[#5A606B] mt-1">
                  Reference <span className="font-medium text-[#22252A] tabular-nums">{submittedRecord.id}</span> for{' '}
                  <span className="font-medium text-[#22252A]">{submittedRecord.positionTitle}</span>.
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-[#ECEEF2] pt-4">
              <div>
                <dt className="text-xs text-[#5A606B]">Name</dt>
                <dd className="font-medium text-[#22252A] mt-0.5">{submittedRecord.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#5A606B]">Email</dt>
                <dd className="font-medium text-[#22252A] mt-0.5">{submittedRecord.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#5A606B]">Phone Number</dt>
                <dd className="font-medium text-[#22252A] mt-0.5 tabular-nums">
                  {submittedRecord.phoneNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#5A606B]">Country</dt>
                <dd className="font-medium text-[#22252A] mt-0.5">{submittedRecord.country}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#5A606B]">Application Letter</dt>
                <dd className="font-medium text-[#22252A] mt-0.5 truncate">
                  {submittedRecord.applicationLetterFileName} ({formatFileSize(submittedRecord.applicationLetterFileSize)})
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#5A606B]">CV Attachment</dt>
                <dd className="font-medium text-[#22252A] mt-0.5 truncate">
                  {submittedRecord.cvFileName} ({formatFileSize(submittedRecord.cvFileSize)})
                </dd>
              </div>
            </dl>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmittedRecord(null)}
                className="h-11 px-6 rounded-full border border-[#8E1945] text-[#8E1945] text-sm font-semibold hover:bg-[#8E1945]/5 transition-colors whitespace-nowrap"
              >
                Submit another
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-7 rounded-full bg-[#8E1945] hover:bg-[#731236] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="apply-name" className="block text-[13px] font-medium text-[#2D3138] mb-1.5">
                  Name <span className="text-[#8E1945]">*</span>
                </label>
                <input
                  id="apply-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Enter your full name"
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-[#22252A] placeholder:text-[#868C98] focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                    errors.name ? 'border-[#B42318]' : 'border-[#D8DCE3]'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="apply-email" className="block text-[13px] font-medium text-[#2D3138] mb-1.5">
                  Email <span className="text-[#8E1945]">*</span>
                </label>
                <input
                  id="apply-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@example.com"
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-[#22252A] placeholder:text-[#868C98] focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                    errors.email ? 'border-[#B42318]' : 'border-[#D8DCE3]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="apply-phone" className="block text-[13px] font-medium text-[#2D3138] mb-1.5">
                  Phone Number <span className="text-[#8E1945]">*</span>
                </label>
                <input
                  id="apply-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                  }}
                  placeholder="+974 5550 1234"
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-[#22252A] placeholder:text-[#868C98] focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                    errors.phoneNumber ? 'border-[#B42318]' : 'border-[#D8DCE3]'
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.phoneNumber}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="apply-country" className="block text-[13px] font-medium text-[#2D3138] mb-1.5">
                  Country <span className="text-[#8E1945]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="apply-country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      if (errors.country) setErrors((prev) => ({ ...prev, country: undefined }));
                    }}
                    className={`w-full h-11 pl-3.5 pr-9 rounded-lg border text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                      country ? 'text-[#22252A]' : 'text-[#868C98]'
                    } ${errors.country ? 'border-[#B42318]' : 'border-[#D8DCE3]'}`}
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="text-[#22252A]">
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-4 h-4 text-[#5A606B] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
                {errors.country && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.country}</span>
                  </p>
                )}
              </div>
            </div>

            <FileAttachmentField
              id="apply-letter-attachment"
              label="Application Letter Attachment"
              required
              file={applicationLetterFile}
              onChange={(file) => {
                setApplicationLetterFile(file);
                if (errors.applicationLetter) {
                  setErrors((prev) => ({ ...prev, applicationLetter: undefined }));
                }
              }}
              error={errors.applicationLetter}
            />

            <FileAttachmentField
              id="apply-cv-attachment"
              label="CV Attachment"
              required
              file={cvFile}
              onChange={(file) => {
                setCvFile(file);
                if (errors.cv) setErrors((prev) => ({ ...prev, cv: undefined }));
              }}
              error={errors.cv}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECEEF2]">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-6 rounded-full border border-[#8E1945] text-[#8E1945] text-sm font-semibold hover:bg-[#8E1945]/5 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 px-7 rounded-full bg-[#8E1945] hover:bg-[#731236] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
