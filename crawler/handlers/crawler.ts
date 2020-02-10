import { fetchSteps } from "../twitter";
import { read, write } from "../gist-storage";
import { removeDuplicateSteps } from "../utils/removeDuplicateSteps";
import userNames from "../../app/assets/content/userNames";

export const handle = async () => {
  const users = await read();

  await Promise.all(
    userNames.map(async userName => {
      console.log("fetching new tweets from " + userName);

      const user = users.find(u => u.userName === userName) || {
        steps: [],
        lastCheckDate: 0,
        userName
      };

      user.lastCheckDate = Date.now();

      const news = await fetchSteps(userName, user.lastCheckDate);

      console.log(news);

      user.steps = removeDuplicateSteps([...user.steps, ...news]);
    })
  );

  await write(users);
};
