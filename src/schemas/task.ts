import { gql } from 'apollo-server';
import { v4 as uuidV4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep'

import allTasksJSON from '../data/tasks';
import { GraphqlContext } from '../types';
import { Task, TaskCreate, TaskUpdate } from '../types/task'

const allTasks: Task[] = [...allTasksJSON]

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
  }
`

export const resolvers = {
  Query: {
    task(parent: undefined, { _id }: Task, { me }: GraphqlContext): Task | null | undefined {
      const task = allTasks.find((task: Task) => task._id === _id)
      return task?.user_id === me?._id ? task : null;
    },
    tasks(parent: undefined, params: undefined, { me }: GraphqlContext): Task[] | null | undefined {
      if (!me) {
        return null;
      }

      return allTasks.filter((task) => task.user_id === me._id);
    }
  },
  Mutation: {
    addTask(parent: undefined, { description }: TaskCreate, { me }: GraphqlContext): Task  {
      if (!me) {
        throw Error("You don't have permission to perform this action.")
      }

      const task: Task = {
        _id: uuidV4(),
        user_id: me?._id,
        description,
        completed: false,
        updatedOn: `${Date.now()}`,
        createdOn: `${Date.now()}`
      }

      allTasks.push(task)

      return { ...task, user: me }
    },
    updateTask(parent: undefined, { _id, ...rest }: TaskUpdate, { me }: GraphqlContext): Task {
      if (!me) {
        throw Error("You don't have permission to perform this action.")
      }

      const taskIndex = allTasks.findIndex((value: Task) => value._id === _id);
      const taskClone = cloneDeep(allTasks[taskIndex]);
      allTasks[taskIndex] = {
        ...taskClone,
        ...rest,
        user: me
      }

      return allTasks[taskIndex];
    }
  }
}
