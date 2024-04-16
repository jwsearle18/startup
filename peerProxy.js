// const { WebSocketServer } = require('ws');
// const wss = new WebSocketServer({ noServer: true });
// const userSockets = new Map(); // Maps user IDs to WebSocket connections

// function setupWebSocketServer(httpServer) {
//     httpServer.on('upgrade', function upgrade(request, socket, head) {
//         // You could perform authentication here if necessary

//         wss.handleUpgrade(request, socket, head, function done(ws) {
//             ws.on('message', function incoming(message) {
//                 const { userId, action } = JSON.parse(message);
//                 if (action === 'register') {
//                     userSockets.set(userId, ws);
//                 }
//                 // Additional message handling...
//             });

//             ws.on('close', () => {
//                 // Remove the closed connection from the map
//                 userSockets.forEach((value, key) => {
//                     if (value === ws) {
//                         userSockets.delete(key);
//                     }
//                 });
//             });
//         });
//     });
// }

// // Function to send a message to a specific user
// function sendMessageToUser(userId, data) {
//     const ws = userSockets.get(userId);
//     if (ws && ws.readyState === ws.OPEN) {
//         ws.send(JSON.stringify(data));
//     }
// }

// module.exports = { setupWebSocketServer, sendMessageToUser };