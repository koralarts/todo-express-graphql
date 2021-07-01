import { FilterQuery } from 'mongodb'
import { Task } from "../types/task";
import DatabaseService from ".";

export const addTask = (task: Task) => DatabaseService.use<Task>('tasks').insertOne(task);

export const updateTask = (task: Task) => DatabaseService.use<Task>('tasks').replaceOne({ _id: task._id }, task);

export const deleteTask = (taskId: string) => DatabaseService.use<Task>('tasks').deleteOne({ _id: taskId });

export const getTask = (query: FilterQuery<Task>) => DatabaseService.use<Task>('tasks').findOne(query);

export const getTasks = (query?: FilterQuery<Task>) => DatabaseService.use<Task>('tasks').find(query);
