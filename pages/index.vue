<script setup>
  import { ref } from 'vue';
  import { computed } from 'vue';
  import markdown from 'markdown-it'
  import hlJS from 'highlight.js'
  import { debounce } from 'lodash-es'
  import 'highlight.js/styles/github.css'
	const loading = ref(false);
  const inputMessage = ref('# Hello World\n');
  const cursorPosition = ref(0)
  const startPosition = ref(0)
  const context_size = ref(200)
  const isContext = ref(true)
  const models = ['gpt-3.5-turbo','gpt-3.5-turbo-16k-0613','gpt-3.5-turbo-1106']
  const model = ref(models[0])
  const startKey = '<!--'
  const endKey = '-->'
  const prompt = ref(
      {
        before_question: '',
        question: '',
        after_question: ''
      }
  );

  const md = markdown({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hlJS.getLanguage(lang)) {
        try {
          return '<pre><code class="hlJS">' +
                 hlJS.highlight(str, { language: lang, ignoreIllegals: true }).value +
                 '</code></pre>';
        } catch (__) {}
      }

      return '<pre><code class="hlJS">' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });

  const updateCursorPosition = (e) => {
    cursorPosition.value = e.target.selectionStart
  }
  const insertKey = (e) => {
     inputMessage.value =  inputMessage.value.slice(0,cursorPosition.value)+ "\n" + startKey + "    " + endKey + "\n" + inputMessage.value.slice(cursorPosition.value)
}
  // 激活copilot模式
  const copilotMode = computed(()=>{
    const copilotKeyWord = inputMessage.value.substring(cursorPosition.value-3,cursorPosition.value);
    return copilotKeyWord.includes(endKey);
  });
  const submitContent = async () => {
    loading.value = true;
    startPosition.value=inputMessage.value.lastIndexOf(startKey,cursorPosition.value-4);
    if (cursorPosition.value - startPosition.value > context_size.value) return
    const orginStartPosition = ref(0);
    if (startPosition.value > context_size.value) orginStartPosition.value = startPosition.value - context_size.value;
    const orginEndPositon = ref(inputMessage.value.length);
    if (inputMessage.value.length -  cursorPosition.value > context_size.value ) orginEndPositon.value = cursorPosition.value + context_size.value;
    prompt.value.after_question = inputMessage.value.slice(cursorPosition.value, orginEndPositon.value)
    prompt.value.question = inputMessage.value.slice(startPosition.value+4, cursorPosition.value-3)
    prompt.value.before_question = inputMessage.value.slice(orginStartPosition.value, startPosition.value)
    const err_answer = ":(我也不知道"
    const { data:answer, error } = await useFetch(`/api/chat`, {
      body: JSON.stringify(prompt.value),
      method: 'post'
    });
      inputMessage.value =  inputMessage.value.slice(0,cursorPosition.value)+ "\n" + answer.value.message + inputMessage.value.slice(cursorPosition.value)
    loading.value = false;
  }
</script>

<template>
  <div  style="display: flex; align-items: center;gap:10px">
    <USelect v-model="model" :options = "models" />
    <UButton @click="insertKey" label="call"/>
    <UButton :disabled="!copilotMode" :loading="loading" @click="submitContent" label="answer"/>
    <UCheckbox v-model="isContext" color="lime" label="Context" disabled />
    <p style="white-space: pre-line; font-size: 12px; color: gray;"></p>
  </div>
  <div class="editor">
    <textarea v-model="inputMessage"
              @input="updateCursorPosition"  @click="updateCursorPosition" @keyup="updateCursorPosition"
              class="inputMessage"></textarea>
    <div class="markdown-body preview" v-html="md.render(inputMessage)"></div>
  </div>
</template>

<style>
body {
  margin: 0;
}

.editor {
  display: flex;
  height: 82vh;
}

.preview {
  width: 50%;
  padding: 1rem;
  overflow-y: auto;
}

.inputMessage {
  width: 50%;
  font-size: 1rem;
  padding: 1rem;
  resize: none;
  color: black;
  border: none;
  outline: none;
  background-color: #f7fafc;
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
}

</style>
