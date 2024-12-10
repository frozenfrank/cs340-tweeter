/** A helper function that handles all items in a queue, calling {@linkcode onMessage} for each message. */
export const queueHandler = function<T>(onMessage: (obj: T) => Promise<void>) {
  return async function(event: any) {
    console.log(`Invoking lambda handler (${typeof event}): ${JSON.stringify(event)}`);
    for (let i = 0; i < event.Records.length; ++i) {
      const { body } = event.Records[i];
      console.log(`Received message (${typeof body}): ${body}`);
      onMessage(body as T);
    }
    return null;
  };
};
