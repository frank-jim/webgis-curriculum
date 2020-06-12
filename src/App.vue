<template>
  <div id="app">
    <map-view ref="mapview"></map-view>
    <search-view ref="search-view"/>
    <login-view></login-view>
    <statistics-drawer>
      <city-group-chart slot="firstpane"></city-group-chart>
      <heat-map-controll slot="secondpane"></heat-map-controll>
    </statistics-drawer>
  </div>
</template>

<script>

import MapView from "./components/map/mapView";
import SearchBar from "./components/Search/SearchBar";
import SearchView from "./views/Search/SearchView";
import LoginView from "./views/Login/LoginView";
import StatisticsDrawer from "./views/StatisticsDrawer";
import CityGroupChart from "./components/statistic-chart/CityGroupChart";
import HeatMapControll from "./components/statistic-chart/HeatMapControll";

export default {
  name: 'app',
  components: {
    HeatMapControll,
    CityGroupChart,
    StatisticsDrawer,
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
