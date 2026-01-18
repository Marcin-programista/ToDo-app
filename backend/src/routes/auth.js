const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../prisma');

const router = express.Router();

function signToken(user) {
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
  );
  return token;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Wymagane: email, password.' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Hasło musi mieć min. 6 znaków.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Użytkownik o tym emailu już istnieje.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash } });

    const accessToken = signToken(user);
    return res.status(201).json({ accessToken, user: { id: user.id, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: 'Błąd serwera.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Wymagane: email, password.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
    }

    const accessToken = signToken(user);
    return res.json({ accessToken, user: { id: user.id, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: 'Błąd serwera.' });
  }
});

module.exports = { authRouter: router };
