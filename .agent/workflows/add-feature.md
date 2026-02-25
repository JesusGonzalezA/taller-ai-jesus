---
description: Cómo añadir una nueva feature al proyecto
---

# Workflow: Add Feature

Sigue estos pasos cada vez que vayas a añadir una nueva funcionalidad.

## Paso 1 — Crea una rama

```bash
git checkout -b feature/nombre-de-la-feature
```

Usa kebab-case en inglés para el nombre (e.g. `feature/user-profile`).

## Paso 2 — Planifica

Antes de escribir código, define brevemente:
- ¿Qué debe hacer esta feature?
- ¿Qué endpoints de API necesita?
- ¿Qué componentes de UI necesita?

Si toca frontend y backend, consulta la skill `full-stack-feature`.

## Paso 3 — Implementa

Sigue la skill correspondiente según lo que necesites:
- Solo frontend → skill `frontend-dev`
- Solo backend → skill `backend-dev`
- Ambos → skill `full-stack-feature`

## Paso 4 — Tests

```bash
npm run test
```

Todos los tests deben pasar. Crea tests nuevos para el código nuevo.

## Paso 5 — Lint

```bash
npm run lint:fix
```

## Paso 6 — Commit y PR

```bash
git add .
git commit -m "Add nombre-de-la-feature"
git push origin feature/nombre-de-la-feature
```

Abre un Pull Request en GitHub. El CI verificará lint y tests automáticamente.
