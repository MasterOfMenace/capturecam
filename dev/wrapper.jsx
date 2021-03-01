import React from 'react';
import Capture from '../src/components/Capture';

class Wrapper extends React.Component {
  state = {
    blob: null,
    dataUrl: '',
    openCapture: false,
  };

  setCaptureStatus = (value) => {
    this.setState({
      openCapture: value
    });
  }

  onGetImageDataHandler = (blob) => {
    const dataUrl = this.getUrlFromBlob(blob);

    this.setState({
      blob,
      dataUrl,
    });
    this.setCaptureStatus(false);
  }

  onClearButonClickHandler = () => {
    this.setState({
      blob: null,
      dataUrl: ''
    });
  }

  getUrlFromBlob = (blob) => {
    return URL.createObjectURL(blob);
  }

  render = () => {
    return (
      <div className="wrapper">
        <button className="getImage" onClick={() => this.setCaptureStatus(true)}>Get Image</button>
        <button className="clear" onClick={this.onClearButonClickHandler}>Clear</button>
        {
          this.state.openCapture &&
          <Capture
            onGetData={this.onGetImageDataHandler}
            onBackButtonClick={() => this.setCaptureStatus(false)}
          />
        }
        <div className="captured">
          <img alt="The screen capture will appear in this box." src={this.state.dataUrl}/>
        </div>
      </div>
    );
  }
}

export default Wrapper;

