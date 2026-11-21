import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DirectApplicationSubmission, formatFileSize } from '../data/careersData';
import { FileAttachmentField } from './FileAttachmentField';

interface DirectApplicationCardProps {
  onSubmitDirect: (submission: DirectApplicationSubmission) => void;
  onOpenApplyModal: () => void;
}

interface DirectFormErrors {
  fullName?: string;
  email?: string;
  phoneNumbers?: string;
  cv?: string;
  coverLetter?: string;
}

export const DirectApplicationCard: React.FC<DirectApplicationCardProps> = ({
  onSubmitDirect,
  onOpenApplyModal,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [errors, setErrors] = useState<DirectFormErrors>({});
  const [lastSubmitted, setLastSubmitted] = useState<DirectApplicationSubmission | null>(null);

  const handlePhoneChange = (index: number, value: string) => {
    setPhoneNumbers((prev) => prev.map((p, i) => (i === index ? value : p)));
    if (errors.phoneNumbers) setErrors((prev) => ({ ...prev, phoneNumbers: undefined }));
  };

  const addPhoneField = () => {
    if (phoneNumbers.length < 3) {
      setPhoneNumbers((prev) => [...prev, '']);
    }
  };

  const removePhoneField = (index: number) => {
    setPhoneNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhoneNumbers(['']);
    setCvFile(null);
    setCoverLetter('');
    setErrors({});
    setLastSubmitted(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: DirectFormErrors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    const validPhones = phoneNumbers.map((p) => p.trim()).filter(Boolean);
    if (validPhones.length === 0 || validPhones.some((p) => p.replace(/[^\d+]/g, '').length < 7)) {
      nextErrors.phoneNumbers = 'Please provide at least one valid phone number.';
    }

    if (!cvFile) {
      nextErrors.cv = 'Please attach your CV.';
    }

    if (!coverLetter.trim() || coverLetter.trim().length < 20) {
      nextErrors.coverLetter = 'Please write a brief cover letter (at least 20 characters).';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !cvFile) return;

    const submission: DirectApplicationSubmission = {
      id: `DIR-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'direct',
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumbers: validPhones,
      cvFileName: cvFile.name,
      cvFileSize: cvFile.size,
      coverLetter: coverLetter.trim(),
      submittedAt: new Date().toISOString(),
    };

    onSubmitDirect(submission);
    setLastSubmitted(submission);
    setFullName('');
    setEmail('');
    setPhoneNumbers(['']);
    setCvFile(null);
    setCoverLetter('');
    setErrors({});
  };

  return (
    <section
      id="direct-application"
      aria-labelledby="direct-application-heading"
      className="bg-white rounded-xl border border-[#E6E8EC] shadow-[0_2px_10px_rgba(16,24,40,0.03)] p-6 sm:p-7"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#ECEEF2]">
        <div>
          <h2
            id="direct-application-heading"
            className="font-display text-[25px] leading-tight text-[#22252A]"
          >
            Submit your candidate profile
          </h2>
          <p className="text-sm text-[#5A606B] mt-1">
            Provide your contact details, CV attachment, and cover letter for upcoming openings.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenApplyModal}
          className="h-10 px-5 rounded-full border border-[#8E1945] text-[#8E1945] text-sm font-semibold hover:bg-[#8E1945]/5 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          Apply with Country &amp; Letter
        </button>
      </div>

      {lastSubmitted && (
        <div
          className="mt-5 flex items-start justify-between gap-4 p-4 rounded-xl border border-[#D8DCE3] bg-[#FAFAFC]"
          role="status"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#067647] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold text-[#22252A]">
                Candidate profile submitted — {lastSubmitted.id}
              </p>
              <p className="text-[#5A606B] mt-0.5">
                {lastSubmitted.fullName} · {lastSubmitted.email} · {lastSubmitted.cvFileName} (
                {formatFileSize(lastSubmitted.cvFileSize)})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLastSubmitted(null)}
            className="text-xs font-medium text-[#8E1945] hover:underline whitespace-nowrap"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="direct-full-name" className="block text-[13px] font-medium text-[#2D3138] mb-1.5">
              Full Name <span className="text-[#8E1945]">*</span>
            </label>
            <input
              id="direct-full-name"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              placeholder="e.g. Amina Hassan"
              className={`w-full h-11 px-3.5 rounded-lg border text-sm text-[#22252A] placeholder:text-[#868C98] focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                errors.fullName ? 'border-[#B42318]' : 'border-[#D8DCE3]'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]" role="alert">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="direct-email" className="block text-[13px] font-medium text-[#2D3138] mb-1.5">
              Email <span className="text-[#8E1945]">*</span>
            </label>
            <input
              id="direct-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="amina.hassan@example.com"
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="direct-phone-0" className="block text-[13px] font-medium text-[#2D3138]">
              Phone Numbers <span className="text-[#8E1945]">*</span>
            </label>
            {phoneNumbers.length < 3 && (
              <button
                type="button"
                onClick={addPhoneField}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#8E1945] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E1945] rounded px-1 py-0.5"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add another number</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  id={`direct-phone-${index}`}
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder={index === 0 ? 'Primary phone number (e.g. +974 5550 1234)' : 'Secondary phone number'}
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-[#22252A] placeholder:text-[#868C98] focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                    errors.phoneNumbers ? 'border-[#B42318]' : 'border-[#D8DCE3]'
                  }`}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePhoneField(index)}
                    aria-label={`Remove phone number ${index + 1}`}
                    className="h-11 px-3 rounded-lg border border-[#D8DCE3] text-[#5A606B] hover:text-[#22252A] hover:bg-[#F3F2F5] transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {errors.phoneNumbers && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.phoneNumbers}</span>
            </p>
          )}
        </div>

        <FileAttachmentField
          id="direct-cv-attachment"
          label="CV Attachment"
          required
          file={cvFile}
          onChange={(file) => {
            setCvFile(file);
            if (errors.cv) setErrors((prev) => ({ ...prev, cv: undefined }));
          }}
          error={errors.cv}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="direct-cover-letter" className="block text-[13px] font-medium text-[#2D3138]">
              Cover Letter <span className="text-[#8E1945]">*</span>
            </label>
            <span className="text-xs text-[#6B7280] tabular-nums">
              {coverLetter.trim().length} characters
            </span>
          </div>
          <textarea
            id="direct-cover-letter"
            rows={5}
            value={coverLetter}
            onChange={(e) => {
              setCoverLetter(e.target.value);
              if (errors.coverLetter) setErrors((prev) => ({ ...prev, coverLetter: undefined }));
            }}
            placeholder="Introduce your background, key qualifications, and why you would like to join our team..."
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#22252A] placeholder:text-[#868C98] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors resize-y ${
              errors.coverLetter ? 'border-[#B42318]' : 'border-[#D8DCE3]'
            }`}
          />
          {errors.coverLetter && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.coverLetter}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="h-11 px-8 rounded-full bg-[#8E1945] hover:bg-[#731236] text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Submit Application
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="h-11 px-7 rounded-full border border-[#8E1945] text-[#8E1945] text-sm font-semibold hover:bg-[#8E1945]/5 transition-colors whitespace-nowrap"
          >
            Clear form
          </button>
        </div>
      </form>
    </section>
  );
};
