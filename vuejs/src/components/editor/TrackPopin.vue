<template>
  <div class="popin popin--track">
    <button @click="closePopin">Fermer la fenêtre</button>
    <h2>Créer un parcours</h2>

    <Form action="" @submit="submit">
      <div>
        <Field type="text" name="name" :rules="nameRules" v-model="name"/>
        <ErrorMessage name="name" />
      </div>

      <button type="submit">Créer le parcours</button>
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
  import { useTracksStore } from '../../stores/tracksStore';
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
      const tracksStore = useTracksStore();
      const modes = EDITOR_MODES;
      
      return { editorStore, tracksStore, modes, leafletService }
    },
    data: function () {
      return {
        name: null,
        nameRules: yup.string().required(),
      }
    },
    methods: {
      submit: function (values :object) {
        let map :any = this.editorStore.getMap;
        let name = values.name;
        let latlng = this.editorStore.getPopin.data.latlng; 
        
        let object = {
          name: name,
        }
        this.tracksStore.setTrackEditing(object);  
        this.editorStore.setPopin('', {});
      },
      closePopin: function (e: any) {
        this.editorStore.setPopin('', {});
      }
    }
  })
  
</script>
