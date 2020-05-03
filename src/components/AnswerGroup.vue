<template>
  <main>
    <div class="responses">
      <div v-for="response in responses" :key="response.id" class="response">
        <Button
          @click="click(response)"
          :disabled="!!disabled || response.disabled"
        >{{response.title}}</Button>
        <div
          v-if="getMyPointsPerResponse(response) > 0"
          class="points"
        >+{{getMyPointsPerResponse(response)}} pt{{getMyPointsPerResponse(response) > 1 ? 's': ''}}</div>
        <div class="votes">
          <Avatar
            v-for="vote in votes.filter(a => a.responseId === response.id)"
            :key="vote.player.id"
            :size="35"
            :player="vote.player"
          />
        </div>
      </div>
    </div>

    <div class="totalPoints">
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

@Component({
  components: {
    Answer,
    Avatar,
    Button
  }
})
export default class extends Vue {
  @Prop() private disabled?: boolean;
  @Prop() private responses!: any[];
  @Prop() private votes!: any[];
  @Prop() private player!: Player;

  click(data: any) {
    if (!!!this.disabled) this.$emit("click", data);
  }

  getMyVote() {
    return this.votes.find(vote => vote.player.id === this.player.id);
  }

  getMyPointsPerResponse(response: any) {
    if (response.author === this.player.id) {
      return 2 * this.votes.filter(v => v.responseId === response.id).length;
    } else if (!!response.good) {
      const vote = this.getMyVote();
      return vote.responseId === response.id ? 1 : 0;
    }
    return 0;
  }

  getTotalPoints() {
    return this.responses
      .map(response => this.getMyPointsPerResponse(response))
      .reduce((a, b) => a + b);
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
