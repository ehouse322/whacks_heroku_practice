const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const promise = require('bluebird');
mongoose.Promise = promise;

const dbURI = "mongodb://league:same@ds157677.mlab.com:57677/wildhackslol";
const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },  
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }};
mongoose.connect(dbURI, options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/app',express.static(__dirname + "/app"));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'false'}));

app.get('/', function(req,res){
    res.sendFile(__dirname + "/index.html");
});

const userGamesController = require("./server/controller/usergames.controller");
const gameController = require("./server/controller/game.controller");
// Game Controller
app.get("/api/game", gameController.getGames);
app.get("/api/game/:gameKey", gameController.getGame);
app.post("/api/game", gameController.addGame);
// User Game Controller
app.get("/api/usergames/:summonerName/:region", userGamesController.getGames);
app.get("/api/champs/:championID", userGamesController.getChampInfo);


app.listen(process.env.PORT || '5000', function(){
    console.log("Listening on port 3000...");
});
