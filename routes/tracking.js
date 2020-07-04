
var express = require('express');
var router = express.Router();
var utils = require('../config/utils.js');
/* GET tracking listing. */


/**
 * @swagger
 * /tracking:
 *   get:
 *     tags:
 *       - Tracking
 *     description: Returns all tracking records
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: an authorization header
 *         in: header
 *         required: true
 *         type: string
 *       - name: filter
 *         description: name of the column you want to filter (must have filterTerm defined) - Can be used multiple times for different columns
 *         in: query
 *         type: string
 *       - name: filterTerm
 *         description: enter the string/number/date you want to filter (must have filter defined) - Can be used multiple times, should match the number of filter params provided
 *         in: query
 *         type: string
 *       - name: sortBy
 *         description: name of the column you want to sort the tracking (sortOrder is not mandatory) - can be used only once per request
 *         in: query
 *         type: string
 *       - name: sortOrder
 *         description: enter ASC or DESC to sort the data ascending or descending for the column provided, sortOrder is not provided and sortBy is provided default ASC is considered (must have sortOrder) - Can be used only once per request
 *         in: query
 *         type: string
 *       - name: sortOrder
 *         description: enter ASC or DESC to sort the data ascending or descending for the column provided, sortOrder is not provided and sortBy is provided default ASC is considered (must have sortOrder) - Can be used only once per request
 *         in: query
 *         type: string
 *       - name: searchColumn
 *         description: name of the column you want to search (must have searchTerm  and searchOperator defined) - Can be used multiple times for different columns
 *         in: query
 *         type: string
 *       - name: searchTerm
 *         description: enter the string/number/date you want to search in the column (must have searchColumn and searchOperator defined) - Can be used multiple times, should match the number of searchColumn params provided
 *         in: query
 *         type: string
 *       - name: searchOperator
 *         description: enter the operation you want to perform on the column (must have searchColumn and searchTerm defined) - Can be used multiple times, should match the number of searchColumn params provided.eq - equals , ne - not equals, gt - greater than , lt - less than, ge - greater than or equals, le - less than or equals , bt - between(used for date ranges - should have a comma seperated date range provided in searchTerm) , ct - contains
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: An array of tracking records
 *         schema:
 *            type: object
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/successGetTracking'
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


router.get('/', function(req, res, next) {
	var options = utils.parseQueryString(req.query,['mode','type','date','description','amount','changesmadeon']);
	connection.query("SELECT id,mode,type,DATE_FORMAT(date, '%Y-%m-%d') AS date,description,amount,changesmadeon,userid FROM `tracking` where userid = "+connection.escape(req.user.id)+options, function (error, results, fields) {
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
/* GET tracking listing. */


/**
 * @swagger
 * /tracking/{id}:
 *   get:
 *     tags:
 *       - Tracking
 *     description: Returns single tracking record
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: tracking id
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
 *         description: A single tracking
 *         schema:
 *            $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/successGetTracking'
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
	connection.query("SELECT id,mode,type,DATE_FORMAT(date, '%Y-%m-%d') AS date,description,amount,changesmadeon,userid FROM `tracking` id="+connection.escape(req.params.id)+' and userid = '+connection.escape(req.user.id), function (error, results, fields) {
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
/* POST tracking listing. */


/**
 * @swagger
 * /tracking:
 *   post:
 *     tags:
 *       - Tracking
 *     description: Creates a new tracking record
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: an authorization header
 *         in: header
 *         required: true
 *         type: string
 *       - name: Tracking
 *         description: Tracking object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/tracking'
 *     responses:
 *       200:
 *         description: Successfully created
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

router.post('/', function(req, res, next) {
	var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
	var tracking = req.body;
	if(tracking.hasOwnProperty('id'))
		delete tracking.id;
	tracking.changesmadeon = CURRENT_TIMESTAMP;
	tracking.userid = req.user.id;
	connection.query("INSERT INTO tracking set ?",tracking, function (error, results, fields) {
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
/* PUT tracking listing. */


/**
 * @swagger
 * /tracking/{id}:
 *   put:
 *     tags:
 *       - Tracking
 *     description: Update a tracking record
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: tracking id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: Tracking
 *         description: Tracking object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: 'https://harinpurumandla.com/workspace/api-doc/expenses/v1/structure/schemas.json#/components/schemas/tracking'
 *       - name: Authorization
 *         description: an authorization header
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully updated
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
	var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
	var tracking = req.body;
	if(tracking.id != req.params.id)
	{
		res.status(403).send(JSON.stringify({"status": 403, "error": JSON.parse('{"message":"Id mismatch"}'), "response": null})); 
		return;
	}
	if(tracking.hasOwnProperty('id'))
		delete tracking.id;
	tracking.changesmadeon = CURRENT_TIMESTAMP;
        tracking.userid = req.user.id;
	connection.query("UPDATE tracking set ? WHERE id = ? and userid = ?",[tracking,req.params.id,req.user.id], function (error, results, fields) {
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
/* DELETE tracking listing. */

/**
 * @swagger
 * /tracking/{id}:
 *   delete:
 *     tags:
 *       - Tracking
 *     description: Deletes a single tracking record
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: tracking id
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
 *         description: Successfully deleted
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



router.delete('/:id', function(req, res, next) {
	connection.query("DELETE FROM tracking WHERE id = ? and userid = ?",[req.params.id,req.user.id], function (error, results, fields) {
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
