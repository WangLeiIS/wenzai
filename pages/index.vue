<script setup>
  import { ref } from 'vue';
  import { computed } from 'vue';
  import markdownit from 'markdown-it'
  import hljs from 'highlight.js'
  import { debounce } from 'lodash-es'
  import 'highlight.js/styles/github.css'
	const loading = ref(false);
  const inputMessage = ref('{?李白是谁?}');
  const cursorPosition = ref(0)
  const startPosition = ref(0)
  const context_size = ref(200)
  const startKey = '{?'
  const endKey = '?}'
  const prompt = ref(
      {
        before_question: '',
        question: '',
        after_question: ''
      }
  );

  const md = markdownit({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre><code class="hljs">' +
                 hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                 '</code></pre>';
        } catch (__) {}
      }

      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });
  const preview = computed(() => {
    return md.render(inputMessage.value)
  })

  const updateInput = debounce((e) => {
    inputMessage.value = e.target.value
  }, 100)

  const updateCursorPosition = (e) => {
    cursorPosition.value = e.target.selectionStart
  }
  const handleInput = (e) => {
    updateInput(e)
    updateCursorPosition(e)
  }
  // 激活copilot模式
  const copilotMode = computed(()=>{
    const copilotKeyWord = inputMessage.value.substring(cursorPosition.value-2,cursorPosition.value);
    return copilotKeyWord.includes(endKey);
  });
  const submitContent = async () => {
    loading.value = true;
    startPosition.value=inputMessage.value.lastIndexOf(startKey,cursorPosition.value-3);
    if (cursorPosition.value - startPosition.value > context_size.value) return
    const orginStartPosition = ref(0);
    if (startPosition.value > context_size.value) orginStartPosition.value = startPosition.value - context_size.value;
    const orginEndPositon = ref(inputMessage.value.length);
    if (inputMessage.value.length -  cursorPosition.value > context_size.value ) orginEndPositon.value = cursorPosition.value + context_size.value;
    prompt.value.after_question = inputMessage.value.slice(cursorPosition.value, orginEndPositon.value)
    prompt.value.question = inputMessage.value.slice(startPosition.value+2, cursorPosition.value-2)
    prompt.value.before_question = inputMessage.value.slice(orginStartPosition.value, startPosition.value)
    const err_answer = ":(我也不知道"
    const answer = await fetch(`/api/chat`, {
      body: JSON.stringify(prompt.value),
      method: 'post'
    });
    if (answer.status === 200) {
      const response = await answer.json();
      inputMessage.value =  inputMessage.value.slice(0,cursorPosition.value)+ "\n" + response?.message + inputMessage.value.slice(cursorPosition.value)
    } else {
      console.error('HTTP error', answer.status)
      inputMessage.value = prompt.value.before_question + startKey + prompt.value.question + endKey + "\n" + err_answer +  prompt.value.after_question
    }
    loading.value = false;
  }
</script>

<template>
  <div class="p-4 m1-10 mr-auto" v-if="loading">
    <span class="loader"></span>
  </div>
  <button :disabled="!copilotMode" v-if="!loading" @click="submitContent"
          class="submitButton">
    <img src="/submit.svg" alt="">
  </button>
  <div class="editor">
    <textarea v-model="inputMessage"
              @input="handleInput"  @click="updateCursorPosition" @keyup="updateCursorPosition"
              class="inputMessage"></textarea>
    <p>{{cursorPosition}}</p>
    <div class="preview" v-html="preview"></div>
  </div>
</template>

<style>
body {
  margin: 0;
}

.loader {
  display: block;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  position: relative;
  color: #d3d3d3;
  box-sizing: border-box;
  animation: animloader 2s linear infinite;
}

@keyframes animloader {
	0% {
		box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 -2px;
	}
	25% {
		box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 2px;
	}
	50% {
		box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 2px, -38px 0 0 -2px;
	}
	75% {
		box-shadow: 14px 0 0 2px, 38px 0 0 -2px;
	}
}



.editor {
  display: flex;
  height: 100vh;
}

.preview {
  width: 50%;
  padding: 1rem;
  overflow-y: auto;
}

.inputMessage {
  width: 50%;
  height: 80%;
  font-size: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
  color: black;
}
.submitButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem; /* w-10 */
  height: 2.5rem; /* h-10 */
  margin-left: 0.5rem; /* ml-2 */
  background-color: #38a169; /* bg-green-500 */
  border-radius: 9999px; /* rounded-full */
  cursor: pointer;
  pointer-events: all;
}

.submitButton:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
