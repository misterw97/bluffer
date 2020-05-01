<template>
  <div @click="myMethod()" class="button">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  myMethod() {
    this.$emit('click');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
 .button {
  background-color: $primary;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    // border: 5px solid $secondary;
    border-radius: 6px;
    &:hover {
      cursor: pointer;
    }
 }
</style>
