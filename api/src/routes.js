const { Router } 		= require('express');

const DevController 	= require('./controllers/DevController');
const SearchController 	= require('./controllers/SearchController');

const routes = Router();

routes.get('/', DevController.index);

routes.post('/devs', DevController.store);

routes.patch('/devs/update/:github_username', DevController.update);

routes.delete('/devs/remove/:github_username', DevController.remove);

routes.get('/search', SearchController.index);

module.exports = routes;