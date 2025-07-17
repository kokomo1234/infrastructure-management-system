import React, { useState, useCallback, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  debounceMs = 300,
  className = "",
  size = "md"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Performance: Debounced search to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Performance: Trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  // Performance: Memoized input change handler
  const handleInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Performance: Memoized clear handler
  const handleClear = useCallback(() => {
    setSearchTerm('');
    setDebouncedTerm('');
  }, []);

  // Performance: Handle Enter key for immediate search
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setDebouncedTerm(searchTerm);
    }
  }, [searchTerm]);

  return (
    <InputGroup className={className} size={size}>
      <InputGroup.Text>
        🔍
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        autoComplete="off"
      />
      {searchTerm && (
        <Button 
          variant="outline-secondary" 
          onClick={handleClear}
          title="Clear search"
        >
          ✕
        </Button>
      )}
    </InputGroup>
  );
};

export default React.memo(SearchBar); // Performance: Prevent unnecessary re-renders
