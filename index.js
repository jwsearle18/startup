const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3003;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

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

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});