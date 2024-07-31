<template>
  <div style="width: 100%; height: 100%">
    <!-- 顶部栏 -->
    <div class="top-container">
      <!-- <div>
        <img src="@/assets/img/map/logo.png" alt="">
        <span></span>
      </div> -->
      <top></top>
    </div>
    <!-- 导航 + （ map + 路由坑 ） -->
    <div class="app-wrapper">
      <!-- （ map + 路由坑 ） -->
      <div class="main-container">
        <!-- map -->
        <div class="map-box">
          <div class="map-container" id="mapContainer"></div>
        </div>

        <!-- 主容器 -->
        <div class="app-box">
          <!-- 路由坑 -->
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { initMap } from '@/assets/js/mapfunc.js'
import Top from './components/Top'
export default {
  components: {
    Top,
  },
  mounted() {
    setTimeout(function() {
      // initMap(document.getElementById('mapContainer'))
    }, 0)
  },
  watch: {
    '$route.path':{
      handler(val){
        console.log(val)
      },
      immediate:true,
      deep:true
    }
  },
}
</script>
