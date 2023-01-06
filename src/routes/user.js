
module.exports = function( config ) {

	const express = require('express');
	const router = express.Router();

	const fusionauth = require("../SWK_Fusionauth_Handler/index")(config)




	router.get('/', (req, res) => {

		// token in session -> get user data and send it back to the react app
		
		if (req.session.token) {
			fusionauth.introspect(req.session.token)
				.then(introspectResponse => {
					//introspectResponse.token = req.session.token
					// valid token -> get more user data and send it back to the react app
					if (introspectResponse.active) {
						const exp_date = new Date(introspectResponse.exp*1000)

						const data = {
							"details": {
								"email": "E-Mail",
								"email_verified": "E-Mail verifiziert",
								"knlogin_id": "FusionAuth-ID",
								"exp_date":"Ablaufzeit",								
								
							},
							"user": {
								"email": ""+introspectResponse.email,
								"email_verified": introspectResponse.email_verified?"verifiziert":"nicht verifiziert",
								"knlogin_id": ""+introspectResponse.sub,
								"exp_date":""+exp_date.getHours()+":"+exp_date.getMinutes()+":"+exp_date.getSeconds(),		
							}
						}

						res.send(data).end();
							
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
