<script setup lang="ts">
import markdown from 'markdown-it'
import hlJS from 'highlight.js'
import { debounce } from 'lodash-es'
import 'highlight.js/styles/github.css'

const inputMessage = useInputMessage()
const md = markdown({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hlJS.getLanguage(lang)) {
      try {
        return '<pre><code class="hlJS">' +
            hlJS.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
      } catch (__) {}
    }

    return '<pre><code class="hlJS">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});
</script>

<template>
  <div class="flex-auto  overflow-y-auto max-w-6xl mx-auto  h-full">
  <div class="markdown-body" v-html="md.render(inputMessage)"/>
  </div>
</template>

<style scoped>

</style>