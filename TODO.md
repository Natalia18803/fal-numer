# Plan de Implementación de Roles

## Tareas:
- [x] 1. models/usuario.js - Add rol field with enum ['usuario', 'admin']
- [x] 2. Create middlewares/validar-rol.js - New middleware to check roles
- [x] 3. Update controllers/authControllers.js - Include rol in token and response
- [x] 4. Update routes/usuarioRoutes.js - Role-based access control
- [x] 5. Update routes/lecturaRoutes.js - Role-based access control
- [x] 6. Update routes/pagoRoutes.js - Role-based access control
- [x] 7. Update middlewares/validar-jwt.js - Extract rol from token

## Progreso: COMPLETADO
