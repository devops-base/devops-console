<template>
  <div>
    <!-- eslint-disable-next-line vue/no-mutating-props -->
    <a-input style="width: 32%" disabled v-model:value="item.name" />
    <!-- eslint-disable-next-line vue/no-mutating-props -->
    <a-input class="ml-5px" style="width: 66%" v-model:value="item.value" :disabled="readOnly" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {Items} from "@/pages/task/script/model";

export default defineComponent({
  name: 'Item',
  props: {
    item: {
      type: Object as PropType<Items>,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped lang="less">
.descClass {

}
</style>
