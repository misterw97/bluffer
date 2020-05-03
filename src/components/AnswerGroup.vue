<template>
  <main>
    <div class="responses">
      <div v-for="response in responses" :key="response.hash" class="response">
        <Button
          @vote="vote(response)"
          :disabled="!!disabled || response.disabled"
        >{{response.value}}</Button>
        <div
          v-if="getMyPointsPerResponse(response) > 0"
          class="points"
        >+{{getMyPointsPerResponse(response)}} pt{{getMyPointsPerResponse(response) > 1 ? 's': ''}}</div>
        <div class="votes">
          <Avatar
            v-for="vote in votes.filter(vote => vote.voteId === response.hash)"
            :key="vote.playerId"
            :size="35"
            :playerId="vote.player.id"
          />
        </div>
      </div>
    </div>

    <div v-if="player.name !== 'Partie' && votes.length > 1" class="totalPoints">
      <h1>+{{getTotalPoints()}}pts</h1>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Answer from "./Avatar.vue";
import Avatar from "./Avatar.vue";
import Button from "./Button.vue";
import Player from "../models/Player";
import Vote from "../models/Vote";
import GameAnswer from "../models/GameAnswer";

@Component({
  components: {
    Answer,
    Avatar,
    Button
  }
})
export default class extends Vue {
  @Prop() private disabled?: boolean;
  @Prop() private responses!: GameAnswer[];
  @Prop() private votes!: Player[];
  @Prop() private player!: Player;

  vote(response: GameAnswer) {
    if (!this.disabled) this.$emit("vote", response);
  }

  getMyPointsPerResponse(response: GameAnswer) {
    if (response.good) {
      if (response.hash === this.player.voteId) return 1;
    } else if (response.hash === this.player.answerId) {
      return 2 * (response.votes?.length || 0);
    }
    return 0;
  }

  getTotalPoints() {
    return this.responses.reduce(
      (acc, response) => acc + this.getMyPointsPerResponse(response),
      0
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$margin: 10px;
.responses {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .response {
    width: 100%;
    margin: $margin;
    font-size: 1.17em;
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;

    @include sm {
      width: calc(50% - #{2 * $margin});
    }

    $size: 35px;

    .points {
      position: absolute;
      left: #{$size / 2};
      bottom: -5px;
      color: $primary;
      font-size: 1.3em;
      font-weight: bold;
    }

    .votes {
      position: absolute;
      bottom: #{$size / -2};
      height: $size;
      right: #{$size / 2};
    }
  }
}

.totalPoints {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}
</style>
