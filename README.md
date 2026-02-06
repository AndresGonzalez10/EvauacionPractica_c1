# Sistema de Gestión Académica - Evaluación Práctica

Aplicación web para el análisis de rendimiento académico, riesgos de deserción y carga docente, desarrollada con **Next.js 15**, **PostgreSQL** y **Docker**.

## 📋 Requisitos
- Docker Desktop
- Node.js (v18+)

## 🚀 Guía de Inicio Rápido

### 1. Configuración de Seguridad
El sistema utiliza variables de entorno para no exponer credenciales.
1. Crea un archivo `.env` en la raíz (puedes basarte en `.env-example`).
2. Define las siguientes variables:
   ```ini
   DB_USER_PASSWORD="doki123"    # Contraseña para usuario admin
   DB_APP_PASSWORD="admin123"    # Contraseña para la App (Next.js)
   DATABASE_URL="postgresql://app:admin123@127.0.0.1:5432/academy_db"