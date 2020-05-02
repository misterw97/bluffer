<template>
  <div class="votes">
    <Answer :disabled="true" :value="game.data.question" title="Question"></Answer>

    <h2>
      Devine la bonne réponse !
      <small>(Tu ne peux pas voter pour la tienne)</small>
    </h2>
    <div class="responses">
      <div v-for="response in responses" :key="response.id" class="response">
        <Button @click="vote(response)" :disabled="response.disabled">{{response.title}}</Button>
        <Avatar v-if="voted === response.id" :size="35" :player="player" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Answer from "../../components/Answer.vue";
import Avatar from "../../components/Avatar.vue";
import Button from "../../components/Button.vue";
import Game from "../../models/Game";
import Player from "../../models/Player";

@Component({
  components: {
    Answer,
    Avatar,
    Button
  }
})
export default class extends Vue {
  @Prop() private game!: Game;
  @Prop() private player!: Player;

  private voted: number = -1;

  responses = [
    { id: 1, title: "Réponse 1, credible mais bon, on a quand même un doute" },
    { id: 2, title: "Réponse 2, la mienne", disabled: true },
    { id: 3, title: "Réponse 3, la vraie" }
  ];

  vote(response: any) {
    this.voted = response.id;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$margin: 10px;

.votes {
  .responses {
    display: flex;
    flex-wrap: wrap;

    .response {
      width: calc(50% - #{2 * $margin});
      margin: $margin;
      font-size: 1.17em;
      position: relative;
      display: flex;
      align-items: center;

      img {
        $size: 35px;
        position: absolute;
        bottom: #{$size / -2};
        height: $size;
        right: #{$size / 2};
        border: 1px solid white;
      }
    }
  }
}
</style>
