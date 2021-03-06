'use strict';
// Load required libraries
const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const documentclient = new AWS.DynamoDB.DocumentClient();
const geoip = require('geoip-lite');

// Create a unique ID to describe this item in DynamoDB
function makeId() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < 64; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

module.exports.handler = (event, context, callback) => {

	// Set the parameters for writing to DynamoDB
	const params = {
		TableName: 'impact-map',
		Item: {
			'Id': makeId(),
			'Added': Math.floor(new Date()),
			'Expire': (Math.floor(new Date())) + 86400,
			'Coordinates': geoip.lookup(event.sourceIP.split(',', 1)[0]),
			'Action': event.action
		},
	};

	// Creates the item
	documentclient.put(params, function(err) {
		if (err) {
			console.error('Unable to add item. ', JSON.stringify(err, null, 2)); // Handles error in console.
			// Return an error message back to the user
			callback(null, {'error': true, 'message': 'Entry was not successful'});
		}
		else callback(null, {'error': false, 'message': 'Entry was successful'});
	});
};
