
import Lottie from 'react-lottie';
import liveIndicator from './liveIndicator.json'

const LottieImage = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: liveIndicator,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };

    return (
        <Lottie options={defaultOptions} />
    )
}

export default LottieImage;