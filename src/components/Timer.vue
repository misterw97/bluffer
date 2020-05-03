<template>
  <div class="timer">{{count}}"</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class extends Vue {
  @Prop() private seconds!: number;

  count = this.seconds;

  mounted() {
    this.tick();
  }

  tick() {
    if (this.count > 0) {
      setTimeout(() => {
        this.count -= 1;
        this.tick();
      }, 1000);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
