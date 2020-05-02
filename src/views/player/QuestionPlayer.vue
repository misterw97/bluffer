<template>
  <div class="question">
    <Ink class="logo" />
    <h2>Sois patient, le maitre du jeu écrit la question pour le tour #{{game.count + 1}}...</h2>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import Button from "../../components/Button.vue";
import Answer from "../../components/Answer.vue";
import Player from "../../models/Player";
import Game from "../../models/Game";
import Ink from "../../assets/ink.svg";

@Component({
  components: {
    Button,
    Answer,
    Ink
  }
})
export default class extends Vue {
  @Prop() private game!: Game;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.question {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 90px 0;

  .logo {
    margin-right: 60px;
  }

  h2 {
    max-width: 300px;
  }
}
</style>
