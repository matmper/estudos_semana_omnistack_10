const socketio 				= require('socket.io');

const parseStringAsArray 	= require('./utils/parseStringAsArray');
const calculateDistance 	= require('./utils/calculateDistance');

let io;
const connections 			= [];

exports.setupWebsocket = (server) => {

	io = socketio(server);

	io.on('connection', client => {

		const { latitude, longitude, techs } = client.handshake.query;

		connections.push({
			id: client.id,
			coordinates: {
				latitudde: Number(latitude),
				longitude: Number(longitude),
			},
			techs: parseStringAsArray(techs),
		});

		//console.log( connections );

	});

};

exports.findConnections = (coordinates, techs) => {

	return connections.filter( connection => {

		//console.log(connection)

		return calculateDistance(coordinates, connection.coordinates) < 10 
			&& connection.techs.some(item => techs.includes(item) )

	})

};

exports.sendMessages = (to, message, data) => {

	to.forEach(connection => {

		io.to(connection.id).emit(message, data);

	});

};