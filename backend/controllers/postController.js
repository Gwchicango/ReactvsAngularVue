
const Post = require('../models/Post');
const User = require('../models/User');

exports.getAllPosts = async (req, res) => {
  try {
  const posts = await Post.findAll({ include: [{ model: User, attributes: ['id', 'username', 'email'] }] });
  res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener posts' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const [updated] = await Post.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const post = await Post.findByPk(req.params.id);
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post no encontrado' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Post no encontrado' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar post' });
  }
};
