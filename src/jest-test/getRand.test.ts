import { test, expect } from "@jest/globals";
import { getRand } from "../utils";

test("get random number from area [10, 80] must >= 10 and < 80", () => {
  const randomNum = getRand([10, 80]);
  expect(randomNum).toBeGreaterThanOrEqual(10);
  expect(randomNum).toBeLessThanOrEqual(80);
});
