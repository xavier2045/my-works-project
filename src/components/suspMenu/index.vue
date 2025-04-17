<template>
  <div class="suspMenu-view">
    <div class="suspMenu-view-pos">
        <div class="suspMenu-view-main">
            <ul>
                <li 
                    v-for="( item, index ) in suspMenu"
                    :key="index"
                    :title="item.name"
                    :class="{ 'flag': index == isSuspMenu }"
                    @click="findSuspMenuIndex(index)"
                >
                <template v-if="item.id !== 6">
                    <!-- <template v-if="item.id !== 1 && item.id !== 4">
                        <i class="icon font_family" :class="item.icon"></i>
                    </template>
                    <template v-else> -->
                        <router-link :to="isAbsolute(item.path) ? item.path : `${$route.path}/${item.path}`">
                            <i class="icon font_family" :class="item.icon"></i>
                        </router-link>
                    <!-- </template> -->
                </template>
                <template v-else>
                    <i class="icon font_family icon-geren24" title="个人中心" @click="findRouterPersonalHomepage"></i>
                </template>
                </li>
            </ul>
        </div> 
    </div>
</div>
</template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
  import { aeUseStore } from '@/stores/user';
  import router from '@/router';
  import { showPopup } from '@/utils/usePopup';
  
  export default defineComponent({
    name: "SuspMenu",
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      menuItems: {
        type: Array,
        default: () => [],
      }
    },
    setup(props, { emit }) {
      const userStore = aeUseStore();
      const userInfo = userStore.getUserInfo;

      const isSuspMenu = ref<number | null>(null);
      const suspMenu = ref(props.menuItems && props.menuItems.length > 0 ? props.menuItems : [
          { id: 1, name: '首页', path: '/', icon: 'icon-shouye24' },
          { id: 4, name: '作品', path: '/WorksList', icon: 'icon-fabuzuopin34' },
          { id: 2, name: '任务', path: '/TaskList', icon: 'icon-woderenwu24-2' },
          { id: 3, name: '活动', path: '/TaskList', icon: 'icon-fabuhuodong34' },
          { id: 5, name: 'Dao', path: '/dao/pageTwo', icon: 'icon-jihui24' },
          { id: 6, name: '个人中心', path: '/PersonalHomepage', icon: 'icon-geren24' },
      ]);

      const isAbsolute = (path: any) => {
        return path.startsWith('/');
      }

      const findSuspMenuIndex = (index: number) => {
          isSuspMenu.value = index;
        //   if(index == 2 || index == 3 || index == 4) {
        //     showPopup('功能正在开发中，敬请期待！', 'error', 3000);
        //   }
      }
      const findRouterPersonalHomepage = () => {
          if(userInfo.userName !== '' && userInfo.userName !== null) {
              router.push('/PersonalHomepage');
          } else {
            router.push('/');
          }
      }

        /** 根据url判断选中侧边栏菜单项 **/
        const findSuspMenuPath = () => {
            const currentUrl = window.location.href;
            if(currentUrl.includes('dao')){
                isSuspMenu.value = 4;
            } else if(currentUrl.includes('TaskList')){
                isSuspMenu.value = 2;
            } else if(currentUrl.includes('WorksList') || currentUrl.includes('works')){
                isSuspMenu.value = 1;
            } else if(currentUrl.includes('PersonalHomepage')){
                isSuspMenu.value = 5;
            } else {
                isSuspMenu.value = 0;
            }
        }

        onMounted(() => {
            findSuspMenuPath();
        });
  
      return {
        isSuspMenu,
        suspMenu,
        isAbsolute,
        findSuspMenuIndex,
        findRouterPersonalHomepage,
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .suspMenu-view{
      width: 54px;
      position: absolute;
      top: 50%;
      left: 50px;
      transform: translateY(-50%);
      z-index: 10;
      .suspMenu-view-pos{
          width: 100%;
          height: 100%;
          .suspMenu-view-main{
              width: 100%;
              height: auto;
              border-radius: 26px;
              border: 1px solid rgba(255, 255, 255, .15);
              background: rgba(23, 23, 54, .5);
              backdrop-filter: blur(10px);
              position: relative;
              ul{
                  margin: 0;
                  padding: 0;
                  padding: 16px 8px;
                  li{
                      width: 36px;
                      height: 36px;
                      border-radius: 50%;
                      list-style-type: none;
                      margin-bottom: 15px;
                      
                      a{
                          width: 100%;
                          height: 100%;
                          display: block;
                          text-align: center;
                          i{
                              font-size: 24px;
                              color: rgb(255, 255, 255, 0.68);
                              display: block;
                              line-height: 36px;
                          }
                      }
                      i{
                          width: 100%;
                          font-size: 24px;
                          color: rgb(255, 255, 255, 0.68);
                          text-align: center;
                          line-height: 36px;
                          display: block;
                          cursor: pointer;
                      }
                      &:hover{
                          box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.6), 0 -2px 5px rgba(99, 99, 217, 0.4);
                          background: linear-gradient(to bottom, rgba(60, 60, 150, .4), rgba(40, 40, 100, .3));
                          i{
                              color: #FFFFFF;
                          }
                      }
                      &:last-child{
                          margin-bottom: 0;
                      }
                  }
                  .flag{
                      box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.6), 0 -2px 5px rgba(99, 99, 217, 0.4);
                      background: linear-gradient(to bottom, rgba(60, 60, 150, .5), rgba(40, 40, 100, .4));
                      i{
                          color: #FFFFFF;
                      }
                  }
              }
          }
      }
  }
  </style>