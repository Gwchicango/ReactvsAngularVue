# Cliente React (MVC Adaptado + Gestión Hotelera)

SPA construida con Vite + React + React Router. Implementa un patrón MVC adaptado al frontend (Models / Services / Controllers / Views) y un contexto de autenticación ligero. Permite autenticación, gestión de posts, habitaciones, huéspedes y reservas, todo integrado con un backend Node/Express propio.

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
    authController.js    # Lógica auth
    postController.js    # Lógica posts
    hotelController.js   # Lógica habitaciones, huéspedes, reservas
  models/
    User.js              # Modelo de usuario
    Post.js              # Modelo de post
  services/
    authService.js       # Llamadas HTTP relacionadas con auth
    postService.js       # Acceso HTTP a JSONPlaceholder
    hotelService.js      # Acceso HTTP a backend hotel (rooms, guests, reservations)
  views/
    LoginView.jsx        # Pantalla de login
    UserGeneratorView.jsx# Generador de usuario candidato
    HomeView.jsx         # Vista de inicio tras login
    PostsView.jsx        # CRUD de posts
    RoomsView.jsx        # CRUD de habitaciones
    GuestsView.jsx       # CRUD de huéspedes
    ReservationsView.jsx # CRUD de reservas
    *.css                # Estilos por vista
  components/
    TableCrud.jsx        # Tabla reutilizable
    ModalForm.jsx        # Modal reutilizable
  App.jsx                # Rutas + layout + protección
  main.jsx               # Bootstrap ReactDOM / Router
index.css                # Design system base
vite.config.*            # Configuración Vite
eslint.config.js         # Config ESLint
tsconfig.json            # Config TS (JS allowed, TS incremental posible)
```

## 4. Arquitectura (MVC Adaptado)
- Models: Clases simples (`Post`, `User`) que encapsulan y normalizan la forma de los datos.
- Services: Aíslan la capa HTTP (auth, posts, hotel). Devuelven instancias de modelos.
- Controllers: Validaciones ligeras, orquestan varios services, exponen funciones puras para las vistas.
- Views: Componentes React de página que manejan estado de interacción (formularios, loaders, edición) y llaman controllers.
- Context: `AuthContext` actúa como mini store global (sesión) y se consulta en componentes y rutas protegidas.

## 5. Flujo Funcional
Login → Home → Posts / Rooms / Guests / Reservations.
1. Usuario ingresa a `/auth`: genera candidato y hace login (sesión se guarda en contexto).
2. Se redirige a `/Home` (ruta protegida). `Protected` evita acceso directo a rutas sin sesión.
3. En `/posts`, `/rooms`, `/guests`, `/reservations` se cargan y gestionan entidades vía controllers/services/backend.
4. Búsqueda, filtros y validaciones en cada módulo. Las reservas calculan automáticamente el total (personas × 50) y validan capacidad y fechas.
5. Crear / Editar / Eliminar actualizan estado local y muestran feedback inmediato.

## 6. APIs Consumidas
- JSONPlaceholder: https://jsonplaceholder.typicode.com (posts)
- randomuser.me: https://randomuser.me (usuarios demo)
- Backend propio: http://localhost:3000 (auth, posts, rooms, guests, reservations)

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
Variables de entorno en `.env`:
```
VITE_API_URL=https://randomuser.me
VITE_API_URL_POST=https://jsonplaceholder.typicode.com
VITE_BACKEND_URL=http://localhost:3000
```
Puedes cambiar la URL del backend para apuntar a tu servidor local o remoto.

## 10. Estilos
- `index.css`: design tokens (colores, radios, sombras, tipografía) + utilidades.
- CSS modular por vista (ej: `posts.css`, `RoomsView.css`, etc) para estilos específicos.
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
- Capa de hooks (`usePosts`, `useRooms`, etc) para encapsular lógica de datos.
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

## 16. Integración con Backend propio y gestión hotelera

La app React está integrada con un backend Node/Express propio para:
- Autenticación de usuarios (`/auth/register`, `/auth/login`)
- CRUD de posts
- CRUD de habitaciones (`/hotel/rooms`)
- CRUD de huéspedes (`/hotel/guests`)
- CRUD de reservas (`/hotel/reservations`)

### Ejemplo de uso de features hoteleros
- Menú de navegación permite acceder a Rooms, Guests y Reservations.
- Cada módulo permite alta, edición, borrado y listado de entidades.
- Las reservas calculan automáticamente el total (personas × 50) y validan capacidad y fechas.
- Los estados de habitaciones y reservas se muestran con badges de color.

### Configuración de URLs
- Las URLs del backend están en `.env`.
- Puedes cambiar la URL para apuntar a tu servidor local o remoto.

### Flujo resumido
1. Usuario se registra/loguea → backend valida y responde con datos + id.
2. Home y features usan ese id para mostrar y crear registros asociados.
3. Rooms, Guests y Reservations permiten gestión completa desde la UI.

> Para más detalles sobre el backend y los endpoints, revisa la carpeta correspondiente en el monorepo o el README del backend.
