import { read, write } from "../gist-storage";

jest.setTimeout(12000);

it("should read", async () => {
  const data = await read();
});

it("should write", async () => {
  const data = await read();

  {
    const count =
      data[0].steps.length > 0
        ? data[0].steps[data[0].steps.length - 1].count + 1
        : 1;
    const tweet_id = "12312313123213";
    const date = Date.now();

    data[0].steps.push({ tweet_id, date, count });

    data[0].lastCheckDate = date;
  }

  await write(data);

  const data2 = await read();

  expect(data).toEqual(data2);
});
