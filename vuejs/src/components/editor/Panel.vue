<template>
  <div class="panel">
    <h2>Panel</h2>
    <p>Mode : {{ editorStore.getMode }}</p>
    <button @click="editorStore.setMode(modes.ADDING_POI)" :disabled="locked">ADDING POI</button>
    <button v-if="!locked" @click="editorStore.setMode(modes.LOCKED)" :disabled="locked">LOCKED MODE</button>
    <button @click="editorStore.setMode(modes.READING)">READING</button>
    <button @click="addTrack()" :disabled="locked">ADDING TRACK</button>
    <div>
      <h3>Liste des parcours</h3>
      <ul>
        <li v-for="track in tracksStore.data">
          <p>{{ track.name }}</p>
          <button @click="deleteTrack(track.id)" :disabled="locked">Supprimer le parcours</button>
        </li>
      </ul>
    </div>

    <div>
      <h3>Liste des points d'intérêt</h3>
      <button v-if="markersDisplayed" @click="hideAllPois">Cacher les POI</button>
      <button v-if="!markersDisplayed" @click="showAllPois">Montrer les POI</button>
      <ul>
        <li v-for="poi in poisStore.data">
          <p>{{ poi.name }}</p>
          <p>lat : {{ poi.lat}}, lng : {{ poi.lng }}</p>
          <p>Bénévoles : {{ poi.requiredHelpers}}</p>
          <button @click="updatePoi(poi.id)" :disabled="locked">Modifier le POI</button>
          <button @click="deletePoi(poi.id)" :disabled="locked">Supprimer le POI</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.panel {
  height: 100vh;
  width: 25vw;
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
    data () {
      return {
        markersDisplayed: true,
      }
    },
    setup() {
      const editorStore = useEditorStore();
      const poisStore = usePoisStore();
      const tracksStore = useTracksStore();
      const modes = EDITOR_MODES;
      const leafletService = new LeafletService();
      
      return { editorStore, poisStore, tracksStore, modes, leafletService }
    },
    computed: {
      locked: function () {
        if (this.editorStore.mode == EDITOR_MODES.LOCKED) {
          return true;
        }
        return false;
      },
    },
    methods: {
      addTrack() {
        this.editorStore.setMode(this.modes.ADDING_TRACK)
        this.editorStore.setPopin(POPIN_NAME.TRACK, {});
      },
      deleteTrack(id) {
        this.editorStore.setPopin(POPIN_NAME.TRACK_DELETE, { id: id })
      },
      updatePoi(id) {
        this.editorStore.setPopin(POPIN_NAME.POI, { id: id })
      },
      deletePoi(id) {
        this.editorStore.setPopin(POPIN_NAME.POI_DELETE, { id: id })
      },
      hideAllPois() {
        this.markersDisplayed = false;

        let pois = this.poisStore.data;
        pois.map(poi => {
          this.leafletService.removeMarker(this.editorStore.map, poi.marker);
          poi.marker = {};
        });
      },
      showAllPois() {
        this.markersDisplayed = true;

        let pois = this.poisStore.data;
        let draggable = false;
        if (this.editorStore.mode == EDITOR_MODES.READING) {
          draggable = true;
        }

        pois.map(poi => {
          let marker = this.leafletService.addMarker(this.editorStore.map, [poi.lat, poi.lng], draggable);
          marker.addEventListener('dragend', this.moveMarker);
          poi.marker = marker;
        });
      },
      moveMarker: function (e :any) {
        let latlng = e.target.getLatLng();
        let leaflet_id = e.target._leaflet_id;
        this.poisStore.movePoi(leaflet_id, latlng);
      },
    }
  })
  
</script>
