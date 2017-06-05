const router = require('express').Router();

module.exports = router;

const graphqlHTTP = require('express-graphql');
const { buildSchema, graphql } = require('graphql');

const schema = buildSchema(`
  type Query {
    ip: String,
    test(id: String): Test,
    tests: [Test],
    qwe(id: Int): Qwe,

    video(url: String): CrawledVideoResult
  }

  input CrawlInput {
      url: String!
  }

  type CrawlResult {
      url: String!
      canonicalUrl: String
      title: String
  }

  type Mutation {
    crawlWebpage(url: String!) : CrawlResult
  }

  type CrawledVideoResult {
    url: String,
    canonicalUrl: String,
    title: String,
    description: String,
    video: String
  }

  type Qwe {
    args: String
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

    qwe: (args, req) => {
        return { args: JSON.stringify(args) };
    },

    crawlWebpage: (args, req, x) => {
        // console.log('!!!!', x.variableDefinitions);
        console.log('!!!!', x);
        // console.log('!!!!', args);
        return { title: 'Title', canonicalUrl: 'https://', url: args.url };
    },

    video: (args, req) => {
        const axios = require('axios');
        const cheerio = require('cheerio');

        return axios({
            url: args.url,
            headers: {
                'Accept': 'text/html'
            },
            transformResponse: html => cheerio.load(html)
        }).then(res => {
            const $ = res.data;

            const title = $ => $('meta[property="og:title"]').attr('content') || $('title').text();
            const canonicalUrl = $ => $('href[rel=canonical]').attr('href') || $('meta[property="og:url"]').attr('content');
            const description = $ => $('meta[property="og:description"]').attr('content') || $('meta[name=description]').attr('content');

            const video = $ => $('meta[property="og:video"]').attr('content');

            $('meta[property^="og:video"]').toArray().forEach((a) => {
                console.log(a.attribs.content);
            })

            return {
                url: args.url,
                title: title($),
                description: description($),
                canonicalUrl: canonicalUrl($),
                video: video($)
            };  
        })
    },

    test: function (args, request) {
        // console.log(args);
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
    graphiql: true,
    // graphiql: false,
}));