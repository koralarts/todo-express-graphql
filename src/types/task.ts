import { User } from "./user"

export type Task = {
  _id: string;
  user_id: string;
  user?: User;
  description: string;
  completed: boolean;
  dateCompleted?: string;
  deadline?: string;
  updatedOn: string;
  createdOn: string;
}

export type TaskCreate = Pick<Task, "description">

export type TaskUpdate = Exclude<Task,  "createdOn" | "updatedOn"> & {
  description?: string;
  completed?: boolean;
}
