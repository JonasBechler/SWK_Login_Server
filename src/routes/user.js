
module.exports = function( config ) {

  const express = require('express');
  const router = express.Router();
  const request = require('request');

  const token_handler = require('../helpers/token_handler')(config);



  router.get('/', (req, res) => {

    // token in session -> get user data and send it back to the react app

    if (req.session.token) {

      function valid_callback(introspectResponse) {

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
			}

			token_handler.valid(req.session.token, valid_callback)
    }

    // no token -> send nothing
    else {
      res.send({}).end();
    }
  });

  return router
}
