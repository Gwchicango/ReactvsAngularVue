
# Backend Node/Express + MySQL

Este backend provee autenticación de usuarios y gestión de posts, habitaciones, huéspedes y reservas para clientes Angular y React. Expone endpoints REST y utiliza MySQL como base de datos.

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
2. Crea un archivo `.env` con la configuración de tu base de datos:
  ```env
  MYSQL_HOST=localhost
  MYSQL_DATABASE=bd_registro
  MYSQL_USER=root
  MYSQL_PASSWORD=root
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
  - `POST /posts` — Crear post
  - `PUT /posts/:id` — Editar post
  - `PATCH /posts/:id` — Patch parcial
  - `DELETE /posts/:id` — Eliminar post
- **Habitaciones (Rooms):**
  - `GET /hotel/rooms` — Lista habitaciones
  - `GET /hotel/rooms/:id` — Detalle habitación
  - `POST /hotel/rooms` — Crear habitación
  - `PUT /hotel/rooms/:id` — Editar habitación
  - `DELETE /hotel/rooms/:id` — Eliminar habitación
- **Huéspedes (Guests):**
  - `GET /hotel/guests` — Lista huéspedes
  - `GET /hotel/guests/:id` — Detalle huésped
  - `POST /hotel/guests` — Crear huésped
  - `PUT /hotel/guests/:id` — Editar huésped
  - `DELETE /hotel/guests/:id` — Eliminar huésped
- **Reservas (Reservations):**
  - `GET /hotel/reservations` — Lista reservas
  - `GET /hotel/reservations/:id` — Detalle reserva
  - `POST /hotel/reservations` — Crear reserva
  - `PUT /hotel/reservations/:id` — Editar reserva
  - `DELETE /hotel/reservations/:id` — Eliminar reserva (solo si está cancelada o finalizada)

## 5. Variables de entorno

El backend usa un archivo `.env` para configuración sensible. Ejemplo:

```env
MYSQL_HOST=localhost
MYSQL_DATABASE=bd_registro
MYSQL_USER=root
MYSQL_PASSWORD=root
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

El backend espera una base de datos MySQL con las siguientes tablas:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'disponible'
);

CREATE TABLE guests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  document VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL
);

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roomId INT NOT NULL,
  guestId INT NOT NULL,
  checkIn DATE NOT NULL,
  checkOut DATE NOT NULL,
  personas INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (roomId) REFERENCES rooms(id),
  FOREIGN KEY (guestId) REFERENCES guests(id)
);
```

## 8. Seguridad

- Las contraseñas se almacenan hasheadas (bcryptjs).
- El login responde con JWT (si lo implementas, agrega la lógica de generación y validación de tokens).

## 9. Desarrollo y pruebas

- Usa `npm start` para desarrollo.
- Puedes probar los endpoints con Postman, Thunder Client o similar.

## 10. Notas

- Si cambias el puerto, actualiza la URL en el frontend.
- El backend puede convivir con el frontend en el mismo monorepo o por separado.
- Para producción, configura variables de entorno seguras y usa HTTPS.

---

© 2025 Backend Node/Express – Proyecto educativo / demostración.
