require('dotenv/config');

const express 	= require('express');
const mongoose 	= require('mongoose');
const routes 	= require('./routes');

const app 		= express();

// realiza conexão com o banco
const conn 		= 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+'/'+process.env.DB_NAME+'?retryWrites=true&w=majority';

mongoose.connect(conn, {
	useNewUrlParser: true,
	useUndefinedTopology: false,
});

app.use(express.json());
app.use(routes);

app.listen(3333);