import app from './app.js';
import { consumeMessages } from './controllers/puntos.controller.js';
import { connectDB } from './db.js';

connectDB();

app.listen(3010);

console.log('Server started on port 3010');

consumeMessages();

