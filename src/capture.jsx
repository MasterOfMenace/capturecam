import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  mask: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255,255,255, 0.9)',
    display: 'flex'
  },
  container: {
    width: '320px',
    margin: 'auto'
  },
  output: {
    width: '320px',
    height: '400px',
    position: 'absolute',
    left: 0,
    top: 0
  },
  camera: {
    position: 'relative',
    background: 'black'
  },
  snapshotBtn: {
    fontSize: 0,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid black',
    backgroundColor: 'white',
    position: 'absolute',
    left: 'calc(50% - 20px)',
    bottom: '10%'
  },
  controlsWrapper: {
    height: '50px',
    width: '100%',
    backgroundColor: 'rgb(0,0,0)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};

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
      height: 400,
      imgData: null,
      blob: null,
      camera: CAMERA_TYPES.ENVIRONMENT
    };
  }

  componentDidMount = () => {
    console.log(this.state.camera);
    this.ctx = this.canvasRef.current.getContext('2d');
    this._startup();
  }

  componentWillUnmount = () => {
    console.log('capture unmounted');
  }

  someWorkWithBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    console.log(blob);
    console.log(url);
    blob.lastModified = Date.now();
    this.setState({
      imgData: url,
      blob
    });
  }

  _startup = () => {
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

  _stopStreamedVideo = (videoElem) => {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    videoElem.srcObject = null;
  }

  _stop = () => {
    const video = this.videoRef.current;
    this._stopStreamedVideo(video);
    this._clear();
  }

  _canPlay = () => {
    const video = this.videoRef.current;
    if (!this.state.streaming) {
      const height = video.videoHeight / (video.videoWidth / this.state.width);
      this.setState({
        height
      });

      this.setState({
        streaming: true
      });
    }
  }

  _takePicture = () => {
    const canvas = this.canvasRef.current;
    const video = this.videoRef.current;
    const {width, height} = this.state;
    if (width && height) {
      this.ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(this.someWorkWithBlob, 'image/jpeg'); // canvas.toBlob() returns undefined
    }
  }

  _clear = () => {
    const canvas = this.canvasRef.current;
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);

    const data = canvas.toDataURL('image/jpeg');
    this.setState({
      imgData: data
    });
  }

  _onOkButtonClickHandler = () => {
    this._stop();
    this.props.onGetData(this.state.blob);
  }

  _onCancelButtonClickHandler = () => {
    this.setState({
      blob: null,
      imgData: null
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
    this._stopStreamedVideo(video);
    this.toggleCamera(this.state.camera, this._startup);
  }

  render = () => {
    return (
      <div className="capture-mask" style={styles.mask}>
        <div className="capture-container" style={styles.container}>
          <div className="controls-wrapper" style={styles.controlsWrapper}>
            {this.state.imgData ? <button id="okButton" onClick={this._onOkButtonClickHandler}>Ok</button> : null}
            {this.state.imgData ? <button id="okButton" onClick={this._onCancelButtonClickHandler}>Cancel</button> : null}
          </div>
          <div className="camera" style={styles.camera}>
            <video id="video" ref={this.videoRef} width={this.state.width} height={this.state.height} onCanPlay={this._canPlay}>Video stream not available.</video>
            <div className="output" style={{
              ...styles.output,
              display: this.state.imgData ? 'block' : 'none'
            }}>
              <img id="photo" alt="The screen capture will appear in this box." ref={this.imageRef} src={this.state.imgData}/>
            </div>
          </div>
          <div className="controls-wrapper" style={styles.controlsWrapper}>
            <button className="change-cam" onClick={this.onCameraChangeButtonClickHandler}>Change Camera</button>
            <button id="snapshot" onClick={this._takePicture} style={styles.snapshotBtn}>Take photo</button>
            <button id="snapshot" onClick={this.props.onBackButtonClick}>Go back</button>
          </div>
          <canvas ref={this.canvasRef} id="canvas" width={this.state.width} height={this.state.height} style={{display: 'none'}}></canvas>
        </div>
      </div>);
  }
}

Capture.propTypes = {
  onGetData: PropTypes.func,
  onBackButtonClick: PropTypes.func
};

export default Capture;
