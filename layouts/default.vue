<script setup>
const route = useRoute()

const links = [
[{
    label: 'Wenz-AI',
    labelClass: 'text-2xl font-semibold text-primary'
  }]
]
</script>
<template>
  <div class="border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between  px-4">
      <div>
         <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
      </div>
      <h1 class="flex flex-row items-center mr-2">
        <span class="text-green-700 font-normal	 text-lg">郁郁乎文哉</span>
      </h1>
     </div>
</div>
  <div id="main" class="p-4 box-border overflow-auto" style="height: calc(100% - 62px)">
    <slot />
  </div>
  <UNotifications />
</template>