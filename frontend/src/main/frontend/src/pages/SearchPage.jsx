import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import QuoteCard from '../components/QuoteCard';
import QuoteViewModal from '../components/QuoteViewModal';
import { filteredSearch } from '../lib/api';
import FilteredSearch from '../components/FilteredSearch';
import { Funnel } from 'react-bootstrap-icons';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [viewedQuote, setViewedQuote] = useState(null);
  const location = useLocation();

  const closeView = () => setViewedQuote(null);

  useEffect(() => {
    console.log("Location state on SearchPage load:", location.state); // Debugging location state
  
    const query = new URLSearchParams(location.search).get("q") || "*";
    const filters = {
      filterUsed: location.state?.filterUsed || false,
      filterBookmarked: location.state?.filterBookmarked || false,
      filterUploaded: location.state?.filterUploaded || false,
      include: location.state?.include || "",
      exclude: location.state?.exclude || "",
    };
  
    console.log("Filters extracted from location state:", filters); // Debugging filters
  
    (async () => {
      try {
        const results = await filteredSearch(query === "*" ? "" : query, filters);
        console.log("Filtered search results:", results); // Debugging API response
        setSearchResults(results);
        setError(null);
      } catch (err) {
        setSearchResults([]);
        setError("No quotes matched your search.");
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search, location.state]);
  


  return (
    <div className="container">
      {viewedQuote && (
        <QuoteViewModal
          quote={viewedQuote}
          close={closeView}
        />
      )}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Search Results</h1>
        <Funnel
          size={24}
          style={{ cursor: 'pointer', color: '#146C43' }}
          onClick={() => setIsFilterModalVisible(true)}
        />
      </div>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && searchResults.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {searchResults.map((quote) => (
            <div className="col" key={quote._id.$oid}>
              <QuoteCard quote={quote} showViewModal={setViewedQuote} />
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p>No quotes matched your search.</p>
      )}
      <FilteredSearch
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onSearch={(results) => {
          setSearchResults(results);
          setError(null);
        }}
      />
    </div>
  );
};

export default SearchPage;