import { DocumentNode } from 'graphql';
import { gql } from 'apollo-server';
import { v4 as uuidV4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import bcrypt from 'bcrypt';

import { generateJWT } from '../utils/jwt';
import { GraphqlContext } from '../types';
import { User, UserCreate, UserUpdate, UserLogin } from '../types/user';
import { addUser, getUser, updateUser } from '../db/user';

const SALT_ROUNDS = 10;

export const allUsers: User[] = [];

export const typeDefs: DocumentNode = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
    tasks: [Task]
    token: String
  }

  extend type Query {
    me: User
    user(_id: String!): User
    users: [User]
  }

  extend type Mutation {
    login(username: String!, password: String!): User
    addUser(email: String!, username: String!, password: String!): User
    updateUser(email: String, username: String): User
  }
`

export const resolvers = {
  Query: {
    me(parent: undefined, data: undefined, context: any): null {
      return context?.me;
    },
    async user(parent: undefined, { _id }: User): Promise<User | null> {
      return await getUser({ _id });
    },
    users(): User[] {
      return allUsers
    }
  },
  Mutation: {
    async addUser(parent: undefined, { email, username, password }: UserCreate): Promise<User> {
      const existingUser: User | null = await getUser({ email, username });

      if (!!existingUser) {
        throw new Error("User with email or username already exists.");
      }

      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
      const user = {
        _id: uuidV4(),
        email,
        username,
        password: hashedPassword
      };

      await addUser(user);

      return user;
    },
    async updateUser(parent: undefined, { email, username }: UserUpdate, { me }: GraphqlContext): Promise<User> {
      if (!me) {
        throw Error("You don't have permission to update resource.");
      }

      const user: User | null = await getUser({ _id: me._id });

      if (!user) {
        throw Error("You don't have permission to update resource.");
      }

      let userClone = cloneDeep(user)
      userClone = {
        ...userClone,
        email,
        username
      }

      await updateUser(userClone);

      return userClone;
    },
    async login(parent: undefined, { username, password }: UserLogin): Promise<User | null> {
      const user: User | null = await getUser({ username })

      if (!user) {
        throw Error("Username or password provided was incorrect.");
      }

      if (bcrypt.compareSync(password, user.password)) {
        return {
          ...user,
          token: generateJWT({ _id: user._id })
        };
      }

      return null;
    },
  }
}
