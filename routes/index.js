var express = require('express');
var router = express.Router();

/* GET homepage. Return a json response with message and usage. */
router.get('/', function(req, res, next) {
  res.json({
  	message: 'Welcome to WoTD REST API Written in NodeJS',
  	usage: 'localhost[:port]/api/v1/wotd?date={any valid date string format}',
  	example: ['localhost[:port]/api/v1/wotd?date=06/20/2018',
  	          'localhost[:port]/api/v1/wotd?date=06-20-2018',
  	          'localhost[:port]/api/v1/wotd?date=06.20.2018',
  	          'localhost[:port]/api/v1/wotd?date=2018/06/20',
  	          'localhost[:port]/api/v1/wotd?date=2018-06-20',
  	          'localhost[:port]/api/v1/wotd?date=2018.06.20']
  });
});

module.exports = router;
