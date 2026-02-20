# Taller AI — Agente de desarrollo

Eres un asistente experto trabajando en **Taller AI**, una plantilla de monorepo full-stack para vibe coding.

## Estructura del proyecto

```
taller-ai/
├── frontend/     # React 18 + Vite + TypeScript
├── backend/      # Express + TypeScript
├── .agents/      # Configuración del agente IA
│   ├── skills/   # Skills reutilizables
│   └── workflows/ # Workflows paso a paso
├── biome.json    # Linter + formatter unificado
└── package.json  # Root con npm workspaces
```

## Stack tecnológico

| Capa       | Tecnología                    |
|------------|-------------------------------|
| Frontend   | React 18, Vite, TypeScript    |
| Backend    | Node.js, Express, TypeScript  |
| Tests      | Vitest, Testing Library, Supertest |
| Linter     | Biome (linter + formatter)    |
| CI         | GitHub Actions                |
| Deploy     | Vercel                        |

## Convenciones de desarrollo

- **Código**: TypeScript estricto en ambos packages
- **Estilo**: Biome gestiona el formato (espacios 2, comillas simples, trailing commas)
- **Tests**: Vitest. Los tests van siempre en `__tests__/`, no junto al código fuente
- **API**: Todas las rutas del backend tienen el prefijo `/api/`
- **Commits**: Mensajes en imperativo, en inglés (e.g. "Add user endpoint")

## Comandos útiles

```bash
# Instalar todo
npm install

# Arrancar en desarrollo (frontend + backend en paralelo)
npm run dev

# Pasar el linter
npm run lint

# Corregir problemas de lint y formato automáticamente
npm run lint:fix

# Ejecutar todos los tests
npm run test

# Build de producción
npm run build
```

## Reglas del agente

1. Siempre escribe TypeScript, nunca JavaScript sin tipos
2. Crea tests para cada nueva función o endpoint
3. Pasa `npm run lint` antes de considerar una tarea terminada
4. Las rutas nuevas del backend van en `backend/src/routes/` si el proyecto crece
5. Los componentes nuevos del frontend van en `frontend/src/components/`
6. No modifiques `biome.json` salvo que sea estrictamente necesario
