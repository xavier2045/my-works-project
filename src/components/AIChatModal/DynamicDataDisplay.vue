<template>
    <div class="dynamic-data">
      <div class="data-item" v-html="htmlContent"></div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export type FieldConfig = {
    key: string;
    label: string;
    businessType: number[];
  };
  
  export default defineComponent({
    name: 'DynamicDataDisplay',
    props: {
      data: {
        type: Object as PropType<any>,
        required: true
      },
      fields: {
        type: Array as PropType<FieldConfig[]>,
        required: true
      },
      businessType: {
        type: Number,
        required: true
      }
    },
    computed: {
      htmlContent(): string {
        let content = '<ul>';
        
        this.fields.forEach(field => {
          if (this.data.hasOwnProperty(field.key) && field.businessType.includes(this.businessType)) {
            const value = this.data[field.key];
            content += `<li><strong>${field.label}:</strong> ${value}</li>`;
          }
        });
  
        content += '</ul>';
        return content;
      }
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .dynamic-data {
    width: 100%;
    height: auto;
    .data-item{
        width: 100%;
        height: auto;
        line-height: 1.5;
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            li {
                padding: 10px;
                list-style-type: none;
                border-bottom: 1px solid #eee;
                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }
  }
  </style>