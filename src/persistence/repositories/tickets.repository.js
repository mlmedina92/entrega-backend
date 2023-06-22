import TktDTO from "../DTOs/tkts/tkt.dto.js";

export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createTkt(tkt) {
        const tktDAO = await this.dao.create(tkt)
        return tktDAO
    }
}