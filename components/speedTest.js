const sampleSizes = [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072]; // Sizes in KB (up to 128 MB)

export const downloadTest = async (updateGaugeCallback, options = {}) => {
    const { testDuration, chunkSize, testCycles } = options;
    let totalSpeed = 0;
    let validCount = 0;
    let lastValidSpeed = 0;
    const startTime = Date.now();

    // If user-defined options are not provided, use the default sampleSizes and loop over them
    const sizes = testCycles && chunkSize ? Array(testCycles).fill(chunkSize) : sampleSizes;

    for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        const url = `https://phpstack-1344875-4935668.cloudwaysapps.com/files/${size}KB.bin`;

        try {
            console.log(`Starting download for ${size} KB...`); // Log the size being downloaded
            const cycleStartTime = Date.now();
            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-cache',
            });

            if (!response.ok) {
                console.error('Response not OK:', response.statusText);
                continue;
            }

            const blob = await response.blob();
            const cycleDuration = (Date.now() - cycleStartTime) / 1000; // Convert to seconds

            // Log the cycle duration
            console.log(`Cycle Duration for ${size} KB: ${cycleDuration.toFixed(3)} seconds`);

            // Calculate the speed in Mbps
            const speed = (size / cycleDuration / 1024) * 8; // Speed in Mbps
            console.log(`Calculated Speed for ${size} KB: ${speed.toFixed(2)} Mbps`); // Log the calculated speed

            // Include valid speeds for small files as well
            if (cycleDuration > 0.1 || size <= 2048) {
                totalSpeed += speed;
                validCount++;
                lastValidSpeed = speed;
                console.log(`Valid Download Speed: ${lastValidSpeed.toFixed(2)} Mbps for ${size} KB.`);
            } else {
                console.log(`Download took less than 0.1 seconds for ${size} KB. Duration: ${cycleDuration.toFixed(2)} seconds. Estimated Speed: ${(size / cycleDuration / 1024).toFixed(2)} MB/s`);
            }

            // Update the speedometer in real-time
            if (updateGaugeCallback) {
                console.log(`Updating gauge with speed: ${lastValidSpeed.toFixed(2)} Mbps`); // Log the speed passed to the gauge
                updateGaugeCallback(lastValidSpeed); // Pass the speed value
            }

            // Break if the total test duration exceeds the user-defined duration
            if (testDuration && (Date.now() - startTime) / 1000 > testDuration) {
                console.log('Test duration limit reached, ending test...');
                break;
            }
        } catch (error) {
            console.error('Download failed:', error);
            return { speed: 0 };
        }
    }

    // Calculate and return the average speed if there are valid speeds
    if (validCount > 0) {
        const averageSpeed = (totalSpeed / validCount).toFixed(2);
        console.log(`Average Download Speed: ${averageSpeed} Mbps`);
        return { speed: averageSpeed };
    }

    // Return the last calculated speed if no valid average could be determined
    console.log(`Returning last calculated speed: ${lastValidSpeed.toFixed(2)} Mbps`);
    return { speed: lastValidSpeed.toFixed(2) };
};

export const uploadTest = async () => {
    // Create a sample file for upload
    const fileSize = 128 * 1024; // 128 KB
    const blob = new Blob([new Uint8Array(fileSize)], { type: 'application/octet-stream' });

    const startTime = Date.now();
    const url = 'https://forested-cyan-swoop.glitch.me/upload'; // Replace with your server URL

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: blob,
        });
        const duration = (Date.now() - startTime) / 1000; // in seconds
        const speed = (fileSize / duration / 1024).toFixed(2); // Convert KB/s to MB/s
        console.log(`Upload Speed: ${speed} MB/s`);
        return { speed: parseFloat(speed) }; // Return speed as a number
    } catch (error) {
        console.error('Upload failed:', error);
        return { speed: 0 }; // Return 0 if upload fails
    }
};