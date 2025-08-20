# Instrucciones para crear un backend con base de datos para el proyecto React

## 1. Estructura recomendada

```
backend/
  controllers/
    postController.js
    authController.js
  models/
    Post.js
    User.js
  routes/
    postRoutes.js
    authRoutes.js
  db.js
  app.js
  package.json
  .env
```

## 2. Pasos para crear el backend

### a) Crear carpeta y dependencias
```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv mongoose
```

### b) Archivo principal `app.js`
```js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

require('./db');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));
```

### c) Conexión a la base de datos `db.js`
```js
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión', err));
```

En `.env`:
```
MONGO_URI=mongodb://localhost:27017/tu_basededatos
```

### d) Modelo de ejemplo `models/Post.js`
```js
const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
  userId: Number
});
module.exports = mongoose.model('Post', PostSchema);
```

### e) Rutas y controladores básicos

`routes/postRoutes.js`:
```js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
```

`controllers/postController.js` (ejemplo básico):
```js
const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

exports.createPost = async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.status(201).json(post);
};

exports.updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
};

exports.deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
```

### f) Adaptar el frontend
- Cambia `BASE_URL` en `src/services/postService.js` a `http://localhost:3000`.
- Los endpoints `/posts` funcionarán igual que con JSONPlaceholder, pero ahora con datos reales.

---

