<!-- components/rowOrCol/Row.vue -->
<template>
    <div class="row">
      <slot></slot>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Row',
  });
  </script>
  
  <style scoped>
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
  }
  </style>
  