require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { authRouter } = require('./routes/auth');
const { todosRouter } = require('./routes/todos');
const { authRequired } = require('./middleware/auth');

const app = express();

const PORT = Number(process.env.PORT || 4000);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: false
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/todos', authRequired, todosRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Nieoczekiwany błąd serwera.' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
