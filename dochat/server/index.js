require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const uploadRoute = require('./routes/upload');
const chatRoute = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/upload', uploadRoute);
app.use('/api/chat', chatRoute);

app.get('/', (req, res) => res.json({ status: 'DocChat API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
