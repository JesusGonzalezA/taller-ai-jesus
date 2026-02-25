---
description: Verificar requisitos del sistema e instalar todas las dependencias del proyecto
---

# Workflow: Install

Ejecuta estos pasos en orden para preparar el entorno de desarrollo desde cero.

## Paso 1 — Verificar Node.js

El proyecto requiere **Node.js 20 o superior**.

```bash
node --version
```

Si la versión es inferior a `v20.0.0`, instala la versión LTS desde [nodejs.org](https://nodejs.org) o usando un gestor de versiones:

```bash
# Con nvm
nvm install 20
nvm use 20

# Con fnm
fnm use 20
```

## Paso 2 — Verificar Git

```bash
git --version
```

Si Git no está instalado, descárgalo desde [git-scm.com](https://git-scm.com).

## Paso 3 — Instalar dependencias

Desde la raíz del proyecto, ejecuta:

```bash
npm install
```

Esto instala las dependencias de todos los workspaces (`frontend` y `backend`) en una sola operación gracias a npm workspaces.

## Paso 4 — Verificar la instalación

```bash
npm run lint
npm run test
```

Si ambos comandos pasan sin errores, el entorno está listo. ✅

## Paso 5 — Arrancar en desarrollo

```bash
npm run dev
```

- Frontend disponible en: [http://localhost:5173](http://localhost:5173)
- Backend disponible en: [http://localhost:3000](http://localhost:3000)
- Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health)
