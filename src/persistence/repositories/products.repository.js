import BasicProductDTO from "../DTOs/products/basicProduct.dto.js";

export default class ProductsRepository{
    constructor(dao){
        this.dao=dao
    }

    async get(query){
        const prodsDAO= await this.dao.getProducts(query)
        let prods = []
        prodsDAO.payload.forEach(prod => {
            prods.push(new BasicProductDTO(prod))
        });
        return {...prodsDAO, 'payload': prods}
    }

    async getById(pid){
        const prodsDAO= await this.dao.getProductById(pid)
        return new BasicProductDTO(prodsDAO)
    }

    async addProduct(prod){
        const prodsDAO= await this.dao.addProduct(prod)
        return new BasicProductDTO(prodsDAO)
    }

    async updateProductById(prod){
        const prodsDAO= await this.dao.updateProductById(prod)
        return new BasicProductDTO(prodsDAO)
    }

    async removeProductById(pid){
        const prodId= await this.dao.removeProductById(pid)
        return prodId
    }
}