import ticketDao from "../persistence/DAOs/ticketsFactory.js"

export const createTkt = async (query) => {
     const tkt = await ticketDao.createTkt(query)
     return tkt
}