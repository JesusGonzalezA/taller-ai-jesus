---
description: Cómo implementar una feature completa que afecta a frontend y backend
---

# Skill: Feature Full-Stack

## Cuándo usar esta skill

Usa esta skill cuando la feature requiera cambios tanto en el frontend como en el backend.

## Proceso

### 1. Planifica primero

Antes de escribir código, define:
- **Nombre de la feature** (en inglés, kebab-case: `user-profile`)
- **Endpoint(s)** necesarios: método, ruta, request/response shapes
- **Componente(s)** de UI necesarios

### 2. Empieza por el backend

Siempre implementa el backend primero. Así el contrato de la API queda definido antes de hacer el frontend.

1. Crea la ruta → sigue la skill `backend-dev.md`
2. Escribe los tests del backend
3. Verifica: `npm run test --workspace=backend`

### 3. Implementa el frontend

1. Crea el componente/página → sigue la skill `frontend-dev.md`
2. Conecta con la API usando `fetch('/api/...')`
3. Escribe los tests del componente
4. Verifica: `npm run test --workspace=frontend`

### 4. Lint y verificación final

```bash
npm run lint:fix   # corrige problemas automáticamente
npm run test       # ejecuta todos los tests
```

### 5. Crea el PR

Describe en el PR:
- Qué hace la feature
- Cómo se ha testeado
- Cualquier decisión de diseño importante
