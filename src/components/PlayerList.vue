<template>
  <div v-if="!!player" class="player-list">
    <div class="title">Players</div>

    <div
      v-for="p in players"
      v-bind:class="{ active: player.id === p.id }"
      class="player"
      :key="p.id"
    >
      <Avatar :checkmark="true" class="avatar" :size="50" :player="p" />
      <div class="info">
        <a :href="`/#/game/${p.game}/player/${p.id}`" v-if="player.isMaster">{{ p.name }}</a>
        <div v-else>{{ p.name }}</div>
        <div>{{ p.score }}pts</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import Avatar from "./Avatar.vue";
import Player from "../models/Player";

@Component({
  components: { Avatar }
})
export default class extends Vue {
  @Prop() private player!: Player;
  private players: Player[] = [];

  @Socket()
  scores(data: Player[]) {
    this.players = [...data].sort((a, b) => b.score - a.score);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$margin: 20px;

.player-list {
  min-width: 320px;
  min-height: 100%;
  height: 100vh;
  background-color: white;
  color: $primary;
  font-weight: bold;

  .title {
    margin: 0;
    text-align: right;
    font-size: 2em;
    padding: $padding $margin 35px;
  }

  .player {
    display: flex;
    align-items: center;
    font-size: 1.5em;
    padding: 15px $margin;

    .avatar {
      border-radius: 50%;
      margin-right: $margin;
    }

    .info {
      display: flex;
      justify-content: space-between;
      flex: 1;

      a {
        text-decoration: none;
        color: $primary;
      }
    }

    &.active {
      background-color: $grey;
    }
  }
}
</style>
