<template>
  <img
    v-if="!!playerId"
    v-bind:style="`width:${size}px`"
    :src="`https://avatars.dicebear.com/v2/bottts/${playerId}.svg?mood[]=happy&radius=50&background=${getBackground()}`"
    :alt="`Avatar`"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "../models/Player";

@Component({
  components: {}
})
export default class extends Vue {
  @Prop() private playerId!: string;
  @Prop() private size!: number;

  getBackground() {
    const background = Math.floor(parseInt(this.playerId) / 10);
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
