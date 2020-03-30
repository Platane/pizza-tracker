import { fetchSteps } from "../twitter";
import { read, write } from "../gist-storage";
import { removeDuplicateSteps } from "../utils/removeDuplicateSteps";
import userNames from "../../app/assets/content/userNames";

export const handle = async () => {
  // read the previous users from the db
  const previousUsers = await read();

  // update every users
  const newUsers = await Promise.all(
    userNames.map(async userName => {
      console.log("fetching new tweets from " + userName);

      const user = previousUsers.find(u => u.userName === userName) || {
        steps: [],
        lastCheckDate: 0,
        userName
      };

      const news = await fetchSteps(userName, user.lastCheckDate);

      return {
        ...user,
        lastCheckDate: Date.now(),
        steps: removeDuplicateSteps([...user.steps, ...news])
      };
    })
  );

  // check if we need to write
  if (
    newUsers.some(newUser => {
      const previousUser = previousUsers.find(
        u => u.userName === newUser.userName
      );

      return (
        //
        // if the user is new
        !previousUser ||
        //
        // if the user have new steps
        previousUser.steps.length < newUser.steps.length ||
        //
        // if the last write is older than 6 days
        previousUser.lastCheckDate + 6 * 24 * 60 * 60 * 1000 <
          newUser.lastCheckDate
      );
    })
  )
    await write(newUsers);
};
