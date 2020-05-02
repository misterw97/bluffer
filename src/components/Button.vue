<template>
  <div @click="myMethod()" class="button">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  myMethod() {
    this.$emit("click");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.button {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: $primary;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border: 3px solid $secondary;
  border-radius: 15px;
  &:hover {
    cursor: pointer;
  }
}
</style>
