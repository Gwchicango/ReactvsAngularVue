# Backend Node/Express + MySQL

Este backend provee autenticación de usuarios y gestión de posts para clientes Angular y React. Expone endpoints REST y utiliza MySQL como base de datos.

---

## 1. Requisitos previos

- Node.js >= 20
- npm >= 10
- MySQL >= 8 (local o remoto)

## 2. Instalación

1. Clona el repositorio y entra a la carpeta `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Crea un archivo `.env` con la configuración de tu base de datos y JWT:
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=nombre_db
   JWT_SECRET=alguna_clave_secreta
   PORT=3001
   ```

## 3. Scripts principales

| Script         | Descripción                        |
|---------------|------------------------------------|
| `npm start`   | Inicia el servidor en modo normal   |
| `npm run dev` | Inicia con nodemon (dev hot reload) |

## 4. Endpoints principales

- **Auth:**
  - `POST /auth/register` — Registro de usuario
  - `POST /auth/login` — Login de usuario
- **Posts:**
  - `GET /posts` — Lista todos los posts
  - `GET /posts/:id` — Detalle de post
  - `POST /posts` — Crear post (requiere auth)
  - `PUT /posts/:id` — Editar post (requiere auth)
  - `DELETE /posts/:id` — Eliminar post (requiere auth)

## 5. Variables de entorno

El backend usa un archivo `.env` para configuración sensible. Ejemplo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=demo_db
JWT_SECRET=supersecreto
PORT=3001
```

- Cambia los valores según tu entorno local/remoto.
- El puerto por defecto es 3001.

## 6. Integración con el frontend

- El frontend (Angular/React) debe apuntar a la URL del backend para login, registro y gestión de posts.
- Ejemplo de URL: `http://localhost:3001/auth/login`
- El backend responde con JWT y datos del usuario.
- Los endpoints de posts requieren autenticación (token en header `Authorization: Bearer ...`).

## 7. Base de datos

- El backend espera una base de datos MySQL con las tablas `users` y `posts`.
- Puedes usar el siguiente esquema básico:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## 8. Seguridad

- Las contraseñas se almacenan hasheadas (bcrypt).
- El login responde con JWT (expira en 1 día por defecto).
- Los endpoints protegidos validan el token JWT.

## 9. Desarrollo y pruebas

- Usa `npm run dev` para desarrollo (hot reload con nodemon).
- Puedes probar los endpoints con Postman, Thunder Client o similar.

## 10. Notas

- Si cambias el puerto, actualiza la URL en el frontend.
- El backend puede convivir con el frontend en el mismo monorepo o por separado.
- Para producción, configura variables de entorno seguras y usa HTTPS.

---

© 2025 Backend Node/Express – Proyecto educativo / demostración.
