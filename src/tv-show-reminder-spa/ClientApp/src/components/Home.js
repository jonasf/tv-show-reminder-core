import React, { Component } from "react";

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);
    this.state = { upcomingepisodes: [], episodestodelete: [], loading: true };

    this.checkForDelete = this.checkForDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getEpisodes();
  }

  getEpisodes(event) {
    fetch("api/EpisodeData/UpcomingEpisodes")
      .then(response => response.json())
      .then(data => {
        this.setState({
          upcomingepisodes: data,
          loading: false
        });
      });
  }

  checkForDelete(event) {
    const episodestodelete = this.state.episodestodelete;
    let index;

    if (event.target.checked) {
      episodestodelete.push(+event.target.value);
    } else {
      index = episodestodelete.indexOf(+event.target.value);
      episodestodelete.splice(index, 1);
    }

    this.setState({ episodestodelete: episodestodelete });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch("api/EpisodeData/Delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.episodestodelete)
    }).then(response => {
      this.setState({ loading: true });
      this.getEpisodes();
    });
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      <table className="table table-striped">
        <tbody>
          {this.state.upcomingepisodes.map(episode => (
            <tr key={episode.id}>
              <td>
                <input
                  type="checkbox"
                  name="episodeIds"
                  value={episode.id}
                  onChange={this.checkForDelete}
                />
              </td>
              <td>{episode.airDate}</td>
              <td>
                {episode.tvShowName} {episode.seasonNumber}
              </td>
              <td>{episode.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div>
        <h1>Kommande avsnitt</h1>
        <form onSubmit={this.handleSubmit}>
          {contents}
          <input type="submit" value="Radera" className="btn btn-primary" />
        </form>
      </div>
    );
  }
}
