
module.exports = function( config ) {

	const express = require('express');
	const router = express.Router();

	const fusionauth = require("../SWK_Fusionauth_Handler/index")(config)




	router.get('/', (req, res) => {

		// token in session -> get user data and send it back to the react app
		
		if (req.session.token) {
			fusionauth.introspect(req.session.token)
				.then(introspectResponse =>{
					introspectResponse.token = req.session.token
					// valid token -> get more user data and send it back to the react app
					if (introspectResponse.active) {

						res.send(introspectResponse).end();
							
					}

					// expired token -> send nothing
					else {

						req.session.destroy();
						res.send({}).end();
						
					}
				})
		}

		// no token -> send nothing
		else {
			res.send({}).end();
		}
	});

	return router
}
