import config from '../../config.js'
// import TicketsFile from './carts/CartFile.js'
import TicketsRepository from '../repositories/tickets.repository.js'

let ticketDao

switch (config.persistence) {
    case 'MONGO':
        await import('../mongo/configMongo.js')
        const { default: TicketsMongo } = await import('./tickets/TicketsMongo.js')
        ticketDao = new TicketsRepository(new TicketsMongo())
        break;

    // case 'FILE':
    //     ticketDao = new TicketsFile()
    //     break;
}

export default ticketDao