import React, { Component } from 'react';
import SignInUp from './SignInUp';
export default function withAuth(AuthComponent) {
  return class AuthWrapped extends Component {
    render() {
      if (localStorage.getItem('image-coll-auth')) {
        return (
          <AuthComponent history={this.props.history}/>
        )
      }
      else {
        return (
          <SignInUp/>
        )
      }
    }
  }
}