<template>
  <div class="popin popin--poi">
    <button @click="closePopin">Fermer la fenêtre</button>
    <h2>Supprimer un parcours</h2>
    <p>Voulez-vous vraiment supprimer ce parcours ? Cette action est irréversible.</p>
    <button @click="deleteTrack">Confirmer</button>
    <button @click="closePopin">Annuler</button>
  </div>
</template>

<style>
.popin {
  background: red; 
  
  position: absolute;
  width: 50vw;
  height:60vh;
  top: 20vh;
  left: 25vw;
  z-index: 1000;
}
</style>

<script lang="ts">
  import { defineComponent } from 'vue';


  import { useEditorStore } from '../../stores/editorStore';
  import { EDITOR_MODES } from '../../utils/constants.js';
  import LeafletService from '../../services/LeafletService';
  import { useTracksStore } from '../../stores/tracksStore';


  export default defineComponent({
    setup() {
      const leafletService = new LeafletService();
      const editorStore = useEditorStore();
      const tracksStore = useTracksStore();
      const modes = EDITOR_MODES;
      
      return { editorStore, tracksStore, modes, leafletService }
    },
    methods: {
      deleteTrack: function () {
        let id = this.editorStore.popin.data.id;
        let track = this.tracksStore.data.find(track => track.id == id);
        this.leafletService.removePolyline(this.editorStore.map, track.polyline);
        // Remove track from store after removing marker.
        this.tracksStore.deleteTrack(id);

        // Close popin after deleting POI.
        this.editorStore.setPopin('', {});
      },
      closePopin: function (e: any) {
        this.editorStore.setPopin('', {});
        this.editorStore.setMode(EDITOR_MODES.READING);
      }
    }
  })
  
</script>
