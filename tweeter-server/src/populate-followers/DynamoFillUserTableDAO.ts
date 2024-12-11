import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";
import { User } from "tweeter-shared";
import { DynamoDAO } from "../model/dao/dynamo/DynamoDAO";

export class DynamoFillUserTableDao extends DynamoDAO {
  //
  // Modify these values as needed to match your user table.
  //
  private readonly tableName = "tweeter-users";
  private readonly userAliasAttribute = "alias";
  private readonly userFirstNameAttribute = "firstName";
  private readonly userLastNameAttribute = "lastName";
  private readonly userImageUrlAttribute = "imageUrl";
  private readonly passwordHashAttribute = "passwordHash";
  private readonly followeeCountAttribute = "followeeCount";
  private readonly followerCountAttribute = "followerCount";

  async createUsers(userList: User[], password: string) {
    if (userList.length == 0) {
      console.log("zero followers to batch write");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      RequestItems: {
        [this.tableName]: this.createPutUserRequestItems(
          userList,
          hashedPassword
        ),
      },
    };

    try {
      const resp = await this.client.send(new BatchWriteCommand(params));
      await this.putUnprocessedItems(resp, params);
    } catch (err) {
      throw new Error(
        `Error while batch writing users with params: ${params}: \n${err}`
      );
    }
  }

  private createPutUserRequestItems(userList: User[], hashedPassword: string) {
    return userList.map((user) =>
      this.createPutUserRequest(user, hashedPassword)
    );
  }

  private createPutUserRequest(user: User, hashedPassword: string) {
    const item = {
      [this.userAliasAttribute]: user.alias,
      [this.userFirstNameAttribute]: user.firstName,
      [this.userLastNameAttribute]: user.lastName,
      [this.passwordHashAttribute]: hashedPassword,
      [this.userImageUrlAttribute]: user.imageUrl,
      [this.followerCountAttribute]: 0,
      [this.followeeCountAttribute]: 1,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed users.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }

}