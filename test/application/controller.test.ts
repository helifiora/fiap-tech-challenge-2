import { assert, describe, it } from "vitest";

import * as v from "valibot";

import {
  ControllerRequest,
  ControllerInvalidBodyError,
  ControllerNoParamError,
  ControllerResponse,
} from "#application/controller.ts";

describe("ControllerRequest", () => {
  const body1 = v.object({
    name: v.string(),
    age: v.number(),
  });

  it("[body] should throw ControllerInvalidBodyError when schema is invalid", () => {
    const request = new ControllerRequest({
      body: { name: 200 },
    });

    assert.throws(() => request.body(body1), ControllerInvalidBodyError);
  });

  it("[body] should return an object when schema is valid", () => {
    const request = new ControllerRequest({
      body: {
        name: "Heli",
        age: 21,
      },
    });

    const result = request.body(body1);
    assert.equal(result.name, "Heli");
    assert.equal(result.age, 21);
  });

  it("[param] should throw ControllerNoParamError when key is not found", () => {
    const request = new ControllerRequest({
      params: { oi: "oi" },
    });

    assert.throws(() => request.param("me"), ControllerNoParamError);
  });

  it("[param] should return a string when key is found", () => {
    const request = new ControllerRequest({
      params: { oi: "oi oi oi" },
    });

    const key = request.param("oi");
    assert.equal(key, "oi oi oi");
  });

  it("[query] should return null when key is not found", () => {
    const request = new ControllerRequest({
      queries: { q: "asd" },
    });

    const key = request.query("oi");
    assert.equal(key, null);
  });

  it("[query] should return string when key is found", () => {
    const request = new ControllerRequest({
      queries: { q: "asd" },
    });

    const key = request.query("q");
    assert.equal(key, "asd");
  });

  it("[header] should return null when key is not found", () => {
    const request = new ControllerRequest({
      headers: { q: "asd" },
    });

    const key = request.header("oi");
    assert.equal(key, null);
  });

  it("[header] should return string when key is found", () => {
    const request = new ControllerRequest({
      headers: { q: "asd" },
    });

    const key = request.header("q");
    assert.equal(key, "asd");
  });
});

describe("ControllerResponse", () => {
  it("[created] should create a response", () => {
    const response = ControllerResponse.created({ value: "okay okay" });
    assert.equal(response.status, 201);
    assert.deepEqual(response.content, { value: "okay okay" });
  });

  it("[ok] should create a response", () => {
    const response = ControllerResponse.ok({ value: "okay okay" });
    assert.equal(response.status, 200);
    assert.deepEqual(response.content, { value: "okay okay" });
  });

  it("[badRequest] should create a response", () => {
    const response = ControllerResponse.badRequest("nada haver");
    assert.equal(response.status, 400);
    assert.deepEqual(response.content, { error: "nada haver" });
  });

  it("[noContent] should create a response", () => {
    const response = ControllerResponse.noContent();
    assert.equal(response.status, 204);
    assert.equal(response.content, null);
  });
});
