type FilterOption = {
  label: string;
  value: string;
};

export const FilterBar = ({
  label,
  options,
  activeFilter,
  onFilterChange,
}: {
  label: string;
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (next: string) => void;
}) => (
  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === activeFilter;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onFilterChange(option.value)}
              className={`min-h-9 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-600 text-white"
                  : "border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
