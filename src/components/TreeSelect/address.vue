<template>
    <div class="location-picker">
      <div class="location-header" @click="toggleDropdown">
        <div class="location-header-l">
          <span>{{ selectedProvince?.label || '' }} {{ selectedCity?.label || '' }} {{ selectedDistrict?.label || '' }}</span>
        </div>
        <div class="location-header-r">
          <i class="icon font_family" :class="dropdownOpen ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"></i>
        </div>
      </div>
      <div v-if="dropdownOpen" class="dropdown-container">
        <div class="dropdown-tabs">
          <span :class="{ active: activeTab === 'province' }" @click="setActiveTab('province')">省</span>
          <span :class="{ active: activeTab === 'city' }" @click="setActiveTab('city')">市</span>
          <span :class="{ active: activeTab === 'district' }" @click="setActiveTab('district')">区</span>
        </div>
        <div class="dropdown-content">
          <ul v-if="activeTab === 'province'">
            <li 
                v-for="province in provinces" 
                :key="province.value" 
                :class="{ selected: selectedProvince && selectedProvince.value === province.value }"
                @click="selectProvince(province)"
            >
              {{ province.label }}
            </li>
          </ul>
          <ul v-if="activeTab === 'city' && selectedProvince">
            <li 
                v-for="city in selectedProvince.children" 
                :key="city.value"
                :class="{ selected: selectedCity && selectedCity.value === city.value }"
                @click="selectCity(city)"
            >
              {{ city.label }}
            </li>
          </ul>
          <ul v-if="activeTab === 'district' && selectedCity">
            <li 
                v-for="district in selectedCity.children" 
                :key="district.value" 
                
                :class="{ selected: selectedDistrict && selectedDistrict.value === district.value }"
                @click="selectDistrict(district)"
            >
              {{ district.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import AreaCode from '@/assets/json/areaCode.json';
  
  interface Location {
    value: string;
    label: string;
    children?: Location[];
  }
  
  export default defineComponent({
    setup(_, { emit }) {
      const dropdownOpen = ref(false);
      const activeTab = ref<'province' | 'city' | 'district'>('province');
      const provinces = ref<Location[]>([]);
      const selectedProvince = ref<Location | null>(null);
      const selectedCity = ref<Location | null>(null);
      const selectedDistrict = ref<Location | null>(null);
  
      onMounted(() => {
        loadLocationData();
      });
  
      function loadLocationData() {
        try {
          const response = AreaCode as Location[];
          provinces.value = response;
        } catch (error) {
          console.error('Failed to load location data:', error);
        }
      }
  
      function toggleDropdown() {
        dropdownOpen.value = !dropdownOpen.value;
      }
  
      function setActiveTab(tab: 'province' | 'city' | 'district') {
        activeTab.value = tab;
      }
  
      function selectProvince(province: Location) {
        selectedProvince.value = province;
        selectedCity.value = null;
        selectedDistrict.value = null;
        activeTab.value = 'city';
      }
  
      function selectCity(city: Location) {
        selectedCity.value = city;
        selectedDistrict.value = null;
        activeTab.value = 'district';
      }
  
      function selectDistrict(district: Location) {
        selectedDistrict.value = district;
        dropdownOpen.value = false; // Close dropdown after selecting the district
        emitSelectedData();
      }
  
      function emitSelectedData() {
        emit('location-selected', {
          province: selectedProvince.value,
          city: selectedCity.value,
          district: selectedDistrict.value
        });
      }
  
      return {
        dropdownOpen,
        activeTab,
        provinces,
        selectedProvince,
        selectedCity,
        selectedDistrict,
        toggleDropdown,
        setActiveTab,
        selectProvince,
        selectCity,
        selectDistrict,
        emitSelectedData
      };
    }
  });
  </script>
  
  <style scoped lang="scss">
  .location-picker {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .location-header {
    height: 100%;
    padding: 0 30px 0 150px;
    display: flex;
    .location-header-l{
        flex: 1;
        width: 0;
        height: auto;
        span{
          width: 100%;
          display: block;
          font-weight: 400;
          font-size: 16px;
          color: #FFFFFF;
          line-height: 28px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-right: 10px;
        }
    }
    .location-header-r{
        width: 24px;
        flex-shrink:0;
        margin-left: 20px;
        i{
            font-size: 24px;
            color: #FFFFFF;
            display: block;
            line-height: 28px;
        }
    }
  }
  .dropdown-container {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    height: 290px;
    border-radius: 12px;
    margin-top: 5px;
    z-index: 10;
    padding-bottom: 10px;
    overflow: hidden;
    // background-color: rgba(255, 255, 255, .06);
    backdrop-filter: blur(20px);
    box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
  }
  
  .dropdown-tabs {
    width: 100%;
    height: 42px;
    display: flex;
    justify-content: space-around;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 42px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    span {
        width: 33.333%;
        cursor: pointer;
    }
    .active {
        background-color: rgba(0, 0, 0, .26);
        backdrop-filter: blur(20px);
    }
  }
  .dropdown-content {
    height: calc(100% - 42px);
    overflow-y: auto;
    padding: 10px;
    &:focus-visible{
        outline: none;
    }
    @supports (-moz-appearance: none) {
        scrollbar-width: thin;

        ::-moz-scrollbar-track {
            background-color: rgba(225,225,225,0);  /* 轨道颜色 */
            border-radius: 2px;
        }

        ::-moz-scrollbar-thumb {
            background-color: rgba(225,225,225,0.2);  /* 滑块颜色 */
            border-radius: 2px;
            width: 4px;
        }

        ::-moz-scrollbar-thumb:hover {
        background-color: rgba(225,225,225,0.2);  /* 悬停时滑块颜色 */
        }
    }
    /* 通用滚动条样式 */
    &::-webkit-scrollbar { /* 整个滚动条 */
        width: 4px; /* 滚动条宽度 */
    }
    &::-webkit-scrollbar-track { /* 滚动条轨道 */
        background: rgba(225,225,225,0); 
    }
    &::-webkit-scrollbar-thumb { /* 滚动条滑块 */
        background: rgba(225,225,225,0.2); 
        border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb:hover { /* 鼠标悬停时滚动条滑块样式 */
        background: rgba(225,225,225,0.2); 
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        li {
            cursor: pointer;
            font-weight: 600;
            font-size: 16px;
            color: rgba(225,225,225,0.5);
            line-height: 1;
            text-align: center;
            font-style: normal;
            text-transform: none;
            padding: 15px 0;
            &:hover {
                color: rgba(225,225,225,1);
            }
        }
        .selected {
            color: #FFFFFF;
        }
    }
  }
  </style>
  