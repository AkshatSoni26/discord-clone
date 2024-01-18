import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfils = Server & {
    members: (Member & {profile: Profile})[]
}