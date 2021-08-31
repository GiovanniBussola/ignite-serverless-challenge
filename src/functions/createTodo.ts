import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from '../utils/dynamodbClient'
import { v4 as uuidV4 } from 'uuid'
import dayjs from 'dayjs'

interface ICreateTodo {
  id: string
  user_id: string
  title: string
  done: boolean
  deadline: string
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { title, done = false, deadline } = JSON.parse(event.body) as ICreateTodo
  const { user_id } = event.pathParameters;
  const id = uuidV4()
  
  const todo = {
    id,
    user_id,
    title,
    done,
    deadline: dayjs(deadline).format("YYYY-MM-DD HH:mm::ss")
  }

  await document.put({
    TableName: 'users_todo',
    Item: todo
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo created!',
      todo
    }),
    headers: {
      "Content-type": "application/json"
    }
  }
}