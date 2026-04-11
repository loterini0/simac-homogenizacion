# simac-homogenizacion
Transforma datos meteorológicos de estaciones a intervalos de 5 minutos.

## Tecnologías
- Backend: Node.js + Express + MongoDB
- Frontend: React + Chart.js
- Infraestructura: Docker + Nginx
- 
## Por qué estas tecnologías

- **Node.js + Express** porque el algoritmo ya estaba en JavaScript, era natural mantener el mismo lenguaje en el backend.
- **MongoDB** porque los datos de entrada y salida son arrays JSON, encajan bien con documentos NoSQL sin necesidad de definir esquemas rígidos.
- **React** para manejar el estado de la tabla y la gráfica de forma reactiva cuando llegan los datos del servidor.
- **Docker** para que cualquier persona pueda levantar el proyecto con un solo comando sin instalar dependencias manualmente.

### Requisitos
- Node.js >= 18
- MongoDB corriendo localmente
- npm
- 
## Instalación local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install --legacy-peer-deps
npm start
```

## Ejecución con Docker

```bash
docker-compose up --build
```

| Contenedor | Puerto |
|---|---|
| frontend-container | 80 |
| backend-container | 3001 |
| db-container | 27017 |

## Endpoints
- `POST /homogenize` → Retorna datos cincominutales
- `GET /history` → Retorna últimos 10 cálculos
