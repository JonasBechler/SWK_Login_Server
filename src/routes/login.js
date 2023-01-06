
module.exports = function ( config ) {

	const express = require('express');
	const router = express.Router();

	const fusionauth = require("../SWK_Fusionauth_Handler/index")(config)



	router.get('/', (req, res) => {
		
		if (req.session.token) {

			fusionauth.introspect(req.session.token)
				.then(introspectResponse => {
					if (introspectResponse.active){
						res.redirect("/")
					}
					else{
						fusionauth.login.redirect(req, res)
					}
				})
		}
		else{

			fusionauth.login.redirect(req, res)

		}
		
	});

	return router;
}