import React from 'react';
import ImageUploader from 'react-images-upload';
import * as filestack from 'filestack-js';
import withAuth from './components/withAuth';

const client = filestack.init('AVjyBCnoNQ8ySfmKRDlHwz');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      uploading: ''
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(picture) {
    this.setState({
      pictures: this.state.pictures.concat(picture),
      uploading: 'Uploading...please wait...'
    });
    client.upload(picture[0])
      .then(res => {
        console.log('success: ', res)
      })
      .then(()=>{
        this.setState({
          uploading: 'Successfully uploaded!'
        });
      })
      .catch(err => {
        console.log(err)
      });
  }

  render() {
    return (
      <div>
        <ImageUploader
          withIcon={true}
          buttonText='Choose an image'
          onChange={this.onDrop}
          imgExtension={['.jpg', '.gif', '.png']}
          maxFileSize={5242880}
        />
        <div style={{display: 'flex', justifyContent: 'center'}}>
          {this.state.uploading}
        </div>
      </div>
    );
  }
}

export default withAuth(App);