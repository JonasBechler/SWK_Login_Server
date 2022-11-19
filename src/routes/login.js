
module.exports = function ( config ) {

	const express = require('express');
	const router = express.Router();

	const token_handler = require('../helpers/token_handler')(config);


	router.get('/', (req, res) => {
		
		if (req.session.token) {

			function valid_callback(introspectResponse) {

				if (introspectResponse.active){
					res.redirect("/")
				}
				else{
					token_handler.redirect_fusionauth(req, res)
				}

			}

			token_handler.valid(req.session.token, valid_callback)

		}
		else{

			token_handler.redirect_fusionauth(req, res)

		}
		
	});

	return router;
}