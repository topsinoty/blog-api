import {
  wrapSuccessfulOperationJSON,
  wrapFailedOperationJSON,
} from "../helper";
import * as assert from "node:assert";
import { test } from "node:test";

test("wrapSuccessfulOperationJSON works", () => {
  const data = { message: "hello" };
  const wrapped = wrapSuccessfulOperationJSON(data);

  assert.deepEqual(wrapped, {
    status: "SUCCESS",
    data,
  });
});

test("wrapFailedOperationJSON works", () => {
  const error = new Error("oops") as any;
  error.statusCode = 500;
  const wrapped = wrapFailedOperationJSON(error);

  assert.equal(wrapped.status, "FAIL");
  assert.equal(wrapped.data, null);
  assert.equal(wrapped.error.message, "oops");
});
