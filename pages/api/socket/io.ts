import {Server as NetServer} from 'http'
import { NextApiRequest } from 'next'
import {Server as ServerIO} from 'socket.io'

import { NextApiResponseServerIo } from '../../../type'


export const config = {
    api : {
        bodyParser: false,
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if(!res.socket.server.io) {
        const path = `/api/socket/io`;
        const httpServe: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServe,{
            path: path,
            addTrailingSlash: false,
        });
        res.socket.server.io = io;
    }

    //@ts-ignore
    res.end()
}

export default ioHandler