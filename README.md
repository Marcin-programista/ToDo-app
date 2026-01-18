## Uruchomienie

### Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev

### Frontend
cd frontend
cp .env.example .env
npm install
npm run dev

Frontend: http://localhost:5173
Backend: http://localhost:4000
Health: http://localhost:4000/api/health
