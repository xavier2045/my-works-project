<!-- components/rowOrCol/Col.vue -->
<template>
    <div :class="colClass">
      <slot></slot>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'Col',
    props: {
      xs: {
        type: Number,
        default: 24,
      },
      sm: {
        type: Number,
        default: 24,
      },
      md: {
        type: Number,
        default: 12,
      },
      lg: {
        type: Number,
        default: 8,
      },
      xl: {
        type: Number,
        default: 6,
      },
      xxl: {
        type: Number,
        default: 5,
      },
      xxxl: {
        type: Number,
        default: 4,
      },
    },
    setup(props) {
      const colClass = computed(() => {
        return {
          col: true,
          [`col-xs-${props.xs}`]: true,
          [`col-sm-${props.sm}`]: true,
          [`col-md-${props.md}`]: true,
          [`col-lg-${props.lg}`]: true,
          [`col-xl-${props.xl}`]: true,
          [`col-xxl-${props.xxl}`]: true,
          [`col-xxxl-${props.xxxl}`]: true,
        };
      });
  
      return {
        colClass,
      };
    },
  });
  </script>
  
  <style scoped>
  .col {
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
  }
  
  /* Default to full width for small devices */
  .col-xs-24 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  /* Media queries for responsive grid */
  @media (min-width: 576px) {
    .col-sm-24 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .col-sm-12 {
      flex: 0 0 50%;
      max-width: 50%;
    }
    .col-sm-8 {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
    .col-sm-6 {
      flex: 0 0 25%;
      max-width: 25%;
    }
    .col-sm-5 {
      flex: 0 0 20%;
      max-width: 20%;
    }
    .col-sm-4 {
      flex: 0 0 16.6667%;
      max-width: 16.6667%;
    }
  }
  
  @media (min-width: 768px) {
    .col-md-24 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .col-md-12 {
      flex: 0 0 50%;
      max-width: 50%;
    }
    .col-md-8 {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
    .col-md-6 {
      flex: 0 0 25%;
      max-width: 25%;
    }
    .col-md-5 {
      flex: 0 0 20%;
      max-width: 20%;
    }
    .col-md-4 {
      flex: 0 0 16.6667%;
      max-width: 16.6667%;
    }
  }
  
  @media (min-width: 992px) {
    .col-lg-24 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .col-lg-12 {
      flex: 0 0 50%;
      max-width: 50%;
    }
    .col-lg-8 {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
    .col-lg-6 {
      flex: 0 0 25%;
      max-width: 25%;
    }
    .col-lg-5 {
      flex: 0 0 20%;
      max-width: 20%;
    }
    .col-lg-4 {
      flex: 0 0 16.6667%;
      max-width: 16.6667%;
    }
  }
  
  @media (min-width: 1200px) {
    .col-xl-24 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .col-xl-12 {
      flex: 0 0 50%;
      max-width: 50%;
    }
    .col-xl-8 {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
    .col-xl-6 {
      flex: 0 0 25%;
      max-width: 25%;
    }
    .col-xl-5 {
      flex: 0 0 20%;
      max-width: 20%;
    }
    .col-xl-4 {
      flex: 0 0 16.6667%;
      max-width: 16.6667%;
    }
  }
  @media (min-width: 1600px) {
    .col-xxl-24 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .col-xxl-12 {
      flex: 0 0 50%;
      max-width: 50%;
    }
    .col-xxl-8 {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
    .col-xxl-6 {
      flex: 0 0 25%;
      max-width: 25%;
    }
    .col-xxl-5 {
      flex: 0 0 20%;
      max-width: 20%;
    }
    .col-xxl-4 {
      flex: 0 0 16.6667%;
      max-width: 16.6667%;
    }
  }
  @media (min-width: 1920px) {
    .col-xxxl-24 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .col-xxxl-12 {
      flex: 0 0 50%;
      max-width: 50%;
    }
    .col-xxxl-8 {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
    .col-xxxl-6 {
      flex: 0 0 25%;
      max-width: 25%;
    }
    .col-xxxl-5 {
      flex: 0 0 20%;
      max-width: 20%;
    }
    .col-xxxl-4 {
      flex: 0 0 16.6667%;
      max-width: 16.6667%;
    }
  }
  </style>
  