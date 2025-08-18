# Cliente React MVC

Proyecto creado con Vite + React reorganizado siguiendo un estilo inspirado en MVC (Modelo - Vista - Controlador) + Services.

## Estructura

```
src/
	models/         # Modelos de dominio (estructuras de datos)
		Post.js
	services/       # Acceso a APIs / datos externos
		postService.js
	controllers/    # Orquestación entre servicios y vistas
		postController.js
	views/          # Componentes React de presentación
		PostsView.jsx
	App.jsx         # Punto de ensamblaje de vistas
	main.jsx        # Bootstrap ReactDOM
```

## Flujo
1. La vista (`PostsView`) solicita datos al controlador.
2. El controlador (`postController`) llama al servicio.
3. El servicio (`postService`) hace fetch a la API pública y devuelve instancias del modelo (`Post`).
4. La vista renderiza la información.

### Flujo de Autenticación Simulada
1. `UserGeneratorView` obtiene un candidato de `randomuser.me` vía `authService`.
2. `LoginView` recibe el candidato y el usuario introduce username + password.
3. `authController.loginWithCredentials` valida credenciales (mock) y devuelve `User`.
4. `App` guarda el usuario autenticado y muestra `PostsView`.

## API Pública usada
Se usa `https://jsonplaceholder.typicode.com/posts` limitada a 10 resultados para ejemplo.

## Scripts
```
npm run dev     # Desarrollo con HMR
npm run build   # Build producción
npm run preview # Servir build
```

## Mejoras futuras sugeridas
- Añadir TypeScript para tipado fuerte.
- React Query / SWR para cache de datos.
- Tests unitarios (Jest + Testing Library) para controlador y vista.
- Manejo de rutas (React Router) si se añaden más vistas.

## Rutas actuales
| Ruta | Descripción |
|------|-------------|
| /auth | Pantalla de generación de usuario + login |
| / | Dashboard simple protegido |
| /posts | Listado de posts (protegido) |

