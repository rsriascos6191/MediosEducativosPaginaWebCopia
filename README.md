# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Configurar el backend de reservas

Las solicitudes del formulario público se guardan en PostgreSQL mediante el backend de `backend/`.

1. Crea una base de datos PostgreSQL y copia `backend/.env.example` como `backend/.env`. Completa las credenciales de la base de datos.
2. Desde la raíz del proyecto, crea el esquema y los datos de prueba:

   ```sh
   psql -h localhost -U <DB_USER> -d <DB_NAME> -f backend/database/migrations/001_initial_schema.sql
   psql -h localhost -U <DB_USER> -d <DB_NAME> -f backend/database/scripts/agregar_cupo_invitados.sql
   psql -h localhost -U <DB_USER> -d <DB_NAME> -f backend/database/scripts/agregar_max_invitados_por_graduando.sql
   psql -h localhost -U <DB_USER> -d <DB_NAME> -f backend/database/seeds/datos_prueba.sql
   ```

   El seed incluye un espacio de prueba para que el formulario tenga una opción reservable. En una instalación real, registra los campus, tipos y espacios vigentes en la base de datos.
3. En una terminal, instala las dependencias y ejecuta la API:

   ```sh
   cd backend
   npm ci
   npm start
   ```

4. En otra terminal, inicia el frontend desde la raíz con `npm run dev`.

El catálogo público, el detalle, la consulta de disponibilidad y el formulario obtienen los espacios activos desde PostgreSQL. La disponibilidad consulta solicitudes existentes y el backend vuelve a validar cruces de horario al guardar, para evitar solicitudes simultáneas para el mismo espacio.
