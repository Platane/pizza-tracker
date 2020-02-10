import Twitter from "twitter";
import { Step } from "../entities/Step";
import { removeDuplicateSteps } from "./utils/removeDuplicateSteps";

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * use the search api to preciselly search for the tweet
 * /!\ this allows to pull only recent tweet ( 7 days old max )
 * /!\ this does not seems to includes RT
 */
const fetchLastSteps = async (userName: string): Promise<Step[]> => {
  const data = await client.get("search/tweets", {
    q: `from:${userName} count`
  });

  return data.statuses
    .map(parse)
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
};

/**
 * pull all the timeline and search for the tweet which match the regExp
 * /!\ this is cost effective
 */
const fetchAllSteps = async (
  userName: string,
  since: number,
  cursor: string | undefined = undefined,
  k: number = 0
): Promise<Step[]> => {
  const { steps, nextCursor, oldestDate } = await _fetchTimeLine(
    userName,
    cursor
  );

  return removeDuplicateSteps([
    ...steps,
    ...(k > 20 || oldestDate < since
      ? []
      : await fetchAllSteps(userName, since, nextCursor, k + 1))
  ]);
};

const _fetchTimeLine = async (userName: string, cursor: string | undefined) => {
  const data = await client.get("statuses/user_timeline", {
    screen_name: userName,
    exclude_replies: false,
    contributor_details: false,
    include_rts: false,
    trim_user: true,
    count: 200,
    ...(cursor ? { max_id: cursor } : {})
  });

  const steps: Step[] = data
    .map(parse)
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);

  const oldestDate = Math.min(Date.now(), ...steps.map(step => step.date));

  const nextCursor = steps[0] ? steps[0].tweet_id : undefined;

  return { steps, oldestDate, nextCursor };
};

/**
 * use the best fitted fetch method
 */
export const fetchSteps = (userName: string, since: number = 0) =>
  since > Date.now() - 7 * 24 * 60 * 60 * 1000
    ? fetchLastSteps(userName)
    : fetchAllSteps(userName, since);

const extractPizzaCount = (text: string): number | null => {
  const d = text.match(/🍕 *x *(\d+)/);
  return !d || !d[1] ? null : +d[1];
};

const parse = (x): Step | undefined => {
  const count = extractPizzaCount(x.text);

  return count === null
    ? undefined
    : {
        tweet_id: x.id_str,
        date: new Date(x.created_at).getTime(),
        count
      };
};
