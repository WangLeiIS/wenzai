<script setup>
  import { ref } from 'vue';
	const loading = ref(false);
  const inputMessage = ref('李白是谁？');
  // todo 待删除
  const prompt_position = ref([0,0])

  const prompt = ref(
      {
        before_question: '',
        question: '',
        after_question: ''
      }
  );

  const cursorPosition = ref(0)

  const updateCursorPosition = (e) => {
    cursorPosition.value = e.target.selectionStart
  }
  const copilotMode = computed(()=>{
    const copilotKeyWord = inputMessage.value.substring(cursorPosition.value-2,cursorPosition.value);
    return copilotKeyWord.includes("::");
  });
  const submitContent = async () => {
    loading.value = true;
    // todo 建立中间变量context
    prompt_position.value[1]=cursorPosition.value
    prompt_position.value[0]=inputMessage.value.lastIndexOf("::",prompt_position.value[1]-3)
    prompt.value.after_question = inputMessage.value.slice(prompt_position.value[1])
    prompt.value.question = inputMessage.value.slice(prompt_position.value[0]+2, prompt_position.value[1]-2)
    prompt.value.before_question = inputMessage.value.slice(0, prompt_position.value[0])
    const err_answer = ":(我也不知道"
    const answer = await fetch(`/api/chat`, {
      body: JSON.stringify(prompt.value),
      method: 'post'
    });
    if (answer.status === 200) {
      const response = await answer.json();
      inputMessage.value = prompt.value.before_question + "::" + prompt.value.question + "::" + "\n" + response?.message +  prompt.value.after_question
    } else {
      console.error('HTTP error', answer.status)
      inputMessage.value = prompt.value.before_question + "::" + prompt.value.question + "::" + "\n" + err_answer +  prompt.value.after_question
    }
    loading.value = false;
  }
</script>

<template>
  <div class="p-4 m1-10 mr-auto" v-if="loading">
    <span class="loader"></span>
  </div>
  <div class="editor">
    <textarea v-model="inputMessage"
              @input="updateCursorPosition"  @click="updateCursorPosition" @keyup="updateCursorPosition"
              class="inputMessage"></textarea>
    <p>{{cursorPosition}}</p>
    <button :disabled="loading || !copilotMode" @click="submitContent"
            class="submitButton">
      <img src="/submit.svg" alt="">
    </button>
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

.inputMessage {
  width: 80%;
  height: 80%;
  font-size: 1.5rem;
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
