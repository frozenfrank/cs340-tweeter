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
    const params = {
      TableName: this.tableName,
      Key: this.generateDefaultKey(alias),
      UpdateExpression: `SET ${updateAttr} = if_not_exists(${updateAttr}, :start) + :inc`,
      ExpressionAttributeValues: {
        ":inc": delta,
        ":start": 0, // default starting value if the attribute does not exist
      },
      ReturnValues: "NONE" as "NONE",
    };
    console.log(`DynamoFollowStatsDAO incrementValue with alias '${JSON.stringify(alias)}', params '${JSON.stringify(params)}'`);
    const command = new UpdateCommand(params);

    return this.send(command).then();
  }

}
