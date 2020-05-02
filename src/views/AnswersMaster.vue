<template>
  <div class="answers">
    <h2>Tour #{{game.count+1}}</h2>
    <Button @click="sendQuestion()">Ouvrir le vote</Button>
    <h3>Question</h3>
    <textarea disabled :value="game.data.question" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import Button from "../components/Button.vue";
import Player from "../models/Player";
import Game from "../models/Game";

@Component({
  components: {
    Button
  }
})
export default class extends Vue {
  @Prop() private player!: Player;
  @Prop() private game!: Game;

  @Socket()
  message(data: { player: Player; answer: string }) {
    console.log(data);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
textarea {
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid $secondary;
  border-radius: 5px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1em;
}
</style>
