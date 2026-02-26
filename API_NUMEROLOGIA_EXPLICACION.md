# 📖 API DE NUMEROLOGÍA - EXPLICACIÓN COMPLETA

## ¿CÓMO FUNCIONA TU API?

Tu API es un sistema de **membresías de numerología** donde los usuarios pueden:
1. Registrarse y hacer login
2. Realizar pagos para activar su membresía
3. Obtener lecturas numerológicas (principal y diaria)

---

## 🔄 FLUJO COMPLETO DE USO

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. Registro │────▶│  2. Login   │────▶│  3. Pago    │────▶│ 4. Lecturas │
│  (GRATIS)    │     │  (GRATIS)   │     │  (PAGO)     │     │  (PREMIUM)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 📡 EJEMPLOS CON CURL

### 1. REGISTRO DE USUARIO (GRATIS)
```
bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456",
    "fecha_nacimiento": "1990-05-15"
  }'
```
**Respuesta:**
```
json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "estado": "inactivo"
  }
}
```

---

### 2. LOGIN
```
bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'
```
**Respuesta:**
```
json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "...",
    "nombre": "Juan Pérez",
    "estado": "inactivo"
  }
}
```

⚠️ **GUARDA EL TOKEN** - Lo necesitarás para todas las demás peticiones

---

### 3. OBTENER MI USUARIO (con token)
```
bash
curl -X GET http://localhost:3000/api/auth \
  -H "x-token: TU_TOKEN_AQUI"
```

---

### 4. REALIZAR PAGO (Activar membresía)
```
bash
curl -X POST http://localhost:3000/api/pagos \
  -H "Content-Type: application/json" \
  -H "x-token: TU_TOKEN_AQUI" \
  -d '{
    "usuario_id": "ID_DEL_USUARIO",
    "monto": 50.00,
    "metodo": "tarjeta"
  }'
```
**Efecto:** El usuario cambia de `inactivo` → `activo` por 30 días

---

### 5. CONSULTAR ESTADO DE MEMBRESÍA
```
bash
curl -X GET http://localhost:3000/api/pagos/estado/ID_USUARIO \
  -H "x-token: TU_TOKEN_AQUI"
```
**Respuesta:**
```
json
{
  "usuario_id": "...",
  "estado": "activo",
  "mensaje": "Membresía activa hasta 15/06/2025"
}
```

---

### 6. GENERAR LECTURA PRINCIPAL (Solo 1 vez por usuario)
```
bash
curl -X POST http://localhost:3000/api/lecturas/principal/ID_USUARIO \
  -H "x-token: TU_TOKEN_AQUI"
```
**Respuesta:**
```
json
{
  "message": "Lectura principal generada",
  "lectura": {
    "usuario_id": "...",
    "tipo": "principal",
    "contenido": "Tu número de vida es 15...",
    "fecha_lectura": "2025-05-15T..."
  }
}
```

---

### 7. GENERAR LECTURA DIARIA (1 por día, solo si tienes membresía activa)
```
bash
curl -X POST http://localhost:3000/api/lecturas/diaria/ID_USUARIO \
  -H "x-token: TU_TOKEN_AQUI"
```
**Respuesta:**
```
json
{
  "message": "Lectura diaria generada",
  "lectura": {
    "contenido": "Lectura diaria para 15/05/2025: Hoy es un día propicio..."
  }
}
```

---

## 🔐 AUTENTICACIÓN

Todas las rutas protegidas (excepto registro y login) requieren:
- Header: `x-token: TU_JWT_TOKEN`

El token dura **30 días**.

---

## ⚠️ BUG ENCONTRADO

En `routes/pagoRoutes.js`, el POST debe ir ANTES del GET para evitar conflictos:

```
javascript
// ❌ INCORRECTO (actual)
router.get('/:usuario_id', ...);  // Esto captura el POST!
router.post('/', ...);

// ✅ CORRECTO
router.post('/', ...);  // Primero el POST
router.get('/:usuario_id', ...);  // Luego el GET
```

---

## 📊 RESUMEN DE ENDPOINTS

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/registro` | ❌ | Registrarse |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth` | ✅ | Mi perfil |
| GET | `/api/usuarios` | ✅ | Todos los usuarios |
| GET | `/api/usuarios/:id` | ✅ | Usuario por ID |
| PUT | `/api/usuarios/:id` | ✅ | Actualizar usuario |
| PATCH | `/api/usuarios/:id/estado` | ✅ | Cambiar estado |
| DELETE | `/api/usuarios/:id` | ✅ | Eliminar usuario |
| GET | `/api/pagos` | ✅ | Todos los pagos |
| GET | `/api/pagos/:usuario_id` | ✅ | Pagos de usuario |
| POST | `/api/pagos` | ✅ | Crear pago |
| GET | `/api/pagos/estado/:usuario_id` | ✅ | Estado membresía |
| GET | `/api/lecturas` | ✅ | Todas las lecturas |
| GET | `/api/lecturas/usuario/:id` | ✅ | Lecturas de usuario |
| GET | `/api/lecturas/:id` | ✅ | Lectura por ID |
| POST | `/api/lecturas/principal/:id` | ✅ | Lectura principal |
| POST | `/api/lecturas/diaria/:id` | ✅ | Lectura diaria |

---

## 🎯 NOTAS IMPORTANTES

1. **Usuario nuevo** = estado `inactivo` (no puede ver lecturas diarias)
2. **Pago realizado** = estado `activo` por 30 días
3. **Lectura principal** = solo se genera 1 vez
4. **Lectura diaria** = 1 por día, solo usuarios activos
