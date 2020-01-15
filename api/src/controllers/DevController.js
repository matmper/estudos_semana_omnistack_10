const axios 				= require('axios');
const Dev 					= require('../models/Dev');
const parseStringAsArray 	= require('../utils/parseStringAsArray');

module.exports = {

	async index(request, response) {

		const devs = await Dev.find();

		return response.json(devs);

	},

	// async = pode demorar responder
	async store(request, response) {

		const { github_username, techs, latitude, longitude } = request.body;

		// get
		let dev = await Dev.findOne({ github_username });

		if( !dev ) {

			// await = aguarda resposta
			const apiResponse 	= await axios.get(`https://api.github.com/users/${github_username}`);

			// se não retornar name, pega login
			const { name = login, avatar_url, bio } = apiResponse.data;

			const techsArray 	= parseStringAsArray(techs);

			const location 		= {
				type: 'Point',
				coordinates: [longitude, latitude]
			};

			dev = await Dev.create({
				github_username,
				name,
				avatar_url,
				bio,
				techs: techsArray,
				location,
			});

		}

		return response.json(dev);

	},

	// atualiza dados de um único dev
	async update(request, response) {

		const { github_username }				= request.params;
		const { techs, latitude, longitude } 	= request.body;

		let dev = await Dev.findOne({ github_username });

		if( dev ) {

			// await = aguarda resposta
			const apiResponse 	= await axios.get(`https://api.github.com/users/${github_username}`);

			// se não retornar name, pega login
			const { name = login, avatar_url, bio } = apiResponse.data;

			const techsArray 	= parseStringAsArray(techs);

			const location 		= {
				type: 'Point',
				coordinates: [longitude, latitude]
			};

			dev = await Dev.update({
				github_username
			},
			{
				name,
				avatar_url,
				bio,
				techs: techsArray,
				location,
			});

			return response.json(dev);

		} else {

			return response.json({'success':false, 'message':'user not found'});

		}

	},

	// remove um único dev
	async remove(request, response) {

		const { github_username }				= request.params;

		let dev = await Dev.findOne({ github_username });

		// verifica se existe usuário
		if( dev ) {

			const remove = Dev.deleteOne({ github_username });

			if( remove ) {
				return response.json({'success':true, 'message':'user removed'});
			} else {
				return response.json({'success':false, 'message':'error to remove user'});
			}

		} else {

			return response.json({'success':false, 'message':'user not found'});

		}

	},

};