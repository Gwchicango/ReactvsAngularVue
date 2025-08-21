const express = require('express');
const cors = require('cors');
require('dotenv').config();
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotel');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/posts', postRoutes);
app.use('/auth', authRoutes);
app.use('/hotel', hotelRoutes);

const sequelize = require('./db');
const User = require('./models/User');
const Post = require('./models/Post');

sequelize.sync().then(() => {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));
});
