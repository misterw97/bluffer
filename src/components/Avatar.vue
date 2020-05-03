<template>
  <img
    v-if="!!player"
    v-bind:style="`width:${size}px`"
    :src="`https://avatars.dicebear.com/v2/bottts/${player.id}.svg?mood[]=happy&radius=50&background=${getBackground()}`"
    :alt="`Avatar de ${player.name}`"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "../models/Player";

@Component({
  components: {}
})
export default class extends Vue {
  @Prop() private player!: Player;
  @Prop() private size!: number;

  getBackground() {
    const background = Math.floor(parseInt(this.player.id) / 10);
    return `%23${background}`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
img {
  border: 1px solid white;
  border-radius: 50%;
}
</style>
