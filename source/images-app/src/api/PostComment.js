import axios from 'axios';

export default class PostComment {
  constructor(domain) {
    this.domain = domain || 'http://localhost:8080';
  }
  post(comment, imageId) {
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
    return axios.post(`${this.domain}/image/${imageId}/comment`,
      {comment}, config)
      .then((response) => {
        if(response.status === 200){
        }
        return response
      });
  }
}