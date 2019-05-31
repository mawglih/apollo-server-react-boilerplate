const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controller/userController');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB CONNECTED'))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if(authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error(`Unable to authenticate user with token ${authToken} `);
    }
    return { currentUser }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server is listening on ${url}`);
});