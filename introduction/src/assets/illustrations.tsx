import React from 'react';

export const EmptyStateIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="100" cy="100" r="80" className="fill-indigo-50 dark:fill-indigo-950/40" />
    <circle cx="100" cy="100" r="60" className="fill-indigo-100 dark:fill-indigo-900/40" />
    <rect
      x="65"
      y="55"
      width="70"
      height="90"
      rx="12"
      className="fill-white dark:fill-slate-800 stroke-indigo-500/30 dark:stroke-indigo-400/30"
      strokeWidth="3"
    />
    <rect x="78" y="47" width="44" height="16" rx="6" className="fill-indigo-500" />
    <circle cx="100" cy="55" r="3" className="fill-white" />
    
    {/* Checkbox 1 */}
    <rect x="77" y="75" width="14" height="14" rx="4" className="fill-emerald-500" />
    <path d="M81 82L84 85L89 79" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="97" y="79" width="26" height="6" rx="3" className="fill-slate-200 dark:fill-slate-700" />

    {/* Checkbox 2 */}
    <rect x="77" y="99" width="14" height="14" rx="4" className="fill-indigo-500" />
    <path d="M81 106L84 109L89 103" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="97" y="103" width="26" height="6" rx="3" className="fill-slate-200 dark:fill-slate-700" />

    {/* Checkbox 3 (pending) */}
    <rect x="77" y="123" width="14" height="14" rx="4" className="stroke-slate-300 dark:stroke-slate-600 fill-transparent" strokeWidth="2" />
    <rect x="97" y="127" width="18" height="6" rx="3" className="fill-slate-200 dark:fill-slate-700" />

    {/* Decorative stars */}
    <path d="M150 40L153 48L161 51L153 54L150 62L147 54L139 51L147 48L150 40Z" className="fill-amber-400 animate-pulse" />
    <path d="M45 130L47 134L51 136L47 138L45 142L43 138L39 136L43 134L45 130Z" className="fill-indigo-400 animate-pulse" />
  </svg>
);

export const DashboardGreetingIllustration: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="80" cy="80" r="64" className="fill-indigo-500/10 dark:fill-indigo-400/10" />
    <path
      d="M50 85L70 105L115 55"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-indigo-600 dark:text-indigo-400"
    />
    <circle cx="125" cy="40" r="8" className="fill-amber-400" />
    <circle cx="35" cy="120" r="6" className="fill-emerald-400" />
  </svg>
);
