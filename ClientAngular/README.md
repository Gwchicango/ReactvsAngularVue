# ClientAngular

Aplicación de ejemplo en Angular 20 que demuestra un patrón de capas sencillo: vista → controller (fachada) → service (API) → modelo, más autenticación con guard, layout adaptable y manejo de estado local con *signals*.

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
		services/        # Servicios compartidos (Auth, Posts)
		guards/          # Guards de routing (authGuard)
	features/
		auth/            # Dominio autenticación (página Login)
		home/            # Dashboard (vista ligera)
		posts/           # CRUD de posts (vista rica + controller + modelo)
	shared/
		components/      # Componentes reutilizables (modal, etc.)
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

### Vista → Controller → Service → Modelo (Posts)
- Vista: `PostsList` concentra estado de UI (búsqueda con debounce, formularios, edición rápida, ids ocupados, overlays, modales) usando *signals*.
- Controller: `PostsController` es una fachada que desacopla la vista del servicio (punto para agregar reglas, caching, composición futura).
- Service: `PostsService` encapsula las llamadas fetch a JSONPlaceholder (GET/POST/PUT/PATCH/DELETE) y filtra búsqueda local.
- Modelos: `PostEntity` (forma de la API) y `PostModel` (alias/extendido para UI si se requiere). 

### Dashboard
`Dashboard` es una vista ligera: sólo lee usuario a través de `DashboardController` y muestra datos (incluye barra de fuerza de contraseña). 

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

---

© 2025 ClientAngular – Proyecto educativo / demostración.
