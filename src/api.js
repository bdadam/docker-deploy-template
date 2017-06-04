const router = require('express').Router();

module.exports = router;

const graphqlHTTP = require('express-graphql');
const { buildSchema, graphql } = require('graphql');

const schema = buildSchema(`
  type Query {
    ip: String,
    test(id: String): Test,
    tests: [Test]
  }

  type Test {
      name: String,
      id: String
  }
`);

const root = {
    ip: function (args, request) {
        return request.ip;
    },

    test: function (args, request) {
        console.log(args);
        return Promise.resolve({ name: 'Test name', id: args.id });
    },

    tests: (args) => {
        return [
            { name: 'Q1', id: 'q1' },
            { name: 'Q2', id: 'q2' },
            { name: 'Q3', id: 'q3' },
        ];
    }
};

// const q = '{ ip, test(id: "asdf") { name, id }, tests { name, id, name2: name } }';
// const r = graphql(schema, q, root, { ip: '127.0.0.1' });
// const s = Date.now();
// r.then(x => {
//     console.log(JSON.stringify(x));
//     console.log(Date.now() - s);
// });

router.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    // graphiql: true,
    // graphiql: false,
}));