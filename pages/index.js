import React, { useState } from 'react';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
const Speedometer = dynamic(() => import('../components/Speedometer'), {
  ssr: false,
});
import PastResults from '../components/PastResults'; // Adjust the import path if needed
import { downloadTest, uploadTest } from '../components/speedTest'; // Import your speed test logic

const socket = io('http://localhost:3001');

const Home = () => {
  const [ping, setPing] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);

  // New state variables for test settings
  const [testDuration, setTestDuration] = useState(10); // Default 10 seconds
  const [chunkSize, setChunkSize] = useState(1024); // Default 1024 KB
  const [testCycles, setTestCycles] = useState(3); // Default 3 cycles

  // The startTest function to be triggered when the button is clicked
  const startTest = async () => {
    socket.emit('startTest');

    // Ping test logic
    socket.on('pingResult', ({ pingTime }) => setPing(pingTime));

    // Download test logic with real-time gauge updates
    const downloadResult = await downloadTest(setDownloadSpeed, { testDuration, chunkSize, testCycles });
    setDownloadSpeed(downloadResult.speed);
    socket.emit('downloadResult', { downloadSpeed: downloadResult.speed });

    // Upload test logic with real-time gauge updates
    const uploadResult = await uploadTest(setUploadSpeed, { testDuration, chunkSize, testCycles });
    setUploadSpeed(uploadResult.speed);
    socket.emit('uploadResult', { uploadSpeed: uploadResult.speed });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-4 text-center md:text-4xl">Test Your Internet Speed</h1>
      <p className="mb-8 text-center sm:text-lg">Find out how fast your internet connection is.</p>
      
      {/* Settings for Customizable Parameters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div>
          <label className="block mb-2">Test Duration (seconds):</label>
          <input
            type="number"
            value={testDuration}
            onChange={(e) => setTestDuration(parseInt(e.target.value))}
            className="p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-2">Data Chunk Size (KB):</label>
          <input
            type="number"
            value={chunkSize}
            onChange={(e) => setChunkSize(parseInt(e.target.value))}
            className="p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-2">Test Cycles:</label>
          <input
            type="number"
            value={testCycles}
            onChange={(e) => setTestCycles(parseInt(e.target.value))}
            className="p-2 rounded bg-gray-800 text-white"
          />
        </div>
      </div>

      {/* Speedometers */}
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
        <Speedometer label="Ping" value={ping} max={1000} />
        <Speedometer label="Download" value={downloadSpeed} max={500} />
        <Speedometer label="Upload" value={uploadSpeed} max={500} />
      </div>

      {/* Start Test Button */}
      <button
        onClick={startTest}
        className="mt-8 px-6 py-3 bg-blue-600 rounded-lg text-lg"
      >
        Start Testing
      </button>

      {/* Display Past Results */}
      <PastResults />
    </div>
  );
};

export default Home;