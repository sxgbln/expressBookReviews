const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session?.authorization?.accessToken) {
    const token = req.session.authorization.accessToken;
    jwt.verify(token, 'fingerprint_customer', (err, user) => { // Use the same secret key
      if (err) {
        return res.status(403).json({ message: "Not authorized" });
      }
      req.user = user; // Store decoded user data (e.g., username) in req.user
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    return res.status(401).json({ message: "User not authenticated" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
