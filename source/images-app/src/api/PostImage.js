import axios from 'axios';

export default class PostImage {
  constructor(domain) {
    this.domain = domain || 'http://localhost:8080';
  }
  post(imageInfo) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      auth: {
        username: localStorage.getItem('image-coll-usr'),
        password: localStorage.getItem('image-coll-pass')
      },
    };
    return axios.post(`${this.domain}/image`,
      imageInfo, config)
      .then((response) => {
        if(response.status === 200){
        }
        return response
      });
  }
}