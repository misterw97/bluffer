<template>
  <div class="main">
    <div class="state">Question</div>
    <div class="state">Réponses</div>
    <div class="state">Votes</div>
    <div class="state">Résultats</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import GameState from '../models/GameState';

@Component({
  components: {}
})
export default class extends Vue {
  @Prop() private _state!: GameState;  

  @Socket()
  state(data: any) {
    console.log(data);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main {
  display: flex;

  .state {
    background-color: lawngreen;
  }
}
</style>
