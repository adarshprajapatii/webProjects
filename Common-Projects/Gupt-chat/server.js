const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    // CORS (Cross-Origin Resource Sharing) ko enable kar rahe hain taaki client aur server alag-alag origins par chal sakein
    cors: {
        origin: "*", // Kisi bhi origin se request accept karein
        methods: ["GET", "POST"]
    },
});

// Frontend files ko serve karne ke liye middleware
app.use(express.static(path.join(__dirname, "Frontend")));

// Variables to manage users and rooms
const waitingPool = []; // Ye array un users ko store karta hai jo chat partner ka wait kar rahe hain
const activeRooms = {}; // Ye object active chat rooms ko store karta hai, jahan key roomId aur value users ki array hai

// Socket.IO connection event
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Jab client "joinPool" event emit karta hai
    socket.on("joinPool", () => {
        console.log(`User ${socket.id} joined the pool.`);
        // Check karein ki waiting pool mein koi aur user hai ya nahi
        if (waitingPool.length > 0) {
            // Agar koi hai, toh use pool se remove karke match karein
            const partnerId = waitingPool.pop();
            const roomId = `${socket.id}#${partnerId}`; // Ek unique room ID create karein

            socket.join(roomId); // Current user ko room mein join karein
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.join(roomId); // Partner user ko bhi room mein join karein
                activeRooms[roomId] = [socket.id, partnerId]; // Active rooms mein entry add karein
                console.log(`Matched users: ${socket.id} and ${partnerId} in room ${roomId}`);

                // Dono users ko "matched" event bhejein taaki chat start ho sake
                socket.emit("matched", roomId);
                partnerSocket.emit("matched", roomId);
            }
        } else {
            // Agar pool empty hai, toh current user ko waiting pool mein add karein
            waitingPool.push(socket.id);
        }
    });

    // Jab client "sendMessage" event emit karta hai
    socket.on("sendMessage", ({ roomId, message }) => {
        console.log(`Message from ${socket.id} in room ${roomId}: ${message}`);
        // Message ko room mein doosre user ko bhejein
        socket.to(roomId).emit("receiveMessage", { message });
    });

    // File transfer ke liye events
    socket.on("file-start", ({ roomId, fileName, fileSize, fileType, fileId }) => {
        // Partner ko file transfer start hone ka notification bhejein
        socket.to(roomId).emit("file-start", { fileName, fileSize, fileType, fileId });
    });

    socket.on("file-chunk", ({ roomId, chunk, fileId }) => {
        // File ka chunk partner ko bhejein
        socket.to(roomId).emit("file-chunk", { chunk, fileId });
    });

    socket.on("file-end", ({ roomId, fileId }) => {
        // File transfer end hone ka notification bhejein
        socket.to(roomId).emit("file-end", { fileId });
    });

    // Typing indicator ke liye
    socket.on("typing", ({ roomId, typing }) => {
        // Partner ko typing status bhejein
        socket.to(roomId).emit("partnerTyping", { typing });
    });

    // Jab koi user disconnect hota hai
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Waiting pool se user ko remove karein
        const poolIndex = waitingPool.indexOf(socket.id);
        if (poolIndex > -1) {
            waitingPool.splice(poolIndex, 1);
        }

        // Active room se partner ko notify karein ki unka partner disconnect ho gaya hai
        let roomIdToClose = null;
        for (const roomId in activeRooms) {
            const users = activeRooms[roomId];
            if (users.includes(socket.id)) {
                const partnerId = users.find(id => id !== socket.id);
                if (partnerId) {
                    io.to(partnerId).emit("partnerDisconnected"); // Partner ko event bhejein
                }
                roomIdToClose = roomId;
                break;
            }
        }
        // Room ko active rooms se remove karein
        if (roomIdToClose) {
            delete activeRooms[roomIdToClose];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});