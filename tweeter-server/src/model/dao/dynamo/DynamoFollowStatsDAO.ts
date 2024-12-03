import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { FollowxStats } from "../../dto/FollowxStats";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFollowStatsDAO extends DynamoDAO<FollowxStats> {
  protected tableName = 'tweeter-follows-stats';

  private aliasAttr = "alias";
  private followersAttr = "followers";
  private followeesAttr = "followees";


  public getStats(alias: string, consistentRead = false): Promise<FollowxStats> {
    return this.getItem(this.generateKey(alias), consistentRead)
      // Provide empty values when the item doesn't exist
      .then(stats => (stats || { alias, followees: 0, followers: 0}));
  }

  public incrementValue(alias: string, followersOrNot: boolean, delta: number): Promise<void> {
    const updateAttr = followersOrNot ? this.followersAttr : this.followeesAttr;
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: this.generateKey(alias),
      UpdateExpression: `SET ${updateAttr} = ${updateAttr} + :inc`,
      ExpressionAttributeValues: {
        ":inc": delta,
      },
      ReturnValues: "NONE",
    });

    return this.send(command).then();
  }

  private generateKey(alias: string) {
    return { [this.aliasAttr]: alias };
  }
}
