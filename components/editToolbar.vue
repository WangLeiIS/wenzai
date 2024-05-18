<script setup lang="ts">

import {useInputQuestion, usePreview} from "~/composables/states";
import PreviewToolbar from "~/components/previewToolbar.vue";
import {getQuestion} from "~/composables/getPrompt";

const cursorPosition = useCursorPosition()
const selectPosition = useSelectPosition()
const inputMessage = useInputMessage()
const inputQuestion = useInputQuestion()

const models = useModels()
const model = useModel()
model.value = models.value[0]
const isLoading = useIsLoading()
const isContext = useIsContext()
const isSelect = useIsSelect()
const isCall = useIsCall()
const previewMode = usePreview()

const callKey = '\n <!--    --> \n'
const endKey = '-->'

const insertKey = () =>
    inputMessage.value =  insertText(callKey, cursorPosition.value, inputMessage.value)

const isAnswer = computed(() => {
  const copilotKeyWord = inputMessage.value.substring(cursorPosition.value-3,cursorPosition.value);
  return copilotKeyWord.includes(endKey);
})

const setContext = () => {
  isContext.value = !isContext.value
}


const submitContent = async () => {
  if (!isAnswer.value&&!isCall.value&&!isSelect.value) {
    isCall.value = true
    return
  }
  let insertPosition = cursorPosition.value
  if (isSelect.value){
    insertPosition = selectPosition.value
  }
  if (isCall.value){
    insertPosition = cursorPosition.value+inputQuestion.value.length
  }
  isLoading.value = true
  let prompt  = {
    beforeQuestion: '',
    afterQuestion: '',
    question: '',
    model: '',
    MSG: ''
  }
  if (isCall.value){
    prompt = getQuestion(inputQuestion.value)
    isCall.value = false
    inputMessage.value =  insertText(inputQuestion.value, cursorPosition.value, inputMessage.value)
    inputQuestion.value = ''
  } else { prompt = getPrompt(inputMessage.value,isContext.value,cursorPosition.value, selectPosition.value) }
  if (prompt.MSG !== ''){
    inputMessage.value = insertText(prompt.MSG, insertPosition, inputMessage.value)
    isLoading.value = false
    return
  }
  prompt.model = model.value
  const { data:answer, error } = await useFetch(`/api/chat`, {
    body: JSON.stringify(prompt),
    method: 'post'
  });
  const answerText = '\n'+ answer.value.message+ '\n'
  inputMessage.value = insertText(answerText, insertPosition, inputMessage.value)
  isLoading.value = false
  isSelect.value = false
}


</script>

<template>
  <div class="grid grid-cols-2">
    <div   class="justify-self-start" style="display: flex; align-items: center;gap:10px">
      <USelect :disabled="previewMode == 2" v-model="model" :options = "models" />
      <UButton :disabled="previewMode == 2" v-if="!isContext"  @click="setContext"
             icon="i-heroicons-x-circle"
             color="gray"
             variant="ghost" label="context"/>
      <UButton :disabled="previewMode == 2" v-if="isContext"  @click="setContext"
             icon="i-heroicons-bars-3-bottom-left"
             label="context"/>
      <UButton :disabled="previewMode == 2" :loading="isLoading"
               @click="submitContent"
               icon="i-heroicons-sparkles"/>
      <UModal v-model="isCall" :overlay="false" class="bg-opacity-0">
        <div class="flex flex-row gap-2 ">
          <UInput placeholder="asking..." class="w-full" v-model="inputQuestion" />
          <UButton @click="submitContent" icon="i-heroicons-sparkles"/>
        </div>
      </UModal>
    <p style="white-space: pre-line; font-size: 12px; color: gray;"></p>
    </div>
    <div  class="justify-self-end">
      <preview-toolbar />
    </div>
  </div>
</template>

<style scoped>

</style>