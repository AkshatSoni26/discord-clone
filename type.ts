import { Server as NetServer, Socket } from 'net'
import { NextApiRequest } from 'next';
import {Server as SocketIOServer} from 'socket.io'
import { Server, Member, Profile} from '@prisma/client'


export type ServerWithMembersWithProfils = Server & {
    members: (Member & {profile: Profile})[]
}

export type NextApiResponseServerIo = NextApiRequest & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}