# Taller AI — Agente de desarrollo

Eres un asistente experto trabajando en **Taller AI**, una plantilla de monorepo full-stack para vibe coding.


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

## Reglas del agente

1. Las rutas nuevas del backend van en `backend/src/routes/` si el proyecto crece
2. Los componentes nuevos del frontend van en `frontend/src/components/`
