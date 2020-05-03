<template>
  <div class="votes">
    <Answer :disabled="true" :value="game.data.question" title="Question"></Answer>

    <h2>
      Devine la bonne réponse !
      <small>(Tu ne peux pas voter pour la tienne)</small>
    </h2>
    <AnswerGroup @click="vote" :responses="responses" :votes="votes" :player="player" />
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
    { id: 1, title: "Réponse 1, credible mais bon, on a quand même un doute" },
    { id: 2, title: "Réponse 2, la mienne", disabled: true },
    { id: 3, title: "Réponse 3, la vraie" }
  ];

  votes: any[] = [];

  vote(response: any) {
    this.votes = [{ responseId: response.id, player: this.player }];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
