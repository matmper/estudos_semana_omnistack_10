require('dotenv/config');

const express 				= require('express');
const mongoose 				= require('mongoose');
const cors 					= require('cors');
const http 					= require('http');

const routes 				= require('./routes');
const { setupWebsocket } 	= require('./websocket');

const app 		= express();
const server 	= http.Server(app);

setupWebsocket(server);

// realiza conexão com o banco (alterar dados no .env)
const conn 		= 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+'/'+process.env.DB_NAME+'?retryWrites=true&w=majority';

mongoose.connect(conn, {
	useNewUrlParser: true,
	useUndefinedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);