"use-strict";

import { ApolloServer } from 'apollo-server';

import { typeDefs, userSchema, taskSchema } from './schemas';
import { User } from './types/user';

import { verifyJWT } from './utils/jwt';

const PORT = 3000;

const app = new ApolloServer({
  context({ req }) {
    const token = req.headers?.authorization || '';

    if (!token) {
      return null;
    }

    const data = verifyJWT(token);
    const me: User | undefined = userSchema.allUsers.find(user => user._id === data?._id);

    return { me }
  },
  typeDefs: [typeDefs, taskSchema.typedefs, userSchema.typeDefs],
  resolvers: [taskSchema.resolvers, userSchema.resolvers]
});

app.listen(PORT).then(({ url }) => {
  console.log('🚀  Server ready');
});
