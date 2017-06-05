const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
    var response;
    beforeAll(async () => {
        response = await request(app).get('/');
    });

    it('200 OK', () => {
        expect(response.status).toEqual(200);
    });

    it('Content-Type: text/html', () => {
        expect(response.type).toEqual('text/html');
    });

    it('HTML Snapshot', () => {
        expect(response.text).toMatchSnapshot();
    });
});