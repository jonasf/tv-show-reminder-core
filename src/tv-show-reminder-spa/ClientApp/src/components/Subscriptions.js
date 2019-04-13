import React, { Component } from "react";
import ReactNotification from "react-notifications-component";

export class Subscriptions extends Component {
  static displayName = Subscriptions.name;

  constructor(props) {
    super(props);
    this.state = { subscriptions: [], loading: true };

    this.refreshEpisodes = this.refreshEpisodes.bind(this);
    this.deleteSubscription = this.deleteSubscription.bind(this);
    this.notifySuccess = this.notifySuccess.bind(this);
    this.notificationDOMRef = React.createRef();
    this.getSubscriptions();
  }

  getSubscriptions(event) {
    fetch("api/SubscriptionData/List")
      .then(response => response.json())
      .then(data => {
        this.setState({
          subscriptions: data,
          loading: false
        });
      });
  }
  
  refreshEpisodes(subscriptionId, tvShowName, event){
    event.preventDefault();
    // TODO: Remove button instead of reloading list
    fetch('api/SubscriptionData/RefreshEpisodesForSubscription', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: subscriptionId,
    }).then(response => {
      this.notifySuccess('Avsnitt uppdaterade', 'Avsnitten för ' + tvShowName + ' har uppdaterats.', event);
      this.setState({loading: true});
      this.getSubscriptions();
    });
  }

  deleteSubscription(subscriptionId, tvShowName, event){
    event.preventDefault();
    // TODO: Remove button instead of reloading list
    fetch('api/SubscriptionData/Delete', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: subscriptionId,
    }).then(response => {
      this.notifySuccess('Prenumeration borttagen', 'Prenumerationen på ' + tvShowName + ' har har tagits bort.', event);
      this.setState({loading: true});
      this.getSubscriptions();
    });
  }

  notifySuccess(title, body, event){
    this.notificationDOMRef.current.addNotification({
      title: title,
      message: body,
      type: "success",
      insert: "top",
      container: "top-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 10000 },
      dismissable: { click: true }
    });
  }

  render() {
    let contents = this.state.loading ? (
    <p>
    <em>Loading...</em>
    </p>
    ) : (
    <table className="table table-striped">
    <thead>
      <tr>
        <th>TV-program</th>
        <th>Nästa avsnitt</th>
        <th>&nbsp;</th>
        <th>&nbsp;</th>
      </tr>
    </thead>  
    <tbody>
      {this.state.subscriptions.map((subscription, index) => (
        <tr key={index}>
          <td>{subscription.subscription.tvShowName}</td>
          {subscription.nextEpisode ? (
              <td>
                  {new Intl.DateTimeFormat('sv-SE',{
                      weekday: 'long',
                      day : 'numeric',
                      month: 'numeric'
                  }).format(new Date(subscription.nextEpisode.airDate))}&nbsp; 
                  ({subscription.nextEpisode.title};&nbsp;S{subscription.nextEpisode.seasonNumber}{subscription.nextEpisode.episodeNumber === 0 ? ' Special' : 'E' + subscription.nextEpisode.episodeNumber})
                </td>
            ) : (
             <td>&nbsp;</td>
          )}
          <td>
            <button className="btn btn-secondary" type="button" onClick={(e) => this.refreshEpisodes(subscription.subscription.id, subscription.subscription.tvShowName, e)}>
              <i className="fa fa-refresh"/>
            </button>
          </td>
          <td>
            <button className="btn btn-secondary" type="button" onClick={(e) => this.deleteSubscription(subscription.subscription.id, subscription.subscription.tvShowName, e)}>
              <i className="fa fa-trash"/>
            </button>
          </td>
        </tr>
      ))}   
    </tbody>
    </table>
    );

    return (
      <div>
      <ReactNotification ref={this.notificationDOMRef} />
      <h1>Prenumerationer</h1>
      {contents}
      </div>
    );
  }
}
