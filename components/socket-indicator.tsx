'use client'

import { Badge } from "@/components/ui/badge";
import { useSocket } from "./providers/socket-provider";
import LottieImage from "./lottie/LottieImage";


const SocketIndicator = () => {

    const { isConnected } = useSocket()

    if (!isConnected) {
        return (
            <Badge variant='outline' className="bg-rose-600 text-white border-none">
                Fallback: Polling every 1s
            </Badge>
        )
    }

    return (
        <Badge variant='outline' className="flex bg-emerald-600 text-white border-none">
            <LottieImage />
            Live
        </Badge>
    );
}

export default SocketIndicator;