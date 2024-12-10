/** A helper function that handles all items in a queue, calling {@linkcode onMessage} for each message. */
export const queueHandler = function<T>(onMessage: (obj: T) => Promise<void>) {
  return async function(event: any) {
    console.log("Invoking lambda handler")
    for (let i = 0; i < event.Records.length; ++i) {
      const { body } = event.Records[i];
      console.log(`Received message: ${body}`);
      onMessage(body as T);
    }
    return null;
  };
};
