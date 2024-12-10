export interface QueueClient {
  sendMessage(message: string): Promise<void>;
  sendJsonMessage(obj: object): Promise<void>;
}
