const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/db.js');

describe('GET /', () => {
    it('Works', async () => {
        const query = `query { test(id: "1234") { name, id } }`;
        const { status, body } = await request(app).get(`/api/gql/graphql?query=${encodeURIComponent(query)}`);

        expect(status).toEqual(200);
        expect(body).toMatchSnapshot();
    });

    it('Works with variables', async () => {
        const query = `query Test($id: String) { test(id: $id) { name, id } }`;
        const variables = { id: '2345' };

        const { status, body } = await request(app).get(`/api/gql/graphql?query=${encodeURIComponent(query)}&variables=${encodeURIComponent(JSON.stringify(variables))}`);

        expect(status).toEqual(200);
        expect(body).toMatchSnapshot();
    });
});