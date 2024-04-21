<script setup lang="ts">

import {usePreview} from "~/composables/states";
import PreviewToolbar from "~/components/previewToolbar.vue";

const cursorPosition = useCursorPosition()
const selectPosition = useSelectPosition()
const inputMessage = useInputMessage()

const models = useModels()
const model = useModel()
model.value = models.value[0]
const isLoading = useIsLoading()
const isContext = useIsContext()
const isSelect = useIsSelect()
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
  let insertPosition = cursorPosition.value
  if (isSelect){
    insertPosition = selectPosition.value
  }
  isLoading.value = true
  const prompt = getPrompt(inputMessage.value,isContext.value,cursorPosition.value, selectPosition.value)
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
  const answerText = '\n'+ answer.value.message
  inputMessage.value = insertText(answerText, insertPosition, inputMessage.value)
  isLoading.value = false
}


</script>

<template>
  <div class="grid grid-cols-2">
    <div   class="justify-self-start" style="display: flex; align-items: center;gap:10px">
<!--    <UButton disabled @click="insertKey"-->
<!--             icon="i-heroicons-arrow-right-end-on-rectangle"-->
<!--             label="save"/>-->
    <USelect :disabled="previewMode == 2" v-model="model" :options = "models" />
    <UButton :disabled="previewMode == 2"
             @click="insertKey"
             icon="i-heroicons-arrow-right-end-on-rectangle"
             label="call"/>
    <UButton :disabled="!isAnswer&&!isSelect" :loading="isLoading"
             @click="submitContent"
             icon="i-heroicons-sparkles"
             label="answer"/>
    <UButton :disabled="previewMode == 2" v-if="!isContext"  @click="setContext"
             icon="i-heroicons-x-circle"
             color="gray"
             variant="ghost"
             label="Context"/>
    <UButton :disabled="previewMode == 2" v-if="isContext"  @click="setContext"
             icon="i-heroicons-bars-3-bottom-left"
             label="Context"/>
    <p style="white-space: pre-line; font-size: 12px; color: gray;"></p>
    </div>
    <div  class="justify-self-end">
      <preview-toolbar />
    </div>
  </div>
</template>

<style scoped>

</style>