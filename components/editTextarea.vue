<script setup lang="ts">

const cursorPosition = useCursorPosition()
const selectPosition = useSelectPosition()
const inputMessage = useInputMessage()
const isSelect = useIsSelect()

const updateCursor = (e) => {
  isSelect.value = false
  cursorPosition.value = e.target.selectionStart
  selectPosition.value=e.target.selectionEnd
  if (e.target.selectionStart !==  e.target.selectionEnd) isSelect.value = true
}

</script>

<template>
    <textarea v-model="inputMessage"
              @change="updateCursor"  @click="updateCursor"
              @keyup="updateCursor"  @keydown="updateCursor" @select="updateCursor"
              class="inputMessage"></textarea>
</template>

