import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import jsPDF from 'jspdf';

const Speedometer = ({ label, value, max }) => {
  console.log('',label, 'value', value);
  // Convert value to a number
  const numericValue = Math.round(Number(value)); // Convert and round value to a number
  const isValidValue = !isNaN(numericValue) && numericValue >= 0; // Check if it's a valid number

  // Debugging: Log the current speed value
  console.log(`${label} Speed Value:`, numericValue); // Log the speed value for debugging

  // Store the result in localStorage
  const storeResult = () => {
    const previousResults = JSON.parse(localStorage.getItem('speedTestResults')) || [];
    previousResults.push({ label, value: numericValue, date: new Date() }); // Store numeric value
    localStorage.setItem('speedTestResults', JSON.stringify(previousResults));
  };

  // Call storeResult when value changes
  React.useEffect(() => {
    if (isValidValue) {
      storeResult();
    }
  }, [numericValue]); // Trigger on value change

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Internet Speed Test Report', 20, 10);
    doc.text(`Test Date: ${new Date().toLocaleString()}`, 20, 20);
    doc.text(`Label: ${label} Speed`, 20, 30);
    doc.text(`Value: ${numericValue} ${label === 'Ping' ? 'ms' : 'Mbps'}`, 20, 40);
    doc.save('speed-test-report.pdf');
  };

  return (
    <div className="flex flex-col items-center">
      <ReactSpeedometer
        maxValue={max}
        value={isValidValue ? numericValue : 0} // Use 0 or any default value if invalid
        needleColor="#FF1744"
        startColor="#00C6FF"
        endColor="#FF3D00"
        segments={8}
        needleTransitionDuration={2000}
        needleTransition="easeElastic"
        ringWidth={12}
        textColor="#E0E0E0"
        width={320}
        height={200}
        customSegmentStops={[0, max * 0.2, max * 0.4, max * 0.6, max * 0.8, max]}
        segmentColors={['#00C6FF', '#007AFF', '#FF9100', '#FF5252', '#FF3D00']}
        valueTextFontSize="18px"
        labelFontSize="12px"
      />
      <h3 className="mt-4 text-lg text-[#E0E0E0]">
        {label} Speed: {isValidValue ? numericValue : 0} {label === 'Ping' ? 'ms' : 'Mbps'}
      </h3>

    </div>
  );
};

export default Speedometer;