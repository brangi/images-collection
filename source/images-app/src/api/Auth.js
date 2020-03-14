import axios from 'axios';

export default class Auth {
  constructor(domain) {
    this.domain = domain || 'http://localhost:8080';
  }
  register(user, pass) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      }
    };
    return axios.post(`${this.domain}/signup`,
      {
        user: user,
        pass: pass
      }, config)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('image-coll-auth', 'authorized');
          localStorage.setItem('image-coll-usr', user);
          localStorage.setItem('image-coll-pass', pass);
        }
        return response
      })
  }
  login(user, pass) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      }
    };
    return axios.post(`${this.domain}/login`,
      {
        user: user,
        pass: pass
      }, config)
      .then((response) => {
        if(response.status === 200){
          localStorage.setItem('image-coll-auth', response.data.message);
          localStorage.setItem('image-coll-usr', user);
          localStorage.setItem('image-coll-pass', pass);
        }
        return response
      })
  }
}