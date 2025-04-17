<template>
  <div>
    <div class="personal-center">
      <div>
          发布作品
      </div>
      <div>
        <Amap
          :width="'100%'" 
          :height="'500px'" 
          :zoom="18" 
          :center="[113.948584, 22.554721]"
          :plugins="['AMap.Scale', 'AMap.PlaceSearch', 'AMap.Marker']"
          :markers="[]"
          @locationSelected="handleLocationSelected"
        />
      </div>
      <div v-if="selectedLocation">
        <p>经纬度: {{ selectedLocation.lnglat }}</p>
        <p>地址: {{ selectedLocation.address }}</p>
        <p>省: {{ selectedLocation.province }}</p>
        <p>市: {{ selectedLocation.city }}</p>
        <p>区: {{ selectedLocation.district }}</p>
        <p>地区编码: {{ selectedLocation.adcode }}</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { ref } from 'vue';
  import Amap from '@/components/amap/index.vue';
  const selectedLocation = ref<{
    lnglat: [number, number],
    address: string,
    province: string,
    city: string,
    district: string,
    adcode: string
  } | null>(null);


  const handleLocationSelected = (location: any) => {
    selectedLocation.value = location;
  };

</script>

<style lang='scss' scoped>

</style>
