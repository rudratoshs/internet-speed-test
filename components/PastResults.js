import React, { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 15;

const PastResults = () => {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResults = JSON.parse(localStorage.getItem('speedTestResults')) || [];
      setResults(storedResults);
    }
  }, []);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentResults = results.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === 'next' && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === 'prev' && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl text-[#E0E0E0]">Past Results:</h3>
      <table className="min-w-full bg-gray-800 text-[#E0E0E0] border border-gray-700 mt-4">
        <thead>
          <tr>
            <th className="py-2 border-b">Speed Type</th>
            <th className="py-2 border-b">Speed</th>
            <th className="py-2 border-b">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {currentResults.map((result, index) => (
            <tr key={index} className={`border-b hover:bg-gray-700 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}`}>
              <td className="py-2">{result.label} Speed</td>
              <td className="py-2">
                {result.value} {result.label === 'Ping' ? 'ms' : 'Mbps'}
              </td>
              <td className="py-2">
                {new Date(result.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button 
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-600"
        >
          Previous
        </button>
        <button 
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PastResults;