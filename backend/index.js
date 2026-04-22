const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

connectDB();
const port = 3000;

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', require('./router/auth'));

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});