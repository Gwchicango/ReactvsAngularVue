
# ClientAngular

Aplicación de ejemplo en Angular 20 con autenticación, CRUD de posts, habitaciones, huéspedes y reservas, layout adaptable, manejo de estado local con *signals* y rutas protegidas. Integra un backend Node/Express propio para toda la gestión de datos.

---

## 1. Requisitos previos

- Node.js >= 20 (recomendado LTS actual)
- npm >= 10 (instalado con Node)
- Angular CLI 20.x (opcional global para comandos directos):
	```bash
	npm install -g @angular/cli@20
	```
- Navegador moderno

## 2. Instalación

```bash
npm install
```

## 3. Scripts principales (package.json)

| Script | Descripción |
|--------|-------------|
| `npm start` | Dev server con recarga (ng serve en `http://localhost:4200`) |
| `npm run build` | Build producción en `dist/` |
| `npm run watch` | Build en modo watch (desarrollo sin servidor) |
| `npm test` | Unit tests con Karma/Jasmine |
| `npm run serve:ssr:ClientAngular` | Servir bundle SSR (después de build SSR) |

> SSR: el proyecto incluye dependencias (`@angular/ssr`, `express`). Si deseas SSR completo ejecuta primero `ng build --ssr` (o el nuevo comando equivalente según la versión de CLI) y luego el script `serve:ssr:ClientAngular`.

## 4. Ejecución rápida

Desarrollo:
```bash
npm start
```
Abrir: http://localhost:4200

Compilación producción:
```bash
npm run build
```
Archivos: `dist/ClientAngular/`

SSR (experimental / opcional):
```bash
ng build --ssr
npm run serve:ssr:ClientAngular
```

## 5. Estructura de carpetas (resumen funcional)

```
src/app/
	core/
		services/        # Servicios compartidos (Auth, Hotel: rooms, guests, reservations)
		guards/          # Guards de routing (authGuard)
	features/
		auth/            # Login y registro
		home/            # Dashboard
		posts/           # CRUD de posts
		rooms/           # CRUD de habitaciones
		guests/          # CRUD de huéspedes
		reservations/    # CRUD de reservas
	shared/
		components/      # Componentes reutilizables (modal, tabla, etc.)
		ui/              # UI pequeñas (skeleton-card)
	app.*              # Root component + rutas (Layout principal)
```

## 6. Arquitectura y patrones

### Autenticación
`AuthService` funciona como un *contexto global*: mantiene el usuario actual en un `BehaviorSubject`, persiste en `localStorage` y expone `user` / `user$`. El flujo de login incluye generación de un candidato (`generateCandidate()` → API randomuser) y posterior validación manual en la página `Login`.

### Rutas protegidas
`authGuard` bloquea acceso a rutas privadas (`/dashboard`, `/posts`) redirigiendo a `/login` si no hay usuario cargado.

### Layout
El componente raíz `App` actúa de Layout: header con navegación, avatar, botón de logout y `<router-outlet>`. Oculta el header en `/login` para una experiencia enfocada.


### Vista → Controller → Service → Modelo (Posts, Rooms, Guests, Reservations)
- Vista: Cada feature (PostsList, RoomsComponent, GuestsComponent, ReservationsComponent) concentra estado de UI y lógica de interacción.
- Service: `PostsService` y `HotelService` encapsulan llamadas a la API (backend propio y externas).
- Modelos: Entidades tipadas para cada dominio.


### Dashboard
`Dashboard` es una vista ligera: muestra datos del usuario autenticado y resumen de entidades (habitaciones, huéspedes, reservas, posts).

## 7. Flujo de autenticación (detalle)
1. Usuario abre `/login`.
2. Pulsa “Generar” → `AuthService.generateCandidate()` trae datos mock.
3. Escribe o autocompleta usuario y password (deben coincidir exactamente con los generados).
4. Submit → `auth.login()` guarda en memoria + localStorage → navegación a `/dashboard`.
5. Guard permite acceso a rutas protegidas. Logout limpia y redirige.

## 8. Estado y reactividad
Se usan *Angular Signals* (`signal`, `computed`, `effect`) para manejar estado local sin necesidad de librerías externas. Para estado global simple se recurre a un `BehaviorSubject` en `AuthService` (podría migrarse a signal global si se desea uniformidad).

## 9. Testing
Ejecutar unit tests:
```bash
npm test
```
El stack incluye Karma + Jasmine (config estándar generada por CLI). Añade specs junto a los archivos (`*.spec.ts`).

## 10. Estilo y formato
Prettier configurado en `package.json` (line width 100, comillas simples, parser angular para HTML). Ejecuta tu extensión de Prettier o un script personalizado si lo agregas.

## 11. Configuración y variables
No hay `.env`. Las URLs están embebidas (p.ej. `https://jsonplaceholder.typicode.com/posts`). Si se añade configuración: crear `src/environments/` y ajustar `angular.json` para reemplazos.

## 12. Accesibilidad básica
Se incluyen atributos `aria-label` en navegación y uso de botones correctos para acciones; conviene añadir roles y focus management para modales en futuras mejoras.

## 13. Mejoras futuras sugeridas
- Migrar `AuthService` a signals (`toSignal(auth.user$)` o reescritura interna).
- Cache / memoización de lista de posts para búsquedas sin repetir fetch.
- Interceptor HTTP si se cambia de `fetch` a `HttpClient`.
- Centralizar lógica de fuerza de contraseña en un helper reutilizable.
- Implementar guards adicionales (ej: `canDeactivate` en edición si hay cambios sucios).
- Añadir pruebas e2e (Playwright / Cypress).

## 14. Troubleshooting
| Problema | Causa común | Solución |
|----------|-------------|----------|
| Error al instalar paquetes | Versión antigua de Node | Actualizar a Node 20+ |
| `ng` no se reconoce | CLI no instalado global | Usar `npx ng ...` o instalar global |
| Cambios no recargan | Cache del navegador | Forzar reload duro / borrar cache |
| SSR no arranca | Build sin flag SSR | Ejecutar `ng build --ssr` antes de servir |

## 15. Referencias
- Angular docs: https://angular.dev
- JSONPlaceholder API: https://jsonplaceholder.typicode.com
- Random User API: https://randomuser.me


## 16. Integración con Backend propio y gestión hotelera

La aplicación Angular está integrada con un backend Node/Express propio para:
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
- Las URLs del backend están en `src/environments/environment.ts`.
- Puedes cambiar la URL para apuntar a tu servidor local o remoto.

### Flujo resumido
1. Usuario se registra/loguea → backend valida y responde con datos + id.
2. Dashboard y features usan ese id para mostrar y crear registros asociados.
3. Rooms, Guests y Reservations permiten gestión completa desde la UI.

> Para más detalles sobre el backend y los endpoints, revisa la carpeta correspondiente en el monorepo o el README del backend.

---

© 2025 ClientAngular – Proyecto educativo / demostración.
