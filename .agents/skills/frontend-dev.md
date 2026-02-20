---
description: Cómo desarrollar componentes y páginas en el frontend (React + Vite)
---

# Skill: Desarrollo Frontend

## Cuándo usar esta skill

Usa esta skill cuando necesites:
- Crear un nuevo componente React
- Añadir una nueva página/ruta
- Conectar el frontend con el backend
- Escribir tests de componentes

## Estructura de carpetas

```
frontend/
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── pages/        # Componentes de página (una por ruta)
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilidades y helpers
│   ├── App.tsx
│   └── main.tsx
└── __tests__/        # Tests de componentes y hooks
```

## Crear un componente

1. Crea el archivo en `frontend/src/components/NombreComponente.tsx`
2. Usa TypeScript estricto con props tipadas:

```tsx
interface Props {
  title: string;
  onAction?: () => void;
}

export default function NombreComponente({ title, onAction }: Props) {
  return <div>{title}</div>;
}
```

3. Crea su test en `frontend/__tests__/NombreComponente.test.tsx`

## Test de un componente

```tsx
import { render, screen } from '@testing-library/react';
import NombreComponente from '../src/components/NombreComponente';

describe('NombreComponente', () => {
  it('renders title', () => {
    render(<NombreComponente title="Hola" />);
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });
});
```

## Llamadas al backend

Usa `fetch` con rutas relativas a `/api/`:

```ts
const res = await fetch('/api/tu-ruta');
const data = await res.json();
```

En local, Vite hace proxy de `/api/*` al backend (puerto 3000).
Configura el proxy en `vite.config.ts` si no está ya:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:3000',
  },
},
```
