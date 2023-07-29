const net = require('node:net');

function findAvailablePort(desiredPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(0)
          .then((port) => resolve(port))
          .catch((err) => reject(err));
      } else {
        reject(err);
      }
    });

    server.listen(desiredPort, () => {
      const { port } = server.address();
      server.close(() => {
        resolve(port);
      });
    });
  });
}

module.exports = { findAvailablePort };
