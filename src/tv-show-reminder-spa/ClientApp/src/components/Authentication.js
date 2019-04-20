import React, { Component } from "react";

export class Authentication extends Component {
    static displayName = Authentication.name;

    constructor(props) {
      super(props);
      this.state = { password: '', errors: '' };

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleSubmit(event) {
      event.preventDefault();
      this.setState({errors: ''})
      fetch('api/Auth/Login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({password : this.state.password})
        }).then(response => response.json()
        ).then(data => {
            if(!data.token) {throw Error();}
            console.log(data)
            // Logga in etc
            // Spara i localstorage
            localStorage.setItem('user', JSON.stringify(data));
        }).catch(error => {
            this.setState({errors: 'Ogiltigt lösenord.'})
        }); 
    }

    handlePasswordChange(event) {
      this.setState({password: event.target.value});
    }

    render() {
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <div className="input-group">
                <input type="password" name="password" value={this.state.password} className="form-control" placeholder="Lösenord" onChange={this.handlePasswordChange} />
                <div className="input-group-append">
                  <button className="btn btn-secondary" type="button" onClick={this.handleSubmit}>
                    <i className="fa fa-lock"/>
                  </button>
                </div>
              </div>
            </form>
            {this.state.errors ? (<div className="alert alert-danger" role="alert">{this.state.errors}</div>) : ('')}
          </div>
        );
    }
}  