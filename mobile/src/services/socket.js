import socketio from 'socket.io-client';

const socket = socketio('http://192.168.0.129:3333', {

	autoConnect: false

});

function connect(data) {

	socket.io.opts.query = data;

	socket.connect();

}

function disconnect() {

	if( socket.connected )
		socket.disconnect();

}

function subscribeToNewDevs(subscribeFunction) {

	socket.on('new-dev', subscribeFunction);

}

export default {
	connect,
	disconnect,
	subscribeToNewDevs,
};