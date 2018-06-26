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
        <h1> Restaurants in Kathmandu </h1>
        <MapContainer google={this.props.google} />
        </div>
    );
  }
}
// Added my Google Map API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyB2QQnmg5PH9Nb3iq-vZ7AQDLPnI-nUL8k',
})(App)
