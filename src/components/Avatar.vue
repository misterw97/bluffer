<template>
  <div v-if="!!playerId" v-bind:style="`width:${size}px`" class="avatar" v-html="svg" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-bottts-sprites";
import Player from "../models/Player";

@Component({
  components: {}
})
export default class extends Vue {
  @Prop() private playerId!: string;
  @Prop() private size!: number;

  options = {
    mood: ["happy"],
    radius: 50,
    background: this.getBackground()
  };
  avatars = new Avatars(sprites, this.options);
  svg = this.avatars.create(this.playerId);

  getBackground() {
    const background = Math.floor(parseInt(this.playerId) / 10);
    return `#${background}`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.avatar {
  border: 1px solid white;
  border-radius: 50%;
}
</style>
