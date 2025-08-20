# Cliente React (Arquitectura MVC Adaptada)

Aplicación SPA construida con Vite + React + React Router. Implementa un patrón MVC adaptado al frontend (Models / Services / Controllers / Views) y un contexto de autenticación ligero. Permite: autenticación simulada, listado, búsqueda, filtrado, creación, edición (total y parcial) y eliminación (simulada) de posts contra la API pública JSONPlaceholder.

## 1. Requisitos Previos
- Node.js >= 18 (se recomienda LTS)
- npm >= 9 (incluido con Node)
- Conexión a internet (consumo de API pública y generación de usuario / avatar si se amplía)

Verifica:
```
node -v
npm -v
```

## 2. Instalación y Ejecución Rápida
```
npm install        # instala dependencias
npm run dev        # inicia servidor desarrollo (HMR)
```
Abrir en el navegador: http://localhost:5173 (puerto por defecto de Vite, puede variar si está ocupado; la consola indicará el final).

Build de producción y preview:
```
npm run build
npm run preview    # sirve dist/ de forma local
```

Lint opcional:
```
npm run lint
```

## 3. Estructura de Directorios
```
src/
	assets/                # Imágenes / SVG
	context/
		AuthContext.jsx      # Estado global de sesión (login/logout)
	controllers/
		authController.js    # Lógica orquestadora auth
		postController.js    # Lógica orquestadora posts
	models/
		User.js              # Modelo de usuario
		Post.js              # Modelo de post
	services/
		authService.js       # Llamadas HTTP relacionadas con auth (simuladas / random user)
		postService.js       # Acceso HTTP a JSONPlaceholder
	views/
		LoginView.jsx        # Pantalla de login
		UserGeneratorView.jsx# Generador de usuario candidato
		HomeView.jsx         # Vista de inicio tras login
		PostsView.jsx        # Vista CRUD de posts
		*.css                # Estilos por vista
	App.jsx                # Rutas + layout + protección
	main.jsx               # Bootstrap ReactDOM / Router
index.css                # Design system base
vite.config.*            # Configuración Vite
eslint.config.js         # Config ESLint
tsconfig.json            # Config TS (JS allowed, TS incremental posible)
```

## 4. Arquitectura (MVC Adaptado)
- Models: Clases simples (`Post`, `User`) que encapsulan y normalizan la forma de los datos.
- Services: Aislan la capa HTTP (endpoints, query params, manejo de errores). Devuelven instancias de modelos.
- Controllers: Validaciones ligeras, orquestan varios services, exponen funciones puras para las vistas.
- Views: Componentes React de página que manejan estado de interacción (formularios, loaders, edición) y llaman controllers.
- Context: `AuthContext` actúa como mini store global (sesión) y se consulta en componentes y rutas protegidas.

Beneficio: cambiar endpoints solo toca services, añadir reglas de negocio se concentra en controllers, y la UI se mantiene enfocada en presentación.

## 5. Flujo Funcional
Login → Home → Posts.
1. Usuario ingresa a `/auth`: genera candidato y hace login (sesión se guarda en contexto).
2. Se redirige a `/Home` (ruta protegida). `Protected` evita acceso directo a rutas sin sesión.
3. En `/posts`, la vista carga posts (lista completa) llamando controller → service → API → modelos.
4. Búsqueda usa debounce (420ms) para reducir peticiones. Filtros y refresh reutilizan la misma función `load()`.
5. Crear / Editar / Patch / Delete actualizan estado local y muestran feedback (busy ids, overlays, banners de error).

## 6. API Consumida
JSONPlaceholder: https://jsonplaceholder.typicode.com
- GET /posts (se obtiene listado completo sin límite por defecto)
- GET /posts?userId=ID (filtro)
- GET /posts?title_like=texto (búsqueda por título)
- POST /posts, PUT /posts/:id, PATCH /posts/:id, DELETE /posts/:id (operaciones simuladas; la API no persiste realmente, se mantiene coherencia en estado local).

## 7. Estado y Rendimiento
- Debounce de búsqueda: minimiza llamadas.
- `busyIds` (Set) para bloqueo fino por registro durante operaciones.
- Overlays y skeletons para percepción de rendimiento.
- Sin caching avanzado: se deja listo para integrar SWR / React Query.

## 8. Scripts (package.json)
```
dev       -> vite
start     -> vite (alias)
build     -> vite build
preview   -> vite preview
lint      -> eslint .
```

## 9. Configuración / Variables
No se requieren variables de entorno. Si se quisiera cambiar la API base, editar `BASE_URL` en `postService.js`.

## 10. Estilos
- `index.css`: design tokens (colores, radios, sombras, tipografía) + utilidades.
- CSS modular por vista (ej: `posts.css`) para estilos específicos.
- Modo claro/oscuro usando `prefers-color-scheme`.

## 11. Accesibilidad y UX
- Loader con `role="status"` y `aria-live`.
- Modales con `role="dialog"` + `aria-modal`.
- Botones claros para acciones CRUD + feedback de error visible.

## 12. Testing (Sugerido)
Pendiente. Recomendado: Jest + React Testing Library. Priorizar tests de services (mocks de fetch) y controllers (validaciones), luego smoke tests de vistas.

## 13. Mejoras Futuras
- Paginación real (parámetros `_page` y `_limit`).
- Persistencia de sesión (localStorage o cookies seguras).
- Manejo centralizado de errores/toasts.
- Capa de hooks (`usePosts`) para encapsular lógica de datos.
- Migración gradual a TypeScript estricto.
- Pruebas E2E (Playwright o Cypress).

## 14. Solución de Problemas
| Problema | Causa probable | Solución |
|----------|----------------|----------|
| No carga posts | Sin conexión o CORS temporal | Reintentar / comprobar red |
| Login redirige siempre a /auth | Context sin usuario (no se hizo login) | Completar login en /auth |
| Cambia el puerto | Puerto 5173 ocupado | Usar el nuevo puerto que muestra Vite |
| Edición no persiste tras refresh | API simulada no guarda cambios | Es comportamiento esperado |

## 15. Licencia
Uso educativo / demo. 

---
