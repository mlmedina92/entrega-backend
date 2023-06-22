import { productsModel } from "../../mongo/models/products.model.js"
import CustomError from '../../../utils/errors/CustomError.js'
import { ErrorsName } from '../../../utils/errors/errors.enum.js'

export default class ProductManager {
  async addProduct({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
    owner,
    uid
  }) {
    try {
      if (typeof thumbnails === 'string') {
        thumbnails = thumbnails.split(',');
      }

      const ownerValue = owner === 'premium' ? uid : 'admin';

      const addProd = await productsModel.create({
        title,
        description,
        code,
        price: Number(price),
        status,
        stock: Number(stock),
        category,
        thumbnails,
        owner: ownerValue,
      });

      return addProd;
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.CREATING_PROD,
        cause: error.cause || error.stack,
        message: error.message,
      });
    }
  }

  // consultar todos
  async getProducts(queryParams = {}) { //recibe objeto query y destructura sus props
    const { page = 1, limit = 10, category = null, stock = null, sort = null } = queryParams //si arranca en null no hace nada

    let query = {}
    if (category) { // ej: http://localhost:3000/api/products?category=categorria2 
      query.category = category;
    }
    if (stock) { // ej: http://localhost:3000/api/products?stock=0 . Esto retorna todos los prod con stock 
      query.stock = { $gt: stock } // muestra los resultados que sea >= al param que viene
    }

    // ejemplo precio asc http://localhost:3000/api/products?sort=price
    // ejemplo precio desc http://localhost:3000/api/products?sort=-price

    const myCustomLabels = {
      docs: 'payload'
    };

    // status:success/error
    // payload: Resultado de los productos solicitados
    // totalPages: Total de páginas
    // prevPage: Página anterior
    // nextPage: Página siguiente
    // page: Página actual
    // hasPrevPage: Indicador para saber si la página previa existe
    // hasNextPage: Indicador para saber si la página siguiente existe.
    // prevLink: Link directo a la página previa (null si hasPrevPage=false)
    // nextLink: Link directo a la página siguiente (null si hasNextPage=false)


    const prods = await productsModel.paginate(query, { page, limit, sort, customLabels: myCustomLabels, lean: true })



    const status = prods !== 'error' ? 'success' : 'error' // como seria????
    const prevLink = prods.hasPrevPage ? `http://localhost:3000/api/products?page=${prods.prevPage}` : null
    const nextLink = prods.hasNextPage ? `http://localhost:3000/api/products?page=${prods.nextPage}` : null

    return { ...prods, status: status, prevLink: prevLink, nextLink: nextLink };
  }

  async getProductById(id) {
    try {
      const getById = await productsModel.findById(id);
      return getById;
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.GETTING_PROD,
        cause: error.cause || error.stack,
        message: error.message,
      })
    }
  }

  async updateProductById(prodToUpdate) {
    let {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = prodToUpdate;

    if (typeof thumbnails === 'string') {
      thumbnails = thumbnails.split(',')
    }

    const found = await this.getProductById(id);

    found.title = title;
    found.description = description;
    found.code = code;
    found.price = Number(price);
    found.status = (status.toLowerCase() === "true");
    found.stock = Number(stock);
    found.category = category;
    found.thumbnails = thumbnails;

    const update = await productsModel.findOneAndUpdate({ _id: id }, { $set: found });

    return update;
  }

  async removeProductById(id) {
    try {
      const deleted = await productsModel.findByIdAndDelete(id);
      return deleted;
    } catch (error) {
      CustomError.createCustomError({
        name: ErrorsName.REMOVING_PROD,
        cause: error.cause || error.stack,
        message: error.message,
      })
    }
  }
}
