import React, { useEffect, useMemo, useState } from 'react';
import { Home, ChevronDown, ArrowRight, Trash2, FileText } from 'lucide-react';
import {
  ApplicationSubmission,
  JOB_FAMILIES,
  JOB_SUB_CATEGORIES,
  JobPosition,
  LOCATIONS,
  OPEN_POSITIONS,
  formatFileSize,
} from './data/careersData';
import { ApplyModal } from './components/ApplyModal';
import { DirectApplicationCard } from './components/DirectApplicationCard';

type SortOption = 'relevance' | 'newest' | 'title-asc' | 'location-asc';

const STORAGE_KEY = 'career_portal_submissions_v1';

export default function App() {
  // Draft inputs in the left "Refine your search" sidebar
  const [draftKeywords, setDraftKeywords] = useState('Cabin crew');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftJobFamily, setDraftJobFamily] = useState('');
  const [draftSubCategory, setDraftSubCategory] = useState('');

  // Applied filters (triggered by clicking Search or pressing Enter)
  const [appliedFilters, setAppliedFilters] = useState({
    keywords: 'Cabin crew',
    location: '',
    jobFamily: '',
    subCategory: '',
  });

  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  // Apply modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);

  // Saved submissions (persisted in localStorage)
  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ApplicationSubmission[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // Ignore storage quota errors
    }
  }, [submissions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      keywords: draftKeywords.trim(),
      location: draftLocation,
      jobFamily: draftJobFamily,
      subCategory: draftSubCategory,
    });
  };

  const handleClearFilters = () => {
    setDraftKeywords('');
    setDraftLocation('');
    setDraftJobFamily('');
    setDraftSubCategory('');
    setAppliedFilters({
      keywords: '',
      location: '',
      jobFamily: '',
      subCategory: '',
    });
  };

  const openApplyForPosition = (position: JobPosition | null) => {
    setSelectedPosition(position);
    setApplyModalOpen(true);
  };

  const handleAddSubmission = (record: ApplicationSubmission) => {
    setSubmissions((prev) => [record, ...prev]);
  };

  const handleDeleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
  };

  const activeFilterLabels = useMemo(() => {
    const parts: string[] = [];
    if (appliedFilters.keywords) parts.push(`"${appliedFilters.keywords}"`);
    if (appliedFilters.location) parts.push(appliedFilters.location);
    if (appliedFilters.jobFamily) parts.push(appliedFilters.jobFamily);
    if (appliedFilters.subCategory) parts.push(appliedFilters.subCategory);
    return parts;
  }, [appliedFilters]);

  const filteredPositions = useMemo(() => {
    const query = appliedFilters.keywords.toLowerCase();
    const matches = OPEN_POSITIONS.filter((job) => {
      const matchesKeywords =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.jobFamily.toLowerCase().includes(query) ||
        job.subCategory.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.summary.toLowerCase().includes(query);

      const matchesLocation = !appliedFilters.location || job.location === appliedFilters.location;
      const matchesFamily = !appliedFilters.jobFamily || job.jobFamily === appliedFilters.jobFamily;
      const matchesSub =
        !appliedFilters.subCategory || job.subCategory === appliedFilters.subCategory;

      return matchesKeywords && matchesLocation && matchesFamily && matchesSub;
    });

    const sorted = [...matches];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => b.postedDate.localeCompare(a.postedDate));
    } else if (sortBy === 'title-asc') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'location-asc') {
      sorted.sort((a, b) => a.location.localeCompare(b.location));
    }
    return sorted;
  }, [appliedFilters, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#22252A]">
      {/* Lush botanical dark-emerald top header banner matching the reference screenshot */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[#173321] via-[#244D32] to-[#162F1F] text-white border-b border-black/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 40%, rgba(122, 179, 98, 0.45) 0%, transparent 45%), radial-gradient(circle at 75% 20%, rgba(90, 148, 72, 0.35) 0%, transparent 40%), radial-gradient(circle at 52% 85%, rgba(18, 42, 26, 0.7) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-[1220px] mx-auto px-6 h-[76px] flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-[22px] tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
          >
            Meridian Careers
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-white/90"
          >
            <a
              href="#open-positions"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Open Positions
            </a>
            <a
              href="#direct-application"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Candidate Profile
            </a>
            <a
              href="#submitted-applications"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Submissions ({submissions.length})
            </a>
            <a
              href="#not-sure-start"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Guidance
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => openApplyForPosition(null)}
              className="h-10 px-6 rounded-full bg-[#8E1945] hover:bg-[#731236] border border-white/25 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Apply
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb bar matching Home / Open positions */}
      <div id="top" className="border-b border-[#F0F1F4] bg-white">
        <div className="max-w-[1220px] mx-auto px-6 py-4 flex items-center gap-2.5 text-[13px] text-[#4B515B]">
          <button
            type="button"
            onClick={handleClearFilters}
            aria-label="Home — show all open positions"
            className="inline-flex items-center text-[#3A3F47] hover:text-[#8E1945] transition-colors"
          >
            <Home className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <span className="text-[#9CA3AF]" aria-hidden="true">
            /
          </span>
          <span className="text-[#3A3F47] font-normal">Open positions</span>
        </div>
      </div>

      {/* Main two-column layout matching the screenshot */}
      <main id="open-positions" className="flex-1 w-full max-w-[1220px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[276px_1fr] gap-10 items-start">
          {/* Left Sidebar: Refine your search */}
          <aside aria-labelledby="refine-search-heading">
            <h1
              id="refine-search-heading"
              className="font-display text-[28px] leading-[1.2] text-[#22252A] mb-6"
            >
              Refine your search
            </h1>

            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <label
                  htmlFor="filter-keywords"
                  className="block text-[13px] font-medium text-[#2D3138] mb-1.5"
                >
                  Keywords
                </label>
                <input
                  id="filter-keywords"
                  type="text"
                  value={draftKeywords}
                  onChange={(e) => setDraftKeywords(e.target.value)}
                  placeholder="Enter job title or keyword"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#D8DCE3] bg-white text-sm text-[#22252A] placeholder:text-[#7B818C] focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="filter-location"
                  className="block text-[13px] font-medium text-[#2D3138] mb-1.5"
                >
                  Location
                </label>
                <div className="relative">
                  <select
                    id="filter-location"
                    value={draftLocation}
                    onChange={(e) => setDraftLocation(e.target.value)}
                    className={`w-full h-11 pl-3.5 pr-9 rounded-lg border border-[#D8DCE3] bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                      draftLocation ? 'text-[#22252A]' : 'text-[#7B818C]'
                    }`}
                  >
                    <option value="">Select an option</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="text-[#22252A]">
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-4 h-4 text-[#5A606B] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="filter-job-family"
                  className="block text-[13px] font-medium text-[#2D3138] mb-1.5"
                >
                  Job family
                </label>
                <div className="relative">
                  <select
                    id="filter-job-family"
                    value={draftJobFamily}
                    onChange={(e) => setDraftJobFamily(e.target.value)}
                    className={`w-full h-11 pl-3.5 pr-9 rounded-lg border border-[#D8DCE3] bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                      draftJobFamily ? 'text-[#22252A]' : 'text-[#7B818C]'
                    }`}
                  >
                    <option value="">Select an option</option>
                    {JOB_FAMILIES.map((family) => (
                      <option key={family} value={family} className="text-[#22252A]">
                        {family}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-4 h-4 text-[#5A606B] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="filter-sub-category"
                  className="block text-[13px] font-medium text-[#2D3138] mb-1.5"
                >
                  Job Sub Categories
                </label>
                <div className="relative">
                  <select
                    id="filter-sub-category"
                    value={draftSubCategory}
                    onChange={(e) => setDraftSubCategory(e.target.value)}
                    className={`w-full h-11 pl-3.5 pr-9 rounded-lg border border-[#D8DCE3] bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945] transition-colors ${
                      draftSubCategory ? 'text-[#22252A]' : 'text-[#7B818C]'
                    }`}
                  >
                    <option value="">Select an option</option>
                    {JOB_SUB_CATEGORIES.map((sub) => (
                      <option key={sub} value={sub} className="text-[#22252A]">
                        {sub}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-4 h-4 text-[#5A606B] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[#8E1945] hover:bg-[#731236] text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="w-full h-11 rounded-full border border-[#8E1945] text-[#8E1945] bg-white hover:bg-[#8E1945]/5 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  Clear all filters
                </button>
              </div>
            </form>
          </aside>

          {/* Right Column: Filters bar, Open Positions / No jobs found card, and Candidate Application Form */}
          <div className="min-w-0">
            {/* Top Utility Row: Filters applied ( Reset ) + Sort by */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#22252A]">
                <span className="font-semibold">
                  Filters applied ({' '}
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="font-normal underline underline-offset-2 hover:text-[#8E1945] transition-colors"
                  >
                    Reset
                  </button>{' '}
                  )
                </span>
                {activeFilterLabels.length > 0 && (
                  <span className="text-xs text-[#5A606B]">
                    · {activeFilterLabels.join(' · ')}
                  </span>
                )}
              </div>

              <div className="relative">
                <label htmlFor="sort-positions" className="sr-only">
                  Sort positions
                </label>
                <select
                  id="sort-positions"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-9 pl-3.5 pr-8 rounded-md border border-[#D8DCE3] bg-white text-[13px] font-medium text-[#22252A] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8E1945]/20 focus:border-[#8E1945]"
                >
                  <option value="relevance">Sort by</option>
                  <option value="newest">Newest first</option>
                  <option value="title-asc">Title (A–Z)</option>
                  <option value="location-asc">Location (A–Z)</option>
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-[#3A3F47] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Results Area */}
            {filteredPositions.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E6E8EC] shadow-[0_2px_10px_rgba(16,24,40,0.04)] px-7 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display text-[24px] leading-snug text-[#22252A]">
                    No jobs found
                  </h2>
                  <p className="text-sm text-[#5A606B] mt-1">
                    Adjust your search criteria,{' '}
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="text-[#8E1945] underline underline-offset-2 hover:text-[#731236]"
                    >
                      view all open positions
                    </button>
                    , or submit a direct application below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openApplyForPosition(null)}
                  className="h-10 px-6 rounded-full bg-[#8E1945] hover:bg-[#731236] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPositions.map((position) => (
                  <article
                    key={position.id}
                    className="bg-white rounded-xl border border-[#E6E8EC] shadow-[0_2px_10px_rgba(16,24,40,0.03)] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors hover:border-[#CFD4DD]"
                  >
                    <div className="min-w-0">
                      <h2 className="font-display text-[22px] leading-snug text-[#22252A]">
                        {position.title}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A606B]">
                        <span>{position.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{position.jobFamily}</span>
                        <span aria-hidden="true">·</span>
                        <span>{position.employmentType}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{position.referenceCode}</span>
                      </div>
                      <p className="mt-2.5 text-sm text-[#4B515B] leading-relaxed max-w-2xl">
                        {position.summary}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openApplyForPosition(position)}
                        className="h-10 px-6 rounded-full bg-[#8E1945] hover:bg-[#731236] text-white text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Hairline divider matching the reference screenshot */}
            <hr className="border-0 border-t border-[#ECEEF2] my-8" />

            {/* Candidate Direct Application Form: Full Name, Email, Phone Numbers, CV Attachment, Cover Letter */}
            <DirectApplicationCard
              onSubmitDirect={handleAddSubmission}
              onOpenApplyModal={() => openApplyForPosition(null)}
            />

            {/* Saved / Submitted Applications */}
            {submissions.length > 0 && (
              <section
                id="submitted-applications"
                aria-labelledby="submissions-heading"
                className="mt-8 bg-white rounded-xl border border-[#E6E8EC] shadow-[0_2px_10px_rgba(16,24,40,0.03)] p-6 sm:p-7"
              >
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#ECEEF2]">
                  <h2
                    id="submissions-heading"
                    className="font-display text-[23px] leading-tight text-[#22252A]"
                  >
                    Submitted Applications ({submissions.length})
                  </h2>
                </div>

                <div className="divide-y divide-[#ECEEF2]">
                  {submissions.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-5 last:pb-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="text-sm font-semibold text-[#22252A]">
                            {item.type === 'position' ? item.positionTitle : 'Direct Candidate Profile'}
                          </span>
                          <span aria-hidden="true" className="text-[#9CA3AF]">
                            ·
                          </span>
                          <span className="text-xs text-[#5A606B] tabular-nums">{item.id}</span>
                        </div>

                        <p className="text-sm text-[#4B515B]">
                          {item.type === 'position' ? item.name : item.fullName} · {item.email} ·{' '}
                          <span className="tabular-nums">
                            {item.type === 'position'
                              ? item.phoneNumber
                              : item.phoneNumbers.join(', ')}
                          </span>
                          {item.type === 'position' ? ` · ${item.country}` : ''}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-[#5A606B]">
                          <span className="inline-flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#8E1945]" aria-hidden="true" />
                            <span>
                              CV: {item.cvFileName} ({formatFileSize(item.cvFileSize)})
                            </span>
                          </span>
                          {item.type === 'position' && (
                            <span className="inline-flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#8E1945]" aria-hidden="true" />
                              <span>
                                Application Letter: {item.applicationLetterFileName} (
                                {formatFileSize(item.applicationLetterFileSize)})
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSubmission(item.id)}
                        aria-label={`Withdraw application ${item.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5A606B] hover:text-[#B42318] transition-colors self-start shrink-0 py-1 px-2 rounded hover:bg-[#FEF3F2]"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Bottom "Not sure where to start?" band matching the screenshot */}
      <section
        id="not-sure-start"
        className="w-full bg-[#F3F2F5] border-t border-[#E8E6EC] py-16 px-6 mt-12 text-center"
      >
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-[34px] leading-tight text-[#22252A] text-balance">
            Not sure where to start?
          </h2>
          <p className="mt-3 text-[15px] text-[#5A606B] leading-relaxed">
            Submit a general application with your country of residence, application letter, and CV
            to be considered for upcoming openings.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => openApplyForPosition(null)}
              className="h-11 px-8 rounded-full bg-[#8E1945] hover:bg-[#731236] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Apply
            </button>
          </div>
        </div>
      </section>

      {/* Apply Modal: Name, Email, Phone Number, Country, Application Letter Attachment, CV Attachment */}
      <ApplyModal
        isOpen={applyModalOpen}
        position={selectedPosition}
        onClose={() => setApplyModalOpen(false)}
        onSubmitApplication={handleAddSubmission}
      />
    </div>
  );
}
