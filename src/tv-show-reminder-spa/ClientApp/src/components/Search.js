import React, { Component } from 'react';
import { store } from 'react-notifications-component';
import { authHeader } from './auth-header';

export class Search extends Component {
    static displayName = Search.name;

    constructor(props) {
        super(props);
        this.state = { searchterm: '', searchtermforresult: '', tvshows: [], loading: false };

        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addsubscription = this.addsubscription.bind(this);
        this.notifySuccess = this.notifySuccess.bind(this);
    }
    
    handleSubmit(event) {
      event.preventDefault();
      this.search(event);  
    }

    search(event) {
      this.setState({loading: true});
      fetch("api/SubscriptionData/Search?searchTerm=" + this.state.searchterm, {
        headers: {
          'Authorization': authHeader()
        }
      }).then(response => response.json())
      .then(data => {
        this.setState({
          tvshows: data,
          loading: false,
          searchtermforresult: this.state.searchterm
        });
      });
    }

    handleSearchTermChange(event) {
      this.setState({searchterm: event.target.value});
    }

    addsubscription(showId, showName, event){
      event.preventDefault();
      // TODO: Remove button instead of reloading list
      fetch('api/SubscriptionData/Add', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': authHeader(),
        },
        body: JSON.stringify({
          showId: showId,
          showName: showName,
        })
      }).then(response => {
        this.notifySuccess(showName, event);
        this.setState({loading: true});
        this.search();
      });
    }

    notifySuccess(showName, event){
      store.addNotification({
        title: "Prenumeration sparad",
        message: showName + " är tillagd i dina prenumerationer.",
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
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <div className="input-group">
                <input type="text" name="showName" value={this.state.searchterm} onChange={this.handleSearchTermChange} className="form-control" placeholder="Sök efter TV-serie"/>
                <div className="input-group-append">
                  <button className="btn btn-secondary" type="button" onClick={this.handleSubmit}>
                    <i className="fa fa-search"/>
                  </button>
                </div>
              </div>
            </form>
            {this.state.loading ? (<p><em>Loading...</em></p>) : ('')}
            {this.state.searchtermforresult ? (<p>Sökresultat för "{this.state.searchtermforresult}", {this.state.tvshows.length} träffar.</p>): ('')}
            {this.state.tvshows.length > 0 &&
              <div>
                <table className="table table-striped" id="table">
                  <tbody>
                    {this.state.tvshows.map(show => (
                      <tr key={show.id}>
                        <td><img className="img-responsive" alt="logo" src={show.imageUrl}/></td>
                        <td>{show.name}</td>
                        <td>{show.startedYear}</td>
                        <td><a href={show.link}target="_blank">Mer info.</a></td>
                        <td>{show.isSubscribed ? <span>&nbsp;</span> : <button className="btn btn-secondary" type="button" onClick={(e) => this.addsubscription(show.id, show.name, e)}><i className="fa fa-plus"></i></button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
        );
    }
}