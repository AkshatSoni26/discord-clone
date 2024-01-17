import { redirect } from 'next/navigation'

import {currentProfile} from ''

const NavigationSidebar = () => {
    
    const profile = await currentProfile()

    if(!profile) {
        return redirect("/")
    }

    const servers = await sb.server.findmany({
        where: [
            members: {
                some: {
                    profileId: profile.id
                }
            }
        ]
    })

    return <>
    Navigation Sidebar
    </>
}

export default NavigationSidebar