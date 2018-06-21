# WotD

An API that gives a word of the day either from [dictionary.com](dictionary.com) or from a [user provided file](resources/dictionary.json).

## Getting Started

Step by step instructions that will help you get a development environment running.

### Prerequisites

- node v6.11.2 and npm v6.1.0

### Installing

Install dependencies inside the root folder

```
npm install
```

### Running

Start the server

```
npm start
```

The server should be localhost:3000 by default or the port can be set through the PORT node environment variable

## Automated tests

### Software used

* [Mocha](https://mochajs.org/)
* [Chai](http://www.chaijs.com/)
* [Chai HTTP](https://github.com/chaijs/chai-http)

### Run tests

Run the tests under the test folder

```
npm run test
```


## Usage

### v1 - [dictionary.com](dictionary.com) 

Scrapes & parses WotD from [dictionary.com](dictionary.com) 

```
localhost:{port}/api/v1/wotd

localhost:3000/api/v1/wotd
```

### v2 - [User provided file](resources/dictionary.json)

Converts the date to a unique number & retrieves a word using hash index.

```
localhost:{port}/api/v2/wotd

localhost:3000/api/v2/wotd
```

### Specifying a date

For both versions, you can provide a specific date to get that date's WotD

If no date is specified in the url parameter, it will return WotD for the current date

```
localhost:{port}/api/{v1 or v2}/wotd?date={any valid date string}

localhost:3000/api/v1/wotd?date=06-15-2018
```

### Sample output

```
{
  "date": "2018/6/21",
  "word": "summerize",
  "definition": "to prepare (a house, car, etc.) so as to counteract the hot weather of summer: to summerize a house by adding air conditioning."
}
```

## Built With

* [Express](https://maven.apache.org/) - Node.js framework
* [cheerio](https://github.com/cheeriojs/cheerio) - Parse scraped data
* [node-cache](https://github.com/mpneuried/nodecache) - Cache words & definitions

## Authors

**Duc Nguyen**

## Acknowledgments

* [dictionary.com](dictionary.com)
* [Manhattan's 500 essential words list](https://quizlet.com/40558954/manhattan-gre-essential-wordlist-500-flash-cards/)
* [Manhattan's 500 advanced words list](https://quizlet.com/40559754/manhattan-gre-advanced-wordlist-500-flash-cards/)
