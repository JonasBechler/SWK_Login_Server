
module.exports = function( config ) {

  const express = require('express');
  const router = express.Router();
  const request = require('request');



  router.get('/', (req, res) => {

    // token in session -> get user data and send it back to the react app

    if (req.session.token) {
      request(
        // POST request to /introspect endpoint
        {
          method: 'POST',
          uri: `${config.device_ip}:${config.fusionauth_port}/oauth2/introspect`,
          form: {
            'client_id': config.fusionauth.client_id,
            'token': req.session.token
          }
        },

        // callback
        (error, response, body) => {
          let introspectResponse = JSON.parse(body);
          introspectResponse.token = req.session.token

          // valid token -> get more user data and send it back to the react app
          if (introspectResponse.active) {

            return res.send(introspectResponse).end();
              
          }

          // expired token -> send nothing
          else {
            req.session.destroy();
            res.send({}).end();
          }
        }
      );
    }

    // no token -> send nothing
    else {
      res.send({}).end();
    }
  });

  return router
}
