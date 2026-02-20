---
description: Cómo arrancar el entorno de desarrollo local completo
---

# Workflow: Run Dev

## Requisitos previos

Asegúrate de haber ejecutado el workflow `install.md` antes de continuar.

## Arrancar todo en paralelo

Desde la raíz del proyecto:

```bash
npm run dev
```

Este comando arranca simultáneamente:
- **Frontend**: Vite dev server → [http://localhost:5173](http://localhost:5173)
- **Backend**: Express con tsx en modo watch → [http://localhost:3000](http://localhost:3000)

## Arrancar por separado (opcional)

Si necesitas arrancar solo una parte:

```bash
# Solo frontend
npm run dev --workspace=frontend

# Solo backend
npm run dev --workspace=backend
```

## Verificar que todo funciona

1. Abre [http://localhost:5173](http://localhost:5173) → debes ver la página de bienvenida
2. Abre [http://localhost:3000/api/health](http://localhost:3000/api/health) → debes recibir `{ "status": "ok" }`

## Hot reload

- **Frontend**: Vite hace hot module replacement (HMR) automáticamente al guardar
- **Backend**: `tsx watch` reinicia el servidor automáticamente al guardar

## Parar el servidor

`Ctrl + C` para parar ambos procesos.
