const express = require('express');
const { prisma } = require('../prisma');

const router = express.Router();

// GET /api/todos
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  return res.json(todos);
});

// POST /api/todos
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { title } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'Wymagane: title (string).' });
  }
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 140) {
    return res.status(400).json({ message: 'Title: 1..140 znaków.' });
  }
  const todo = await prisma.todo.create({ data: { title: trimmed, userId } });
  return res.status(201).json(todo);
});

// PATCH /api/todos/:id (toggle completed)
router.patch('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existing = await prisma.todo.findFirst({ where: { id, userId } });
  if (!existing) {
    return res.status(404).json({ message: 'Nie znaleziono ToDo.' });
  }

  const todo = await prisma.todo.update({
    where: { id },
    data: { completed: !existing.completed }
  });
  return res.json(todo);
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existing = await prisma.todo.findFirst({ where: { id, userId } });
  if (!existing) {
    return res.status(404).json({ message: 'Nie znaleziono ToDo.' });
  }

  await prisma.todo.delete({ where: { id } });
  return res.status(204).send();
});

module.exports = { todosRouter: router };
