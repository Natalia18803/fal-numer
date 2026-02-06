# Sistema de Numerología con Lecturas Inteligentes y Membresía Mensual

## Descripción
Este proyecto es una API REST desarrollada en Node.js con Express y MongoDB para un sistema de numerología que incluye gestión de usuarios, membresías mensuales y generación de lecturas mediante IA simulada.

## Tecnologías
- Node.js
- Express
- MongoDB con Mongoose
- dotenv para variables de entorno

## Instalación
1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Configura MongoDB localmente o usa una conexión en la nube
4. Configura las variables de entorno en `.env` (MONGO_URI)
5. Ejecuta el servidor: `npm run dev`

## Endpoints

### Usuarios
- GET /api/usuarios - Listar todos los usuarios
- GET /api/usuarios/:id - Obtener usuario por ID
- POST /api/usuarios - Registrar nuevo usuario
- PUT /api/usuarios/:id - Actualizar usuario
- PATCH /api/usuarios/:id/estado - Cambiar estado (activo/inactivo)
- DELETE /api/usuarios/:id - Eliminar usuario

### Pagos (Membresías)
- GET /api/pagos - Listar todos los pagos
- GET /api/pagos/:usuario_id - Consultar pagos de un usuario
- POST /api/pagos - Registrar pago mensual
- GET /api/pagos/estado/:usuario_id - Consultar estado de membresía

### Lecturas
- POST /api/lecturas/principal/:usuario_id - Generar lectura principal
- POST /api/lecturas/diaria/:usuario_id - Generar lectura diaria (solo usuarios activos)
- GET /api/lecturas/usuario/:usuario_id - Consultar lecturas de un usuario
- GET /api/lecturas/:id - Consultar lectura específica

## Uso en Postman
1. Importa la colección `postman_collection.json` en Postman
2. Asegúrate de que el servidor esté corriendo en localhost:3000
3. Prueba los endpoints en orden lógico:
   - Primero registra un usuario
   - Registra un pago para activar la membresía
   - Genera lecturas

## Validaciones
- Lectura diaria solo para usuarios con estado 'activo'
- Lectura principal se genera una sola vez por usuario
- Pagos activan automáticamente la membresía por 30 días
- Verificación diaria de vencimientos de membresía
