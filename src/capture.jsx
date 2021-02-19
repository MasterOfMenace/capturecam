import React from 'react';
import PropTypes from 'prop-types';
import switchIcon from './images/switch-camera.svg';
import goBackIcon from './images/go-back-arrow.svg';
import './styles/capture.scss';

const CAMERA_TYPES = {
  USER: 'user',
  ENVIRONMENT: 'environment'
};

class Capture extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.imageRef = React.createRef();
    this.canvasRef = React.createRef();

    this.state = {
      streaming: false,
      width: 320,
      height: 0,
      imgUrl: null,
      blob: null,
      camera: CAMERA_TYPES.ENVIRONMENT
    };
  }

  componentDidMount = () => {
    console.log(this.state.camera);
    this.ctx = this.canvasRef.current.getContext('2d');
    this.startup();
  }

  setStreaming = (status) => {
    this.setState({
      streaming: status
    });
  }

  setHeight = (height) => {
    this.setState({
      height
    });
  }

  setImgUrl = (imgUrl) => {
    this.setState({
      imgUrl
    });
  }

  getBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    blob.lastModified = Date.now();
    this.setImgUrl(url);
    this.setState({
      blob
    });
  }

  startup = () => {
    const video = this.videoRef.current;
    navigator.mediaDevices.getUserMedia({video: {
      facingMode: this.state.camera
    }, audio: false})
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log('An error occurred: ' + err);
    });
  }

  stopStreamedVideo = (videoElem) => {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    videoElem.srcObject = null;
  }

  stop = () => {
    const video = this.videoRef.current;
    this.stopStreamedVideo(video);
    this.clear();
  }

  onCanPlayHandler = () => {
    const video = this.videoRef.current;
    if (!this.state.streaming) {
      const height = video.videoHeight / (video.videoWidth / this.state.width);
      this.setHeight(height);
      this.setStreaming(true);
    }
  }

  takePicture = () => {
    const canvas = this.canvasRef.current;
    const video = this.videoRef.current;
    const {width, height} = this.state;
    if (width && height) {
      this.ctx.drawImage(video, 0, 0, width, height);
      canvas.toBlob(this.getBlob, 'image/jpeg');
    }
  }

  clear = () => {
    const canvas = this.canvasRef.current;
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);

    const url = canvas.toDataURL('image/jpeg');
    this.setImgUrl(url);
  }

  onOkButtonClickHandler = () => {
    this.stop();
    this.props.onGetData(this.state.blob);
  }

  onBackButtonClickHandler = () => {
    this.stop();
    this.props.onBackButtonClick();
  }

  onCancelButtonClickHandler = () => {
    this.setState({
      blob: null,
      imgUrl: null
    });
  }

  toggleCamera = (currentCamera, callback) => {
    const camera = currentCamera === CAMERA_TYPES.ENVIRONMENT ? CAMERA_TYPES.USER : CAMERA_TYPES.ENVIRONMENT;
    this.setState({
      camera
    }, callback);
  }

  onCameraChangeButtonClickHandler = () => {
    const video = this.videoRef.current;
    this.stopStreamedVideo(video);
    this.toggleCamera(this.state.camera, this.startup);
  }

  render = () => {
    return (
      <div className="capture">
        <div className="capture__mask">
          <div className="capture__container">
            <div className="capture__controls-wrapper">
              {this.state.imgUrl ? <button className='capture__cancel-button' onClick={this.onCancelButtonClickHandler}>Cancel</button> : null}
              {this.state.imgUrl ? <button className='capture__ok-button' onClick={this.onOkButtonClickHandler}>Ok</button> : null}
            </div>
            <div className="capture__camera">
              <video id="video" ref={this.videoRef} width={this.state.width} height={this.state.height} onCanPlay={this.onCanPlayHandler}>Video stream not available.</video>
              <div className="capture__photo" style={{
                display: this.state.imgUrl ? 'block' : 'none'
              }}>
                <img alt="The screen capture will appear in this box." ref={this.imageRef} src={this.state.imgUrl}/>
              </div>
            </div>
            <div className="capture__controls-wrapper">
              <button className="capture__change-cam-button" onClick={this.onCameraChangeButtonClickHandler}>
                <svg viewBox="0 0 64 64" width='32' height='32' fill='#FFFFFF'>
                  <use href={`${switchIcon}#camera-switch`} />
                </svg>
                <span className='visually-hidden'>Switch Camera</span>
              </button>
              <button className='capture__take-photo-button' onClick={this.takePicture}>Take photo</button>
              <button className='capture__go-back-button' onClick={this.onBackButtonClickHandler}>
                <svg viewBox="0 0 38 38" width='34' height='34' fill='#FFFFFF'>
                  <use href={`${goBackIcon}#go-back-arrow`} />
                </svg>
                <span className='visually-hidden'>Назад</span>
              </button>
            </div>
            <canvas ref={this.canvasRef} width={this.state.width} height={this.state.height}></canvas>
          </div>
        </div>
      </div>
    );
  }
}

Capture.propTypes = {
  onGetData: PropTypes.func,
  onBackButtonClick: PropTypes.func
};

export default Capture;
