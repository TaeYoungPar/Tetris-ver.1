import ReactAudioPlayer from 'react-audio-player';
import music from '../music/MP_엉뚱한 작당모의.mp3'

const BackgroundMusic = () => {
  return (
    <ReactAudioPlayer src={music} autoPlay loop />
  );
}

export default BackgroundMusic;
