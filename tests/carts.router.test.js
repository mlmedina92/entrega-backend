import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/server.js";

chai.use(chaiHttp);

describe("Cart API", () => {
  describe("GET /api/carts/{cid}", () => {
    it("should get a cart", () => {
      return chai
        .request(app)
        .get("/api/carts/64417eb301476898bf585dbf")
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.deep.equal({
            "__v": 0,
            _id: "64417eb301476898bf585dbf",
            products: [
              {
                productId: "63f948be491ba8de92f1b017",
                quantity: 2,
              },
              {
                productId: "6403757cb0bd7410a774965b",
                quantity: 3,
              },
            ],
          });
        });
    });
  });
});