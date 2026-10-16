import React, { useState } from 'react';
import {
  X,
  Scale,
  DollarSign,
  MapPin,
  CheckCircle2,
  Award,
} from 'lucide-react';

interface JobApp {
  id: string;
  company: string;
  roleTitle: string;
  location?: string | null;
  status: string;
  salaryRange?: string | null;
  notes?: string | null;
}

interface OfferComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApp[];
}

function parseSalaryToAnnualNumber(salaryStr?: string | null): number {
  if (!salaryStr) return 0;
  // Match numbers like 150k, 150,000, 160000
  const clean = salaryStr.toLowerCase().replace(/,/g, '');
  const matches = clean.match(/(\d+(?:\.\d+)?)\s*(k)?/g);
  if (!matches || matches.length === 0) return 0;

  const numbers = matches.map((m) => {
    const isK = m.includes('k');
    const num = parseFloat(m.replace('k', ''));
    return isK ? num * 1000 : num;
  });

  // If hourly e.g. "$65/hr", multiply by 2080
  if (clean.includes('/hr') || clean.includes('hour')) {
    return numbers[0] * 2080;
  }

  // If a range, take the high end or average
  if (numbers.length >= 2) {
    return (numbers[0] + numbers[1]) / 2;
  }
  return numbers[0];
}

export const OfferComparisonModal: React.FC<OfferComparisonModalProps> = ({
  isOpen,
  onClose,
  applications,
}) => {
  const [filterStage, setFilterStage] = useState<'all' | 'offers-only'>('all');

  if (!isOpen) return null;

  const validApps = applications.filter((app) => {
    if (filterStage === 'offers-only') {
      return app.status === 'OFFER';
    }
    return Boolean(app.salaryRange) || app.status === 'OFFER' || app.status === 'INTERVIEWING';
  });

  const processedOffers = validApps
    .map((app) => {
      const annual = parseSalaryToAnnualNumber(app.salaryRange);
      const monthly = annual > 0 ? Math.round(annual / 12) : 0;
      const estimatedNetMonthly = annual > 0 ? Math.round((annual * 0.72) / 12) : 0;
      const hourly = annual > 0 ? Math.round(annual / 2080) : 0;
      return {
        ...app,
        annual,
        monthly,
        estimatedNetMonthly,
        hourly,
      };
    })
    .sort((a, b) => b.annual - a.annual);

  const highestOffer = processedOffers.length > 0 ? processedOffers[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl max-h-[85vh] bg-white border border-carbon-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-700 bg-carbon-850/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-slate-100 tracking-tight">
                Compensation & Offer Benchmark Engine
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Annualized base salary, net monthly take-home, and stage comparisons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-lg p-0.5 border border-carbon-700 text-[11px] font-mono shadow-sm">
              <button
                type="button"
                onClick={() => setFilterStage('all')}
                className={`px-2.5 py-1 rounded-md transition ${
                  filterStage === 'all'
                    ? 'bg-carbon-850 text-royal-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Prospect Comp
              </button>
              <button
                type="button"
                onClick={() => setFilterStage('offers-only')}
                className={`px-2.5 py-1 rounded-md transition ${
                  filterStage === 'offers-only'
                    ? 'bg-carbon-850 text-forest-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Offers Extended Only
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-carbon-800 transition ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {processedOffers.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400 space-y-2">
              <DollarSign className="w-8 h-8 mx-auto text-slate-400" />
              <p>No compensation data found for active applications.</p>
              <p className="text-[11px] text-slate-400">
                Add salary figures (e.g., "$155k" or "$140,000 - $160,000") to your application cards to view comparisons.
              </p>
            </div>
          ) : (
            <>
              {/* Highlight Top Offer */}
              {highestOffer && highestOffer.annual > 0 && (
                <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700 font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-forest-700 font-bold block">
                        Top Benchmark Compensation
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">
                        {highestOffer.company} — {highestOffer.roleTitle}
                      </h4>
                      <span className="text-xs font-mono text-slate-400">
                        {highestOffer.salaryRange || `$${highestOffer.annual.toLocaleString()}/yr`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">Estimated Take-Home</span>
                      <span className="text-base font-bold font-mono text-forest-700">
                        ${highestOffer.estimatedNetMonthly.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400">/mo</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">Hourly Rate Eq.</span>
                      <span className="text-base font-bold font-mono text-slate-100">
                        ${highestOffer.hourly}
                        <span className="text-xs font-normal text-slate-400">/hr</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Side-by-Side Ranked Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processedOffers.map((item, idx) => {
                  const isTop = idx === 0 && item.annual > 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition ${
                        isTop
                          ? 'bg-white border-forest-300 ring-1 ring-forest-400/20 shadow-md'
                          : 'bg-white border-carbon-700 hover:border-royal-400 shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-carbon-850 text-slate-300 border border-carbon-700">
                            #{idx + 1} {item.status.replace(/_/g, ' ')}
                          </span>
                          {isTop && (
                            <span className="text-[10px] font-mono text-forest-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Highest
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs text-slate-100 line-clamp-1">
                          {item.roleTitle}
                        </h4>
                        <span className="text-xs font-mono text-royal-700 font-semibold block">
                          {item.company}
                        </span>

                        {item.location && (
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      <div className="pt-3 border-t border-carbon-700 space-y-1.5 text-xs font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Reported Comp:</span>
                          <span className="font-bold text-slate-100">
                            {item.salaryRange || 'Not Specified'}
                          </span>
                        </div>

                        {item.annual > 0 && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Gross / Month:</span>
                              <span className="text-slate-200">
                                ${item.monthly.toLocaleString()}/mo
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Est. Net Take-Home:</span>
                              <span className="text-forest-700 font-semibold">
                                ~${item.estimatedNetMonthly.toLocaleString()}/mo
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-carbon-700 bg-carbon-850/40 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>* Net estimates assume standard 28% federal/state/benefits withholding rate.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-carbon-850 border border-carbon-700 text-slate-200 hover:text-slate-100 shadow-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
