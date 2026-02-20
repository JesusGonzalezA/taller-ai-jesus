# 🚀 Taller AI

> Plantilla de monorepo full-stack lista para **vibe coding** con IA.

[![CI](https://github.com/TU_ORG/taller-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/TU_ORG/taller-ai/actions/workflows/ci.yml)

## Stack

| Capa       | Tecnología                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite + TypeScript            |
| Backend    | Node.js + Express + TypeScript          |
| Tests      | Vitest + Testing Library + Supertest    |
| Linter     | Biome (linter + formatter unificado)    |
| CI         | GitHub Actions                          |
| Deploy     | Vercel                                  |

## Inicio rápido

```bash
# 1. Clona o usa esta plantilla desde GitHub
git clone https://github.com/TU_ORG/taller-ai.git
cd taller-ai

# 2. Instala las dependencias (requiere Node.js >= 20)
npm install

# 3. Arranca el entorno de desarrollo
npm run dev
```

- **Frontend** → [http://localhost:5173](http://localhost:5173)
- **Backend** → [http://localhost:3000](http://localhost:3000)
- **Health check** → [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Comandos disponibles

| Comando           | Descripción                                           |
|-------------------|-------------------------------------------------------|
| `npm run dev`     | Arranca frontend + backend en paralelo                |
| `npm run test`    | Ejecuta todos los tests (frontend y backend)          |
| `npm run lint`    | Pasa el linter con Biome                              |
| `npm run lint:fix`| Corrige problemas de lint y formato automáticamente   |
| `npm run build`   | Build de producción                                   |

## Estructura del proyecto

```
taller-ai/
├── .agents/            # Configuración del agente IA
│   ├── AGENT.md        # Contexto del proyecto para la IA
│   ├── skills/         # Guías reutilizables por dominio
│   └── workflows/      # Flujos de trabajo paso a paso
├── .github/
│   ├── workflows/ci.yml        # GitHub Actions CI
│   └── ISSUE_TEMPLATE/
├── frontend/           # React + Vite + TypeScript
│   ├── src/
│   └── __tests__/
├── backend/            # Express + TypeScript
│   ├── src/
│   └── __tests__/
├── biome.json          # Linter + formatter
└── vercel.json         # Configuración de despliegue
```

## Usar con IA (vibe coding)

Este repositorio incluye configuración lista para trabajar con agentes IA:

- **`.agents/AGENT.md`** — el agente entiende el proyecto desde el primer momento
- **`.agents/skills/`** — guías para añadir features frontend, backend o full-stack
- **`.agents/workflows/`** — flujos para instalar, desarrollar, añadir features o corregir bugs

Simplemente abre el proyecto en tu editor con IA favorito y empieza a vibe codear. 🎉

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Vercel detectará automáticamente la configuración de `vercel.json`
3. Cada push a `main` lanzará un nuevo deploy

## Contribuir

1. Crea una rama: `git checkout -b feature/mi-feature`
2. Haz tus cambios y pasa los checks: `npm run lint && npm run test`
3. Abre un Pull Request — el CI se ejecutará automáticamente

---

Hecho con ❤️ para el taller de vibe coding.
