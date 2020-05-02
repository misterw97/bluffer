<template>
  <div v-if="!!player" class="game">
    <h1>Jeu #{{ player.game }}</h1>
    <h2>{{ player.name }}: {{ player.isMaster }}</h2>

    <div v-if="state='w'">
      waiting animation... // TODO
    </div>

    <h2>Tour #1</h2>
    <Button>Ouvrir les réponses</Button>
    <h3>Question</h3>
    <textarea placeholder="La question originale" />
    <h3>Réponse (vraie)</h3>
    <textarea placeholder="La vraie réponse à la question" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Button from "../components/Button.vue";
import Player from "../models/Player";

enum GameState {
  waiting = 'w',
  question = 'q',
  answers = 'a',
  votes = 'v',
  results = 'r'
}

@Component({
  components: {
    Button
  }
})
export default class Game extends Vue {
  private player: Player|null = null;
  private state: GameState = GameState.waiting;

  mounted() {
    const gameId = this.$route.params.game;
    const playerId = this.$route.params.player;
    this.$socket.client.emit(
      "join",
      {
        id: playerId,
        game: gameId
      },
      (player: Player) => (this.player = player)
    );
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
