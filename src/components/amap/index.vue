<template>
  <div class="map-container">
    <input class="map-seatch" v-model="searchQuery" @keyup.enter="searchAddress" placeholder="输入地址并按回车搜索" />
    <div :id="containerId" :style="{ width, height }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, PropType } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
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
    plugins: {
      type: Array as PropType<string[]>,
      default: () => ["AMap.Scale"],
    },
    markers: {
      type: Array as unknown as PropType<{ position: LngLat, content?: string }[]>,
      default: () => []
    }
  },
  emits: ['locationSelected'],
  setup(props, { emit }) {
    const userStore = aeUseStore();
    const mapKy = userStore.getMapKey;

    const containerId = ref(`amap-container-${Math.random().toString(36).substr(2, 9)}`);
    let map: AMap.Map | null = null;
    let marker: AMap.Marker | null = null;
    const searchQuery = ref("");

    const geocode = (lnglat: LngLat) => {
      AMap.plugin('AMap.Geocoder', () => {
        const geocoder = new AMap.Geocoder();
        geocoder.getAddress(lnglat, (status: string, result: any) => {
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
          } else {
            console.log('Geocode error:', status);
          }
        });
      });
    };

    const addMarker = (lnglat: LngLat, AMap: any) => {
      if (marker) {
        marker.setPosition(lnglat);
      } else {
        marker = new AMap.Marker({
          icon: new AMap.Icon({
            size: new AMap.Size(19, 31),  // 图标大小
            image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            imageSize: new AMap.Size(19, 31)  // 图标大小
          }),
          position: lnglat,
          anchor: 'bottom-center',  // 锚点
          map: map!,
        });
        console.log('Marker created:', marker); // 调试信息
      }
      console.log('Marker added/updated at:', lnglat); // 调试信息
    };

    const searchAddress = () => {
      if (!searchQuery.value) {
        return;
      }

      AMap.plugin('AMap.PlaceSearch', () => {
        const placeSearch = new AMap.PlaceSearch({
          city: '全国', // 设置搜索范围
          map: map!,
        });

        placeSearch.search(searchQuery.value, (status: string, result: any) => {
          if (status === 'complete' && result.poiList.pois.length > 0) {
            const poi = result.poiList.pois[0];
            const lnglat: LngLat = [poi.location.lng, poi.location.lat];
            addMarker(lnglat, AMap);
            map?.setCenter(lnglat);
            geocode(lnglat);
          } else {
            console.error('PlaceSearch error:', status, result);
          }
        });
      });
    };

    onMounted(() => {
      window._AMapSecurityConfig = {
        securityJsCode: mapKy.code,
      };

      AMapLoader.load({
        key: mapKy.key, // 使用传入的API Key
        version: "2.0", // 指定要加载的 JSAPI 的版本
        plugins: props.plugins, // 需要使用的插件列表
      })
        .then((AMap) => {
          map = new AMap.Map(containerId.value, {
            viewMode: "3D", // 是否为3D地图模式
            zoom: props.zoom, // 初始化地图级别
            center: props.center, // 初始化地图中心点位置
          });
          if(map) {
            map.on('click', (e: any) => {
              if (map) {
                const lnglat: LngLat = [e.lnglat.getLng(), e.lnglat.getLat()];
                addMarker(lnglat, AMap);
                geocode(lnglat);
              }
            });
          }
        })
        .catch((e) => {
          console.error("Failed to load AMap script:", e);
        });
    });

    onUnmounted(() => {
      map?.destroy();
    });

    return {
      containerId,
      searchQuery,
      searchAddress
    };
  },
});
</script>

<style scoped lang="scss">
  .map-container{
    width: 100%;
    position: relative;
    .map-seatch{
      width: 200px;
      height: 36px;
      font-size: 18px;
      color: #111111;
      line-height: 36px;
      border-radius: 10px;
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 10;
      border: 2px solid #111111;
    }
    #containerId {
      width: 100%;
      height: 100%;
    }
  }
  
</style>
