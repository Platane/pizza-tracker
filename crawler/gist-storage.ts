import "@pizza-tracker/polyfill/polyfill.fetch";
import { Step } from "../entities/Step";

const GIST_ID = process.env.GIST_ID;
const GIST_TOKEN = process.env.GIST_TOKEN;

const parseFile = (text: string) => {
  let lastCheckDate = 0;

  const steps = text
    .split(/\n/)
    .map(line => {
      const [date, tweet_id, count] = line.split(" ");

      lastCheckDate = Math.max(lastCheckDate, +date);

      return tweet_id && tweet_id != "---"
        ? { date: +date, tweet_id, count: +count }
        : null;
    })

    .filter(Boolean);

  return { steps: steps as Step[], lastCheckDate };
};

const formatFile = (steps: Step[], lastCheckDate: number): string =>
  Math.max(lastCheckDate || 0, ...steps.map(x => x.date)) +
  " ---\n" +
  steps
    .sort((a, b) => b.date - a.date)
    .map(({ date, tweet_id, count }) => [date, tweet_id, count].join(" "))
    .join("\n");

/**
 * read data from the gist
 */
export const read = async () => {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`);

  const resJson = await res.json();

  return Object.keys(resJson.files).map(userName => ({
    userName,
    ...parseFile(resJson.files[userName].content)
  }));
};

/**
 * write data from to the gist
 */
export const write = async (
  users: { userName: string; steps: Step[]; lastCheckDate: number }[]
) => {
  const data = {
    files: Object.fromEntries(
      users.map(({ userName, steps, lastCheckDate }) => [
        userName,
        { content: formatFile(steps, lastCheckDate) }
      ])
    )
  };

  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${GIST_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const resJson = await res.json();

  return Object.keys(resJson.files).map(userName => ({
    userName,
    ...parseFile(resJson.files[userName].content)
  }));
};
