import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Speedometer from './Speedometer';
import PastResults from './PastResults';

const ReportSection = ({ ping, downloadSpeed, uploadSpeed, isTesting }) => {
    const reportRef = useRef();
    const [results, setResults] = useState([]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedResults = JSON.parse(localStorage.getItem('speedTestResults')) || [];
            setResults(storedResults);
        }
    }, []);

    const generatePDF = async () => {
        const element = reportRef.current;

        // Ensure the element is rendered
        if (!element) {
            console.error("Element not found");
            return;
        }

        // Temporarily make the report section visible off-screen
        const originalStyles = {
            display: element.style.display,
            position: element.style.position,
            top: element.style.top,
            left: element.style.left,
            opacity: element.style.opacity,
            pointerEvents: element.style.pointerEvents,
        };

        element.style.position = 'absolute'; // Position off-screen
        element.style.top = '-9999px';
        element.style.left = '-9999px';
        element.style.display = 'block'; // Make it visible for rendering

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true, // Allow cross-origin images
            });

            const imgData = canvas.toDataURL('image/png');
            console.log('Image Data:', imgData); // Validate image data

            // Ensure imgData is not empty and is a valid image format
            if (!imgData || !imgData.startsWith('data:image/png;base64,')) {
                console.error('Invalid image data');
                return;
            }

            const pdf = new jsPDF('p', 'px', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Adjust the image type and dimensions
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            // console.log('pdf',pdf)
            pdf.save('speed-test-report.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            // Restore the original styles
            element.style.display = originalStyles.display;
            element.style.position = originalStyles.position;
            element.style.top = originalStyles.top;
            element.style.left = originalStyles.left;
            element.style.opacity = originalStyles.opacity;
            element.style.pointerEvents = originalStyles.pointerEvents;
        }
    };

    return (
        <div>
            {/* Hidden Report Section */}
            <div ref={reportRef} style={{ display: 'none', backgroundColor: 'black', color: 'white' }}>
                <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
                    <Speedometer label="Ping" value={ping} max={1000} />
                    <Speedometer label="Download" value={downloadSpeed} max={500} />
                    <Speedometer label="Upload" value={uploadSpeed} max={500} />
                </div>
                <div className="mt-4">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort('label')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        </th>
                                        <th onClick={() => handleSort('value')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        </th>
                                        <th onClick={() => handleSort('date')} className="cursor-pointer px-5 py-3 border-b-2 border-gray-600 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result, index) => (
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
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={generatePDF}
                className={`mt-4 text-sm bg-[#ff1644] hover:bg-[#e0133a] text-white font-semibold py-2 px-4 rounded ${isTesting || (!downloadSpeed && !uploadSpeed) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                disabled={isTesting || (!downloadSpeed && !uploadSpeed)}
            >
                Download UI Report
            </button>
        </div>
    );
};

export default ReportSection;
