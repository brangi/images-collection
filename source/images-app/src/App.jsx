import React from 'react';
import moment from 'moment';
import ImageUploader from 'react-images-upload';
import {
  Link,
} from 'react-router-dom'

import * as filestack from 'filestack-js';
import withAuth from './components/withAuth';
import PostImage from './api/PostImage';
import GetImages from './api/GetImages';

const client = filestack.init('AVjyBCnoNQ8ySfmKRDlHwz');
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imagesCollection:[],
      uploadedImages: [],
      uploading: ''
    };
    this.PostImage = new PostImage();
    this.GetImages = new GetImages();
    this.onDrop = this.onDrop.bind(this);
  }

  componentWillMount()  {
    this.GetImages.getCollection().then(images=>{
      if(images.data.length >0) {
        this.setState({
          imagesCollection: images.data
        });
      }
    })
  }

  onDrop(picture) {
    this.setState({
      uploadedImages: this.state.uploadedImages.concat(picture),
      uploading: 'Uploading...please wait...'
    });
    client.upload(picture[0])
      .then(res => {
        console.log('success: ', res);
        if(res.status === 'Stored') return res;
      })
      .then((res)=>{
        this.PostImage.post(res);
        this.setState({
          uploading: `Image: ${res.filename} -  Successfully uploaded!`
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
        <ul>
          {this.state.imagesCollection.map((img) => (
            <li key={img.image_id}>
            <Link to={`/image/${img.image_id}`}>
            {`Name: ${img.image_name}  -  
                  Poster: ${img.username}  -
                  Created at: ${moment(img.created_at)}`
            }
            </Link>
            </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default withAuth(App);