var express = require('express');
var request = require('request');
var NodeCache = require('node-cache'); // used to cache requests with the same parameter
var myCache = new NodeCache();
var cheerio = require('cheerio'); // used to parse content returned by www.dictionary.com/wordoftheday/
var router = express.Router();
var dictionary = require('../resources/dictionary.json'); // load a list of words from a json file
var dictionaryKeys = Object.keys(dictionary);
var baseURL = 'http://www.dictionary.com/wordoftheday/';

/* GET word of the day by calling www.dictionary.com  */
router.get('/v1/wotd', function(req, res, next) {
  // get date from the request query.
  var passedDateString = req.query.date;
  var date, day, month, year, wotd, word, definition;
  // if no date is specified, generate an error response.
  // otherwise, construct a date using passed date string.
  if (passedDateString == undefined) { 
    date = new Date();
  } else {
	  date = new Date(passedDateString.replace(/-/g, '\/'));
	}  
	
	// check if it is a valid date.
	if (isNaN(date.getTime())) { // not a valid date
		res.status(400);
		res.json({
			date: passedDateString,
			message: 'not a valid date'
		});
	} else { // a valid date
	  // dictionary does not provide word of the day for future dates.
	  // it only provides word of the day for current day or before.
	  // if future date is given, it will show the current day word
	  // and the url will be redirected to www.dictionary.com/wordoftheday/
	  // however, we would just generate an error if future date is given.
	  // check if a future date is given.
	  if (date.getTime() > new Date().getTime()) { 
	  	res.status(400);
			res.json({
				date: passedDateString,
				message: 'cannot generate a word for future date'
			});
	  } else {
			// get day, month and year.
			day = date.getDate();
			month = date.getMonth() + 1;
			year = date.getFullYear();
		
			// construct a cache key
			var cacheDateKey = year + '/' + month + '/' + day;
		
			// look up if the word is already in the cache.
			// if it is, return it. 
			// otherwise, send a request to www.dictionary.com
			wotd = myCache.get(cacheDateKey);
			if (wotd != undefined) { // word in cache
				res.status(200);
				res.json(wotd);
			} else {                 // word not in cache
				// send a get request to www.dictionary.com to get word of the day.
				request(baseURL + cacheDateKey, function(err, response, body) {
					if (err) {
						res.status(500);
						res.json({
							date: cacheDateKey,
							message: 'internal server error'
						});
					} else {
						// we can get the word quickly from the url.
						var requestUrl = response.request.uri.href;
						// www.dictionary.com does not provide word of the day for future dates.
						// it only provides word of the day for current day or before.
						// if future date is given, it will show the current day word
						// and the url will be redirected to www.dictionary.com/wordoftheday/
						// however, we would just generate an error if future date is given.
						var indexOfLastSlash = requestUrl.lastIndexOf('/');	
						word = requestUrl.substring(indexOfLastSlash + 1); 
						// parse the response from word of the day to get the word definition.
						var $ = cheerio.load(body);
						// word definition is in <li class='first'> which is a unique class.
						definition = $('.first').text();
						// construct wotd object.
						wotd = {
							date: cacheDateKey,
							word: word,
							definition: definition
						};
						// store it to our cache.
						myCache.set(cacheDateKey, wotd);
						// construct a json response.
						res.status(200);
						res.json(wotd);
					}
				});
			}
		}
	} 
});

/* GET word of the day by pulling a word from a list of given words */
router.get('/v2/wotd', function(req, res, next) {
	// get date from the request query.
  var passedDateString = req.query.date;
  var date, word, definition;
  
  // if no date is specified, generate an error response.
  // otherwise, construct a date using passed date string.
  if (passedDateString == undefined) { 
    date = new Date();
  } else {
	  date = new Date(passedDateString.replace(/-/g, '\/'));
	}  
	
	// check if it is a valid date.
	if (isNaN(date.getTime())) { // not a valid date
		res.status(400);
		res.json({
			date: passedDateString,
			message: 'not a valid date'
		});
	} else { // a valid date
		// construct a formatted date for later use 
	  passedDateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
	  
		// generate an error if given a future date.
	  if (date.getTime() > new Date().getTime()) { 
	  	res.status(400);
			res.json({
				date: passedDateString,
				message: 'cannot generate a word for future date'
			});
	  } else {
	    // get a hash index so that we can pick a word from our word list
	  	var hashIndex = date.getTime() % dictionaryKeys.length;
	  	word = dictionaryKeys[hashIndex];
	  	definition = dictionary[word];
	  	
	  	res.status(200);
	  	res.json({
	  		date: passedDateString,
	  		word: word,
	  		definition: definition
	  	})
	  }
	}
});

module.exports = router;
