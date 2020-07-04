/*jshint esversion: 6 */
var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require('../config/database'); // get db config file
var sha1 = require('sha1');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: config.emailServer,
	auth: {
	  user: "noreplyworkspace@gmail.com",
	  pass: "harin1994"
	}
  });
  
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Login/SignUp
 *     description: Generate JWT token to access resources
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Auth Object
 *         description: Auth object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/login'
 *     responses:
 *       200:
 *         description: Successfully Authenticated
 *         schema:
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/userLogin'
 *       500:
 *         description: Server Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       403:
 *         description: Authorization Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       304:
 *         description: Not Modified
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 */

  router.post('/login', function(req, res, next) {
	var user = req.body;
	connection.query("select id,email,friendlyname,fullname from login where email= ? and password = ?",[user.email,user.password], function (error, results, fields) {
		res.setHeader('Content-Type', 'application/json');
	  	if(error){
            res.status(500).send({success: false,user: null}); 
	  		//If there is error, we send the error in the error section with 500 status
          } else if(results.length <= 0){
            res.status(401).json({success: false,user: null});
          }
           else {
                // if user is found and password is right create a token
			var authtoken = 'JWT '+jwt.sign(JSON.parse(JSON.stringify(results[0])), config.secret, { expiresIn: '360m' });
			var loggedinuser = results[0];
			loggedinuser.token = authtoken;
            // return the information including token as JSON
            res.json({success: true, user: loggedinuser});
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});
/* POST register. */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Login/SignUp
 *     description: Register User 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: User
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/fulluser'
 *     responses:
 *       200:
 *         description: Successfully registered
 *         schema:
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/successOtherTracking'
 *       500:
 *         description: Server Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       403:
 *         description: Authorization Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       304:
 *         description: Not Modified
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       404:
 *         description: Not Found
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 */
router.post('/register', function(req, res, next) {
	var user = req.body;
	if(user.hasOwnProperty('id'))
		delete user.id;
	connection.query("INSERT INTO login set ?",user, function (error, results, fields) {
		res.setHeader('Content-Type', 'application/json');
	  	if(error){
	  		res.status(500).send(JSON.stringify({"status": 500, "error": error, "response": null})); 
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results.insertId}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});
/* POST encryptpassword listing. */
/**
 * @swagger
 * /auth/encryptpass:
 *   post:
 *     tags:
 *       - Login/SignUp
 *     description: Encrypt String 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: User
 *         description: Encrypt String
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/genericAuth'
 *     responses:
 *       200:
 *         description: Successfully encrypted
 *         schema:
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/successGenericAuth'
 *       500:
 *         description: Server Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       403:
 *         description: Authorization Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       304:
 *         description: Not Modified
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       404:
 *         description: Not Found
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 */
router.post('/encryptpass', function(req, res, next) {
	var value = req.body.request;
	if(value)
	{

		res.send(JSON.stringify({"status": 200, "error": null, "response": sha1(value)}));
	}
	else {
		res.status(404).send(JSON.stringify({"status": 404, "error": JSON.parse('{"message":"Not Found"}'), "response": null}));
		//If there is no error, all is good and response is 200OK.
	}
});
/**
 * @swagger
 * /auth/checkemail:
 *   post:
 *     tags:
 *       - Login/SignUp
 *     description: Check if the Email is already encrypted
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Email
 *         description: Email id
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/genericAuth'
 *     responses:
 *       200:
 *         description: Successfully result
 *         schema:
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/successGenericAuth'
 *       500:
 *         description: Server Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       403:
 *         description: Authorization Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       304:
 *         description: Not Modified
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       404:
 *         description: Not Found
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 */
router.post('/checkemail', function(req, res, next) {
	var value = req.body.request;
	if(value)
	{
		connection.query("select id from login where email= ?",value, function (error, results, fields) {
			res.setHeader('Content-Type', 'application/json');
			  if(error){
				res.status(500).send({status: 500, error: 'Server Error', response: null}); 
				  //If there is error, we send the error in the error section with 500 status
			  } else if(results.length <= 0){
				res.status(200).send({status: 200, error:null,response: 0});
			  }
			   else {
				res.status(200).send({status: 200, error:{msg:"Email already registered"},response: 1});
				  //If there is no error, all is good and response is 200OK.
			  }
		  });
	}
	else {
		res.status(404).send(JSON.stringify({"status": 404, "error": JSON.parse('{"message":"Not Found"}'), "response": null}));
		//If there is no error, all is good and response is 200OK.
	}
});
/* POST forgotpassword listing. */
/**
 * @swagger
 * /auth/forgotpassword:
 *   post:
 *     tags:
 *       - Login/SignUp
 *     description: Forgot password Email 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: User
 *         description: Email Id
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/genericAuth'
 *     responses:
 *       200:
 *         description: Successful
 *         schema:
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/successGenericAuth'
 *       500:
 *         description: Server Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       403:
 *         description: Authorization Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       304:
 *         description: Not Modified
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       404:
 *         description: Not Found
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 */

router.post('/forgotpassword', function(req, res, next) {
	var value = req.body.request;
	if(value)
	{
		connection.query("select id,email,friendlyname,fullname from login where email="+connection.escape(value), function (error, results, fields) {
			res.setHeader('Content-Type', 'application/json');
			  if(error){
				  res.status(500).send(JSON.stringify({"status": 500, "error": error, "response": null})); 
				  //If there is error, we send the error in the error section with 500 status
			  } else if (results[0]) {
				  var user = results[0];
				  var token = jwt.sign(JSON.parse(JSON.stringify(user)), config.secret, { expiresIn: '5m' });
				var mailOptions = {
					from: config.email,
					to: value,
					subject: 'Expenses Password Reset',
					text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'https://' + req.headers.host + '/reset/index.php?token=' + encodeURI(token) + '\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				  };
				  transporter.sendMail(mailOptions, function(error, info){
					if (error) {
				  res.status(500).send(JSON.stringify({"status": 500, "error": error, "response": null}));
					} else {
					  
				  res.send(JSON.stringify({"status": 200, "error": null, "response": "email Sent"}));
					}
				  });
				  //If there is no error, all is good and response is 200OK.
			  }
			  else {
				res.status(404).send(JSON.stringify({"status": 404, "error": JSON.parse('{"message": "user not found"}'), "response": null})); 
			  }
		  });
	}
	else {
		res.status(404).send(JSON.stringify({"status": 404, "error": JSON.parse('{"message":"Not Found"}'), "response": null}));
		//If there is no error, all is good and response is 200OK.
	}
});

/**
 * @swagger
 * /auth/resetpassword:
 *   post:
 *     tags:
 *       - Login/SignUp
 *     description: resetPassword
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: User
 *         description: Email Id
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/resendPassword'
 *     responses:
 *       200:
 *         description: Successful email reset
 *         schema:
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/successGenericAuth'
 *       500:
 *         description: Server Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       403:
 *         description: Authorization Error
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       304:
 *         description: Not Modified
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 *       404:
 *         description: Not Found
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/error'
 */

router.post('/resetpassword', function(req, res, next) {
	var value = req.body;
	if(value.password && value.token)
	{
		try {
			var user = jwt.verify(value.token, config.secret);
			if(user)
					{
						connection.query("UPDATE login set password = ? WHERE id = ? and email = ?",[value.password,user.id,user.email], function (error, results, fields) {
							res.setHeader('Content-Type', 'application/json');
							  if(error){
								  res.status(500).send(JSON.stringify({"status": 500, "error": error, "response": null})); 
								  //If there is error, we send the error in the error section with 500 status
							  } else {
								  res.send(JSON.stringify({"status": 200, "error": null, "response": results.affectedRows}));
								  //If there is no error, all is good and response is 200OK.
							  }
						  });
					}
					else
					{
					   res.status(404).send(JSON.stringify({"status": 404, "error": JSON.parse('{"message":"User not found"}'), "response": null}));
					}


		  } catch(err) {
			res.status(500).send(JSON.stringify({"status": 500, "error": JSON.parse('{"message":"Token Expired or Token Malformed, Try A new Link"}'), "response": null}));
		  }
	}
	else {
		res.status(404).send(JSON.stringify({"status": 404, "error": JSON.parse('{"message":"Token or Password Not Sent"}'), "response": null}));
		//If there is no error, all is good and response is 200OK.
	}
});

module.exports = router;

