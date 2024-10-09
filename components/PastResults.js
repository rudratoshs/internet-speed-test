import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ITEMS_PER_PAGE = 10;

const PastResults = () => {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResults = JSON.parse(localStorage.getItem('speedTestResults')) || [];
      setResults(storedResults);
    }
  }, []);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const downloadReport = () => {
    const csvContent = [
      ['Speed Type', 'Speed', 'Date & Time'], // Header row
      ...results.map(result => [
        `${result.label} Speed`,
        `${result.value} ${result.label === 'Ping' ? 'ms' : 'Mbps'}`,
        new Date(result.date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      ])
    ]
      .map(e => e.map(item => item.replace(/,/g, ';')).join(',')) // Replace commas with semicolons in values
      .join('\n'); // Join rows with newlines

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'speed_test_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedResults = (results) => {
    return results.sort((a, b) => {
      const aValue = sortConfig.key === 'date' ? new Date(a.date) : a[sortConfig.key];
      const bValue = sortConfig.key === 'date' ? new Date(b.date) : b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const currentResults = sortedResults(results).slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  const generatePDF = async () => {
    const element = document.getElementById('results-table');

    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('speed_test_report.pdf');
    }
  };

  return (
    <div className="antialiased items-center justify-center font-sans bg-gray-900 text-gray-200 px-4 sm:px-8 py-8" style={{ width: "90%" }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold leading-tight">Past Results:</h2>
        <button
          onClick={downloadReport}
          className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded"
        >
          Download Report
        </button>
      </div>
      <div className="mt-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th onClick={() => handleSort('label')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Speed Type {getSortIcon('label')}
                  </th>
                  <th onClick={() => handleSort('value')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Speed {getSortIcon('value')}
                  </th>
                  <th onClick={() => handleSort('date')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date & Time {getSortIcon('date')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentResults.map((result, index) => (
                  <tr key={index} className={`border-b border-gray-600 bg-gray-900 ${index % 2 === 0 ? 'bg-gray-800' : ''}`}>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm">
                      <p className="text-gray-200 whitespace-no-wrap">{result.label} Speed</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm">
                      <p className="text-gray-200 whitespace-no-wrap">
                        {result.value} {result.label === 'Ping' ? 'ms' : 'Mbps'}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm">
                      <p className="text-gray-200 whitespace-no-wrap">
                        {new Date(result.date).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-5 border-t border-gray-600 flex flex-col xs:flex-row items-center xs:justify-between bg-gray-800">
              <span className="text-xs xs:text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, results.length)} of {results.length} Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-l disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages}
                  className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-r disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastResults;