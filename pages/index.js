import React, { useState } from 'react';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
const Speedometer = dynamic(() => import('../components/Speedometer'), {
  ssr: false,
});
import PastResults from '../components/PastResults';
import CustomTestParam from '../components/CustomTestParam'; // Import the new component
import { downloadTest, uploadTest } from '../components/SpeedTest';

const socket = io('http://localhost:3001');

const Home = () => {
  const [ping, setPing] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [testDuration, setTestDuration] = useState(10);
  const [chunkSize, setChunkSize] = useState(1024);
  const [testCycles, setTestCycles] = useState(3);
  const [isCustomSettingsEnabled, setIsCustomSettingsEnabled] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeSpeedometer, setActiveSpeedometer] = useState(null);

  const toggleCustomSettings = () => {
    setIsCustomSettingsEnabled(!isCustomSettingsEnabled);
  };

  const startTest = async () => {
    setIsTesting(true);
    setActiveSpeedometer('download');

    socket.emit('startTest');

    socket.on('pingResult', ({ pingTime }) => setPing(pingTime));

    const options = isCustomSettingsEnabled ? { testDuration, chunkSize, testCycles } : {};

    // Download Test
    const downloadResult = await downloadTest(setDownloadSpeed, options);
    setDownloadSpeed(downloadResult.speed);
    socket.emit('downloadResult', { downloadSpeed: downloadResult.speed });

    setActiveSpeedometer('upload');

    // Upload Test
    const uploadResult = await uploadTest(setUploadSpeed, options);
    setUploadSpeed(uploadResult.speed);
    socket.emit('uploadResult', { uploadSpeed: uploadResult.speed });

    setIsTesting(false);
    setActiveSpeedometer(null);
  };

  // Determine button text and color
  const buttonText = isTesting ? 'Processing...' : (downloadSpeed && uploadSpeed) ? 'Re-Test' : 'Start Testing';
  const buttonColor = isTesting ? 'bg-yellow-500' : (downloadSpeed && uploadSpeed) ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-4 text-center md:text-4xl">Test Your Internet Speed</h1>
      <p className="mb-8 text-center sm:text-lg">Find out how fast your internet connection is.</p>

      <CustomTestParam
        testDuration={testDuration}
        setTestDuration={setTestDuration}
        chunkSize={chunkSize}
        setChunkSize={setChunkSize}
        testCycles={testCycles}
        setTestCycles={setTestCycles}
        isCustomSettingsEnabled={isCustomSettingsEnabled}
        toggleCustomSettings={toggleCustomSettings}
      />

      <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
        <Speedometer label="Ping" value={ping} max={1000} active={activeSpeedometer === 'ping'} />
        <Speedometer label="Download" value={downloadSpeed} max={500} active={activeSpeedometer === 'download'} />
        <Speedometer label="Upload" value={uploadSpeed} max={500} active={activeSpeedometer === 'upload'} />
      </div>

      <button
        onClick={startTest}
        className={`mt-8 px-6 py-3 rounded-lg text-lg button  bg-green-600
    ${isTesting ? 'processing' : (downloadSpeed > 0 && uploadSpeed > 0 ? 'completed' : '')}`}
      >
        {isTesting ? 'Processing...' : (downloadSpeed > 0 && uploadSpeed > 0 ? 'Test Again' : 'Start Testing')}
      </button>
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0" style={{width:"100%"}}>

      <PastResults />
      </div>
    </div>
  );
};

export default Home;