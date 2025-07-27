const express = require('express');
const app = express();
const cors = require('cors');
const { connectToDatabase } = require('./db/connection');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yaml');

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const itemRoutes = require('./routes/items');
app.use('/items', itemRoutes);

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
