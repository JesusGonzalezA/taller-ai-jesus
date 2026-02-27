---
description: Cómo investigar y corregir un bug
---

# Workflow: Fix Bug

## Paso 1 — Reproduce el bug

Antes de tocar código, confirma que puedes reproducir el bug de forma consistente.
Anota los pasos exactos para reproducirlo.

## Paso 2 — Escribe un test que falle

Crea primero un test que captura el comportamiento incorrecto:

```bash
# Ejecuta solo el test nuevo para ver que falla
npm run test --workspace=frontend
# o
npm run test --workspace=backend
```

Confirma que el test falla con el mensaje esperado.

## Paso 3 — Crea una rama

```bash
git checkout -b fix/descripcion-del-bug
```

## Paso 4 — Corrige el bug

Haz el mínimo cambio necesario para que el test del paso 2 pase.
Evita cambios no relacionados.

## Paso 5 — Verifica que nada se rompió

```bash
npm run test
npm run lint
```

## Paso 6 — Commit y PR

```bash
git add .
git commit -m "Fix descripcion-del-bug"
git push origin fix/descripcion-del-bug
```

En el PR, describe: qué causaba el bug y cómo lo has corregido.
