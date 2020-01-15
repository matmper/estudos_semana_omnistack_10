const Dev 					= require('../models/Dev');
const parseStringAsArray 	= require('../utils/parseStringAsArray');

module.exports = {

	async index(request, response) {

		const { latitude, longitude, techs, maxDistance = 10 } = request.query;

		const techsArray 	= parseStringAsArray(techs);

		// mongo operations (example: $in)
		const devs 			= await Dev.find({
			techs: {
				$in: techsArray
			},
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [longitude, latitude],
						$maxDistance: maxDistance * 1000
					}
				}
			}
		});

		return response.json({ devs });

	},

};