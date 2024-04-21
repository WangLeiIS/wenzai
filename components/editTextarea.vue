<script setup lang="ts">

const cursorPosition = useCursorPosition()
const selectPosition = useSelectPosition()
const inputMessage = useInputMessage()
const isSelect = useIsSelect()
const content = useCookie('content',{default: () => ''})

if (inputMessage.value == '') inputMessage.value = content.value

function updateCookie() {
    content.value = inputMessage.value
}

const updateCursor = (e) => {
  isSelect.value = false
  cursorPosition.value = e.target.selectionStart
  selectPosition.value=e.target.selectionEnd
  if (e.target.selectionStart !==  e.target.selectionEnd) isSelect.value = true
  updateCookie()
}

</script>

<template>
  <div class="flex-auto  overflow-y-auto text-center h-full">
    <textarea v-model="inputMessage"
              @change="updateCursor"  @click="updateCursor"
              @keyup="updateCursor"  @keydown="updateCursor" @select="updateCursor"
              placeholder="write something..."
              class=" bg-white  shadow-md rounded-lg p-2 flex-auto font-medium
              outline-none resize-none border-none w-full" style="height: calc(100% - 6px)"></textarea>
    </div>
</template>

