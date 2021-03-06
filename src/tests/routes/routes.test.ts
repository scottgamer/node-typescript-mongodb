/**
 * This file runs integration testing
 * on every endpoint using supertest
 */

import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../utils";
import middleware from "../../middleware";
import errorHandlers from "../../middleware/errorHandlers";
import routes from "../../routes";
import { createConnection } from "typeorm";
import "reflect-metadata";

jest.mock("axios");

describe("routes integration tests", () => {
  let router: Router;
  let token: string;

  // initialize middleware and router
  beforeAll(async () => {
    await createConnection();
    router = express();
    applyMiddleware(middleware, router);
    applyRoutes(routes, router);
    applyMiddleware(errorHandlers, router);
  });

  test("should login", async () => {
    const response = await request(router)
      .post("/api/v1/auth/login")
      .set({ "Content-Type": "application/json" })
      .send({
        username: "richard",
        password: "5678"
      });
    expect(response.status).toEqual(200);
    // set token for next tests
    token = response.body.token;
  });

  test("should fail if no jwt set", async () => {
    const response = await request(router).get("/api/v1/users");
    expect(response.status).toEqual(401);
  });

  // work-around to run test after getting token
  setTimeout(() => {
    test("should retrieve all users", async () => {
      const response = await request(router)
        .get("/api/v1/users")
        .set("Authorization", token);
      expect(response.status).toEqual(200);
    });
  }, 1000);

  // TODO: fix error handler to not throw 401 on non defined endpoints

  // test("a non-existing api method", async () => {
  //   const response = await request(router).get("/api/v11/products");
  //   expect(response.status).toEqual(401);
  // });
});
