import React from 'react';
import PropTypes from 'prop-types';

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
      imgData: null,
      blob: null
    };
  }

  componentDidMount = () => {
    this.ctx = this.canvasRef.current.getContext('2d');
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
    // URL.revokeObjectURL(url);
  }

  _startup = () => {
    const video = this.videoRef.current;
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
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
    this.props.onGetData(this.state.blob);
    this._stop();
  }

  render = () => {
    return (
      <div className="container">
        <button className="activate" onClick={this._startup}>Start</button>
        <button className="activate" onClick={this._stop}>Stop</button>
        <div className="camera">
          <video id="video" ref={this.videoRef} width={this.state.width} height={this.state.height} onCanPlay={this._canPlay}>Video stream not available.</video>
          <button id="startbutton" onClick={this._takePicture}>Take photo</button>
          <button id="okButton" onClick={this._onOkButtonClickHandler}>Ok</button>
        </div>
        <canvas ref={this.canvasRef} id="canvas" width={this.state.width} height={this.state.height} style={{display: 'none'}}></canvas>
        <div className="output">
          <img id="photo" alt="The screen capture will appear in this box." ref={this.imageRef} src={this.state.imgData}/>
        </div>
      </div>);
  }
}

Capture.propTypes = {
  onGetData: PropTypes.func
};

export default Capture;
