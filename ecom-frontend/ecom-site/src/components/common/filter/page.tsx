import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const filterOptions = {
  Category: ['Shirt', 'Pants', 'Hoodie', 'Sweatshirt'],
  Price: ['400-500', '500-900', '900-1500', '1500-2000'],
  Size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Fit: ['Regular Fit', 'Slim Fit', 'Loose Fit'],
  Color: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Orange', 'Pink', 'Gray', 'Brown', 'Beige'],
};

const filters = Object.keys(filterOptions) as Array<keyof typeof filterOptions>;

interface FilterSectionProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleFilter = (filter: keyof typeof filterOptions) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleCheckboxChange = (filter: string, option: string) => {
    const updatedFilters = { ...selectedFilters };
    if (!updatedFilters[filter]) {
      updatedFilters[filter] = [];
    }

    if (updatedFilters[filter].includes(option)) {
      updatedFilters[filter] = updatedFilters[filter].filter((o) => o !== option);
    } else {
      updatedFilters[filter].push(option);
    }

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="w-full p-4 bg-white rounded-md">
      {/* Filter Header */}
      <div className="flex justify-between items-center pb-2 mb-4">
        <h2 className="text-xl font-bold">Filter & Sort</h2>
        <button className="text-sm text-gray-500 font-semibold" onClick={() => onFilterChange({})}>Clear All</button>
      </div>

      <hr className="text-gray-200 mb-4 mt-4" />

      {/* Filter Categories */}
      <div className="space-y-4">
        {filters.map((filter, index) => (
          <div key={index}>
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFilter(filter)}
            >
              <span className="font-bold text-lg">{filter}</span>
              <FiChevronDown
                className={`transform transition-transform border rounded-full text-xl ${
                  activeFilters.includes(filter) ? 'rotate-180' : ''
                }`}
              />
            </button>
            {activeFilters.includes(filter) && (
              <div className="mt-2 pl-4">
                {filterOptions[filter].map((option, idx) => (
                  <div key={idx} className="text-gray-700 text-sm mb-2">
                    <input
                      type="checkbox"
                      id={`${filter}-${option}`}
                      onChange={() => handleCheckboxChange(filter, option)}
                    />
                    <label className="text-darkGray text-md font-medium" htmlFor={`${filter}-${option}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <hr className="text-gray-200 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
