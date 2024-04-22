<script setup lang="ts">
import {usePreview} from "~/composables/states";

const previewMode = usePreview()
const items = [{
  title: 'edit',
  icon: 'i-heroicons-pencil-square',
}, {
  title: 'preview',
  icon: 'i-heroicons-eye',
}, {
  title: 'read',
  icon: 'i-heroicons-book-open',
}]

const onChange = (index:number) => {
  if (index === 0){
    previewMode.value = 0
  } else if (index === 1){
    previewMode.value = 1
  }else previewMode.value = 2
}
</script>

<template>
  <UTabs :items="items" class="w-full" @change="onChange" :default-index="0">
    <template #default="{ item, index, selected }">
      <div class="flex items-center gap-2 relative truncate">
        <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

        <span class="truncate">{{ item.label }}</span>

        <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
      </div>
    </template>
  </UTabs>
</template>

<style scoped>

</style>