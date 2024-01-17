import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server';

import { currentProfile } from '../../../lib/current-profile';
import { db } from '../../../lib/db';
import { MemberRole } from '@prisma/client';

export async function POST(request: Request) {

   
    try {
        const { name, imageurl } = await request.json()
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        console.log('Creating server...');

        const server = await db.server.create(
            {
                data: {
                    profileId: profile.id,
                    name,
                    imageurl,
                    inviteCode: uuidv4(),
                    channels: {
                        create: [
                            { name: "general", profileId: profile.id }
                        ]
                    },
                    members: {
                        create: [
                            { profileId: profile.id, role: MemberRole.ADMIN }
                        ]
                    }
                }
            }
        )
        console.log('Server created:', server);
        return NextResponse.json(server);

    }
    catch (error) {
        console.log('[SERVER_POST]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}