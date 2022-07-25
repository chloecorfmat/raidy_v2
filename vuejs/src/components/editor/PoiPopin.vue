<template>
  <div class="popin popin--poi">
    <button @click="closePopin">Fermer la fenêtre</button>
    <h2 v-if="action == 'create'">Créer un POI</h2>
    <h2 v-if="action == 'update'">Modifier le POI</h2>

    <Form action="" @submit="submit">
      <div>
        <Field type="text" name="name" :rules="nameRules" v-model="name"/>
        <ErrorMessage name="name" />
      </div>
      <div>
        <Field type="number" min="0" name="required_helpers" :rules="requiredHelpersRules" v-model="requiredHelpers" />
        <ErrorMessage name="required_helpers" />
      </div>

      <button v-if="action == 'create'" type="submit">Créer le point d'intérêt</button>
      <button v-if="action == 'update'" type="submit">Modifier le point d'intérêt</button>
    </Form>
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

  import { ErrorMessage, Field, Form } from 'vee-validate';
  import * as yup from 'yup';

  import { useEditorStore } from '../../stores/editorStore';
  import { usePoisStore } from '../../stores/poisStore';
  import { EDITOR_MODES } from '../../utils/constants.js';
  import LeafletService from '../../services/LeafletService';


  export default defineComponent({
    components: {
      ErrorMessage,
      Field,
      Form
    },
    setup() {
      const leafletService = new LeafletService();
      const editorStore = useEditorStore();
      const poisStore = usePoisStore();
      const modes = EDITOR_MODES;
      
      return { editorStore, poisStore, modes, leafletService }
    },
    data: function () {
      return {
        name: null,
        requiredHelpers: null,
        action: 'create',
        nameRules: yup.string().required(),
        requiredHelpersRules: yup.number().required()
      }
    },
    beforeMount: function () {
      // Update POI : fill the form.
      if (this.editorStore.popin.data.id !== undefined) {
        this.action = "update";
        let poi = this.poisStore.data.find(poi => poi.id == this.editorStore.popin.data.id);
        this.name = poi.name;
        this.requiredHelpers = poi.requiredHelpers;
      }
    },
    methods: {
      submit: function (values :object) {
        let map :any = this.editorStore.getMap;
        let name = values.name;
        let requiredHelpers = values.required_helpers;

        // Create POI : manage latlng position of marker/poi.
        if (this.editorStore.popin.data.id === undefined) {
          let latlng = this.editorStore.getPopin.data.latlng;
          const { lat, lng } = latlng;

          let marker = this.leafletService.addMarker(map, latlng, true);
          marker.addEventListener('dragend', this.moveMarker);

          let data = {
            name: name,
            requiredHelpers: requiredHelpers,
            lat: lat,
            lng: lng,
            marker: marker
          };

          this.poisStore.addPoi(data);
        } else {
          // On update : update data object.
          let data = {
            name: name,
            requiredHelpers: requiredHelpers,
          };

          this.poisStore.updatePoi(data, this.editorStore.popin.data.id);
        }
        
        this.editorStore.setPopin('', {});
        this.editorStore.setMode(EDITOR_MODES.READING);
      },
      moveMarker: function (e :any) {
        let latlng = e.target.getLatLng();
        let leaflet_id = e.target._leaflet_id;
        this.poisStore.movePoi(leaflet_id, latlng);
      },
      closePopin: function (e: any) {
        this.editorStore.setPopin('', {});
        this.editorStore.setMode(EDITOR_MODES.READING);
      }
    }
  })
  
</script>
