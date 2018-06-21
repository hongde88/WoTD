// test api v1
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

// parent test block
describe('WoTD', () => {
	/* Test the /GET route without a given date */
	describe('/GET WoTD', () => {
		it('it should GET the word for the current date', (done) => {
			chai.request(server)
			    .get('/api/v1/wotd')
			    .end((err, res) => {
			    	res.should.have.status(200);
			    	res.body.should.be.a('object');
			    	res.body.should.have.property('date');
			    	res.body.should.have.property('word');
			    	res.body.should.have.property('definition');
			    	done();
			    });
		});
	});
	
	/* Test the /GET route with a given date */ 
	describe('/GET WoTD with a given date', () => {
		it('it should GET the word based on a given date', (done) => {
			chai.request(server)
			    .get('/api/v1/wotd?date=6-15-2018')
			    .end((err, res) => {
			    	res.should.have.status(200);
			    	res.body.should.be.a('object');
			    	res.body.should.have.property('date');
			    	res.body.should.have.property('word');
			    	res.body.should.have.property('definition');
			    	expect(res.body.date).to.equal('2018/6/15');
			    	expect(res.body.word).to.equal('nacreous');
			    	expect(res.body.definition).to.equal('resembling nacre or mother-of-pearl; lustrous; pearly.');
			    	done();
			    });
		});
	});
	
	/* Test the /GET route with a future date */
	describe('/GET WoTD with a future date', () => {
		it('it should GET an error with a message', (done) => {
			chai.request(server)
			    .get('/api/v1/wotd?date=06-25-2019')
			    .end((err, res) => {
			    	res.should.have.status(400);
			    	res.body.should.be.a('object');
			    	res.body.should.have.property('date');
			    	res.body.should.have.property('message');
			    	expect(res.body.date).to.equal('06-25-2019');
			    	expect(res.body.message).to.equal('cannot generate a word for future date');
			    	done();
			    });
		});
	});
	
	/* Test the /GET route with an invalid date string */
	describe('/GET WoTD with an invalid date string', () => {
		it('it should GET an error with a message', (done) => {
			chai.request(server)
			    .get('/api/v1/wotd?date=aaaa')
			    .end((err, res) => {
			    	res.should.have.status(400);
			    	res.body.should.be.a('object');
			    	res.body.should.have.property('date');
			    	res.body.should.have.property('message');
			    	expect(res.body.date).to.equal('aaaa');
			    	expect(res.body.message).to.equal('not a valid date');
			    	done();
			    });
		});
	});
});