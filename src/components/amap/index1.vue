<template>
  <div :id="containerId" :style="{ width, height }"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from 'vue';
import { aeUseStore } from '@/stores/user';

// 定义 LngLat 类型
type LngLat = [number, number];

export default defineComponent({
  name: 'Amap',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100vh'
    },
    zoom: {
      type: Number,
      default: 10
    },
    center: {
      type: Array as unknown as PropType<LngLat>,
      default: (): LngLat => [116.397428, 39.90923]
    },
    markers: {
      type: Array as unknown as PropType<{ position: LngLat, content?: string }[]>,
      default: () => []
    }
  },
  emits: ['locationSelected'],
  setup(props, { emit }) {
    const containerId = ref(`amap-container-${Math.random().toString(36).substr(2, 9)}`);
    const userStore = aeUseStore();
    const mapKy = userStore.getMapKey;
    const loadAmapScript = () => {
      return new Promise((resolve, reject) => {
        if (typeof AMap !== 'undefined') {
          resolve(AMap);
          return;
        }
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://webapi.amap.com/maps?v=2.0&key=`+ mapKy;
        script.onerror = reject;
        script.onload = () => {
          if (typeof AMap !== 'undefined') {
            resolve(AMap);
          } else {
            reject(new Error('AMap script load error'));
          }
        };
        document.head.appendChild(script);
      });
    };

    const geocode = (lnglat: LngLat) => {
      AMap.plugin('AMap.Geocoder', () => {
        const geocoder = new AMap.Geocoder();
        console.log('geocoder', geocoder);
        console.log('lnglat', lnglat);
        geocoder.getAddress(lnglat, (status: string, result: any) => {
          console.log('status', status);
          
          if (status === 'complete' && result.regeocode) {
            const address = result.regeocode.formattedAddress;
            const { province, city, district, adcode } = result.regeocode.addressComponent;
            emit('locationSelected', {
              lnglat,
              address,
              province,
              city,
              district,
              adcode
            });
          } else{
              console.log('根据经纬度查询地址失败');
              emit('locationError', { status, result });
          }
        });
      });
    };

    onMounted(async () => {
      try {
        await loadAmapScript();
        const map = new AMap.Map(containerId.value, {
          zoom: props.zoom,
          center: props.center,
        });

        map.on('click', (e: any) => {
          console.log('e', e);
          const lnglat: LngLat = [e.lnglat.getLng(), e.lnglat.getLat()];
          // document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
          console.log('lnglat', lnglat);
          geocode(lnglat);
        });

        props.markers.forEach(marker => {
          new AMap.Marker({
            position: marker.position,
            content: marker.content,
            map: map
          });
        });
      } catch (error) {
        console.error('Failed to load AMap script:', error);
      }
    });

    return {
      containerId
    };
  },
});
</script>

<style scoped>
</style>
