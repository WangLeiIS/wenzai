<script setup>
import {usePreview} from "~/composables/states";

const previewMode = usePreview()
</script>

<template>
  <edit-toolbar />
  <div class="flex bg-gray-100  m-2 p-3 " style="height: calc(100% - 65px)">
    <edit-textarea class="max-w-6xl  mx-auto" v-if="previewMode === 0"/>
    <preview class="max-w-6xl  mx-auto" v-if="previewMode === 2"/>
    <div class="flex w-full gap-2" v-if="previewMode === 1">
      <edit-textarea class="w-1/2"/>
      <preview class="w-1/2"/>
    </div>
  </div>
</template>

<style>

body {
  margin: 0;
}

</style>
