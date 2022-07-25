<template>
  <div id="map" class="map"></div>
</template>

<style>
.map {
  height: 100vh;
  width: 70vw;
}
</style>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useEditorStore } from '../../stores/editorStore';
  import { usePoisStore } from '../../stores/poisStore';
  import { useTracksStore } from '../../stores/tracksStore';

  import LeafletService from '../../services/LeafletService';
  import { EDITOR_MODES, POPIN_NAME } from '../../utils/constants.js';

  export default defineComponent({
    setup() {
      const editorStore = useEditorStore();
      const poisStore = usePoisStore();
      const tracksStore = useTracksStore();
      const leafletService = new LeafletService();
    
      return { editorStore, poisStore, tracksStore, leafletService }
    },
    mounted () {
      // By default, Paris coordinates.
      let map = this.leafletService.createMap(48.86,  2.349); 
      map.addEventListener('click', this.clickOnMap);
      this.editorStore.setMap(map);

      if(!("geolocation" in navigator)) {
        console.log('Geolocation is not available.');
      } else {
        navigator.geolocation.getCurrentPosition(location => {
          map.setView([location.coords.latitude, location.coords.longitude], 13);
        }, error => {
          console.log(error.message);
        })
      }
    },
    methods: {
      clickOnMap: function(e :any) {
        let mode :string = this.editorStore.getMode;
        switch(mode) {
          case EDITOR_MODES.ADDING_POI:
            this.tracksStore.resetTrackEditing();
            this.editorStore.setMode(EDITOR_MODES.READING);
            this.editorStore.setPopin(POPIN_NAME.POI, { latlng: e.latlng });
            break;
          case EDITOR_MODES.ADDING_TRACK:
            if(Object.keys(this.tracksStore.trackEditing).find(el => el == 'polyline') === undefined) {
              this.tracksStore.trackEditing.polyline = this.leafletService.addPolyline(this.editorStore.map, e.latlng); 
            } 
            this.tracksStore.trackEditing.polyline.addLatLng(e.latlng);
            break;
          default:
            this.tracksStore.resetTrackEditing();
            break;
        }
      }
    }
  })
  
</script>
