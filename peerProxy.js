const { WebSocketServer, WebSocket } = require('ws');
const uuid = require('uuid');

let wss;
let connections = [];

function peerProxy(httpServer) {
  wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
      wss.emit('connection', socket, request);
    });
  });

  

  wss.on('connection', (ws, request) => {
    const connection = { id: uuid.v4(), alive: true, ws };
    connections.push(connection);

    ws.on('message', data => {
      const message = JSON.parse(data);
        broadcastOrder(message.orders);
    });

    ws.on('close', () => {
      connections = connections.filter(c => c.id !== connection.id);
    });

    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  setInterval(() => {
    connections.forEach(c => {
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping(() => {});
      }
    });
  }, 10000);

}

function broadcastOrder(orders) {
    if (!wss || !wss.clients) {
        console.error('WebSocket server is not initialized or has no clients.');
        return;
      }
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'newOrder',
        orders
      }));
    }
  });
}

module.exports = { peerProxy, broadcastOrder };
