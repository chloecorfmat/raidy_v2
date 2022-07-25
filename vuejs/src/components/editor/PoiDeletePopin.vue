<template>
  <div class="popin popin--poi">
    <button @click="closePopin">Fermer la fenêtre</button>
    <h2>Supprimer un POI</h2>
    <p>Voulez-vous vraiment supprimer ce point d'intérêt ? Cette action est irréversible.</p>
    <button @click="deletePoi">Confirmer</button>
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
  import { usePoisStore } from '../../stores/poisStore';
  import { EDITOR_MODES } from '../../utils/constants.js';
  import LeafletService from '../../services/LeafletService';


  export default defineComponent({
    setup() {
      const leafletService = new LeafletService();
      const editorStore = useEditorStore();
      const poisStore = usePoisStore();
      const modes = EDITOR_MODES;
      
      return { editorStore, poisStore, modes, leafletService }
    },
    methods: {
      deletePoi: function () {
        let id = this.editorStore.popin.data.id;
        let poi = this.poisStore.data.find(poi => poi.id == id);
        this.leafletService.removeMarker(this.editorStore.map, poi.marker);
        // Remove POI from store after removing marker.
        this.poisStore.deletePoi(id);

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
