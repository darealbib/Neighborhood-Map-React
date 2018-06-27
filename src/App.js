import React, { Component } from 'react';
import logo from './logo.svg';
// import Google Map API
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'
import swal from "sweetalert"
import './App.css';

class App extends Component {
  render() {
    return (


      <MapContainer google={this.props.google} />

    );
  }
}
// Added my Google Map API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDecCzY1ZE85zWsbuFCYM_elOUsb0-0ZDAs',
})(App)
// In Case of Google Maps API error
window.gm_authFailure = function() {
  swal("Google Maps API Error, Google Maps cannot be loaded.");
   //alert('Google maps failed to load!');
}
