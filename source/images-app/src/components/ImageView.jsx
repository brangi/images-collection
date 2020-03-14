import React from 'react';
import Img from 'react-image'
import withAuth from './withAuth';
import GetImages from '../api/GetImages';

class ImageView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      image_id: '',
      image_name: '',
      image_url: '',
      created_at: '',
      image_data: '',

    };
    this.GetImages = new GetImages();
  }

  componentWillMount()  {
    const imageIdPath = this.props.history.location.pathname.split("/").pop();
    this.GetImages.getImage(imageIdPath).then(image=>{
      this.setState({
        image_url: image.data.image_url
      });
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot)  {

  }

  render() {
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Img src={this.state.image_url && this.state.image_url} />
        </div>
      </div>
    );
  }
}

export default withAuth(ImageView)