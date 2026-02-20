---
description: Cómo añadir endpoints y middleware en el backend (Express + TypeScript)
---

# Skill: Desarrollo Backend

## Cuándo usar esta skill

Usa esta skill cuando necesites:
- Añadir un nuevo endpoint a la API
- Crear middleware (auth, validación, logging, etc.)
- Escribir tests de integración para rutas
- Manejar errores globalmente

## Estructura de carpetas

```
backend/
├── src/
│   ├── routes/       # Routers de Express por dominio
│   ├── middleware/   # Middleware reutilizable
│   ├── lib/          # Utilidades y helpers
│   ├── app.ts        # Express app (exportada para tests)
│   └── index.ts      # Arranque del servidor
└── __tests__/        # Tests de integración con supertest
```

## Añadir un endpoint

1. Si el dominio es nuevo, crea `backend/src/routes/nombre.ts`:

```ts
import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ data: [] });
});

export default router;
```

2. Registra el router en `backend/src/app.ts`:

```ts
import nombreRouter from './routes/nombre';
app.use('/api/nombre', nombreRouter);
```

3. Crea el test en `backend/__tests__/nombre.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/nombre', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/api/nombre');
    expect(res.status).toBe(200);
  });
});
```

## Manejo de errores

Añade siempre un middleware de errores al final de `app.ts`:

```ts
app.use((err: Error, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
```
