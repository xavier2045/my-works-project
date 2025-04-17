<template>
  <div class="height-100" style="padding-left: 20px">
    <persHeader />
    <div class="select-publish-type">
      <div class="type-main">
        <div class="type-main-list">
          <div 
            class="type-main-list-item"
            v-for="(item, index) in menuList" 
            :key="index"
            @click="findRouterPath(item)"
            v-bind:class="{ 'hover-class': item.isHovered }"
            @mouseover="item.isHovered = true"
            @mouseout="item.isHovered = false"
          >
            <div class="type-main-list-item-content">
              <div class="type-icon">
                <template v-if="item.isHovered">
                  <img :src="item.iconHover" alt="" />
                </template>
                <template v-else>
                  <i class="icon font_family" :class="item.icon"></i>
                </template>
                
              </div>
              <div class="type-name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <Kyc :isOpen="isKycOpen" @close="closeKyc" />
      <WpType 
        :isOpen="showWptype" 
        @close="showWptype = false"
        @purchase="handleWptype"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { aeUseStore } from '@/stores/user';
  import Kyc from '@/components/kyc/index.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import WpType from '@/components/wpType/index.vue';
  import activity from '/activity.png';
  import tasks from '/tasks.png';
  import works from '/works.png';
  import { showPopup } from '@/utils/usePopup';

  const userStore = aeUseStore();
  const userInfo = userStore.getUserInfo;
  const isFlag = ref(0);

  const menuList = reactive([
    {id: 2, name: '发布作品', icon: 'icon-fabuzuopin108', path: 'normal', iconHover: works, isHovered: false}, 
    {id: 3, name: '发布任务', icon: 'icon-fabuxuqiu108', path: 'PostATask', iconHover: tasks, isHovered: false},
    {id: 1, name: '发布活动', icon: 'icon-fabuhuodong108', path: 'ReleaseActivities', iconHover: activity, isHovered: false}
  ]);

  const handleMouseOver = (index: any) => {
    menuList[index].isHovered = true;
  };
  const handleMouseOut = (index: any) => {
    menuList[index].isHovered = false;
  };

  const router = useRouter();
  const findRouterPath = (item: any) => {
    let pathUrl = '';
    pathUrl = item.path;
    console.log('userInfo', userInfo);
    // 需要进行校验是否实名认证
    if(userInfo.isAuth == 1) {
      if(item.id == 2) {
        showWptype.value = true;
      } else {
        showPopup('功能正在开发中，敬请期待！', 'error', 3000);
        // if(item.id == 3) {
        //   userInfo.openPostAtaskType = 1;
        // }
        // router.push({ name: pathUrl });
      }
    } else {
      openLogin();
    }
  }

  /**
   * 实名认证
   * 
  */
  const isKycOpen = ref(false);
  const openLogin = () => {
    isKycOpen.value = true;
  };
  const closeKyc = () => {
    isKycOpen.value = false;
  };

  // 选择发布作品的类型
  const showWptype = ref(false)
  const handleWptype = (order) => {
      console.log('Wptype:', order)
  }

  
</script>

<style lang='scss' scoped>
  .select-publish-type{
    width: calc(100% - 4px);
    height: calc(100% - 179px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, .38);
    position: relative;
    overflow: hidden;
    .type-main{
      width: 100%;
      height: 100%;
      // background: rgba(255, 255, 255, .06);
      backdrop-filter: blur(20px);
      .type-main-list{
        padding: 0 110px;
        height: auto;
        display: flex;
        justify-content: space-between;
        .type-main-list-item{
          width: 278px;
          height: 378px;
          cursor: pointer;
          border-radius: 36px;
          position: relative;
          margin-top: 135px;
          transition: transform 0.3s ease;
          border: 1px solid rgba(255, 255, 255, .18); ;
          box-shadow: 18px 0px 72px 0px rgba(0, 0, 0, .6);
          // background: rgba(24, 24, 24, 0.6);
          backdrop-filter: blur(20px);
          &.hover-class{
            transform: translateY(-10px);
            background: rgba(255, 255, 255, .16);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, .38); 
          }
          .type-main-list-item-content{
            width: 100%;
            padding-top: 82px;
            .type-icon{
              width: 104px;
              height: auto;
              margin: 0 auto 79.5px auto;
              i{
                font-size: 104px;
                color: #FFFFFF;
                text-align: center;
                margin: 82px 0 89px 0;
              }
            }
            .type-name{
              font-size: 24px;
              color: #FFFFFF;
              text-align: center;
              font-weight: 400;
              font-size: 24px;
              line-height: 1;
              font-style: normal;
              text-transform: none;
            }
          }
          .type-main-list-item-flag {
            width: 24px;
            position: absolute;
            right: 20px;
            bottom: 20px;
            i{
              font-size: 24px;
              color: #FFFFFF;
            }
          }
        }
        
        .flag{
          background: rgba(255, 255, 255, .16);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, .38); 
        }
      }
      .type-main-btn{
        width: 100%;
        margin-top: 168px;
        .type-main-btn-path{
          width: 160px;
          height: 60px;
          margin: 0 auto;
          cursor: pointer;
          border-radius: 30px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(20px);
          i{
            font-size: 24px;
            color: #FFFFFF;
            text-align: center;
            line-height: 60px;
            display: block;
          }
        }
      }
    }
  }
</style>
