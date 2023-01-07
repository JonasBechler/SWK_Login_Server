
const path = require('path');

const config = require('../../config.json')

config.port = config.login.port
config.port_react = config.login.port_react
config.session_secret = config.login.session_secret
config.fusionauth = config.login.fusionauth

const frontend_dir = path.join(__dirname, "..", "..", "SWK_Login_React", "build")

var app = require('./main')(config, "", frontend_dir)


app.listen(config.port);
console.log(`Login server started on port ${config.port}`);




