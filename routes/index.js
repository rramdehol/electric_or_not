var express = require('express');
var router = express.Router();
// Include config files in gitignore
var config = require("../config/config.js")
// Include mysql
var mysql = require('mysql')
// Setup a connection variable 
var connection = mysql.createConnection({
	host:config.host,
	user:config.user,
	password:config.password,
	database:config.database
});
// After this line runs we will have a valid connection to sql
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	var getImagesQuery = "SELECT * FROM images";
	// Return the images from tables on sql
	connection.query(getImagesQuery,(error, results, fields)=>{
		// res.json(results)
		var randomIndex = Math.floor(Math.random()*results.length)
		// Test to see if an image comes through random
		// res.json(results[randomIndex]);
		res.render('index', { 
			title: 'Rate the Cars',
			imageToRender: '/images/'+results[randomIndex].imageUrl,
			imageID: results[randomIndex].id,
		});
	})
});

// Get route for voter direction
router.get('vote/:voteDirection/:imageID',(req, res, next)=>{
	res.json(req.params.imageID);
})



router.get('/standing', function(req, res, next) {
  res.render('standing', { title: 'Express' });
});

module.exports = router;
