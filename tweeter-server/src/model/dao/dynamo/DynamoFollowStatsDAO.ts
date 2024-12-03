import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { FollowxStats } from "../../dto/FollowxStats";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFollowStatsDAO extends DynamoDAO<FollowxStats> {
  private aliasAttr = "alias";
  private followersAttr = "followers";
  private followeesAttr = "followees";

  protected tableName = 'tweeter-follows-stats';
  protected override keyAttr = this.aliasAttr;

  public getStats(alias: string, consistentRead = false): Promise<FollowxStats> {
    return this.getItem(this.generateDefaultKey(alias), consistentRead)
      // Provide empty values when the item doesn't exist
      .then(stats => (stats || { alias, followees: 0, followers: 0}));
  }

  public incrementValue(alias: string, followersOrNot: boolean, delta: number): Promise<void> {
    const updateAttr = followersOrNot ? this.followersAttr : this.followeesAttr;
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: this.generateDefaultKey(alias),
      UpdateExpression: `SET ${updateAttr} = ${updateAttr} + :inc`,
      ExpressionAttributeValues: {
        ":inc": delta,
      },
      ReturnValues: "NONE",
    });

    return this.send(command).then();
  }

}
