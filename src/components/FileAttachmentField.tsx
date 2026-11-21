import React, { useRef, useState } from 'react';
import { FileText, Paperclip, X, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../data/careersData';

interface FileAttachmentFieldProps {
  id: string;
  label: string;
  required?: boolean;
  accept?: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export const FileAttachmentField: React.FC<FileAttachmentFieldProps> = ({
  id,
  label,
  required = false,
  accept = '.pdf,.doc,.docx,.txt',
  hint = 'PDF, DOC, or DOCX up to 10 MB',
  file,
  onChange,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;
    onChange(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    handleFileSelect(droppedFile);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-[#2D3138] mb-1.5">
        {label}
        {required && <span className="text-[#8E1945] ml-0.5">*</span>}
      </label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          handleFileSelect(e.target.files?.[0] ?? null);
          e.target.value = '';
        }}
      />

      {file ? (
        <div
          className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border bg-[#FAFAFC] transition-colors ${
            error ? 'border-[#B42318]' : 'border-[#D8DCE3]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-4 h-4 text-[#8E1945] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#22252A] truncate">{file.name}</p>
              <p className="text-xs text-[#5A606B] tabular-nums">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-medium text-[#8E1945] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E1945] rounded px-1.5 py-1 whitespace-nowrap"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={`Remove ${label}`}
              className="p-1 text-[#5A606B] hover:text-[#22252A] rounded-md hover:bg-[#ECEEF2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E1945]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg border border-dashed cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E1945] ${
            isDragging
              ? 'border-[#8E1945] bg-[#8E1945]/5'
              : error
              ? 'border-[#B42318] bg-[#FEF3F2]'
              : 'border-[#C9CED6] bg-white hover:border-[#8E1945]/60 hover:bg-[#FAFAFC]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Paperclip className="w-4 h-4 text-[#5A606B] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm text-[#2D3138] truncate">
                <span className="font-medium text-[#8E1945]">Attach file</span> or drag and drop
              </p>
              <p className="text-xs text-[#6B7280]">{hint}</p>
            </div>
          </div>
          <span className="text-xs font-medium text-[#2D3138] border border-[#D8DCE3] rounded-md px-2.5 py-1 bg-[#F9FAFB] shrink-0 whitespace-nowrap">
            Browse
          </span>
        </div>
      )}

      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
