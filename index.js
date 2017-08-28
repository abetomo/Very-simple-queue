'use srict'
const path = require('path')
module.exports = require(path.join(__dirname, 'lib', 'very_simple_queue'))
module.exports.SQS = require(path.join(__dirname, 'lib', 'very_simple_queue_like_sqs'))
