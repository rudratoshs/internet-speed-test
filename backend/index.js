const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('startTest', () => {
    // Mocking ping time calculation
    setTimeout(() => {
      const pingTime = Math.floor(Math.random() * 200); // random ping time between 0 and 200ms
      socket.emit('pingResult', { pingTime });
    }, 1000);

    // Mock download speed calculation
    setTimeout(() => {
      const downloadSpeed = Math.floor(Math.random() * 100); // random speed between 0 and 100 Mbps
      socket.emit('downloadResult', { downloadSpeed });
    }, 2000);

    // Mock upload speed calculation
    setTimeout(() => {
      const uploadSpeed = Math.floor(Math.random() * 50); // random speed between 0 and 50 Mbps
      socket.emit('uploadResult', { uploadSpeed });
    }, 3000);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
