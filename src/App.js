import React, { Component } from 'react';
import logo from './logo.svg';
// import Google Map API
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <h1> Google Maps API + React </h1> // title
        // Passing Props to MapContainer
        <MapContainer google={this.props.google} />
        </div>
    );
  }
}
// Added my Google Map API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCF3FlZ0BNPcYAL7YFvPjJjfmHc39SA6EM ',
})(App)
