import "reflect-metadata";
import Server from './server';
import router from './router';
import bodyParser from 'body-parser';
import cors from 'cors';
import { SERVER_PORT } from './global/environment';
import Model from './model';
import { container } from 'tsyringe';

container.register<Model>("Model", {useValue:  new Model('./src/binary_model/model.json', './src/binary_model/dictionary.json')});
const server = new Server(SERVER_PORT);
const model = container.resolve<Model>("Model");
// BodyParser
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );
server.app.use( bodyParser.text({limit: '100Mb'}) );

// CORS
server.app.use( cors({ origin: true, credentials: true  }) );

// Rutas de servicios
server.app.use('/', router );
model.initialize().then(() => {
    server.start( () => {
        console.log(`Servidor corriendo en el puerto ${ SERVER_PORT }`);
    });
})

