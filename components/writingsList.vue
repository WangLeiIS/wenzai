<script setup lang="ts">
  import type {page} from "~/composables/getPages";


  interface pagesList extends page{
    id: number
  }
  const pages = ref<pagesList[]>([])
  function newPages(){
    pages.value.push({
      id : pages.value.length+1,
      title : "New Note",
      uuid: getUUID(),
      content: "",
    })
  }



  const onNewNote = () => {


  }
  const currentWritingId = () => {

  }
  const onSelectWriting = () => {

  }

  const onDeleteWriting = () => {

  }


</script>

<template>
  <div class="h-full box-border bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-800">
    <div class="p-3 border-b border-primary-400/30 flex items-center">
      <h3 class="text-primary-600 dark:text-primary-300 mr-auto">All Notes ({{ pages.length }})</h3>
      <UTooltip text="New Note" :popper="{ placement: 'top' }">
        <UButton icon="i-heroicons-plus" color="primary" disabled square @click="onNewNote"></UButton>
      </UTooltip>
    </div>
    <TransitionGroup tag="div" name="list" class="h-[calc(100%-57px)] overflow-auto">
      <div v-for="item in pages" :key="item.id"
           class="session-item dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-700/30 p-3 cursor-pointer border-b border-gray-200 dark:border-gray-800 flex items-center"
           :class="{ 'bg-primary-100 dark:bg-primary-700/30 activated': currentWritingId === item.id}">
        <div class="grow">
          <div class="line-clamp-1">{{ item.title  }}</div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>

</style>