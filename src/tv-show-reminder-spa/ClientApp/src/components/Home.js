import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);
      this.state = { upcomingepisodes: [], loading: true };

      fetch('api/EpisodeData/UpcomingEpisodes')
      .then(response => response.json())
      .then(data => {
          this.setState({
              upcomingepisodes: data,
              loading: false
          });
      });
  }

  static renderUpcomingEpisodesTable(upcomingepisodes) {
    return (
        <table className='table table-striped'>
            <tbody>
                {upcomingepisodes.map(episode =>
                    <tr key={episode.id}>
                        <td>{episode.airDate}</td>
                        <td>{episode.tvShowName} {episode.seasonNumber}</td>
                        <td>{episode.title}</td>
                    </tr>
                )}
            </tbody>
        </table>
      );
  }

  render () {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : Home.renderUpcomingEpisodesTable(this.state.upcomingepisodes);

    return (
        <div>
            <h1>TV-kollen</h1>
            {contents}
        </div>
    );
  }
}
