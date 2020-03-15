import React from 'react';
import Img from 'react-image'
import withAuth from './withAuth';
import GetImages from '../api/GetImages';
import PostComment from '../api/PostComment';
import Modal from "react-responsive-modal";

import ImageEdit from '../api/ImageEdit';

import "bootstrap-css-only";

import NewComment from "../components/NewComment";
import Comments from "../components/Comments";
import { Link } from 'react-router-dom';
let imageIdPath;
const modalStyle = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class ImageView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      image_id: null,
      image_name: '',
      image_url: '',
      created_at: '',
      image_data: '',
      poster: '',
      comments:[],

      openImagesModal: false,
      showList: false,
      showImageEdit: false,
      showImageSearch: false,
      //Edit Search
      newName: '',
      searchValuePoster: '',
      searchValueImage: '',
      searchResultNo: 0,
      searchResultImages: [],
      selectedRadio: 'poster'

    };
    this.GetImages = new GetImages();
    this.PostComment = new PostComment();
    this.postNewComment = this.postNewComment.bind(this);

    this.ImageEdit = new ImageEdit();
    this.editName = this.editName.bind(this);
    this.updateInputNewName = this.updateInputNewName.bind(this);
  }

  componentWillMount()  {
    imageIdPath = this.props.history.location.pathname.split("/").pop();
    this.GetImages.getImage(imageIdPath).then(image=>{
      this.setState({
        image_id: image.data.image_id,
        image_url: image.data.image_url,
        image_name: image.data.image_name,
        poster: image.data.poster,
        comments: image.data.comments,
      });
    })
  }

  onCloseModal = () => {
    this.setState({ openImagesModal: false });
    this.setState({ showList: false });
    this.setState({ showImageEdit: false });
    this.setState({ showImageSearch: false });
    this.setState({ searchResultNo: 0 });
    this.setState({ searchResultImages: [] });
  };

  handleEditName = (e) => {
    e.preventDefault();
    this.setState({
      showImageEdit: true,
      openImagesModal: true
    });
  };

  renderEdit() {
    if(this.state.poster === localStorage.getItem('image-coll-usr')){
      return(
        <Link to="/" onClick={this.handleEditName} >
             edit name
        </Link>
      )
    }
    return null;
  }

  updateInputNewName(e){
    this.setState({ newName: e.target.value });
  }

  updateSearchByImageName(e){
    this.setState({ searchValueImage: e.target.value });
  }

  updateSearchByPoster(e){
    this.setState({ searchValuePoster: e.target.value });
  }

  editName(e) {
    e.preventDefault();
    if (this.state.newName) {
      this.ImageEdit.edit(this.state.newName, imageIdPath).then(response => {
        return response
      }).then(res => {
        const editForm = document.getElementsByName('edit-name')[0];
        editForm.reset();
        this.setState({image_name : res.data.image_name });
      }).catch(e => {
        alert("Something went wrong");
      });
    }
  }

  renderModals(){
    if (this.state.showList) {
      return(
        <div>
        </div>
      );
    } else if (this.state.showImageEdit) {
      return(<div>
        <br/>
        <br/>
        <h2>{`Edit image name: `}</h2>
        <form name="edit-name" onSubmit={this.editName}>
          <input type="text" onChange={this.updateInputNewName} /><br/><br/>
          <input type="submit" value="Done"/>
        </form>
      </div>)
    } else if(this.state.showImageSearch){
      return(<div>
      </div>)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot)  {

  }

  postNewComment(comment) {
    comment = {
      username: localStorage.getItem('image-coll-usr'),
      comment: comment.comment

    };
    this.PostComment.post(comment.comment,imageIdPath ).then(com =>{
      this.setState({
        comments: [ comment, ...this.state.comments]
      });
    });
  }

  render() {
    const { openImagesModal } = this.state;

    return (
      <div>
        <div style={modalStyle}>
          <Modal open={openImagesModal} onClose={this.onCloseModal}>
            {this.renderModals()}
          </Modal>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Img src={this.state.image_url && this.state.image_url} />
        </div>
        <div>
          <div className="container">
              <div className="user">
                <h5 className="display-name"> Image name: {this.state.image_name}  {this.renderEdit()} </h5>
                <NewComment postNewComment={this.postNewComment} />
              </div>
          </div>
        <br/>
         <div>
          <Comments comments={this.state.comments} />
         </div>
        </div>
      </div>
    );
  }
}

export default withAuth(ImageView)