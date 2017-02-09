var express = require('express');
var router = express.Router();
// Include config files in gitignore
var config = require("../config/config.js")
// Include mysql
var mysql = require('mysql')
// We will need the fs module to read file
var fs = require('fs');
// Include multer
var multer = require('multer');
// We will specify the type to use later
var upload = multer({
	dest:'public/images'
})
var type = upload.single('imageToUpload')
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
	// var getImagesQuery = 'SELECT * FROM images';
	var getImagesQuery = 'SELECT * FROM images WHERE id NOT IN (SELECT imageID FROM votes WHERE ip ="'+req.ip+'")';
	// Return the images from tables on sql
	connection.query(getImagesQuery,(error, results, fields)=>{
		// res.json(results)
		var randomIndex = Math.floor(Math.random()*results.length)
		// Test to see if an image comes through random
		// res.json(results[randomIndex]);
		console.log(results.length);
		if (results.length ===0){
			res.render('index',{
				title: 'Rate the cars',
				msg: 'No Mmore Images'
			})
		}
		res.render('index', { 
			title: 'Rate the Cars',
			imageToRender: '/images/'+results[randomIndex].imageUrl,
			imageID: results[randomIndex].id,
		});
	})
});

// Get route for voter direction
router.get('/vote/:voteDirection/:imageID',(req, res, next)=>{
	// res.json(req.params);
	var imageID = req.params.imageID;
	var voteD = req.params.voteDirection;
	var ip = req.ip;
	if (voteD === 'up'){
		voteD = 1;
	}
	else{
		voteD = 0;
	}
	var insertVoteQuery = "INSERT INTO votes (ip, imageID, voteDirection) VALUES ('"+ip+"',"+imageID+",'"+voteD+"')"
	var removeEverything = 'DELETE FROM votes'
	// res.send(insertVoteQuery);
	connection.query(insertVoteQuery,(error, results, fields)=>{
		if(error) throw error;
		res.redirect('/');
	})
});



router.get('/standing', function(req, res, next) {
  res.render('standing', { title: 'Express' });
});

 router.get('/testQ', (req,res,next)=>{
 	var query = "SELECT * FROM images WHERE id >? AND id < ?";
 	var id1 = 1;
 	var id2 = 3;
 	connection.query(query,[id1,id2],(error, results, fields)=>{
 		res.json(results)
 	})
 })
router.get('/uploadImage',(req,res,next)=>{
	res.render('uploadImage',{})
})
router.post('/formSubmit',type,(req,res,next)=>{
	var tmpPath = req.file.path;
	// Setup the target path plus the original name of the file
	var targetPath = 'public/images/'+req.file.originalname;
	// Use the fs module to read the file then write it to the correct place
	fs.readFile(req.file,(error, fileContents)=>{
		fs.writeFile(targetPath, fileContents, (error)=>{
			if(error) throw error;
			var insertQuery = "INSERT INTO images (imageUrl) VALUE (?)"
			connection.query(insertQuery,[req.file.originalName],(error, results, fields)=>{
				if(error) throw error;
				res.redirect('/?file=uploaded')
			})
		})
	});
})
module.exports = router;























