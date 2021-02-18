import React from 'react';
import Capture from './capture';

class Wrapper extends React.Component {
  state = {
    blob: null,
    dataUrl: '',
    openCapture: false,
    url: ''
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

  onCancelClick = () => {
    this.setState({
      openCapture: false
    });
  }

  onClearClick = () => {
    this.setState({
      blob: null,
      dataUrl: ''
    });
  }

  getUrlFromBlob = (blob) => {
    return URL.createObjectURL(blob);
  }

  postData = async () => {
    const formData = new FormData();
    formData.append('file', this.state.blob);

    try {
      const response = await fetch('https://test-nirgroup.ru/sk-backends/v1/photos', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log(result);
      const url = `https://test-nirgroup.ru/sk-backends/v1/${result.filePath}${result.fileName}`;
      this.setState({
        url
      });
    } catch (err) {
      console.log(err);
    }
  }

  render = () => {
    return (
      <div className="wrapper">
        <button className="getImage" onClick={this.onGetImageButtonClickHandler}>Get Image</button>
        <button className="clear" onClick={this.onClearClick}>Clear</button>
        <button className="send" onClick={this.postData} disabled={this.state.dataUrl ? false : true}>Send Image</button>
        {this.state.openCapture ? <Capture onGetData={this.onGetImageDataHandler} onBackButtonClick={this.onCancelClick}/> : null}
        <div className="captured">
          <img id="photo" alt="The screen capture will appear in this box." src={this.state.dataUrl}/>
        </div>
        <div className="gallery">
          <img src={this.state.url} alt='Здесь будет отображаться отправленное изображение'/>
        </div>
      </div>
    );
  }
}

export default Wrapper;

