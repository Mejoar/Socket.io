import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const SearchMessages = () => {
  const { state } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        searchMessages(searchQuery);
      }, 300); // Debounce search

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [searchQuery, state.messages]);

  const searchMessages = (query) => {
    const results = [];
    const lowerQuery = query.toLowerCase();

    // Search through all rooms
    Object.entries(state.messages).forEach(([room, messages]) => {
      messages.forEach(message => {
        if (message.text.toLowerCase().includes(lowerQuery) ||
            message.sender.toLowerCase().includes(lowerQuery)) {
          results.push({
            ...message,
            room,
            roomDisplayName: room === 'general' ? 'General' : `#${room}`
          });
        }
      });
    });

    // Sort by timestamp (newest first)
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setSearchResults(results.slice(0, 20)); // Limit to 20 results
    setShowResults(true);
    setIsSearching(false);
  };

  const handleResultClick = (result) => {
    // Navigate to the room containing the message
    if (result.room !== state.currentRoom) {
      // This would trigger room navigation
      console.log(`Navigating to room: ${result.room}`);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={index} style={styles.highlight}>{part}</mark> : 
        part
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.searchIcon}>🔍</div>
      </div>

      {isSearching && (
        <div style={styles.loading}>Searching...</div>
      )}

      {showResults && (
        <div style={styles.resultsContainer}>
          <div style={styles.resultsHeader}>
            <span>Search Results ({searchResults.length})</span>
            <button 
              style={styles.closeButton}
              onClick={() => setShowResults(false)}
            >
              ×
            </button>
          </div>
          
          <div style={styles.resultsList}>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div
                  key={`${result.id}-${index}`}
                  style={styles.resultItem}
                  onClick={() => handleResultClick(result)}
                >
                  <div style={styles.resultHeader}>
                    <span style={styles.resultSender}>{result.sender}</span>
                    <span style={styles.resultRoom}>{result.roomDisplayName}</span>
                    <span style={styles.resultTime}>
                      {new Date(result.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={styles.resultText}>
                    {highlightText(result.text, searchQuery)}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noResults}>
                No messages found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    margin: '10px 20px',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    padding: '8px 35px 8px 12px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#f8f9fa',
  },
  searchIcon: {
    position: 'absolute',
    right: '12px',
    color: '#666',
    pointerEvents: 'none',
  },
  loading: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#666',
    zIndex: 1000,
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    maxHeight: '400px',
    overflow: 'hidden',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f9fa',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#666',
  },
  resultsList: {
    maxHeight: '350px',
    overflowY: 'auto',
  },
  resultItem: {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  resultHeader: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px',
    fontSize: '11px',
  },
  resultSender: {
    fontWeight: 'bold',
    color: '#333',
  },
  resultRoom: {
    color: '#666',
    backgroundColor: '#f0f0f0',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  resultTime: {
    color: '#999',
    marginLeft: 'auto',
  },
  resultText: {
    fontSize: '13px',
    color: '#555',
    lineHeight: '1.3',
  },
  highlight: {
    backgroundColor: '#ffeb3b',
    padding: '1px 2px',
    borderRadius: '2px',
  },
  noResults: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
  },
};

export default SearchMessages;
