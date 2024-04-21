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
  <div class="flex-auto  overflow-y-auto text-center max-w-6xl mx-auto h-full">
    <textarea v-model="inputMessage"
              @change="updateCursor"  @click="updateCursor"
              @keyup="updateCursor"  @keydown="updateCursor" @select="updateCursor"
              class=" bg-white  shadow-md rounded-lg p-2 flex-auto font-medium
              outline-none resize-none border-none w-full" style="height: calc(100% - 6px)"></textarea>
    </div>
</template>

