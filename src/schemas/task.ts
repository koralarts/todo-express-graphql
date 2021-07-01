import { gql } from 'apollo-server';
import { v4 as uuidV4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import { Cursor } from 'mongodb';

import { GraphqlContext } from '../types';
import { Task, TaskCreate, TaskUpdate } from '../types/task'
import { addTask, getTask, getTasks, updateTask, deleteTask } from '../db/task';

export const typedefs = gql`
  type Task {
    _id: ID!
    user: User!
    description: String!
    completed: Boolean
    dateCompleted: String
    deadline: String
    updatedOn: String!
    createdOn: String!
  }

  extend type Query {
    task(_id: String!): Task
    tasks: [Task]
  }

  extend type Mutation {
    addTask(description: String!): Task
    updateTask(_id: String!, description: String, completed: Boolean, dateCompleted: String, deadline: String): Task
    deleteTask(_id: String!): Task
  }
`

export const resolvers = {
  Query: {
    async task(parent: undefined, { _id }: Task, { me }: GraphqlContext): Promise<Task | null> {
      if (!me) {
        return Promise.resolve(null);
      }

      return await getTask({ _id });
    },
    async tasks(parent: undefined, params: undefined, { me }: GraphqlContext): Promise<Task[] | null> {
      if (!me) {
        return Promise.resolve(null);
      }

      return await getTasks({ user_id: me._id }).toArray();
    }
  },
  Mutation: {
    async addTask(parent: undefined, { description }: TaskCreate, { me }: GraphqlContext): Promise<Task>  {
      if (!me) {
        throw Error("You don't have permission to perform this action.");
      }

      const task: Task = {
        _id: uuidV4(),
        user_id: me?._id,
        description,
        completed: false,
        updatedOn: `${Date.now()}`,
        createdOn: `${Date.now()}`
      }

      await addTask(task)

      return { ...task, user: me }
    },
    async updateTask(parent: undefined, { _id, ...rest }: TaskUpdate, { me }: GraphqlContext): Promise<Task> {
      if (!me) {
        throw Error("You don't have permission to perform this action.");
      }

      const task: Task | null = await getTask({ _id, user_id: me._id });

      if (!task) {
        throw Error("You don't have permission to perform this action.")
      }

      const taskClone = { ...cloneDeep(task), ...rest }

      await updateTask(taskClone);

      return taskClone;
    },
    async deleteTask(parent: undefined, { _id }: Task, { me }: GraphqlContext): Promise<Task> {
      if (!me) {
        throw Error("You don't have permission to perform this action.");
      }

      const task: Task | null = await getTask({ _id, user_id: me._id });

      if (!task) {
        throw Error("You don't have permission to perform this action.")
      }

      await deleteTask(_id);

      return task;
    }
  }
}
