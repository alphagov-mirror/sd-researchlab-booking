import Express from 'express';
import { connect, Types } from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import Helmet from 'helmet';
import Morgan from 'morgan';

import GoogleResourcesAPI from './datasources/google/googleResources';

import { getUser } from './resolvers/auth';

import rlabsSchema from './schema';

const { ObjectId } = Types;
ObjectId.prototype.valueOf = function() {
  return this.toString();
};

const apollo = new ApolloServer({
  schema: rlabsSchema,
  dataSources: () => ({
    googleResourcesAPI: new GoogleResourcesAPI()
  }),
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const userContext = await getUser(token);
    return { userContext };
  },
  playground: {
    settings: {
      'editor.theme': 'light'
    }
  }
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

const app = Express();

// logging for dev only
app.use(Morgan('dev'));
// security
app.use(Helmet());
apollo.applyMiddleware({ app });

const PORT = process.env.PORT || 4050;

app.listen(PORT, () => {
  console.log(
    `Server started on PORT: ${PORT}`,
    `GraphQL on ${apollo.graphqlPath}`
  );
});

export default app;
