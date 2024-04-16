const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

function setupWebSocketServer(server) {
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request, client);
    });
    
  });

  wss.on('connection', (ws, request, client) => {
    ws.on('message', (message) => {
      console.log(`Received message from ${client.id}: ${message}`);
      // Process messages here and broadcast updates as needed
    });

    ws.on('close', () => {
      console.log(`Connection closed: ${client.id}`);
    });
  });

  // Broadcast a message to all connected clients
  function broadcastUpdate(type, data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, ...data }));
      }
    });
  }

  // Expose the broadcast function to other modules
  return { broadcastUpdate };
}


module.exports = { setupWebSocketServer };
