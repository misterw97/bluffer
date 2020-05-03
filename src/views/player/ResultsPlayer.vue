<template>
  <div class="results">
    <Answer :disabled="true" :value="game.data.question" title="Question"></Answer>
    <AnswerGroup :responses="responses" :votes="votes" :disabled="true" :player="player" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Answer from "../../components/Answer.vue";
import AnswerGroup from "../../components/AnswerGroup.vue";
import Game from "../../models/Game";
import Player from "../../models/Player";

@Component({
  components: {
    Answer,
    AnswerGroup
  }
})
export default class extends Vue {
  @Prop() private game!: Game;
  @Prop() private player!: Player;

  responses = [
    {
      good: false,
      author: "1",
      id: 1,
      title: "Réponse 1, credible mais bon, on a quand même un doute"
    },
    {
      good: false,
      author: this.player.id,
      id: 2,
      title: "Réponse 2, la mienne"
    },
    { good: true, author: "2", id: 3, title: "Réponse 3, la vraie" }
  ];

  votes: any[] = [
    { responseId: 1, player: { name: "Valentin", id: 1000000 } },
    { responseId: 2, player: { name: "Roger", id: 2000000 } },
    { responseId: 2, player: { name: "François", id: 3000000 } },
    { responseId: 3, player: this.player }
  ];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
