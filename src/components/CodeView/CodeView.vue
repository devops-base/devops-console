<template>
    <div class="codemirror" >
      <div @change="handleChange" id="inputContainer" class="monaco-editor" ref="inputContainer"></div>
    </div>
</template>
<script setup lang="ts">
// 引入vue模块
import {ref, onMounted, watch, toRaw} from 'vue';
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
//引入monaco编辑器
import * as monaco from "monaco-editor";
// eslint-disable-next-line no-undef
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

(self as any).MonacoEnvironment = {
  getWorker(_: any, label: any) {
    if (label === "json") {
      return new JsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new CssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new HtmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new TsWorker();
    }
    return new EditorWorker();
  },
};

interface Props {
  language: string;
  data: string;
  readOnly: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  language: 'bash',
  data: '',
  readOnly: false,
});

// 代码
const inputEditor = ref<IStandaloneCodeEditor>();
const inputContainer = ref<HTMLElement>();
const code = ref(''); // 代码
const resCode = ref('');
const readMode = ref(false);

onMounted(() => {
  code.value = props.data;
  readMode.value = props.readOnly;
  if (inputContainer.value) {
    inputEditor.value = monaco.editor.create(inputContainer.value, {
      value: code.value,
      language: "bash",
      theme: "vs-dark",
      formatOnPaste: true,
      folding: true,
      automaticLayout: true,
      readOnly: readMode.value,
      colorDecorators: true,
      lineNumbers: "on",
      fontSize: 16,
      minimap: {
        enabled: false,
      },
    });
  }
});

const handleChange = () => {
  const codes = toRaw(inputEditor.value)?.getValue();
  if (typeof codes === "string") {
    resCode.value = codes;
  }
};

watch(() => props.data, data => {
  code.value = data;
  toRaw(inputEditor.value)?.setValue(code.value);
});

watch(() => props.readOnly, data => {
  readMode.value = data;
});

defineExpose({
  resCode,
});

</script>
<style scoped>
.codemirror,
.monaco-editor {
    width: 100%;
    height: 100%;
}
</style>
