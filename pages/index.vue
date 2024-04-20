<script setup>

</script>

<template>
  <edit-toolbar />
  <div class="editor">
    <edit-textarea />
    <preview />
  </div>
</template>

<style>

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
  outline: aquamarine;
  background-color: #f7fafc;
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
}

</style>
