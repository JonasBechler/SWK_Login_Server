
module.exports = function ( config ) {
	const express = require('express');
	const router = express.Router();

	const fusionauth = require("../SWK_Fusionauth_Handler/index")(config)



	router.get('/', (req, res) => {

		// delete the session
		req.session.destroy();

		// end FusionAuth session

		fusionauth.logout(req, res)
	});

	return router
}