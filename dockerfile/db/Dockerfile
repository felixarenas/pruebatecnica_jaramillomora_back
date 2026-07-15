# 1. Utilizar la imagen base específica solicitada
FROM postgres:17.9-alpine3.22

LABEL maintainer="Felix Arenas Lourido felixarenas7@gmail.com"
LABEL description="Imagen personalizada de PostgreSQL 17 para el ecosistema Jaramillo Mora"

# 2. Configurar variables de entorno por defecto (pueden ser sobrescritas en el docker-compose)
ENV POSTGRES_DB=desarrollo
ENV POSTGRES_USER=jaramillomora

# 3. Copiar scripts de inicialización al directorio nativo de Postgres
# Esto asegura que el script del esquema public (y cualquier otro .sql o .sh) se ejecute al arrancar
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# 4. Asegurar permisos correctos para los scripts de inicialización en Alpine Linux
USER root
# RUN chmod +x /docker-entrypoint-initdb.d/*.sh 
RUN chmod +x /docker-entrypoint-initdb.d/*.sql
RUN chown -R postgres:postgres /docker-entrypoint-initdb.d/

# 5. Volver al usuario nativo de postgres por seguridad
USER postgres

# 6. Exponer el puerto estándar
##EXPOSE 5453

# El ENTRYPOINT y CMD ya vienen heredados de la imagen oficial de Postgres, 
# por lo que no es necesario declararlos a menos que quieras cambiar los parámetros de arranque.