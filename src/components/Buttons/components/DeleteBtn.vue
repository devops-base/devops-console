<template>
  <contextHolder />
  <Button
    :loading="isLoading"
    :danger="isDanger"
    v-bind="attrs"
    :size="size"
    :type="type || 'primary'"
    :class="`btn ${attrs.class}`"
    @click="onClick"
  >
    <template v-if="isIcon" #icon>
      <DeleteOutlined />
    </template>

    <slot v-if="slots.default" />
    <span v-else>{{ content }}</span>
  </Button>
</template>

<script lang="ts" setup>
import type { ButtonProps } from 'ant-design-vue/lib/button';
import { createVNode, useAttrs, useSlots } from 'vue';
import { Button, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import {SizeType} from "ant-design-vue/lib/config-provider";

interface DefineEmits {
  (e: 'click'): void;
}

const emit = defineEmits<DefineEmits>();

interface DefineProps extends ButtonProps {
  isLoading?: boolean;
  isIcon?: boolean;
  content?: string;
  message?: string; // 删除提示语
  isDanger?: boolean;
  size?: SizeType
  type?: ButtonProps['type']
}

const props = withDefaults(defineProps<DefineProps>(), {
  isLoading: false,
  isDanger: true,
  content: '删除',
  size: 'small',
});

const slots = useSlots();
const attrs = useAttrs();
const [modal, contextHolder] = Modal.useModal();

/** 点击删除 */
const onClick = () => {
  modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: props.message || `确定要${props.content}吗?`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      emit('click');
    }
  });
};
</script>
