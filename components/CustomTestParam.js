import React from 'react';

const CustomTestParam = ({
  testDuration,
  setTestDuration,
  chunkSize,
  setChunkSize,
  testCycles,
  setTestCycles,
  isCustomSettingsEnabled,
  toggleCustomSettings,
}) => {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <div>
        <label className="block mb-2">Test Duration (seconds):</label>
        <input
          type="number"
          value={testDuration}
          onChange={(e) => setTestDuration(parseInt(e.target.value))}
          disabled={!isCustomSettingsEnabled}
          className={`p-2 rounded bg-gray-800 text-white ${
            isCustomSettingsEnabled ? '' : 'opacity-50'
          }`}
        />
      </div>
      <div>
        <label className="block mb-2">Data Chunk Size (KB):</label>
        <input
          type="number"
          value={chunkSize}
          onChange={(e) => setChunkSize(parseInt(e.target.value))}
          disabled={!isCustomSettingsEnabled}
          className={`p-2 rounded bg-gray-800 text-white ${
            isCustomSettingsEnabled ? '' : 'opacity-50'
          }`}
        />
      </div>
      <div className="flex items-center space-x-2">
        <div>
          <label className="block mb-2">Test Cycles:</label>
          <input
            type="number"
            value={testCycles}
            onChange={(e) => setTestCycles(parseInt(e.target.value))}
            disabled={!isCustomSettingsEnabled}
            className={`p-2 rounded bg-gray-800 text-white ${
              isCustomSettingsEnabled ? '' : 'opacity-50'
            }`}
          />
        </div>
        <div className="flex items-center ml-4">
          <span className="mr-2">Custom Settings</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isCustomSettingsEnabled}
              onChange={toggleCustomSettings}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 transition-all"></div>
            <div className="absolute w-5 h-5 bg-white border border-gray-300 rounded-full shadow transform peer-checked:translate-x-5 transition-all"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CustomTestParam;