
module.exports = function( config ) {

  const express = require('express');
  const router = express.Router();
  const request = require('request');

  const token_handler = require('../helpers/token_handler')(config);



  router.get('/', (req, res) => {
    function handle_token(response) {
      console.log(response);
    
      req.session.token = response.access_token;
        
      // redirect to the React app
      res.redirect(`${config.device_ip}:${config.port_react}`);

    }

    token_handler.get_token(req, res, handle_token)
  });

  return router
}
