# Auth User Service

Microservicio de autenticación y perfil de usuario autocontenido, desarrollado con Node.js, TypeScript, Express.js, PostgreSQL y Prisma ORM.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Probar con Postman](#probar-con-postman)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Troubleshooting](#troubleshooting)

## 🚀 Características

- **Autenticación JWT** con tokens de acceso y refresh
- **Gestión de perfil de usuario**
- **Base de datos PostgreSQL** con Prisma ORM
- **TypeScript** para type safety
- **Arquitectura en capas** (routes, controllers, services)
- **Manejo de errores centralizado**
- **Validación de datos**
- **Seguridad con bcrypt** para hash de contraseñas

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org/)
- **PostgreSQL** (v12 o superior) - [Descargar](https://www.postgresql.org/download/)
- **npm** o **yarn**
- **Postman** - [Descargar](https://www.postman.com/downloads/)
- **Git** (opcional)

## 🔧 Instalación

### 1. Clonar el repositorio (o descargar el código)

```bash
git clone https://github.com/Juan-Cartagena/pfm-oauth.git
cd auth-user-service
```

### 2. Instalar dependencias

```bash
npm install
```

## ⚙️ Configuración

### 1. Configurar PostgreSQL

Primero, asegúrate de que PostgreSQL esté ejecutándose. Luego crea una base de datos:

```bash
# Opción 1: Usando createdb
createdb auth_user_db

# Opción 2: Usando psql
psql -U postgres
CREATE DATABASE auth_user_db;
\q
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/auth_user_db?schema=public"

# JWT Secrets (puedes cambiar estos valores por otros más seguros)
JWT_ACCESS_SECRET=tu_clave_secreta_para_access_token_muy_segura
JWT_REFRESH_SECRET=tu_clave_secreta_para_refresh_token_muy_segura

# Server
PORT=3000
NODE_ENV=development
```

### 3. Configurar la base de datos con Prisma

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar las migraciones para crear las tablas
npm run prisma:migrate
```

Si deseas ver tu base de datos visualmente:

```bash
npm run prisma:studio
```

## 🏃‍♂️ Ejecutar el Proyecto

### Modo desarrollo (con hot reload):

```bash
npm run dev
```

Deberías ver:
```
Server is running on port 3000
Environment: development
```

### Verificar que el servicio está funcionando:

Abre tu navegador y ve a: `http://localhost:3000/health`

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Probar con Postman

### 1. Importar la colección en Postman

1. Abre Postman
2. Click en **Import** (botón arriba a la izquierda)
3. Selecciona **File**
4. Navega hasta `docs/api/auth-user-service.postman_collection.json`
5. Click en **Import**

### 2. Configurar el entorno en Postman

1. Click en el ícono de engranaje (⚙️) en la esquina superior derecha
2. Click en **Add** para crear un nuevo entorno
3. Nombre del entorno: `Auth User Service Local`
4. Agrega las siguientes variables:

| Variable | Type | Initial Value | Current Value |
|----------|------|---------------|---------------|
| baseUrl | default | http://localhost:3000 | http://localhost:3000 |
| accessToken | default | | |
| refreshToken | default | | |

5. Click en **Save**
6. Selecciona el entorno desde el dropdown en la esquina superior derecha

### 3. Ejecutar las pruebas en orden

#### Paso 1: Registrar un usuario

1. En la colección, navega a: `Authentication > Register`
2. Revisa el body de la petición:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```
3. Click en **Send**
4. Respuesta esperada (201 Created):
```json
{
  "status": "success",
  "data": {
    "message": "User registered successfully",
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

#### Paso 2: Login

1. Ve a: `Authentication > Login`
2. Click en **Send**
3. Los tokens se guardarán automáticamente en las variables de entorno
4. Respuesta esperada (200 OK):
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Paso 3: Obtener perfil

1. Ve a: `Profile > Get Profile`
2. Nota que el header `Authorization` usa automáticamente `{{accessToken}}`
3. Click en **Send**
4. Respuesta esperada (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "currencyPreference": "USD",
    "theme": "light",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Paso 4: Actualizar perfil

1. Ve a: `Profile > Update Profile`
2. Modifica el body según necesites:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "currencyPreference": "EUR",
  "theme": "dark"
}
```
3. Click en **Send**
4. Verifica que los datos se actualizaron correctamente

#### Paso 5: Refresh Token

1. Ve a: `Authentication > Refresh Token`
2. Click en **Send**
3. Un nuevo `accessToken` se guardará automáticamente

### 4. Probar casos de error

#### Usuario duplicado:
1. Intenta registrar el mismo email nuevamente
2. Deberías recibir un error 409 Conflict

#### Login con credenciales incorrectas:
1. Modifica la contraseña en el login
2. Deberías recibir un error 401 Unauthorized

#### Acceso sin token:
1. Ve a las variables de entorno
2. Borra el valor de `accessToken`
3. Intenta acceder al perfil
4. Deberías recibir un error 401 Unauthorized

## 📚 Endpoints Disponibles

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/refresh-token` | Renovar access token | No |

### Perfil

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/profile` | Obtener perfil del usuario | Sí |
| PUT | `/api/profile` | Actualizar perfil del usuario | Sí |

### Utilidades

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/health` | Verificar estado del servicio | No |

## 📁 Estructura del Proyecto

```
auth-user-service/
├── src/
│   ├── routes/          # Definición de rutas
│   ├── controllers/     # Lógica de controladores
│   ├── services/        # Lógica de negocio
│   ├── middleware/      # Middlewares (auth, errors)
│   ├── utils/           # Utilidades (JWT)
│   ├── types/           # Tipos de TypeScript
│   └── index.ts         # Punto de entrada
├── prisma/
│   └── schema.prisma    # Esquema de base de datos
├── docs/                # Documentación
├── tests/               # Scripts de prueba
├── .env                 # Variables de entorno
├── .env.example         # Ejemplo de variables
├── package.json         # Dependencias
└── tsconfig.json        # Configuración TypeScript
```

## 🔍 Troubleshooting

### Error: Cannot connect to database

**Solución:**
1. Verifica que PostgreSQL esté ejecutándose
2. Verifica las credenciales en `.env`
3. Asegúrate de que la base de datos existe

### Error: JWT Secret not defined

**Solución:**
1. Verifica que el archivo `.env` existe
2. Asegúrate de que las variables JWT están definidas

### Error: Port already in use

**Solución:**
1. Cambia el puerto en `.env`
2. O detén el proceso que usa el puerto 3000

### Los tokens expiran muy rápido

**Solución:**
1. Los access tokens duran 15 minutos por defecto
2. Usa el endpoint de refresh token para renovar
3. Puedes modificar la duración en `src/utils/jwt.utils.ts`

## 🛠️ Scripts disponibles

```bash
# Desarrollo
npm run dev              # Iniciar en modo desarrollo

# Producción
npm run build           # Compilar TypeScript
npm start              # Iniciar servidor compilado

# Base de datos
npm run prisma:generate # Generar cliente Prisma
npm run prisma:migrate  # Ejecutar migraciones
npm run prisma:studio   # Abrir Prisma Studio
```

## 📝 Notas adicionales

- Los passwords se hashean con bcrypt (10 salt rounds)
- Los tokens JWT incluyen el userId y email
- El access token expira en 15 minutos
- El refresh token expira en 7 días
- Todos los endpoints devuelven JSON
- Los errores siguen un formato consistente

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request