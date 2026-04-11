# simac-homogenizacion
Transforma datos meteorológicos de estaciones a intervalos de 5 minutos.

## Tecnologías
- Backend: Node.js + Express + MongoDB
- Frontend: React + Chart.js
- Infraestructura: Docker + Nginx

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