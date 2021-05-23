const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/**Connection**/
exports.socketService = (io) => {
    const users = global.socketUsers;
    // Connection
    io.on("connection", async (socket) => {
        console.log("New client: " + socket.id);
        socket.join(socket.id);
        users[socket.id] = true;
        // Force disconnect
        socket.on("Force-Disconnect", () => {
            socket.disconnect();
        })

        // Disconnect
        socket.on("disconnect", () => {
            console.log("Client disconnect: " + socket.id);
            socket.leave(socket.id);
            delete users[socket.id];
        })
    });

    
}