import { expect } from "chai";
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/server.js";

chai.use(chaiHttp);

describe("GET /api/products", () => {
  it("should return a list of products", async () => {
    const res = await chai.request(app).get("/api/products");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status");
    expect(res.body).to.have.property("payload").to.be.an("array");
  });

  it("should return a specific product by ID", async () => {
    const productId = "64037481b0bd7410a7749655";
    const res = await chai.request(app).get(`/api/products/${productId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("title");
    expect(res.body).to.have.property("price");
  });
});