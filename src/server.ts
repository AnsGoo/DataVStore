import app from './app';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { PORT } from './const';

createConnection().then( async (_) => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('Press CTRL-C to stop \n');
  });

});
