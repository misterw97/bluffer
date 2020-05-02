<template>
  <div class="answer">
    <p>{{ title }}</p>
    <textarea
    v-model="field"
    :disabled="!!disabled"
    :placeholder="placeholder">
    </textarea>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() private title!: string;
  @Prop() private value?: string;
  @Prop() private placeholder?: string;
  @Prop() private disabled?: boolean;
  private fieldValue?: string;

  get field() {
    return this.fieldValue || this.value || "";
  }
  set field(value: string) {
    this.fieldValue = value;
    this.$emit('input', value);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.answer {
  p {
    font-size: 1.3em;
    margin: 0;
    text-align: left;
    margin-bottom: 10px;
  }
  textarea {
    width: 100%;
  }
}
</style>
