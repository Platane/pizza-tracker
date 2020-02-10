import { fetchSteps } from "../twitter";

jest.setTimeout(60000);

it("should fetch steps from recent statuses", async () => {
  const data = await fetchSteps("mrhelmut", Date.now() - 2000);

  console.log(data);
});

it("should fetch steps from recent statuses", async () => {
  const data = await fetchSteps(
    "mrhelmut",
    Date.now() - 1000 * 60 * 60 * 24 * 10
  );

  console.log(data);
});
