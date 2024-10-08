import express from 'express';

import router from './src/routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(3001, function c() {
  console.log('Server is running on port 3001');
});

