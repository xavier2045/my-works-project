<template>
    <div 
      class="works"
      ref="works"
      @click="findClosePopupFun"
    >
      <div class="works-bg">
        <img :src="pcBg" alt="" />
      </div>
      <div class="works-container">
        <div class="works-header">
          <HeaderView
            @update:searchQuery="handleSearchQueryUpdate"
            @update:selectedOption="handleSelectedOptionUpdate"
          />
        </div>
        <div class="works-centnet" data-aos="fade-up">
            <SuspMenu />
            <div class="works-centnet-main">
                <div class="exhibit-five-back back">
                    <div class="previous-icon" @click="goBack">
                        <i class="icon font_family icon-guanbi24"></i>
                    </div>
                </div>
                <div class="worksExhibit">
                    <div class="worksExhibit-main">
                        <div class="displayArea">
                            <div class="displayArea-main">
                                <!-- 提示元素 -->
                                <div 
                                    class="swipe-guide-layer"
                                    v-if="hasSeenGuide"
                                    @click="closeGuide"
                                    >
                                    <div class="guide-content">
                                        <div class="arrows">
                                            <div class="arrows-main">
                                                <div class="arrows-main-left">
                                                    <div class="arrow up">
                                                        <img :src="upIcon" alt="" />
                                                    </div>
                                                    <div class="roundness">
                                                        <img :src="roundness" alt="" />
                                                    </div>
                                                    <div class="arrow down">
                                                        <img :src="downIcon" alt="" />
                                                    </div> 
                                                </div>
                                                <div class="hand">
                                                    <img :src="handShape" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <p>向上或者向下滑动鼠标可切换作品</p>
                                    </div>
                                </div>
                                <div class="displayArea-content">
                                    <template v-if="details.type == 1">
                                        <VideoPlayer :videoUrls="details.urls" :cover="details.cover" />
                                    </template>
                                    <template v-else-if="details.type == 2">
                                        <ImageCarousel 
                                            :images="details.urls"
                                            :viewed="[false]"
                                        />
                                    </template>
                                    <template v-else-if="details.type == 3">
                                        <AudioPlayer :src="details.urls" />
                                    </template>
                                    <template v-else-if="details.type == 4">
                                        <FileViewer :fileUrl="details.urls" :cover="details.cover" />
                                    </template>
                                </div>
                                <div class="work-details-unpack" @click="findUnpackFun">
                                    <i class="icon font_family icon-a-jiantouxiangzuozhankai24"></i> 
                                </div>
                                <div class="work-details-content" @dragover.prevent :class="{ 'show-content': isShowCommunity }">
                                    <template v-if="isType == 1">
                                        <WorkInfo :data="details" @back="findBack" @open-intro="findOpenIntroClick" @open-pedigree="findOpenPedigreeChartClick" />
                                    </template>
                                    <template v-else-if="isType == 2">
                                        <CommentModule :id="Number(details.workId)" @back="findCommentModuleBack" />
                                    </template>
                                </div>
                                <div class="work-details-intro" @dragover.prevent :class="{ 'show-intro': isShowIntro }">
                                    <WorkIntro :data="details" @back="findIntroBack" />
                                </div>
                                <div class="work-pedigreeChart" @dragover.prevent :class="{ 'show-pedigreeChart': isShowPedigreeChart }">
                                    <!-- <PedigreeChart 
                                        title="家族谱系"
                                        api-url="/api/family-data"
                                        :initial-scale="0.85"
                                        @node-click="handleNodeClick"
                                        @node-dblclick="handleNodeDblClick"
                                    /> -->
                                    <!-- :data="details" 
                                        title="家族谱系"
                                        :initial-scale="0.9"
                                        @node-click="handleNodeClick"
                                        @node-dblclick="handleNodeDblClick" -->
                                        <FamilyTree :tree-data="familyTreeData" @select-node="handleNodeSelect" />
                                </div>
                            </div>
                        </div>
                        <div class="describe">
                            <div class="describe-main">
                                <div class="works-info">
                                    <div class="works-info-main content-box">
                                        <div class="image-box" @click="findViewPersonalInfo(details.userId)">
                                            <el-image
                                                :src="details.userAvatar"
                                                fit="cover"
                                                >
                                                <template #error>
                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                </template>
                                            </el-image>
                                        </div>
                                        <div class="text-box">
                                            <p>{{ details.name }}</p>
                                            <span class="multi-line-1">{{ details.brief }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="worksks-pay">
                                    <!-- 发布者 -->
                                    <template v-if="details.userId == userInfo.id">
                                        <div class="info-view"></div>
                                        <div class="but-view mat-30">
                                            <div class="buy relievoShadow" @click="findStrPopupModal">
                                                交易记录
                                            </div>
                                            <div class="min-but relievoShadow"  @click.stop @click="findOpenPublicTypeList">
                                                <template v-if="details.publicType == 1">所有</template>
                                                <template v-if="details.publicType == 2">
                                                    <i class="icon font_family icon-wodezizuzhi24"></i>
                                                </template>
                                                <template v-if="details.publicType == 3">
                                                    <i class="icon font_family icon-quanxian24_1"></i>
                                                </template>
                                            </div>
                                            <div class="module-content-list overflowYAuto" v-if="isShowPublicTypeList">
                                                <div 
                                                class="module-content-list-item"
                                                v-for="(item, index) in publicTypeList"
                                                :key="index"
                                                @click="findPublicTypeFun(item)"
                                                >
                                                <div class="item-name">{{ item.label }}</div>
                                                <div
                                                    class="item-select" 
                                                    :class="{ 'item-active': item.value === details.publicType }"
                                                >
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </template>
                                    <!-- 普通用户 -->
                                    <template v-else>
                                        <template v-if="details.isCommercial == 1">
                                            <template v-if="details.isOnSell == 0">
                                                <div class="mat-30">
                                                    <div class="buy ae-button relievoShadow">
                                                        <div class="button-mian">
                                                            <div class="button-main-text">作品已下架</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="tips-height">
                                                   <template v-if="details.hasBuyTypeOne == 1">
                                                        <div class="info-view">您已购买普通型</div>
                                                    </template> 
                                                </div>
                                                <div class="tips-height">
                                                    <template v-if="details.hasBuyTypeTwo == 1">
                                                        <template v-if="details.buyTypeTwoIsExpire == 0">
                                                            <template v-if="details.sellTwoType == 1">
                                                                <div class="info-view">您已购买{{ details.buyTypeTwoNum }}次增强型</div>
                                                            </template>
                                                            <template v-else>
                                                                <div class="info-view">您已购买{{ details.buyTypeTwoNum }}个月增强型</div>
                                                            </template>
                                                        </template>
                                                        <template v-else>
                                                            <div class="info-view">您购买的权限已过期</div>
                                                        </template>
                                                    </template>
                                                </div>  
                                                <div v-if="details.hasBuyTypeTwo == 0">
                                                    <div class="buy ae-button relievoShadow">
                                                        <div class="button-mian" @click="findShowPopupModal">
                                                            <div class="button-main-text">立即购买</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <div class="buy ae-button relievoShadow">
                                                        <div class="button-mian" @click="findShowPopupModal">
                                                            <div class="button-main-text">继续购买</div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </template>
                                            
                                        </template>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="operatingArea">
                    <div class="options-list">
                        <div class="list-forwarding" @click="findShowCommunity">
                            <div class="icon-box">
                               <i class="icon font_family icon-shequhudong24"></i> 
                            </div>
                            <div class="num">{{ getStatis.commentNum }}</div>
                        </div>
                        <div class="list-forwarding" @click="handleForwarding">
                            <div class="icon-box">
                                <i class="icon font_family icon-zhuanfa24_1"></i>
                            </div>
                            <div class="num">{{ getStatis.shareNum }}</div>
                        </div>
                        <div class="list-forwarding" @click="findFollowAddFun">
                            <div class="icon-box">
                                <i :class="['icon font_family icon-guanzhu20', getStatis.isFollow == 0? '': 'follw']"></i>
                            </div>
                            <div class="num">{{ getStatis.followNum }}</div>
                        </div>
                        <div class="list-forwarding" @click="handleMOOps"  @click.stop>
                            <div class="icon-box rotate-90">
                                <i class="icon font_family icon-liuyandiandian24"></i>
                            </div>
                            <div class="num">更多</div>
                            <div class="work-mOOps" :class="{ 'show-mOOps': isMOOps }">
                                <div class="work-mOOps-main">
                                    <div 
                                        :class="['work-mOOps-item', item.className || 'white']"
                                        v-for="(item, index) in moopsList"
                                        :key="index"
                                        @click="item.action"
                                        >
                                        <div class="item-icon">
                                            <div class="icon-box relievoShadow">
                                            <i :class="['icon font_family', item.icon]"></i> 
                                            </div>
                                        </div>
                                        <div class="item-text">{{ item.name }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
    </div>
    <Login :isOpen="isLoginOpen" @close="closeLogin" />

    <!-- 作品共创者  -->
    <div class="popupModal" v-if="isApplyList" @click="findCoCreatorFun">
        <div class="masking"></div>
        <div class="personInCharge-center" @click.stop>
            <div class="personInCharge-center-title">作品共创者</div>
            <div class="personInCharge-center-list">
                <div class="applies-list">
                    <div
                        class="applies-list-item"
                        v-for="(item, index) in applyListData" 
                        :key="item.userId"
                    >
                        <div class="item-content">
                            <div class="item-content-left">
                                <div class="item-content-left-main">
                                    <div class="item-content-left-main-avatar" @click="findViewPersonalInfo(item.userId)">
                                        <el-image
                                            :src="item.userAvatar"
                                            fit="cover"
                                            >
                                            <template #error>
                                                <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                            </template>
                                        </el-image>
                                    </div>
                                    <div class="item-content-left-main-info">
                                        <div class="item-content-left-main-info-name">{{ item.username }}</div>
                                        <div class="item-content-left-main-info-tips multi-line-1">{{ item.userMotto }}</div>
                                    </div> 
                                </div>
                            </div>
                            <div class="item-content-right">
                                <template v-if="item.isFollow = 0">
                                    <div 
                                        class="exhibit-publish-name relievoShadow" 
                                        style="line-height: 32px !important;" 
                                        @click="findUserFollowAddFun(1, item.userId)"
                                    >关注</div>
                                </template>
                                <template v-else>
                                    <div 
                                        class="exhibit-publish-name relievoShadow" 
                                        style="line-height: 32px !important;" 
                                        @click="findUserFollowAddFun(2, item.userId)"
                                    >取关</div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
    </div>

    <!-- 选择分享人  -->
    <div class="popupModal" v-if="isShareList" @click="isShareList = false">
        <div class="masking"></div>
        <div class="personInCharge-center" @click.stop>
            <div class="personInCharge-center-title">选择分享人</div>
            <div class="personInCharge-center-list">
                <div class="applies-list">
                    <div
                        class="applies-list-item"
                        v-for="(item, index) in shareListData"
                        :key="item.userId"
                    >
                        <div class="item-content">
                            <div class="item-content-left">
                                <div class="item-content-left-main">
                                    <div class="item-content-left-main-avatar" @click="findViewPersonalInfo(item.userId)">
                                        <el-image
                                            :src="item.avatar"
                                            fit="cover"
                                            >
                                            <template #error>
                                                <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                            </template>
                                        </el-image>
                                    </div>
                                    <div class="item-content-left-main-info">
                                        <div class="item-content-left-main-info-name">{{ item.username }}</div>
                                        <div class="item-content-left-main-info-tips multi-line-1">{{ item.motto }}</div>
                                    </div> 
                                </div>
                            </div>
                            <div class="item-content-right">
                                <div class="exhibit-publish-name relievoShadow" style="line-height: 32px !important;"  @click="findShareFun(item.userId)">分享</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
    </div>
    <!-- 删除确认 -->
    <div class="popupModal" v-if="isDeleteWorks" @click="isDeleteWorks = false">
      <div class="masking"></div>
      <div class="popupModal-center" @click.stop>
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <!-- <div class="popupModal-main-title">删除</div> -->
              <div class="popupModal-main-tips">作品永久删除，将无法找回，是否确认删除？</div>
              <div class="popupModal-main-but-group">
                <div class="popupModal-main-but close_relievoShadow" @click="isDeleteWorks = false">取消</div>
                <div class="popupModal-main-but relievoShadow" @click="handleDelete">确定删除</div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <!-- 购买类型  -->
    <PurchaseModal 
        :detailData="details"
        :isOpen="showPurchase" 
        @close="showPurchase = false"
        @purchase="handlePurchase"
    />
    <!-- 交易记录 -->
    <div class="popupModal" v-if="isStr" @click="isStr = false">
        <div class="masking"></div>
        <div class="personInCharge-center strPopup" @click.stop>
            <GenericTable
                :columns="columns"
                :initial-page-size="10"
                :load-more-data="loadMoreData"
                :total-amount="buyListCount.sellSum+''"
                @error="handleError"
            >
                <!-- 用户信息自定义插槽 -->
                <template #cell-userInfo="{ row }">
                <div class="purchaser-info">
                    <img class="avatar" :src="row.userAvatar" alt="用户头像" />
                    <div class="purchaser-details">
                    <div class="purchaser-name">{{ row.username }}</div>
                    <div class="purchaser-id multi-line-1">账号ID: {{ row.userUuid }}</div>
                    </div>
                </div>
                </template>

                <!-- 状态列插槽 -->
                <template #cell-buyType="{ row }">
                    <span :class="`buyType-dot ${row.buyType}`"></span>
                    {{ statusText(row.buyType) }}
                </template>

                <!-- 购买价格列插槽 -->
                <template #cell-buyPrice="{ row }">
                    <span :class="`buyType-dot ${row.buyPrice}`"></span>
                    {{ row.buyPrice }}元
                </template>

                <!-- 操作列插槽 -->
                <template #cell-actions="{ row }">
                <button class="action-btn" @click="editRow(row)">编辑</button>
                <button class="action-btn danger" @click="deleteRow(row)">删除</button>
                </template>
            </GenericTable>
        </div>
    </div>

    <!-- 支付 -->
    <PayBg :payData="payData" @close="closePayModal" v-if="payData.isPay" @button-click="pointsDeduction" />
  </template>
   
  <script lang="ts" setup>
    import { ref, onMounted, onBeforeUnmount, watch, nextTick, onUnmounted } from 'vue';
    import router from '@/router';
    import HeaderView from '@/components/header/header.vue';
    import { initAOS } from '@/animations/aos';
    import { worksDetails, worksCoCreator, worksShare, worksRightCount, worksFollowAdd, worksFollowCancel, worksUpdate, worksBuyList, worksBuyListCount, worksRecreate, worksList, worksMineList } from '@/api/work';
    import { orderQuery, orderSave } from '@/api/pay';
    import { usersFollowMutual, followAdd, followCancel } from '@/api/user';
    import { showPopup } from '@/utils/usePopup';
    import { aeUseStore } from '@/stores/user';
    import { aeWorksStore } from '@/stores/works';
    import { computeHmac, copyToClipboard, extractIdFromUrl, getItem } from '@/utils/index';

    import VideoPlayer from '@/components/workDisplay/videoPlayer/index.vue';
    import ImageCarousel from '@/components/workDisplay/ImageCarousel/index.vue';
    import AudioPlayer from '@/components/workDisplay/AudioPlayer/index.vue';
    import FileViewer from '@/components/workDisplay/FileViewer/index.vue';
    import CommentModule from '@/components/commentModule/index.vue';
    import PedigreeChart from '@/components/pedigreeChart/index.vue';
    import PurchaseModal from '@/components/PublicPopUpBox/PurchaseModal/index.vue'
    import SuspMenu from '@/components/suspMenu/index.vue';
    import PayBg from '@/components/pay/index.vue';
    import WorkInfo from './workInfo.vue';
    import WorkIntro from './workIntro.vue';
    import GenericTable from '@/components/table/GenericTable/index.vue';
    import FamilyTree from '@/components/FamilyTree/index.vue';
    
    // import { setRem } from '../utils/rem' // 引入文件
    // import { debounce } from 'throttle-debounce' // 用于防抖的
  
    import pcBg from '@/assets/images/pc/pcBg.jpg';
    import task001 from '@/assets/images/useless/task001.png';
    import task002 from '@/assets/images/useless/task002.png';
    import task003 from '@/assets/images/useless/task003.png';
    import infoBut from '@/assets/images/common/infoBut.png';
    import upIcon from '@/assets/images/common/upIcon.png';
    import downIcon from '@/assets/images/common/downIcon.png';
    import roundness from '@/assets/images/common/roundness.png';
    import handShape from '@/assets/images/common/handShape.png';


    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const worksStore = aeWorksStore();
    const worksInfo = worksStore.getWorksInfo;

    const parentSearchQuery = ref('');
    const parentSelectedOption = ref('');
    const isType = ref(0); // 1 详情 2 评论
    const isApplyList = ref(false); // 显示共创者列表
    const applyListData = ref([]); // 共创者列表
    const isShareList = ref(false); // 显示选择分享人
    const shareListData = ref([]); // 分享人列表
    const shareLink = ref(''); // 分享链接
    const isDeleteWorks = ref(false); // 删除作品二次确认
    // 提示相关状态
    const hasSeenGuide = ref();
    const details = ref({
        workId: null as number | null,
        userId: null as number | null,
        userAvatar: '',
        type: null as number | null,
        name: '',
        urls: [] as string[],
        cover: '',
        brief: '',
        tags: [],
        isOnChain: null as number | null,
        chainId: null as number | null,
        introductions: [],
        coCreators: [],
        coCreatorNum: null as number | null,
        publicType: 1,
        isCommercial: null as number | null,
        attachmentUrl: '',
        createTime: '',
        isOnSell: null as number | null, // 0 下架 1上架
        hasAddRecreate: null as number | null,  // 是否购加入二创：0否 1是
        allowRecreate: null as number | null,
        createMethod: '',
        patentUrls: [] as string[],
        originalType: null as number | null,
        sellOne: null as number | null,
        sellTwoType: null as number | null,
        sellTwo: null as number | null,
        sellTwoPercent: null as number | null,
        hasBuyTypeOne: null as number | null,
        hasBuyTypeTwo: null as number | null,
        buyTypeTwoNum: null as number | null,
        buyTypeTwoIsExpire: null as number | null,
    });

    // 提示相关状态
    // 关闭引导层的方法
    const closeGuide = () => {
        localStorage.setItem('seenSwipeGuide', 'false'); // 持久化标记
        hasSeenGuide.value = false;
    };
    
    const handleSearchQueryUpdate = (newSearchQuery: string) => {
      parentSearchQuery.value = newSearchQuery;
      findWorksDetailsFun();
    };
    const handleSelectedOptionUpdate = (newSelectedOption: string) => {
      parentSelectedOption.value = newSelectedOption;
      findWorksDetailsFun();
    };

    // 返回上一页
    const goBack = () => {
        router.go(-1);
    };

    // 获取works数据
    const findWorksDetailsFun = () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        let id = extractIdFromUrl(currentUrl)+'';
      const resData = {
        id: worksInfo.currentId
      }
      return new Promise<void>((resolve, reject) => {
        worksDetails(resData).then((response: any) => {
            const { code, data, message } = response;
            const resultData = data;
            if (code !== 200) {
                showPopup(message, 'error', 3000);
                return;
            }
            details.value = resultData;
            findWorksRightCount();
            findWorksCoCreatorFun();
            // 视频
            // details.value.type = 1;
            // details.value.cover = 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/05/1738735671755-41bbf7c9fcffdb2393390470d8cbdc81.jpg';
            // details.value.urls = ['https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/20/1740038794347-original-ea6ac3c2e21ab15b445807705dead34e.mp4'];
            // 图片
            // details.value.type = 2;
            // details.value.cover = 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/05/1738735671755-41bbf7c9fcffdb2393390470d8cbdc81.jpg';
            // details.value.urls = [
            //     'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/25/1740462284350-5f246916a74f02107f105792b575dff6.jpg',
            //     'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/25/1740459375489-c2cd3312fab1255146dd414db38296b9.jpg',
            //     'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/21/1740117178577-16d75d5c583e99d73f3fa50a669374e4.jpg',
            //     'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/24/1740393713014-2.jpeg',
            //     'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/05/1738726828213-%F0%9F%8F%8E.jpeg'
            // ];

            // 文本
            // details.value.type = 4;
            // details.value.cover = 'https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/05/1738735671755-41bbf7c9fcffdb2393390470d8cbdc81.jpg';
            // details.value.urls = ['https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/25/%E5%9E%82%E9%92%93.ppt'];
            // https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/25/%E5%9E%82%E9%92%93.ppt
            // https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/25/%E6%96%B0%E9%97%BB%E6%B5%8B%E8%AF%95.txt
            // https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/25/Ref%20%E8%80%8C%E9%9D%9E%20Reactive%EF%BC%9F.doc
            // https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/26/%E9%9F%B3%E9%A2%91%E5%8F%AF%E8%A7%86%E5%8C%96%E6%A1%88%E4%BE%8B.docx
            // https://wang-1259575362.cos.ap-guangzhou.myqcloud.com/File/2025/02/26/%E5%9E%82%E9%92%93.pdf
            resolve()
        }).catch((error: any) => {
            reject(error)
        })
      })
    }

    /**
     * 登录弹窗
     * 
    */
    const isLoginOpen = ref(false);

    const openLogin = () => {
        isLoginOpen.value = true;
    };
   
    const closeLogin = () => {
        isLoginOpen.value = false;
    };

    // 修改可见权限
    const isShowPublicTypeList = ref(false);
    const publicTypeList = ref([
        { value: 1, label: '所有人可见' },
        { value: 2, label: '仅互关可见' },
        { value: 3, label: '仅自己可见' },
    ]);
    const findPublicTypeFun = (item: any) => {
        details.value.publicType = item.value;
        isShowPublicTypeList.value = false;
        handleWorksUpdateFun(2, item.value);
    };

    const findOpenPublicTypeList = () => {
        isShowPublicTypeList.value = !isShowPublicTypeList.value;
    }; 

     // 统计
    const getStatis = ref({
        followNum: 0,
        commentNum: 0,
        shareNum: 0,
        isShare: 0,
        isFollow: 0
    });
    const findWorksRightCount = () => {
        const resData = {
            id: details.value.workId
        }
        return new Promise<void>((resolve, reject) => {
            worksRightCount(resData).then((response: any) => {
                const { code, data, message } = response;
                const resultData = data;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                getStatis.value = resultData;
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    // 转发
    const handleForwarding = () => {
        const currentUrl = window.location.href; // 获取当前页面的 URL
        shareLink.value = currentUrl;
        copyContent(currentUrl);
        isShareList.value = !isShareList.value;
        findShareListFun();
    };

    /** 点击复制NFT **/
    const copyContent = async (url: string) => {
        await copyToClipboard(url);
    };

    // 我的互关好友列表
    const findShareListFun = () => {
        let reqData = {
            id: details.value.workId,
            businessType: 2
        }
        return new Promise<void>((resolve, reject) => {
            usersFollowMutual(reqData).then((response: any) => {
                const { code, data, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                shareListData.value = data;
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    const findShareFun = (id: any) => {
        const { isShare } = getStatis.value;
        if(isShare == 1) return;
        const resData = {
            id: details.value.workId
        }
        return new Promise<void>((resolve, reject) => {
            worksShare(resData).then((response: any) => {
                const { code, data, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                isShareList.value = false;
                findWorksRightCount();
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    // 点赞
    const findFollowAddFun = () => {
        const { isFollow } = getStatis.value;
        let reqData = {
            id: details.value.workId,
            businessType: 2
        }
        if (isFollow !== 1) {
            return new Promise<void>((resolve, reject) => {
                worksFollowAdd(reqData).then((response: any) => {
                    const { code, message } = response;
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    findWorksRightCount();
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        } else {
            return new Promise<void>((resolve, reject) => {
                worksFollowCancel(reqData).then((response: any) => {
                    const { code, message } = response;
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    findWorksRightCount();
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        }
    }

    // 获取共创者数据
    const findWorksCoCreatorFun = () => {
      const resData = {
        id: details.value.workId
      }
      return new Promise<void>((resolve, reject) => {
        worksCoCreator(resData).then((response: any) => {
            const { code, data, message } = response;
            const resultData = data;
            if (code !== 200) {
                showPopup(message, 'error', 3000);
                return;
            }
            applyListData.value = resultData;
            resolve()
        }).catch((error: any) => {
            reject(error)
        })
      })
    }

    // 打开共创者弹框
    watch(() => worksInfo.isCoCreator, (newValue) => {
        isApplyList.value = newValue;
    });

    const findCoCreatorFun = () => {
        isApplyList.value = false;
        worksInfo.isCoCreator = false;
    };

    // 关注、取关
    const findUserFollowAddFun = (type: number, userId: any) => {
        let reqData = {
            followUserId: userId.value,
        }
        if(type !== 1) {
            return new Promise<void>((resolve, reject) => {
                followCancel(reqData).then((response: any) => {
                    const { code, message } = response;
                    
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    showPopup('关注成功', 'success', 3000);
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        } else {
            return new Promise<void>((resolve, reject) => {
                followAdd(reqData).then((response: any) => {
                    const { code, message } = response;
                    
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    showPopup(message, 'success', 3000);
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        }
    }

    // 查看用户个人中心
    const findViewPersonalInfo = (userId: any) => {
        userInfo.othersId = userId;
        router.push('/PersonalHomepage');
        // window.open(`${window.location.origin}/personalHomepage`, '_blank');
    };

    // 显示弹框
    const isShowCommunity = ref(false);
    // 显示评论弹框
    const findShowCommunity = () => {
        isType.value = 2;
        isShowCommunity.value = !isShowCommunity.value;
    };

    // 打开详情弹框
    const findUnpackFun = () => {
        isType.value = 1;
        isShowCommunity.value = !isShowCommunity.value;
    };

    // 关闭消息弹框
    const findBack = () => {
        isType.value = 0;
        isShowCommunity.value = !isShowCommunity.value;
    };
    // 关闭消息弹框
    const findCommentModuleBack = () => {
        isType.value = 0;
        isShowCommunity.value = !isShowCommunity.value;
    };

    // 作品介绍
    const isShowIntro = ref(false);
    const findOpenIntroClick = () => {
        isShowIntro.value = !isShowIntro.value;
    };
    const findIntroBack = () => {
        isShowIntro.value = !isShowIntro.value;
    };

    // 作品谱系图
    const isShowPedigreeChart = ref(false);
    const findOpenPedigreeChartClick = () => {
        isShowPedigreeChart.value = !isShowPedigreeChart.value;
    };
    const handleNodeSelect = (nodeId: string) => {
        console.log('点击节点:', nodeId)
    }

    const handleNodeDblClick = (nodeId: string) => {
        console.log('双击节点:', nodeId)
    }
    const familyTreeData = {
        id: 1,
        name: 'Root',
        image: '/src/assets/opia.jpeg',
        children: [
            {
                id: 2,
                name: 'Child 1',
                image: task001,
                children: [
                    { id: 3, name: 'Grandchild 1', image: task002 },
                    { id: 4, name: 'Grandchild 2', image: task003 },
                    {
                        id: 5,
                        name: 'Grandchild 3',
                        image: task001,
                        children: [
                            { id: 6, name: 'Great-Grandchild 1', image: task002 },
                            { id: 7, name: 'Great-Grandchild 2', image: task003 },
                            {
                                id: 8,
                                name: 'Great-Grandchild 3',
                                image: task001,
                                children: [
                                    { id: 9, name: 'Great-Great-Grandchild 1', image: task002 },
                                    { id: 10, name: 'Great-Great-Grandchild 2', image: task003 },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]
    }

    // 关闭弹框
    const findClosePopupFun = () => {
        isMOOps.value = false;
        isShowPublicTypeList.value = false;
    }

    // 更多
    interface MoopsItem {
        type: number;
        icon: string;
        name: string;
        className?: string;
        action: () => void;
    }
    const isMOOps = ref(false);
    const moopsList = ref<MoopsItem[]>([]); // 显式指定类型为 MoopsItem[]
    // 点击更多按钮，根据访问用户生成操作按钮并展开操作列表
    const handleMOOps = () => {
        moopsList.value = generateMoopsList();
        isMOOps.value = !isMOOps.value;
    };
    
    // 生成操作按钮列表
    const generateMoopsList = (): MoopsItem[] => {
        const isCreator = userInfo.id === details.value.userId; // 判断当前用户是否为创作者
        const list: MoopsItem[] = []; // 显式指定类型为 MoopsItem[]

        if (isCreator) {
            // 创作者逻辑
            if (details.value.isCommercial === 1) {
                // 收费作品
                if (details.value.isOnSell === 1) {
                    list.push({
                    type: 1,
                    icon: 'icon-xiajia24',
                    name: '下架',
                    action: () => handleOffShelf(),
                    });
                } else {
                    list.push({
                    type: 1,
                    icon: 'icon-xiajia24',
                    name: '上架',
                    action: () => handleOnShelf(),
                    });
                }
            }
            list.push({
                type: 1,
                icon: 'icon-shanchulajitong24',
                name: '删除',
                action: () => isDeleteWorks.value = true,
            });
        } else {
            // 普通用户逻辑
            list.push({
                type: 2,
                icon: 'icon-xiazai24',
                name: '下载源件',
                className: details.value.attachmentUrl ? 'white' : 'gray',
                action: () => handleDownload(),
            });
            if (details.value.isCommercial === 0) {
                if(details.value.allowRecreate == 1) {
                    list.push({
                        type: 2,
                        icon: 'icon-erchuang24',
                        name: details.value.hasAddRecreate == 0 ? '加入二创' : '已加二创库',
                        className: details.value.hasAddRecreate == 0 ? 'white' : 'gray',
                        action: () => handleJoinRecreate(),
                    });
                }
            }
        }

        return list;
    };
    
    // 点击事件处理函数
    // 上架操作
    const handleOnShelf = () => {
        handleWorksUpdateFun(1, 1);
    };

    // 下架操作
    const handleOffShelf = () => {
        handleWorksUpdateFun(1, 0);
    };

    // 删除操作
    const handleDelete = () => {
        handleWorksUpdateFun(3, null);
    };

    // 作品上下架、可见权限、删除 type:1上下架 2可见权限 3删除  isOnSell：上架1 下架0  publicType：可见权限：1所有人 2仅互关 3仅自己
    const handleWorksUpdateFun = (type: number, status: number | null) => {
        const resData = {
            workId: details.value.workId,
            updateType: type,
            isOnSell: null as number | null,
            publicType: null as number | null,
            isDelete: null as number | null,
        }
        if(type === 1) {
            resData.isOnSell = status;
        } else if(type === 2) {
            resData.publicType = status;
        } else if(type === 3) {
            resData.isDelete = 1;
        }
        return new Promise<void>((resolve, reject) => {
            worksUpdate(resData).then((response: any) => {
                const { code, data, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                isMOOps.value = false;
                findWorksDetailsFun();
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    // 下载源件操作
    const handleDownload = () => {
        if (details.value.attachmentUrl) {
            const imgURL = details.value.attachmentUrl;
            const link = document.createElement('a');
            link.href = imgURL;
            link.download = 'image.jpg';
            link.click();
        }
    };

    // 加入二创操作
    const handleJoinRecreate = () => {
        if (details.value.hasAddRecreate == 0) {
            const resData = {
                workId: details.value.workId,
            }
            return new Promise<void>((resolve, reject) => {
                worksRecreate(resData).then((response: any) => {
                    const { code, data, message } = response;
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    findWorksDetailsFun();
                    handleMOOps();
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        }
    };


    // 购买
    const showPurchase = ref(false)
    const findShowPopupModal = () => {
        showPurchase.value = true
    }

    const handlePurchase = (order: any) => {
        let getData = {
            workId: details.value.workId,
            amount: order.amount,
            buyType: order.buyType,
            buyNum: order.buyNum,
        }
        payFee(17, getData)
    }
    /** 支付信息 **/
    const payData = ref({
        isPay: false,
        type: 1,
        payAmount: 0, // 总金额
        poundage: 0,  // 手续费
        mps: 0,  // 质押金
        createTime: '', // 创建时间
        minute: '', // 有效分钟
        payUrl: ''
    });

    // 关闭支付弹框
    const closePayModal = () => {
        clearTimeout(timer);
        payData.value.isPay = false;
        router.replace({ path: router.currentRoute.value.path });
        router.go(0);
    }


    // 创建支付订单
    const orderNo = ref(''); // 订单号
    const payType = ref(1); // 支付类型 1支付宝
    const payFee = (type: number, taskData: any) => {
        let timestamp = Date.now();
        let content = type + taskData.amount + '0' + timestamp;
        let userId = '';
        if(userStore.userInfo.id !== '') {
            userId = userStore.userInfo.id;
        } else {
            userId = getItem('id');
        }

        let reqData = {
        businessData: taskData,
        businessType: type,
        amount: taskData.amount,
        poundage: 0,
        timeStamp: timestamp,
        payType: payType.value,
        sign: computeHmac(content.toString(), userId.toString())
        };
        return new Promise<void>((resolve, reject) => {
            orderSave(reqData).then((response: any) => {
                const { code, data, message } = response;
                
                const resultData = data;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                payData.value.minute = resultData.minute;
                payData.value.createTime = resultData.createTime;
                orderNo.value = resultData.orderNo;
                payData.value.payUrl = resultData.qrcode;
                payData.value.payAmount = Number(taskData.amount) * Number(taskData.buyNum);
                payData.value.isPay = true;
                findOrderResult();
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
        
    }

    // 查询订单结果
    const isActive = ref(true); // 使用 ref 存储活动状态
    let timer: number | undefined; // 定义定时器变量
    const findOrderResult = async () => {
        const getData = { orderNo: orderNo.value };

        const retry = async () => {
        if (!isActive.value) return; // 如果活动状态为 false，退出重试

        try {
            const response = await orderQuery(getData);
            const { code, data, message } = response;

            if (code === 200) {
                if(payType.value == 1) {
                    if(data.orderStatus == 'TRADE_SUCCESS') {
                        showPopup(message, 'success', 3000);
                        payData.value.isPay = false;
                        clearTimeout(timer);
                        isActive.value = false;
                        showPurchase.value = false;
                        findWorksDetailsFun();
                    } else{
                        showPopup('订单失败', 'error', 3000);
                    }
                } else {
                    if (data.orderStatus == 2) {
                        showPopup(message, 'success', 3000);
                        payData.value.isPay = false;
                        clearTimeout(timer);
                        isActive.value = false;
                    } else if (data.orderStatus == 4) {
                        showPopup(message, 'error', 3000);
                        payData.value.isPay = false;
                        clearTimeout(timer);
                        isActive.value = false;
                    } else if (data.orderStatus == 7) {
                        showPopup('订单已关闭', 'error', 3000);
                        payData.value.isPay = false;
                        clearTimeout(timer);
                        isActive.value = false;
                    } else {
                        timer = setTimeout(retry, 10000); // 继续重试
                    }
                } 
            }
            else if(code === 500) {
                showPopup(message, 'error', 3000);
                return false;
            } else {
            showPopup(message, 'error', 3000);
            timer = setTimeout(retry, 10000); // 继续重试
            }
            
        } catch (error) {
            console.error('Error fetching order:', error);
            timer = setTimeout(retry, 10000); // 继续重试
        }
        };

        retry();
    };
    


    /** 交易记录 **/
    const isStr = ref(false);
    const buyListCount = ref({
        sellNum: 0,
        sellSum: 0,
        sellOneNum: 0,
        sellOneSum: 0,
        sellTwoNum: 0,
        sellTwoSum: 0,
    });

    const columns = ref([
        {
            prop: 'userInfo',
            label: '作品购买者',
            width: '260px',
            sortable: true
        },
        {
            prop: 'buyType',
            label: '全部类型',
            width: '90px',
            filterable: true,
            filterOptions: [
            { value: '', label: '全部', count: 0 },
            { value: 'normal', label: '普通型', count: 0 },
            { value: 'enhanced', label: '增强型', count: 0 }
            ]
        },
        {
            prop: 'buyPrice',
            label: '购买价格',
            width: '90px',
            sortable: true
        },
        {
            prop: 'buyNum',
            label: '购买数量',
            width: '90px',
            minWidth: '90px'
        },
        {
            prop: 'buyTime',
            label: '购买时间',
            width: '90px',
            minWidth: '90px'
        }
    ]);

    const findStrPopupModal = () => {
        findworksBuyListCountFun();
        isStr.value = !isStr.value;
    };

    // 作品交易记录统计
    const findworksBuyListCountFun = () => {
        const resData = {
            id: details.value.workId
        }
        return new Promise<void>((resolve, reject) => {
            worksBuyListCount(resData).then((response: any) => {
                const { code, data, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                buyListCount.value = data;

                // 更新 filterOptions 中的 count
                columns.value[1].filterOptions = [
                    { value: '', label: '全部', count: buyListCount.value.sellNum },
                    { value: 1, label: '普通型', count: buyListCount.value.sellOneNum },
                    { value: 2, label: '增强型', count: buyListCount.value.sellTwoNum }
                ];
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    }

    const loadMoreData = async (page: number, pageSize: number, filters: number) => {
        try {
            // 构造请求参数
            const getData = {
                id: details.value.workId,
                pageNum: page,
                pageSize: pageSize,
                buyType: filters == 0 ? '' : filters
            };

            // 调用后台接口获取数据
            const response = await worksBuyList(getData);
            const { code, data, message } = response;

            // 处理接口返回的数据
            if (code !== 200) {
                showPopup(message, 'error', 3000);
                return { data: [], total: 0, pages: 0 };
            }

            // 返回分页后的数据
            return {
                data: data.rows, // 假设返回的数据结构中有 list 字段
                total: data.total, // 假设返回的数据结构中有 total 字段
                pages: Math.ceil(data.total / pageSize)
            };
        } catch (error) {
            console.error('Error fetching data:', error);
            showPopup('数据加载失败', 'error', 3000);
            return { data: [], total: 0, pages: 0 };
        }
    };

    // Edit row handler
    const editRow = (row: any) => {
      console.log('编辑行:', row);
    };

    // Delete row handler
    const deleteRow = (row: any) => {
      console.log('删除行:', row);
    };

    // Error message state
    const errorMessage = ref<string>('');

    // Handle error event from GenericTable
    const handleError = (msg: string) => {
      errorMessage.value = msg;
      setTimeout(() => {
        errorMessage.value = '';
      }, 3000);
    };

    // Map status values to display text
    const statusText = (status: string) => {
      const statusMap: Record<string, string> = {
        1: '普通型',
        2: '增强型'
      };
      return statusMap[status] || status;
    };

    /*************** 上滑下滑切换作品 ********************/
    const SCROLL_THRESHOLD = 30;
    const startY = ref(0);
    let isScrolling = false;

    const isSlidingEnabled = () => {
        return worksInfo.isRouterType !== 3 && !isWorksListEmpty();
    };

    const isWorksListEmpty = () => !worksInfo.worksIdList || worksInfo.worksIdList.length === 0;

    const findWorksListFun = async (params: any) => {
        return await worksList(params);
    };

    const findWorksMineListFun = async (params: any) => {
        return await worksMineList(params);
    };

    const loadPreviousPage = async () => {
        if (worksInfo.params.pageNum <= 1) {
            showPopup('已经是第一条数据了', 'info', 3000);
            return;
        }
        const newPageNum = worksInfo.params.pageNum - 1;
        const getData = { ...worksInfo.params, pageNum: newPageNum };
        try {
            const response = worksInfo.isRouterType === 1
            ? await findWorksListFun(getData)
            : await findWorksMineListFun(getData);

            if (response.code === 200) {
            const newIds = worksInfo.isRouterType === 1
                ? response.data.rows.map((item: any) => item.workId)
                : response.data.workDTOS.map((item: any) => item.workId);
            worksInfo.worksIdList = [...new Set([...newIds, ...worksInfo.worksIdList])];
            worksInfo.params.pageNum = newPageNum;
            }
        } catch (error) {
            showPopup('加载上一页失败', 'error', 3000);
        }
    };

    const loadNextPage = async () => {
        const newPageNum = worksInfo.params.pageNum + 1;
        const getData = { ...worksInfo.params, pageNum: newPageNum };
        try {
            const response = worksInfo.isRouterType === 1
            ? await findWorksListFun(getData)
            : await findWorksMineListFun(getData);

            if (response.code === 200) {
            const dataArray = worksInfo.isRouterType === 1
                ? response.data.rows
                : response.data.workDTOS;
            if (dataArray.length === 0) {
                showPopup('没有更多数据了', 'info', 3000);
                return;
            }
            const newIds = dataArray.map((item: any) => item.workId);
            worksInfo.worksIdList = [...new Set([...worksInfo.worksIdList, ...newIds])];
            worksInfo.params.pageNum = newPageNum;
            }
        } catch (error) {
            showPopup('加载下一页失败', 'error', 3000);
        }
    };

    const getCurrentWorkIndex = () => {
        if (isWorksListEmpty()) return -1;
        const currentWorkId = details.value.workId;
        return worksInfo.worksIdList.findIndex(id => id === currentWorkId);
    };

    const navigateToWork = (workId: number) => {
        console.log('切换到的作品ID:', workId);
        if (worksInfo.currentId !== workId) {
            worksInfo.currentId = workId;
            findWorksDetailsFun();
        } else {
            console.log('作品ID未变化，无需切换');
        }
    };

    const handlePreviousWork = () => {
        if (!isSlidingEnabled()) {
            console.log('滑动功能未启用');
            return;
        }
        const currentIndex = getCurrentWorkIndex();
        console.log('当前索引:', currentIndex, 'worksIdList:', worksInfo.worksIdList);
        if (currentIndex === -1) {
            console.log('当前作品不在列表中');
            return;
        }
        if (currentIndex === 0) {
            showPopup('已经是第一条数据了', 'info', 3000);
            return;
        }
        if (currentIndex === 1 && worksInfo.params.pageNum > 1) {
            loadPreviousPage().then(() => {
            const previousWorkId = worksInfo.worksIdList[currentIndex - 1];
            navigateToWork(previousWorkId);
            });
        } else if (currentIndex > 0) {
            const previousWorkId = worksInfo.worksIdList[currentIndex - 1];
            navigateToWork(previousWorkId);
        }
    };

    const handleNextWork = () => {
        if (!isSlidingEnabled()) {
            console.log('滑动功能未启用');
            return;
        }
        const currentIndex = getCurrentWorkIndex();
        console.log('当前索引:', currentIndex, 'worksIdList:', worksInfo.worksIdList);
        if (currentIndex === -1) {
            console.log('当前作品不在列表中');
            return;
        }
        if (currentIndex === worksInfo.worksIdList.length - 1) {
            showPopup('没有更多数据了', 'info', 3000);
            return;
        }
        if (currentIndex === worksInfo.worksIdList.length - 2) {
            console.log('加载下一页，当前 pageNum:', worksInfo.params.pageNum);
            loadNextPage().then(() => {
            const nextWorkId = worksInfo.worksIdList[currentIndex + 1];
            console.log('下一页加载完成，切换到作品ID:', nextWorkId);
            navigateToWork(nextWorkId);
            });
        } else if (currentIndex < worksInfo.worksIdList.length - 1) {
            const nextWorkId = worksInfo.worksIdList[currentIndex + 1];
            console.log('切换到下一个作品ID:', nextWorkId);
            navigateToWork(nextWorkId);
        }
    };

    const handlePointerStart = (event: PointerEvent) => {
        if (!isSlidingEnabled()) return;
        // 确保只处理单点操作
        if (event.pointerType === 'touch' && event.isPrimary === false) {
            console.log('检测到多点触控，忽略');
            return;
        }
        startY.value = event.clientY;
        isScrolling = true;
        event.preventDefault();
        closeGuide();
    };

    const handlePointerMove = (event: PointerEvent) => {
        if (!isScrolling) return;
        event.preventDefault();
        const currentY = event.clientY;
    };

    const handlePointerEnd = (event: PointerEvent) => {
        if (!isScrolling) {
            console.log('isScrolling 为 false，退出 handlePointerEnd');
            return;
        }
        const endY = event.clientY;
        const deltaY = endY - startY.value;
        // 如果滑动距离太小，可能是快速点击，不触发切换
        if (Math.abs(deltaY) < 10) {
            console.log('滑动距离过小，可能是快速点击，忽略');
            isScrolling = false;
            return;
        }

        if (Math.abs(deltaY) >= SCROLL_THRESHOLD) {
            if (deltaY > 0) {
            console.log('向上滑动/拖动');
            handlePreviousWork();
            } else {
            console.log('向下滑动/拖动');
            handleNextWork();
            }
        } else {
            console.log('滑动距离不足，未触发切换，deltaY:', deltaY, 'SCROLL_THRESHOLD:', SCROLL_THRESHOLD);
        }
        isScrolling = false;
    };

    const handlePointerCancel = (event: PointerEvent) => {
        console.log('pointercancel 触发，操作被取消，pointerType:', event.pointerType);
        isScrolling = false;
    };

    const bindEvents = () => {
        const displayArea = document.querySelector('.displayArea-content') as HTMLElement | null;
        if (displayArea) {
            console.log('找到 .displayArea-content 元素，开始绑定 Pointer 事件');
            if (worksInfo.isRouterType !== 3) {
            const pointerDownHandler = (e: PointerEvent) => {
                handlePointerStart(e);
            };
            const pointerMoveHandler = (e: PointerEvent) => {
                handlePointerMove(e);
            };
            const pointerUpHandler = (e: PointerEvent) => {
                handlePointerEnd(e);
            };
            const pointerCancelHandler = (e: PointerEvent) => {
                handlePointerCancel(e);
            };

            displayArea.addEventListener('pointerdown', pointerDownHandler, { passive: false });
            displayArea.addEventListener('pointermove', pointerMoveHandler, { passive: false });
            document.addEventListener('pointerup', pointerUpHandler, { passive: false });
            document.addEventListener('pointercancel', pointerCancelHandler, { passive: false });

            // 存储事件处理函数
            displayArea._pointerDownHandler = pointerDownHandler;
            displayArea._pointerMoveHandler = pointerMoveHandler;
            displayArea._pointerUpHandler = pointerUpHandler;
            displayArea._pointerCancelHandler = pointerCancelHandler;
            } else {
            console.log('isRouterType === 3，滑动功能已禁用');
            }
        } else {
            console.error('未找到 .displayArea-content 元素，无法绑定滑动事件');
        }
    };

    const unbindEvents = () => {
        const displayArea = document.querySelector('.displayArea-content') as HTMLElement | null;
        if (displayArea) {
            if (displayArea._pointerDownHandler) {
            displayArea.removeEventListener('pointerdown', displayArea._pointerDownHandler);
            displayArea.removeEventListener('pointermove', displayArea._pointerMoveHandler!);
            document.removeEventListener('pointerup', displayArea._pointerUpHandler!);
            document.removeEventListener('pointercancel', displayArea._pointerCancelHandler!);

            // 清理存储的事件处理函数
            displayArea._pointerDownHandler = undefined;
            displayArea._pointerMoveHandler = undefined;
            displayArea._pointerUpHandler = undefined;
            displayArea._pointerCancelHandler = undefined;
            }
        }
    };

    watch(() => details.value.workId, (newId) => {
        if (newId) {
            const currentIndex = getCurrentWorkIndex();
            console.log(`当前作品ID: ${newId}, 在列表中位置: ${currentIndex + 1}/${worksInfo.worksIdList.length}`);
        }
    });

    // 苹果电脑端滑动事件
    const handleTouchStart = (event: TouchEvent) => {
        if (!isSlidingEnabled()) return;
        startY.value = event.touches[0].clientY;
        isScrolling = true;
    };

    const handleTouchMove = (event: TouchEvent) => {
        if (!isScrolling) return;
        const currentY = event.touches[0].clientY;
        const deltaY = currentY - startY.value;
        if (Math.abs(deltaY) >= SCROLL_THRESHOLD) {
            if (deltaY > 0) {
                console.log('向上滑动');
                handlePreviousWork();
            } else {
                console.log('向下滑动');
                handleNextWork();
            }
            isScrolling = false;
        }
    };

    const handleTouchEnd = () => {
        isScrolling = false;
    };

    const bindTouchEvents = () => {
        const displayArea = document.querySelector('.displayArea') as HTMLElement | null;
        if (displayArea) {
            displayArea.addEventListener('touchstart', handleTouchStart, { passive: false });
            displayArea.addEventListener('touchmove', handleTouchMove, { passive: false });
            displayArea.addEventListener('touchend', handleTouchEnd, { passive: false });
        }
    };

    const unbindTouchEvents = () => {
        const displayArea = document.querySelector('.displayArea') as HTMLElement | null;
        if (displayArea) {
            displayArea.removeEventListener('touchstart', handleTouchStart);
            displayArea.removeEventListener('touchmove', handleTouchMove);
            displayArea.removeEventListener('touchend', handleTouchEnd);
        }
    };

    // 使用 wheel 事件处理鼠标滚轮滑动
    const handleWheel = (event: WheelEvent) => {
        if (!isSlidingEnabled()) return;
        const deltaY = event.deltaY;
        if (Math.abs(deltaY) >= SCROLL_THRESHOLD) {
            if (deltaY > 0) {
                console.log('向下滑动/滚动');
                handleNextWork();
            } else {
                console.log('向上滑动/滚动');
                handlePreviousWork();
            }
        }
    };

    const bindWheelEvent = () => {
        const displayArea = document.querySelector('.displayArea') as HTMLElement | null;
        if (displayArea) {
            displayArea.addEventListener('wheel', handleWheel, { passive: false });
        }
    };

    const unbindWheelEvent = () => {
        const displayArea = document.querySelector('.displayArea') as HTMLElement | null;
        if (displayArea) {
            displayArea.removeEventListener('wheel', handleWheel);
        }
    };

    const handleOutsideClick = (event) => {
        const popupModal = document.querySelector('.popupModal');
        const personInChargeCenter = document.querySelector('.personInCharge-center');
        const strPopup = document.querySelector('.strPopup');

        if (popupModal && !personInChargeCenter?.contains(event.target) && !strPopup?.contains(event.target)) {
            // isApplyList.value = false;
            // isShareList.value = false;
            // isStr.value = false;
            isMOOps.value = false;
            isShowIntro.value = false;
            isShowPedigreeChart.value = false;
            isShowCommunity.value = false;
        }
    };


    onMounted(() => {
        findWorksDetailsFun().then(() => {
            console.log('worksInfo.worksIdList:', worksInfo.worksIdList);
            console.log('当前作品ID:', details.value.workId);
            console.log('当前索引:', getCurrentWorkIndex());
        });
        initAOS();
        nextTick(() => {
            bindEvents();
        });
        let isShow = localStorage.getItem('seenSwipeGuide');
        console.log("localStorage.getItem('seenSwipeGuide')", localStorage.getItem('seenSwipeGuide'));
        if (isShow !== null) {
            hasSeenGuide.value = isShow === 'true';
        } else {
            hasSeenGuide.value = true;
        }
        bindTouchEvents();
        bindWheelEvent();
        document.addEventListener('click', handleOutsideClick);
    });

    onBeforeUnmount(() => {
        unbindEvents();
        unbindTouchEvents();
        unbindWheelEvent();
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleOutsideClick);
    });
  </script>
   
  <style lang="scss" scoped>
    @use '@/assets/styles/common.scss';
    @use '@/assets/styles/popupModal.scss';
    @use '@/assets/styles/worlsDetails.scss';
    * { margin: 0; padding: 0; }
    html,body {
      width: 100%;
      height: 100%;
    }
    .arco-space {
      display: inherit;
    }
    .highlight-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; /* 禁止事件穿透 */
    }
    .exhibit-publish-name{
        width: 70px;
        margin: 0 auto;
        border-radius: 8px;
        cursor: pointer;
    }

    .purchaser-info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 12px;
        object-fit: cover;
        }
            
        .purchaser-details {
        line-height: 1.4;
            .purchaser-name {
            font-weight: 600;
            color: #e2e8f0;
            white-space: nowrap; // 防止文字换行
            }
            
            .purchaser-id {
            font-size: 14px;
            color: #fff;
            white-space: nowrap; // 防止文字换行
            }
        }
    }
    .popupModal{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        clip-path: inset(0 0 0 0); /* 限制蒙版显示范围 */
        .strPopup{
            width: 640px;
            margin: 0;
            padding: 0;
            border-radius: 28px;
            .generic-table-container{
                border-radius: 28px;
            }
        }
    }
  </style>
