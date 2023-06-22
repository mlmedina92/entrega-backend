import express from 'express';
import session from 'express-session'; //modulo session:seteo las config de la session(QUE INF SE VA A GUARDAR)
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import cartsRouter from './routes/api.carts.router.js';
import ticketsRouter from './routes/api.tickets.router.js';
import cartRouter from './routes/cart.router.js';
import producstRouter from './routes/api.products.router.js';
import messagesRouter from './routes/api.messages.router.js'
import mocksRouter from './routes/api.mocks.router.js'
import homeRouter from './routes/home.router.js';
import chatRouter from './routes/chat.router.js';
import usersRouter from './routes/users.router.js';
import apiUsersRouter from './routes/api.users.router.js';
import apiSessions from './routes/apiSessions.router.js'
import jwtRouter from './routes/jwt.router.js';
import realTimeProductsRouter from './routes/realTimeProducts.router.js';
import { Server } from 'socket.io';
import MessageManager from './persistence/DAOs/messages/MessageMongo.js'; // TODO meter la clase en chat.router.js
import mongoStore from 'connect-mongo'
import './persistence/mongo/configMongo.js';
import passport from 'passport';
import cookieParser from 'cookie-parser'
import './passport/PassportStrategies.js'
// import { errorMiddleware } from './utils/errors/errors.middleware.js'
import logger from './utils/winston.js'
import { createLog } from './middlewares/winston.middleware.js'
import swaggerUi from 'swagger-ui-express'
import { swaggerSetup } from './swaggerSpecs.js'

//Creacion del servidor
const app = express();
const PORT = 8080;

// console.log(__dirname); //Brinda el path exacto para acceder a la carpeta PUBLIC

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// momngo session almacenar en BD
app.use(
  session({ //configuro el storage de session en mongo
    secret: 'sesionKey',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30000 },
    store: new mongoStore({//ahora creo un new mongostore no filestore
      mongoUrl: 'mongodb+srv://lm30540:Montiel9@cluster0.fq2dase.mongodb.net/Ecommerce?retryWrites=true&w=majority' //le apso la url
    }),
  })
)

// Configurar handlebars
app.engine('handlebars', handlebars.engine()); //solo para handlebars.
app.set('views', __dirname + '/views'); //Ubicación de carpeta vistas
app.set('view engine', 'handlebars'); //Qué motor de plantilla uso}}

//inicializar passport
app.use(passport.initialize())

// rutas
app.use('/api/users', apiUsersRouter)//servicios: son los llamados a la api
app.use('/api/sessions', apiSessions)
app.use('/api/products', producstRouter); //cdo llamo a ruta /api/products traer los prods en un json
app.use('/api/carts', cartsRouter);//cdo es /api son servicios
app.use('/api/tickets', ticketsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/mocks', mocksRouter); // mockingproducts

//vistas
app.use('/', homeRouter);//renderiza los prods
app.use('/users', usersRouter)//login y registro
app.use('/jwt', jwtRouter)
app.use('/cart', cartRouter);//renderiza carrito
app.use('/realTimeProducts', realTimeProductsRouter);
app.use('/chat', chatRouter)

// app.use(errorMiddleware)

app.use(createLog)
app.get('/loggerTest', function (req, res) {
  // Ejemplos de logger -> ver levels disponibles en utils/winston.js
  logger.debug('log debug')
  logger.http('log http')
  logger.info('log info')
  logger.warning('log warning')
  logger.error('log error')
  logger.fatal('log fatal')
  res.status(200).send('Logger test success')
})

//swagger documentation endpoint
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup))

//El servidor escucha al puerto
const httpServer = app.listen(PORT, () => {
  logger.debug(`Escuchando al puerto ${PORT}`);
});

//servidor socketServer
export const socketServer = new Server(httpServer);

const mm = new MessageManager(); // TODO refactor

//Emicion de eventos para el chat
socketServer.on('connection', (socket) => {
  socket.on('show', async () => {
    const getAll = await mm.getMsgs();
    socket.emit('loadMsg', getAll);
  });

  socket.on('sendInfo', async (e) => {
    const sendMsg = await mm.sendMsg(e);
    const getAll = await mm.getMsgs();
    socket.emit('sendMsg', sendMsg);
    socket.emit('loadMsg', getAll);
  });
});

export default socketServer;

export { httpServer, app }