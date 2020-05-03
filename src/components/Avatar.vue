<template>
  <main>
    <div
      v-if="!!player"
      v-bind:style="`width:${size}px;height:${size}px`"
      class="avatar"
      v-html="svg"
    />
    <div v-if="!!checkmark && !!player && !!player.done" class="done" />
  </main>
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
  @Prop() private player!: Player;
  @Prop() private size!: number;
  @Prop() private checkmark?: boolean;

  options = {
    mood: ["happy"],
    radius: 50,
    background: this.getBackground()
  };
  avatars = new Avatars(sprites, this.options);
  svg = this.avatars.create(this.player.id);

  getBackground() {
    const background = Math.floor(parseInt(this.player.id) / 10);
    return `#${background}`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
main {
  position: relative;

  .avatar {
    border: 1px solid white;
    border-radius: 50%;
  }

  .done {
    position: absolute;
    background-color: $green;
    width: 15px;
    height: 15px;
    right: 0;
    border-radius: 50%;
    bottom: -3px;
  }
}
</style>
