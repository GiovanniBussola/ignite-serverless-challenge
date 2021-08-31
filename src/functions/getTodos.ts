import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from '../utils/dynamodbClient'

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document.query({
    TableName: 'users_todo',
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': user_id
    }
  }).promise()

  const userTodos = response.Items

  return {
    statusCode: 200,
    body: JSON.stringify({
      todos: userTodos
    }),
    headers: {
      "Content-type": "application/json"
    }
  }
}