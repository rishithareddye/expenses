var express = require('express');
var router = express.Router();
/* GET user listing. */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     description: Returns user details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: Authorization
 *         description: an authorization header
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User record 
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/successGetUser'
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

router.get('/:id', function(req, res, next) {
	if(req.params.id != req.user.id)
	{
		res.status(403).send(JSON.stringify({"status": 403, "error": JSON.parse('{"message":"Id mismatch"}'), "response": null})); 
		return;
	}
	connection.query("select id,email,friendlyname,fullname from login where id="+connection.escape(req.params.id), function (error, results, fields) {
		res.setHeader('Content-Type', 'application/json');
	  	if(error){
	  		res.status(500).send(JSON.stringify({"status": 500, "error": error, "response": null})); 
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});
/* PUT user listing. */
/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags:
 *       - User
 *     description: Update a user record
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: User
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/user'
 *       - name: Authorization
 *         description: an authorization header
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully updated user
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
router.put('/:id', function(req, res, next) {
	var user = req.body;
	if(user.id != req.params.id && req.params.id != req.user.id)
	{
		res.status(403).send(JSON.stringify({"status": 403, "error": JSON.parse('{"message":"Id mismatch"}'), "response": null})); 
		return;
	}
	if(user.hasOwnProperty('id'))
		delete user.id;
    if(user.hasOwnProperty('password'))
        delete user.password;
    
        console.log(user);
	connection.query("UPDATE login set ? WHERE id = ?",[user,req.params.id], function (error, results, fields) {
		res.setHeader('Content-Type', 'application/json');
	  	if(error){
	  		res.status(500).send(JSON.stringify({"status": 500, "error": error, "response": null})); 
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results.affectedRows}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});
/* PUT password listing. */
/**
 * @swagger
 * /user/changepassword/{id}:
 *   put:
 *     tags:
 *       - User
 *     description: Update a user password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: User
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/changePassword'
 *       - name: Authorization
 *         description: an authorization header
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully changed password
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
router.put('/changepassword/:id', function(req, res, next) {
    var user = req.body;
    
	if(user.id != req.params.id && req.params.id != req.user.id)
	{
		res.status(403).send(JSON.stringify({"status": 403, "error": JSON.parse('{"message":"Id mismatch"}'), "response": null})); 
		return;
    }
    if(user.password == req.params.oldpassword)
	{
		res.status(304).send(JSON.stringify({"status": 304, "error": JSON.parse('{"message":"same password"}'), "response": null})); 
		return;
	}
	connection.query("UPDATE login set password = ? WHERE id = ? and email = ?",[user.password,req.params.id,user.email], function (error, results, fields) {
		res.setHeader('Content-Type', 'application/json');
	  	if(error){
	  		res.status(500).send(JSON.stringify({"status": 500, "error": error, "response": null})); 
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results.affectedRows}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});
module.exports = router;