module.exports = function(config) {

  const request = require('request');
  const pkce = require('../helpers/pkce');


  function valid( token, callback ){
      request(
          // POST request to /introspect endpoint
          {
            method: 'POST',
            uri: `${config.device_ip}:${config.fusionauth_port}/oauth2/introspect`,
            form: {
              'client_id': config.fusionauth.client_id,
              'token': token
            }
          },

          // callback
          (error, response, body) => {
            let introspectResponse = JSON.parse(body);
            callback(introspectResponse)
          }
      );
  }

  function redirect_fusionauth(req, res) {
      req.session.verifier = pkce.generateVerifier();

      // Generate the PKCE challenge
      const challenge = pkce.generateChallenge(req.session.verifier);

      // Redirect the user to log in via FusionAuth
      const redirect_uri = `${config.device_ip}:${config.fusionauth_port}/oauth2/authorize?client_id=${config.fusionauth.client_id}&redirect_uri=${config.device_ip}:${config.port}${config.fusionauth.redirect_uri}&response_type=code&code_challenge=${challenge}&code_challenge_method=S256`
      res.redirect(redirect_uri);
  }

  function get_token (req, res, callback) {
    return request(
      // POST request to /token endpoint
      {
        method: 'POST',
        uri: `${config.device_ip}:${config.fusionauth_port}/oauth2/token`,
        form: {
          'client_id': config.fusionauth.client_id,
          'client_secret': config.fusionauth.client_secret,
          'code': req.query.code,
          'code_verifier': req.session.verifier,
          'grant_type': 'authorization_code',
          'redirect_uri': `${config.device_ip}:${config.port}${config.fusionauth.redirect_uri}`
        }
      },

      // callback
      (error, response, body) => {
        callback(JSON.parse(body));
      }
    );
  }

  return {
    valid: valid, 
    redirect_fusionauth: redirect_fusionauth,
    get_token: get_token
  }
}