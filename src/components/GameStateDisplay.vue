<template>
  <div class="main">
    <div class="state" v-bind:class="{ disabled: state !== 'q' }">Question</div>
    <div class="state" v-bind:class="{ disabled: state !== 'a' }">Réponses</div>
    <div class="state" v-bind:class="{ disabled: state !== 'v' }">Votes</div>
    <div class="state" v-bind:class="{ disabled: state !== 'r' }">Résultats</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameState from "../models/GameState";
import Game from '../models/Game';

@Component({
  components: {}
})
export default class extends Vue {
  @Prop() private state!: GameState;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main {
  display: flex;
  margin-top: 10px;

  .state {
    background-color: white;
    height: 30px;
    @include round;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    position: relative;
    padding: 0 5px;

    @include sm {
      margin-right: 20px;
      padding: 0 15px;
    }

    &.disabled {
      border-color: $darkgrey;
      background-color: $grey;
    }

    &::after {
      content: "";
      height: 3px;
      width: 5px;
      background-color: $darkgrey;
      position: absolute;
      right: -8px;

      @include sm {
        width: 20px;
        right: -23px;
      }
    }

    &:last-of-type {
      margin: 0;

      &::after {
        width: 0;
      }
    }
  }
}
</style>
