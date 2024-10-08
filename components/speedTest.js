const sampleSizes = [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072]; // Sizes in KB (up to 128 MB)

export const downloadTest = async (updateGaugeCallback, { testDuration, chunkSize, testCycles }) => {
    let totalSpeed = 0;
    let validCount = 0;
    let lastValidSpeed = 0;
    const startTime = Date.now();

    for (let i = 0; i < testCycles; i++) {
        const size = chunkSize; // Use the user-defined chunk size
        const url = `https://phpstack-1344875-4935668.cloudwaysapps.com/files/${size}KB.bin`;

        try {
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

            // Calculate the speed in Mbps
            const speed = (size / cycleDuration / 1024 * 8).toFixed(2);

            // Update the speedometer in real-time
            if (updateGaugeCallback) {
                updateGaugeCallback(parseFloat(speed));
            }

            totalSpeed += parseFloat(speed);
            validCount++;

            // Break if the total test duration exceeds the user-defined duration
            if ((Date.now() - startTime) / 1000 > testDuration) {
                console.log('Test duration limit reached, ending test...');
                break;
            }
        } catch (error) {
            console.error('Download failed:', error);
            return { speed: 0 };
        }
    }

    if (validCount > 0) {
        const averageSpeed = (totalSpeed / validCount).toFixed(2);
        console.log(`Average Download Speed: ${averageSpeed} Mbps`);
        return { speed: averageSpeed };
    }

    console.log(`Returning last calculated speed: ${lastValidSpeed} Mbps`);
    return { speed: lastValidSpeed };
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