
const jwt = require('jsonwebtoken');

// 🔐 HTTP Middleware (Express)
// exports.verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // Accepts "Bearer <token>"

//   console.log("🛡️ Incoming Authorization Header:", authHeader); // Log full header
//   console.log("🛡️ Extracted Token:", token); // Log extracted token

//   if (!token) {
//     return res.status(403).json({ error: 'No token provided' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ error: 'Unauthorized' });
//     console.log("✅ Token decoded successfully:", decoded);
//     req.user = { id: decoded.userId };
//      console.log("👤 User ID attached to req.user:", req.user.id);
//     next();
//   });
// };
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("🛡️ Incoming Authorization Header:", authHeader); // Log full header
  console.log("🛡️ Extracted Token:", token); // Log extracted token

  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
     console.log("✅ Token decoded successfully:", decoded);
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.user = { id: decoded.userId };
     console.log("👤 User ID attached to req.user:", req.user.id);
    next();
  });
};




// // 🔐 Socket.IO Middleware
// exports.verifyTokenSocket = (socket, next) => {
//   const token = socket.handshake.auth.token;
//   console.log("socket token coming in socket middleware",token)
//   if (!token) {
//     return next(new Error('No token'));
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return next(new Error('Unauthorized'));
//      console.log("✅ Token decoded successfully:", decoded);
//     socket.userId = decoded.userId;
//      console.log("👤 User ID attached to socket.userId:", socket.userId);
//     next();
//   });
// };

// module.exports = {
//   verifyToken,
//   verifyTokenSocket,
// };