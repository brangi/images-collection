import axios from 'axios';

export default class SearchImage {
  constructor(domain) {
    this.domain = domain || 'http://localhost:8080';
  }
  byName(name) {
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
    return axios.get(`${this.domain}/search/image?name=${name}`, config)
      .then((response) => {
        return response
      });
  }
}