import { Step } from "../../../entities/Step";
import { useState, useEffect } from "react";
import userNames from "../../assets/content/userNames";

const GIST_ID = process.env.GIST_ID;
const GIST_USER = process.env.GIST_USER;

export const useData = () => {
  const [users, setUsers] = useState(
    [] as { userName: string; steps: Step[] }[]
  );

  useEffect(() => {
    for (const userName of userNames)
      fetchData(userName)
        .catch(error => {
          console.error(error);
          return [];
        })
        .then(steps =>
          setUsers(users =>
            [...users, { userName, steps }].sort(
              (a, b) =>
                userNames.indexOf(a.userName) - userNames.indexOf(b.userName)
            )
          )
        );
  }, []);

  return users;
};

const fetchData = async userName => {
  const res = await fetch(
    `https://gist.githubusercontent.com/${GIST_USER}/${GIST_ID}/raw/${userName}`
  );

  const resText = await res.text();

  const steps = resText
    .split("\n")
    .map(line => {
      const [date, tweet_id, count] = line.split(" ");

      return tweet_id && tweet_id != "---"
        ? { date: +date, tweet_id, count: +count }
        : null;
    })
    .filter(Boolean) as Step[];

  return steps.sort((a, b) => a.date - b.date);
};
