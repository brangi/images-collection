import React from 'react';
import moment from 'moment';
import Modal from "react-responsive-modal";
import ImageUploader from 'react-images-upload';
import {
  Link,
} from 'react-router-dom'

import * as filestack from 'filestack-js';
import withAuth from './components/withAuth';
import PostImage from './api/PostImage';
import GetImages from './api/GetImages';
import SearchImage from './api/SearchImage';

const client = filestack.init('AVjyBCnoNQ8ySfmKRDlHwz');
const modalStyle = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imagesCollection:[],
      uploadedImages: [],
      uploading: '',
      openImagesModal: false,
      showListResult: false,
      showImageSearch: false,
      searchValueImage: '',
      searchResultNo: 0,
      searchResultImages: [],
    };
    this.PostImage = new PostImage();
    this.GetImages = new GetImages();
    this.SearchImage = new SearchImage();
    this.searchImage = this.searchImage.bind(this);
    this.updateInputSearchImage = this.updateInputSearchImage.bind(this);
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

  handleLogOut = () => {
      localStorage.clear();
      window.location.href = '/';
  };

  onCloseModal = () => {
    this.setState({ openImagesModal: false });
    this.setState({ showListResult: false });
    this.setState({ showImageSearch: false });
    this.setState({ searchResultNo: 0 });
    this.setState({ searchResultImages: [] });
    window.location.href = '/';
  };

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

   searchImage(e) {
    e.preventDefault();
    this.SearchImage.byName(this.state.searchValueImage).then(res =>{
      if(res.data.length > 0){
        this.setState({ searchResultNo: res.data.length });
        this.setState({ searchResultImages: res.data });
        console.log(res.data)
      }
      const searchForm = document.getElementsByName('search-image')[0];
      searchForm.reset();
    });
  }

  updateInputSearchImage(e){
    this.setState({ searchValueImage: e.target.value });
  }

  renderModals(){
    if(this.state.showImageSearch){
      return(<div>
        <br/>
        <br/>
        <h2>{`Search for an image`}</h2>
        <form name="search-image" onSubmit={this.searchImage} >
          <input type="text"  placeholder="By name..." onChange={this.updateInputSearchImage} /><br/><br/>
          <input type="submit" value="Search"/>
        </form>
        {(this.state.searchResultNo > 0 )?
          <div>
            <br/>
            <br/>
            <h2>{`Search Result: ${this.state.searchResultNo}`}</h2>
            <br/>
            <div>
              <ul>
                {this.state.searchResultImages.map(function(image, idx){
                  const link = `/image/${image.image_id}`;
                  return (<li key={idx}>
                    {`Image: ${image.image_name}`} <a href={link}>View</a></li>)
                })}
              </ul>
            </div>
          </div>
          :''}
      </div>)
    }
  }

  openModalSearch = (e) => {
    e.preventDefault();
    this.setState({
      showImageSearch: true,
      openImagesModal: true
    });
  };

  render() {
    const { openImagesModal } = this.state;

    return (
      <div>
        <div style={modalStyle}>
          <Modal open={openImagesModal} onClose={this.onCloseModal}>
            {this.renderModals()}
          </Modal>
        </div>
        <div>
          <Link to="/" onClick={this.handleLogOut}>Log out</Link>
        </div>
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
        <div>
          <Link to="/" onClick={this.openModalSearch}>Search </Link>
        </div>
        <ul>
          <div> - Images  - </div>
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