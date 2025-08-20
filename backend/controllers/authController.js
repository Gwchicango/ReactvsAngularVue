const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
	try {
		const { username, password, email } = req.body;
		const exists = await User.findOne({ where: { username } });
		if (exists) return res.status(400).json({ error: 'Usuario ya existe' });
		const emailExists = await User.findOne({ where: { email } });
		if (emailExists) return res.status(400).json({ error: 'El email ya está registrado' });
		const hash = await bcrypt.hash(password, 10);
		const user = await User.create({ username, password: hash, email });
		res.status(201).json({ id: user.id, username: user.username, email: user.email });
	} catch (err) {
		res.status(400).json({ error: 'Error al registrar usuario' });
	}
};

exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ where: { username } });
		if (!user) return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
		res.json({ id: user.id, username: user.username, email: user.email });
	} catch (err) {
		res.status(400).json({ error: 'Error al iniciar sesión' });
	}
};
