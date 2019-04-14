import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactNotification from "react-notifications-component";
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.refreshEpisodesForAllSubscriptions = this.refreshEpisodesForAllSubscriptions.bind(this);
    this.notifySuccess = this.notifySuccess.bind(this);
    this.notificationDOMRef = React.createRef();
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  refreshEpisodesForAllSubscriptions(event) {
    event.preventDefault();
    fetch('api/SubscriptionData/RefreshEpisodesForAllSubscriptions', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    }).then(response => {
      this.notifySuccess();
    });
  }

  notifySuccess(event){
    this.notificationDOMRef.current.addNotification({
      title: "Uppdatering av program",
      message: "Samtliga prenumerationer uppdaterade.",
      type: "success",
      insert: "top",
      container: "top-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 10000 },
      dismissable: { click: true }
    });
  }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">TV-kollen</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ReactNotification ref={this.notificationDOMRef} />
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/search">Sök</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/subscriptions">Prenumerationer</NavLink>
                </NavItem>
                <NavItem>
                  <button className="btn btn-success" type="button" onClick={this.refreshEpisodesForAllSubscriptions}>Uppdatera alla program</button>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
