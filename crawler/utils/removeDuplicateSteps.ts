import { Step } from "../../entities/Step";

export const removeDuplicateSteps = (arr: Step[]): Step[] =>
  arr.filter((x, i, arr) => i == arr.findIndex(u => u.tweet_id == x.tweet_id));
