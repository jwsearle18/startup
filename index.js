const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const cors = require('cors');

const { peerProxy, broadcastOrder } = require('./peerProxy');


// const fetch = require('node-fetch');

const authCookieName = 'token';

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3003;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.use(cors());


apiRouter.get('/searchGroceryProducts', async (req, res) => {
  const query = req.query.query;
  const apiKey = 'bfbf551c64974ba1b23c22788e0b29bd';
  const spoonacularUrl = `https://api.spoonacular.com/food/ingredients/search?query=${query}&number=10&apiKey=${apiKey}`;

  try {
      const response = await fetch(spoonacularUrl);
      const data = await response.json();
      res.json(data);
  } catch (error) {
      console.error('Error fetching grocery products:', error);
      res.status(500).send('Error fetching grocery products');
  }
});

// Register an owner
apiRouter.post('/register/owner', async (req, res) => {
  const { email, password, address } = req.body;
  try {
    const user = await DB.createUser(email, password, 'owner', address);
    setAuthCookie(res, user.token); // Set the auth cookie
    res.status(201).json({ message: "Owner registered successfully", userId: user._id.toString() });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Error registering owner');
  }
});

// Register a renter
apiRouter.post('/register/renter', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await DB.createUser(email, password, 'renter');
      setAuthCookie(res, user.token); // Set the auth cookie
      res.status(201).json({ message: "Renter registered successfully", userId: user._id.toString() });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send('Error registering renter');
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);

      let userAddress = null;
      if (user.addressAssociations && user.addressAssociations.length > 0) {
        userAddress = user.addressAssociations[0].address;
      }

      res.send({ userId: user._id.toString(), userAddress, role: user.role }); // Send the user's unique ID as a string
      return;
    }
  }
  res.status(401).send({ msg: 'Incorrect Email or Password' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();


secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    req.userId = user._id.toString();
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.use(secureApiRouter);

secureApiRouter.post('/renter/associate-address', async (req, res) => {
  const { userId, address, startDate, endDate } = req.body;
  try {
      await DB.associateAddress(userId, address, startDate, endDate);
      res.status(200).json({ message: "Address associated successfully" });
  } catch (error) {
      console.error('Association error:', error);
      res.status(500).send('Error associating address');
  }
});

secureApiRouter.post('/orders', async (req, res) => {
  const { userId, address, items } = req.body;
  
  const canOrder = await DB.canPlaceOrder(userId, address);
  if (!canOrder) {
      return res.status(403).send("You're not authorized to place an order for this address.");
  }

  try {
      await DB.addOrder({ userId, address, items });
      

      let message;
      if (items.length === 1) {
          message = `${items[0].name} was just ordered by another renter!`;
      } else {
          const itemNames = items.map(item => item.name);
          const lastItem = itemNames.pop();
          message = `${itemNames.join(", ")} and ${lastItem} were just ordered by another renter!`;
      }
      broadcastOrder(message);
      console.log(message);

      res.status(201).send('Order placed successfully.');
      
  } catch (error) {
      console.error('Order placement error:', error);
      res.status(500).send('Error placing order');
  }
});


secureApiRouter.get('/orders/:address', async (req, res) => {
  const { address } = req.params;
  const userId = req.userId;

  const isOwner = await DB.isOwnerOfAddress(userId, address);
  if (!isOwner) {
    return res.status(403).json({ message: "You're not authorized to place an order for this address." });
  }

  try {
      const orders = await DB.getOrdersByAddress(address);
      res.json(orders);
  } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).send('Error retrieving orders');
  }
});

apiRouter.delete('/auth/logout', (req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).send("Logged out successfully");
});


setInterval(DB.dissociateExpiredAddresses, 24 * 60 * 60 * 1000);

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  DB.dissociateExpiredAddresses();
});

peerProxy(httpService);