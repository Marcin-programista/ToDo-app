# Aplikacja ToDo (Frontend + Backend + DB + JWT)

W paczce masz **pełną aplikację ToDo**:
- **Backend**: Node.js + Express + Prisma + SQLite
- **Frontend**: React (Vite)
- **Autoryzacja**: token **JWT** (nagłówek `Authorization: Bearer <token>`)

> Uwaga: W wiadomości prosisz o „zapoznanie się z przesłanym dokumentem”. W tej rozmowie **nie widzę żadnego załącznika**, więc przygotowałem rozwiązanie zgodne z typowymi wymaganiami (CRUD ToDo + DB + JWT). Jeśli doślesz dokument, dopasuję projekt do jego wytycznych.

## Wymagania
- Node.js **18+** (polecam 20+)
- npm (z Node)

## Struktura projektu
```
todo-app/
  backend/
  frontend/
  README.md
```

## Uruchomienie krok po kroku

### 1) Rozpakuj ZIP i otwórz w VS Code
1. Rozpakuj plik zip.
2. W VS Code: **File → Open Folder** i wskaż folder `todo-app`.

### 2) Backend (API + baza SQLite)
1. Otwórz terminal w VS Code.
2. Przejdź do backendu:
   ```bash
   cd backend
   ```
3. Skopiuj plik konfiguracyjny env:
   ```bash
   cp .env.example .env
   ```
4. Zainstaluj zależności:
   ```bash
   npm install
   ```
5. Utwórz bazę danych i tabele (migracje Prisma):
   ```bash
   npx prisma migrate dev
   ```
6. Uruchom backend:
   ```bash
   npm run dev
   ```

Backend wystartuje domyślnie na: `http://localhost:4000`

Szybki test:
- `GET http://localhost:4000/api/health` → `{ "ok": true }`

### 3) Frontend (React)
1. Otwórz **drugi terminal**.
2. Przejdź do frontendu:
   ```bash
   cd frontend
   ```
3. Skopiuj env:
   ```bash
   cp .env.example .env
   ```
   (Jeśli backend działa na innym porcie/hostcie, zmień `VITE_API_URL`.)
4. Zainstaluj zależności:
   ```bash
   npm install
   ```
5. Uruchom frontend:
   ```bash
   npm run dev
   ```

Frontend wystartuje domyślnie na: `http://localhost:5173`

### 4) Użycie aplikacji
1. Wejdź na `http://localhost:5173`
2. Zarejestruj konto.
3. Dodawaj zadania, oznaczaj jako wykonane, usuwaj.

## Endpointy API (dla testów)
### Rejestracja
`POST /api/auth/register`
```json
{ "email": "test@example.com", "password": "secret123" }
```

### Logowanie
`POST /api/auth/login`
```json
{ "email": "test@example.com", "password": "secret123" }
```

### ToDo (wymaga tokenu JWT)
Nagłówek:
`Authorization: Bearer <accessToken>`

- `GET /api/todos` – lista
- `POST /api/todos` – dodanie: `{ "title": "Kupić mleko" }`
- `PATCH /api/todos/:id` – przełącz completed
- `DELETE /api/todos/:id` – usuń

## Najczęstsze problemy
- **CORS**: jeśli zmienisz port frontendu, ustaw w `backend/.env` pole `FRONTEND_URL`.
- **Baza**: SQLite tworzy plik `backend/dev.db`. Usuń go, jeśli chcesz „czysty start” (i uruchom migracje ponownie).
- **Token**: aplikacja zapisuje token w `localStorage`.

Powodzenia! 🙂
