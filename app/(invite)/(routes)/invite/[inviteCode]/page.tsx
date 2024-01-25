
import { redirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "../../../../../lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "../../../../../lib/db";


interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};


const InviteCodePage = async ({ params }: InviteCodePageProps) => {


    const profile = await currentProfile();

    console.log("inviteCode====>", params.inviteCode)

    console.log('======profile======', profile)

    if (!profile || profile === null) {
        return redirectToSignIn();
    }

    console.log("=======before invitcode check+=======")


    if (!params.inviteCode) {
        return redirect('/')
    }

    console.log("before====existingServer====before")

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile?.id
                }
            }
        }
    })

    console.log("existingServer====>", existingServer)

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`)
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    })


    if (server) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('come under the server condition');
        return redirect('/');
    }
    


    return (
        <div>
            Hello Invite friend.
        </div>
    )
}

export default InviteCodePage