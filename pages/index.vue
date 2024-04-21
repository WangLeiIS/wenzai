<script setup>
import {usePreview} from "~/composables/states";

const previewMode = usePreview()
</script>

<template>
  <edit-toolbar />
  <div class="flex bg-gray-100  m-2 p-3 gap-2 " style="height: calc(100% - 50px)">
    <edit-textarea v-if="previewMode < 2 "/>
    <preview v-if="previewMode > 0"/>
  </div>
</template>

<style>

body {
  height: 100%;
}

</style>
