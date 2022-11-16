
const path = require('path');

const config = require('../../config.json')
const fusionAuth_config = require('../fusionauth_config.json')

config.port = config.konrad.port
config.port_react = config.konrad.port_react
config.fusionauth = fusionAuth_config

const frontend_dir = path.join(__dirname, "..", "..", "react", "build")
const userDataPath = path.join(__dirname, "..", "data", "accounts.json")

var app = require('./SWK_Server_Template/src/main')(config, userDataPath)


app.listen(config.port);
console.log(`Konrad server started on port ${config.port}`);




