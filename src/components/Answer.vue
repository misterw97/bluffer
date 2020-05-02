<template>
  <div class="answer">
    <div class="header">
      <p>{{ title }}</p>
      <div v-if="showControls&&!canEdit" class="controls">
        <a @click="edit()">modifier</a>
        <!-- <a>merge</a> -->
      </div>
      <Button @click="save()" v-if="canEdit">
        Enregistrer
      </Button>
    </div>
    <textarea v-model="field" :disabled="!(!disabled||canEdit)" :placeholder="placeholder"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Button from './Button.vue';

@Component({
  components: {
    Button
  }
})
export default class extends Vue {
  @Prop() private title!: string;
  @Prop() private value?: string;
  @Prop() private placeholder?: string;
  @Prop() private disabled?: boolean;
  @Prop() private showControls?: boolean;

  private canEdit: boolean = false;
  private fieldValue: string;

  constructor() {
    super();
    this.fieldValue = this.value || "";
  }

  @Watch('value')
  onValueChanged(val: string, oldVal: string) {
    this.fieldValue = val;
  }

  save() {
    if (this.value !== this.fieldValue) {
      this.$emit("edit", this.fieldValue);
    }
    this.canEdit = false;
  }

  edit() {
    this.canEdit = true;
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
  .button {
    width: 150px;
    height: 20px;
    padding: 15px;
  }
}
</style>
