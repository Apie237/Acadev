import React from 'react';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search courses..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-20 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />

        {/* Clear Button (shows when there's text) */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-16 flex items-center pr-2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-6 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;