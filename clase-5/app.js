import express, { json } from 'express'; // require -> commonJS
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

// EN EL FUTURE: el import del json será así:
// import movies from './movies.json' with {type: 'json'};

// como leer un json en ESModules
// import fs from 'node:fs';
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));

// como leer un json en ESModules recomendado por ahora

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by'); // deshabilitar el header X-Powered-By: Express

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-FLIGHT
// OPTIONS

// Todos los recurrsos que sean MOVIES se identifican con /movies
app.use('/movies', moviesRouter);

const PORT = process.env.PORT || 1234;

app.listen(PORT, () =>
  console.log(`Server listening on port http://localhost:${PORT}`)
);
