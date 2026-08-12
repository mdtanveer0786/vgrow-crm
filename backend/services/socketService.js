const socketConnections = new Map(); // map to store active connections by tenantId

let io;

const init = (socketIoInstance) => {
  io = socketIoInstance;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Expect clients to authenticate or join their organization room
    socket.on('join_organization', (tenantId) => {
      if (!tenantId) return;
      socket.join(tenantId);
      console.log(`[Socket] Client ${socket.id} joined organization ${tenantId}`);
      
      // We can also store them in a local map if we need direct access
      if (!socketConnections.has(tenantId)) {
        socketConnections.set(tenantId, new Set());
      }
      socketConnections.get(tenantId).add(socket.id);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      
      // Remove from map if needed (socket.rooms handles most of this automatically though)
      for (const [tenantId, sockets] of socketConnections.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            socketConnections.delete(tenantId);
          }
          break;
        }
      }
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

const emitToOrganization = (tenantId, event, data) => {
  if (!io) return;
  io.to(tenantId).emit(event, data);
};

module.exports = {
  init,
  getIo,
  emitToOrganization,
  socketConnections
};
