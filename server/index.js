import Express from 'express';
import { connect, Types } from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import Helmet from 'helmet';
import Morgan from 'morgan';
import { verify } from 'jsonwebtoken';

import User from './models/User';

import typeDefs from './schema';
import resolvers from './resolvers';

const { ObjectId } = Types;
ObjectId.prototype.valueOf = function() {
  return this.toString();
};

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ User, currentUser: req.currentUser })
});

// connect to the database
connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    poolSize: 10,
    useFindAndModify: false,
    useCreateIndex: true
  }
)
  .then(() => console.log('Database connected'))
  .catch((error) => console.error('Unable to connect to database', error));

const App = Express();

// logging for dev only
App.use(Morgan('dev'));
// security
App.use(Helmet());
// App.use(async (req, res, next) => {
//   const token = req.headers.authorization;
//   if (token !== null || token !== undefined) {
//     try {
//       const currentUser = await verify(token, process.env.SECRET);
//       req.currentUser = currentUser;
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   next();
// });
// apollo.applyMiddleware({ App });

const PORT = process.env.PORT || 4050;

App.listen(PORT, () => {
  console.log(
    `Server started on PORT: ${PORT}`,
    `GraphQL on ${apollo.graphqlPath}`
  );
});

export default App;
