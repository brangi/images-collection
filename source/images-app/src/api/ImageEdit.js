import axios from 'axios';

export default class ImageEdit {
  constructor(domain) {
    this.domain = domain || 'http://localhost:8080';
  }
  edit(name, imageId) {
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
    return axios.put(`${this.domain}/image/${imageId}/name`,
      {name}, config)
      .then((response) => {
        if(response.status === 200){
        }
        return response
      });
  }
}