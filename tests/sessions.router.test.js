import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/server.js";

chai.use(chaiHttp);

describe("Sessions Router", () => {
  describe("POST /login", () => {
    it("should log in a user and return a session token", () => {
      const credentials = {
        email: "marcus@bane.com",
        password: "123",
      };

      return new Promise((resolve, reject) => {
        chai
          .request(app)
          .post("/api/users/login")
          .send(credentials)
          .end((err, res) => {
            if (err) {
              reject(err);
              console.log("error");
            } else {
              expect(res.status).to.equal(200);
              resolve();
            }
          });
      });
    });
  });
});
