<template>
  <div id="app">
    <map-view ref="mapview"></map-view>
    <search-view ref="search-view"/>
    <login-view></login-view>
  </div>
</template>

<script>

import MapView from "./components/map/mapView";
import SearchBar from "./components/Search/SearchBar";
import SearchView from "./views/Search/SearchView";
import LoginView from "./views/Login/LoginView";

export default {
  name: 'app',
  components: {
    LoginView,
    SearchView,
    SearchBar,
    MapView
  }
}
</script>

<style>
#app {

}
  body{
    padding: 0px;
    margin: 0px;
  }
</style>
