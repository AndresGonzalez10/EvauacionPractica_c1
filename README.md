Sistema de Gestión Académica - Evaluación Práctica
Aplicación web integral para el análisis de rendimiento académico, detección de riesgos de deserción y monitoreo de carga docente. El sistema implementa una arquitectura moderna utilizando Next.js 15, PostgreSQL y Docker.

📋 Dependencias y Prerrequisitos
Para ejecutar este proyecto, únicamente necesitas tener instalado el siguiente software en tu equipo anfitrión. El resto de las librerías (Node.js, PostgreSQL, React, etc.) están contenerizadas.

Software Requerido (Host)
Docker Desktop (Versión más reciente recomendada).

Asegúrate de que Docker Engine esté corriendo.

Git (Opcional, para clonar el repositorio).

Stack Tecnológico (Incluido en los contenedores)
Frontend: Next.js 15 (App Router), React 19, Tailwind CSS.

Backend/DB: PostgreSQL 15 (Imagen Alpine).

Librerías Clave:

zod: Para validación estricta de datos.

pg: Cliente de conexión a base de datos.

lucide-react: Iconografía.

🚀 Guía de Instalación y Ejecución
Sigue estos pasos para desplegar la aplicación en un entorno local aislado.

1. Configuración de Variables de Entorno (Seguridad)
El sistema implementa Cero Hardcodeo. Las credenciales se inyectan dinámicamente.

En la raíz del proyecto, crea un archivo llamado .env.

Copia el siguiente contenido. Puedes cambiar los valores, pero asegúrate de recordarlos:

Ini, TOML
# --- SECRETOS DE INFRAESTRUCTURA ---

# 1. Contraseña Root de Postgres (Superusuario)
# Esta variable es usada por Docker para inicializar el contenedor maestro.
DB_ROOT_PASSWORD=postgrespassword

# 2. Contraseña para el usuario Admin 'ang' (Mantenimiento)
# Utilizada por el script interno de inicialización de roles.
DB_USER_PASSWORD=doki123

# 3. Contraseña para la Aplicación 'app' (Next.js)
# Esta es la credencial que usará el Frontend.
# El sistema construirá la URL de conexión automáticamente con este valor.
DB_APP_PASSWORD=admin123
Nota: No es necesario definir DATABASE_URL manualmente. Docker Compose la construye automáticamente usando DB_APP_PASSWORD para evitar errores de escritura.

2. ⚠️ Nota Crítica para Usuarios de Windows (LF vs CRLF)
Si estás ejecutando este proyecto en Windows, debes verificar el formato de fin de línea del script de base de datos, ya que Docker (Linux) no reconoce el formato de Windows (CRLF).

Abre el archivo: db/init_auth.sh en VS Code.

Mira la barra azul en la esquina inferior derecha.

Si dice CRLF, haz clic y cámbialo a LF.

Guarda el archivo.

Si no haces esto, la base de datos podría fallar al iniciar.

3. Despliegue con Docker Compose
Ejecuta el siguiente comando en la terminal para construir las imágenes y levantar los servicios:

Bash
docker compose up -d --build
Una vez termine, accede a la aplicación en:
👉 http://localhost:3000

🛠️ Comandos de Mantenimiento
Si necesitas reiniciar la base de datos desde cero (por ejemplo, si cambiaste las contraseñas en el .env o modificaste los datos semilla), usa estos comandos para borrar los volúmenes antiguos y reconstruir:

Bash
# Apaga y BORRA los volúmenes de base de datos (Reinicio limpio)
docker compose down -v

# Vuelve a levantar todo
docker compose up -d --build