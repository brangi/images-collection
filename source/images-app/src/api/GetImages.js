import axios from 'axios';

export default class GetImages {
  constructor(domain) {
    this.domain = domain || 'http://localhost:8080';
  }
  getCollection(sortBy) {
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
    return axios.get(`${this.domain}/image/collection?sort=${sortBy?sortBy:''}`, config)
      .then((response) => {
        if(response.status === 200){
        }
        return response
      });
  }
  getImage(id) {
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
    return axios.get(`${this.domain}/image/${id}`, config)
      .then((response) => {
        if(response.status === 200){
        }
        return response
      });
  }
}