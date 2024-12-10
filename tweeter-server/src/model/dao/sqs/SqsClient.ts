import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { QueueClient } from "../interface/QueueClient";

export class SqsClient implements QueueClient {
  sqsClient: SQSClient;

  constructor(
    sqsRegion: string,
    private sqsUrl: string,
  ) {
    this.sqsClient = new SQSClient({ region: sqsRegion });
  }

  public sendJsonMessage(obj: object): Promise<void> {
    return this.sendMessage(JSON.stringify(obj));
  }

  public async sendMessage(message: string): Promise<void> {

    const params = {
      DelaySeconds: 10,
      MessageBody: message,
      QueueUrl: this.sqsUrl,
    };

    try {
      console.log(`Submitting SQS message: ` + JSON.stringify(params));
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }
}
