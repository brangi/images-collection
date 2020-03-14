import React, { Component } from 'react';
import ReactModalLogin from 'react-modal-login';

class SignInUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loggedIn: null,
      loading: false,
      error: null,
      initialTab: null,
      recoverPasswordSuccess: null,
    };

  }

  openModal(initialTab) {
    this.setState({
      initialTab: initialTab
    }, () => {
      this.setState({
        showModal: true,
      })
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      error: null
    });
  }

  onLogin() {
    const user = document.querySelector('#user').value;
    const password = document.querySelector('#password').value;
  }

  onRegister() {
    const user = document.querySelector('#user').value;
    const password = document.querySelector('#password').value;
  }

  render() {
    return (
      <main>
        <div>
          <ReactModalLogin
            visible={true}
            onCloseModal={this.closeModal.bind(this)}
            form={{
              onLogin: this.onLogin.bind(this),
              onRegister: this.onRegister.bind(this),
              loginBtn: {
                label: "Sign in"
              },
              registerBtn: {
                label: "Sign up"
              },

              loginInputs: [
                {
                  containerClass: 'RML-form-group',
                  label: 'User',
                  type: 'user',
                  inputClass: 'RML-form-control',
                  id: 'user',
                  name: 'user',
                  placeholder: 'user',
                },
                {
                  containerClass: 'RML-form-group',
                  label: 'Password',
                  type: 'password',
                  inputClass: 'RML-form-control',
                  id: 'password',
                  name: 'password',
                  placeholder: 'Password',
                }
              ],
              registerInputs: [
                {
                  containerClass: 'RML-form-group',
                  label: 'User',
                  type: 'user',
                  inputClass: 'RML-form-control',
                  id: 'user',
                  name: 'user',
                  placeholder: 'user',
                },
                {
                  containerClass: 'RML-form-group',
                  label: 'Password',
                  type: 'password',
                  inputClass: 'RML-form-control',
                  id: 'password',
                  name: 'password',
                  placeholder: 'Password',
                }
              ]
            }}
          />
        </div>
      </main>
    )
  }
}

export default SignInUp;