<template>
  <div @click="myMethod()" class="button" v-bind:class="{ disabled }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  @Prop() private disabled?: boolean;

  myMethod() {
    if (!!!this.disabled) this.$emit("click");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.button {
  box-sizing: border-box;
  width: 100%;
  background-color: $primary;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  @include round;
  user-select: none;

  &:hover {
    cursor: pointer;
  }

  &.disabled {
    cursor: unset;
    background-color: $darkgrey;
  }
}
</style>
