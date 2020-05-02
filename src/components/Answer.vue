<template>
  <div class="answer">
    <div class="header">
      <p>{{ title }}</p>
      <div class="controls">
        <span>edit</span>
        <span>merge</span>
      </div>
    </div>
    <textarea v-model="field" :disabled="!!disabled" :placeholder="placeholder"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() private title!: string;
  @Prop() private value?: string;
  @Prop() private placeholder?: string;
  @Prop() private disabled?: boolean;
  private fieldValue: string;

  constructor() {
    super();
    this.fieldValue = this.value || "";
  }

  @Watch('value')
  onValueChanged(val: string, oldVal: string) {
    this.fieldValue = val;
  }

  get field() {
    return this.fieldValue;
  }
  set field(value: string) {
    this.fieldValue = value;
    this.$emit("input", value);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.answer {
  .header {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 1.3em;
      margin: 0;
      text-align: left;
      margin-bottom: 10px;
    }
  }
  textarea {
    width: 100%;
  }
}
</style>
