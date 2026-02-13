# Sistema de Gestión Académica - Evaluación Práctica

Aplicación web integral para el análisis de rendimiento académico, detección de riesgos de deserción y monitoreo de carga docente. El sistema implementa una arquitectura moderna utilizando **Next.js 15**, **PostgreSQL** y **Docker**.

---

## 📋 Dependencias y Prerrequisitos

Para ejecutar este proyecto, **únicamente** necesitas tener instalado el siguiente software en tu equipo anfitrión.

### Software Requerido (Host)
* **Docker Desktop** (Asegúrate de que Docker Engine esté corriendo).
* **Git** (Opcional).

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para desplegar la aplicación. El sistema **no contiene credenciales en el código**, por lo que es necesario configurar las variables de entorno para su primer inicio.

### 1. Configuración de Variables de Entorno (Seguridad)

1.  En la raíz del proyecto, crea un archivo llamado `.env` (si no existe).
2.  Define las siguientes variables con las contraseñas seguras que tú elijas. El sistema se configurará automáticamente con los valores que escribas aquí.

```ini
# --- SECRETOS DE INFRAESTRUCTURA ---

# 1. Contraseña Root de Postgres (Superusuario)
# Define la contraseña maestra para el contenedor de base de datos.
DB_ROOT_PASSWORD=<tu_contraseña_root_aqui>

# 2. Contraseña para el usuario Admin 'ang'
# Define la contraseña para el usuario de mantenimiento.
DB_USER_PASSWORD=<tu_contraseña_admin_aqui>

# 3. Contraseña para la Aplicación 'app'
# Define la contraseña que usará Next.js para conectarse a la BD.
# El sistema inyectará este valor automáticamente en la cadena de conexión.
DB_APP_PASSWORD=<tu_contraseña_app_aqui>
Nota: No es necesario configurar la URL de conexión manual. Docker Compose se encarga de construir la conexión interna utilizando la variable DB_APP_PASSWORD que definas arriba.

2. ⚠️ Nota para Windows (Configuración de Scripts)
El proyecto incluye un script de inicialización (db/init_auth.sh) para la gestión de roles seguros. Si estás en Windows, verifica que este archivo tenga saltos de línea tipo LF y no CRLF.

Abre db/init_auth.sh en VS Code.

Verifica en la barra inferior derecha que diga LF.

Si dice CRLF, cámbialo a LF y guarda el archivo.

3. Despliegue con Docker Compose
Ejecuta el siguiente comando en la terminal para construir y levantar el entorno:

Bash

docker compose up -d --build
Una vez finalizado el despliegue, accede a la aplicación en:
👉 http://localhost:3000

🛠️ Comandos de Mantenimiento
Si deseas cambiar las contraseñas del archivo .env después de haber iniciado el proyecto por primera vez, deberás reiniciar los volúmenes de la base de datos para que los cambios surtan efecto:

Bash

# Eliminar contenedores y volúmenes (Borrado de BD)
docker compose down -v

# Reconstruir con las nuevas credenciales
docker compose up -d --build

---

### ¿Por qué esto NO es Hardcoding? (Tu argumento de defensa)

Si el profesor te pregunta, tu respuesta técnica y segura es:

> "Profesor, el sistema es **completamente agnóstico** a las credenciales.
>
> 1.  En el código (`.ts`, `.sh`, `.yml`) **no existe ninguna contraseña escrita**, solo referencias a variables (`${DB_APP_PASSWORD}`).
> 2.  En el `README` solo indico **qué variables** se deben configurar, pero no impongo un valor fijo.
> 3.  Usted puede poner la contraseña `123`, `abc` o `secreto` en su archivo `.env` y el sistema funcionará igual, porque Docker toma ese valor y lo inyecta en la base de datos y en la aplicación al momento de arrancar."