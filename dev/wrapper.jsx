import React from 'react';
import Capture from '../src/components/capture';

class Wrapper extends React.Component {
  state = {
    blob: null,
    dataUrl: '',
    openCapture: false,
  };

  onGetImageButtonClickHandler = () => {
    this.setState({
      openCapture: true
    });
  };

  onGetImageDataHandler = (blob) => {
    console.log(blob);
    const dataUrl = this.getUrlFromBlob(blob);

    this.setState({
      blob,
      dataUrl,
      openCapture: false
    });
  }

  onCancelButtonClickHandler = () => {
    this.setState({
      openCapture: false
    });
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
        <button className="getImage" onClick={this.onGetImageButtonClickHandler}>Get Image</button>
        <button className="clear" onClick={this.onClearButonClickHandler}>Clear</button>
        {this.state.openCapture ? <Capture onGetData={this.onGetImageDataHandler} onBackButtonClick={this.onCancelButtonClickHandler}/> : null}
        <div className="captured">
          <img alt="The screen capture will appear in this box." src={this.state.dataUrl}/>
        </div>
      </div>
    );
  }
}

export default Wrapper;

