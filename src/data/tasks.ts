import { Task } from '../types/task'

const tasks: Task[] = [
  {
    "_id": "562028ae-d42d-11eb-b8bc-0242ac130003",
    "user_id": "1",
    "description": "Create Todo Application",
    "completed": false,
    "updatedOn": `${Date.now()}`,
    "createdOn": `${Date.now()}`
  },
  {
    "_id": "53ac9af8-d42d-11eb-b8bc-0242ac130003",
    "user_id": "1",
    "description": "Clean kitty litter",
    "completed": false,
    "updatedOn": `${Date.now()}`,
    "createdOn": `${Date.now()}`
  }
]

export default tasks
