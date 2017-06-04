const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const app = require('../src/index');

chai.use(chaiHttp);

describe('Test', () => {
    it('2+2=4', () => {
        expect(2 + 2).to.equal(4);
    });
});

describe('GET /', () => {
    var res;
    before(() => chai.request(app).get('/').then(response => res = response));

    it('200 OK', () => {
        expect(res).to.have.status(200);
        // expect(res).to.have.
    });

    it('Content-Type: text/html', () => {
        expect(res.type).to.equal('text/html');
    });

    it('Textcontent looks html', () => {
        expect(res.text).to.contain('<html');
    });
});