import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
DeleteCommand,
DynamoDBDocumentClient,
GetCommand,
PutCommand,
PutCommandOutput,
QueryCommand,
UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

export abstract class DynamoDAO {
  protected readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({region: 'us-west-2'}));

  abstract tableName: string;
}
