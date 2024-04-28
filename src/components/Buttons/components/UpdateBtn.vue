<template>
  <Button
    :loading="isLoading"
    v-bind="attrs"
    :size="size || 'small'"
    :type="type || 'primary'"
    :class="`btn ${attrs.class}`"
    @click="onClick"
  >
    <template #icon>
      <slot name="icon" />
    </template>

    <slot v-if="slots.default" />
    <span v-else>{{ content }}</span>
  </Button>
</template>

<script lang="ts" setup>
import type { ButtonProps } from 'ant-design-vue/lib/button';
import {type PropType, useAttrs, useSlots} from 'vue';
import { Button } from 'ant-design-vue';
import type {SizeType} from "ant-design-vue/lib/config-provider";

interface DefineEmits {
  (e: 'click'): void;
}

const emit = defineEmits<DefineEmits>();

interface DefineProps extends ButtonProps {
  isLoading?: boolean;
  content?: string;
  size?: SizeType;
  type?: ButtonProps['type']
}

withDefaults(defineProps<DefineProps>(), {
  isLoading: false,
  content: '编辑',
  size: 'small',
});

const slots = useSlots();
const attrs = useAttrs();

/** 点击编辑 */
const onClick = () => {
  emit('click');
};
</script>
