'use strict';
// Load required libraries
const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const documentclient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {

	// Set from and to variables, use from and to in event if present.
	let from;
	if (Number(event.from) > 1) from = Number(event.from);
	else from = 1;

	let to;
	if (Number(event.to) > 1) to = Number(event.to);
	else to = new Date() / 1000;

	// Set scan limit to 20 if not present or greater than 20
	let limit = process.env.LIMIT;
	if (Number(event.limit) < process.env.LIMIT) limit = event.limit;

	// Set scanning parameters
	let params = {
		TableName: process.env.TABLE_NAME,
		// Only get Coordinates and Action data from the table
		ProjectionExpression: 'Coordinates, #b',
		// Only return items that fall within start and stop parameters
		FilterExpression: 'Added BETWEEN :start AND :stop',
		ExpressionAttributeNames: {
			// Set an 'alias' for the word, 'Action', because 'Action' is a reserved word in DynamoDB
			'#b': 'Action'
		},
		ExpressionAttributeValues: {
			// Set an 'alias' for start and stop variables
			':start': from,
			':stop': to
		},
		Limit: limit
	};

	if (event.hasOwnProperty('exclusivestartkey') && event.exclusivestartkey !== '') {
		params.ExclusiveStartKey = {};
		params.ExclusiveStartKey.Id = event.exclusivestartkey;
	}

	documentclient.scan(params, function(err,data) {
		// Log error if scanning returns err
		if (err) {
			console.error('Unable to scan the table. ', JSON.stringify(err, null, 2));
			callback(null, 'Unable to retrieve the data.');
		}
		else callback(null, data); // Returns the item data back to the client
	});

};
