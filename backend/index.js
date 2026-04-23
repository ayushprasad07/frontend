const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');

connectDB();
const port = 3000;

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./router/auth'));
app.use('/api/item', require('./router/item'));

app.get('/', (req, res) => {
    res.send('Server is runing perfectly!');
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});