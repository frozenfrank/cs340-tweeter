import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  DynamoDBDocumentClientCommand,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  QueryCommand,
  QueryCommandOutput
} from "@aws-sdk/lib-dynamodb";
import { MetadataBearer } from "@aws-sdk/types";


/**
 * A page of data returned by the database.
 *
 * @param <T> type of data objects being returned.
 */
export class DataPage<T> {
  values: T[]; // page of values returned by the database
  hasMorePages: boolean; // Indicates whether there are more pages of data available to be retrieved

  constructor(values: T[], hasMorePages: boolean) {
    this.values = values;
    this.hasMorePages = hasMorePages;
  }
}

export abstract class DynamoDAO<T extends Record<string, any>, U extends Record<string, any> = T> {
  protected readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({region: 'us-west-2'}));

  protected abstract tableName: string;

  // Simple, prebuilt commands

  protected async getItem(key: object, consistentRead = false): Promise<U|null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: key,
      ConsistentRead: consistentRead,
    });

    return this.sendGetCommand(command);
  }

  protected async putItem(item: T): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: { ...item },
    });

    return this.send(command).then();
  }

  async deleteItem(key: object): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: key,
      ReturnValues: "NONE",
    });

    return this.send(command).then();
  }

  // Sending commands

  protected async sendGetCommand(command: GetCommand): Promise<U | null> {
    const response = await this.send<GetCommandOutput>(command);
    if (response.Item) {
      return this.readItem(response.Item as T);
    }
    return null;
  }

  protected async readPagedQueryCommand(command: QueryCommand): Promise<DataPage<U>> {
    const response = await this.send<QueryCommandOutput>(command);
    const hasMorePages = response.LastEvaluatedKey !== undefined;
    const items = this.readItems(response.Items as T[]);

    return new DataPage(items, hasMorePages);
  }

  protected async send<OUT extends object>(command: DynamoDBDocumentClientCommand<any, OUT, any, any, any>): Promise<OUT> {
    const response = await this.client.send(command);
    this.logResponseOnError(response);
    return response;
  }

  // Sending helpers

  protected readItems(items: T[] | undefined): U[] {
    const out: U[] = [];
    items?.forEach(item => out.push(this.readItem(item)));
    return out;
  }

  /** OVERRIDE ME! Replace this assumptive guess with more precise logic as needed. */
  protected readItem(data: T): U {
    // Override me!
    return data as unknown as U; // Assume that the data row is a POJO matching the entity type
  }

  protected logResponseOnError(response: MetadataBearer): void {
    const statusCode = response.$metadata.httpStatusCode || 0;
    const statusCategory = Math.floor(statusCode / 100);
    if (statusCategory === 2) return;
    console.warn(`Received ${statusCode} status code:`, response);
  }
}
