# Sistema de Gestión Académica - Evaluación Práctica

Aplicación web integral para el análisis de rendimiento académico, detección de riesgos de deserción y monitoreo de carga docente. El sistema implementa una arquitectura moderna utilizando **Next.js 15**, **PostgreSQL** y **Docker**.

---

## 📋 Dependencias y Prerrequisitos

Para ejecutar este proyecto, **únicamente** necesitas tener instalado el siguiente software en tu equipo anfitrión. El resto de las librerías (Node.js, PostgreSQL, React, etc.) están contenerizadas.

### Software Requerido (Host)
* **Docker Desktop** (Versión más reciente recomendada).
    * Asegúrate de que Docker Engine esté corriendo.
* **Git** (Opcional, para clonar el repositorio).

### Stack Tecnológico (Incluido en los contenedores)
* **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
* **Backend/DB:** PostgreSQL 15 (Imagen Alpine).
* **Librerías Clave:**
    * `zod`: Para validación estricta de datos.
    * `pg`: Cliente de conexión a base de datos.
    * `lucide-react`: Iconografía.

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para desplegar la aplicación en un entorno local aislado.

### 1. Configuración de Variables de Entorno (Seguridad)
El sistema no incluye credenciales hardcodeadas. Debes crear un archivo de configuración local.

1.  En la raíz del proyecto, crea un archivo llamado `.env`.
2.  Copia el siguiente contenido y **define tus propias contraseñas seguras**:

    ```ini
    # --- CONFIGURACIÓN DE SEGURIDAD ---

    # 1. Contraseña para el usuario administrador de PostgreSQL
    # (El script de inicialización usará esto para configurar la BD)
    DB_USER_PASSWORD="<escribe_tu_contraseña_admin_aqui>"

    # 2. Contraseña para el usuario de la Aplicación (Next.js)
    # (El script creará este usuario limitado con esta contraseña)
    DB_APP_PASSWORD="<escribe_tu_contraseña_app_aqui>"

    # 3. String de Conexión
    # IMPORTANTE: Reemplaza <escribe_tu_contraseña_app_aqui> con la misma que pusiste arriba.
    # Nota: Usamos 'db' como host porque estamos dentro de la red de Docker.
    DATABASE_URL="postgresql://app:<escribe_tu_contraseña_app_aqui>@db:5432/academy_db"
    ```

### 2. Despliegue con Docker Compose
Ejecuta el siguiente comando en la terminal para construir las imágenes y levantar los servicios:

```bash
docker compose up -d --build