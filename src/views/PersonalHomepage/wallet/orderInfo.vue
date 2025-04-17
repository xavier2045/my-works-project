<template>
    <div class="popupModal" @click="findCloseModule">
      <div class="modal-mask"></div>
      <div class="popupModal-wrapper user-info" @click.stop>
        <div class="popupModal-wapper-center">
          <div class="popupModal-wrapper-mask"></div>
          <div class="orderInfo">
            <div class="orderInfo-content">
              <div class="orderInfo-content-main">
                <div class="main-title">{{ title }}</div>
                <div class="main-price">
                  <span>{{ orderData.isIncome == 0 ? '-' : '+' }}</span>¥{{ orderData.totalAmount }}
                </div>
                <div class="main-line"></div>
                <div class="main-item" v-for="(item, index) in items" :key="index">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-val multi-line-1">
                    {{ formatFieldValue(item.fields) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
import { ref, defineComponent } from 'vue';
import { aeUseStore } from '@/stores/user';

export default defineComponent({
  name: 'orderInfo',
  props: {
    type: {
      type: Number,
      default: 1,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ['back'],
  setup(props, { emit }) {
    const userStore = aeUseStore();
    const isType = ref(props.type);
    const orderData = ref(props.data);
    const title = ref('');
    const items = ref<{ name: string; fields: string }[]>([]);

    // 初始化字段列表
    const initList = () => {
      const commonFields = [
        { name: '订单状态', fields: 'status' },
        { name: '订单编号', fields: 'orderNo' },
        { name: '订单时间', fields: 'createTime' },
      ];

      if (isType.value === 1) {
        if (orderData.value.flowType === 1) {
          title.value = '发布任务';
          items.value = [
            { name: '手续费', fields: 'totalAmount' },
            { name: '任务名称', fields: 'name' },
            { name: '付款方式', fields: 'payType' },
            { name: '收款方', fields: 'username' },
            ...commonFields,
          ];
        } else if (orderData.value.flowType === 2) {
          title.value = orderData.value.isIncome === 0 ? '指定任务责任人' : '参与任务';
          items.value = [
            { name: orderData.value.isIncome === 0 ? '质押金' : '任务报酬', fields: 'totalAmount' },
            { name: '任务名称', fields: 'name' },
            { name: '付款方式', fields: 'payType' },
            { name: orderData.value.isIncome === 0 ? '收款方' : '付款方', fields: 'username' },
            ...commonFields,
          ];
        } else if ([3, 4].includes(orderData.value.flowType)) {
          title.value = '创建团队';
          items.value = [
            { name: '手续费', fields: 'totalAmount' },
            { name: '团队名称', fields: 'name' },
            { name: '付款方式', fields: 'payType' },
            { name: '收款方', fields: 'username' },
            ...commonFields,
          ];
        } else if (orderData.value.flowType === 5) {
          title.value = '创建子任务';
          items.value = [
            { name: '手续费', fields: 'totalAmount' },
            { name: '任务名称', fields: 'name' },
            { name: '付款方式', fields: 'payType' },
            { name: '收款方', fields: 'username' },
            ...commonFields,
          ];
        } else if (orderData.value.flowType === 6 || orderData.value.flowType === 7) {
          title.value = orderData.value.isIncome === 0 ? '指定子任务责任人' : '参与子任务';
          items.value = [
            { name: orderData.value.isIncome === 0 ? '质押金' : '任务报酬', fields: 'totalAmount' },
            { name: '任务名称', fields: 'name' },
            { name: '付款方式', fields: 'payType' },
            { name: orderData.value.isIncome === 0 ? '收款方' : '付款方', fields: 'username' },
            ...commonFields,
          ];
        }
      } else {
        if (orderData.value.flowType === 1) {
          title.value = '发布作品';
          items.value = [
            { name: '手续费', fields: 'totalAmount' },
            { name: '作品名称', fields: 'name' },
            { name: '作品类型', fields: 'isCommercial' },
            { name: '付款方式', fields: 'payType' },
            { name: '收款方', fields: 'username' },
            ...commonFields,
          ];
        } else if (orderData.value.flowType === 2) {
          title.value = orderData.value.isIncome === 0 ? '购买作品' : '出售作品';
          items.value = [
            { name: '订单金额', fields: 'totalAmount' },
            { name: '作品名称', fields: 'name' },
            { name: '作品类型', fields: 'isCommercial' },
            { name: '付款方式', fields: 'payType' },
            { name: orderData.value.isIncome === 0 ? '付款方' : '收款方', fields: 'username' },
            ...commonFields,
          ];
        } else if (orderData.value.flowType === 3) {
          title.value = orderData.value.isIncome === 0 ? '分成支出' : '抽佣收入';
          items.value = [
            { name: '订单金额', fields: 'totalAmount' },
            { name: '作品名称', fields: 'name' },
            { name: '作品类型', fields: 'isCommercial' },
            { name: orderData.value.isIncome === 0 ? '付款方式' : '收款方式', fields: 'payType' },
            { name: orderData.value.isIncome === 0 ? '收款方' : '付款方', fields: 'username' },
            ...commonFields,
          ];
        } else if (orderData.value.flowType === 4) {
          title.value = '余额提现';
          items.value = [
            { name: '订单金额', fields: 'totalAmount' },
            { name: '提现方式', fields: 'withdrawWay' },
            ...commonFields,
          ];
        }
      }
    };

    // 格式化字段值
    const formatFieldValue = (field: string) => {
      if (field === 'totalAmount') {
        return orderData.value[field];
      }

      if (field === 'payType') {
        if (isType.value === 1) {
          return orderData.value.payWay === 1 ? '积分支付' : '人民币支付';
        } else {
          return orderData.value.username; // 根据 UI 图，payType 在 isType=2 时显示 username
        }
      }

      if (field === 'isCommercial' && isType.value === 2) {
        if (orderData.value.flowType === 1) {
          return orderData.value[field] === 0 ? '普通类' : '商用类';
        } else {
          return orderData.value.buyType === 1 ? '商业类-普通型' : `商业类-商用型x${orderData.value.buyNum}`;
        }
      }

      if (field === 'status') {
        return orderData.value[field] === 1 ? '提现中' : orderData.value[field] === 2 ? '成功' : orderData.value[field] === 3 ? '失败' : '';
      }

      if (field === 'orderNo' || field === 'createTime') {
        return orderData.value[field];
      }

      // 默认返回值
      return orderData.value[field] || '';
    };

    // 关闭弹窗
    const findCloseModule = () => {
      emit('back');
    };

    // 初始化
    initList();

    return {
      items,
      isType,
      title,
      orderData,
      findCloseModule,
      formatFieldValue,
    };
  },
});
</script>
  
  <style lang="scss" scoped>
    .popupModal{
        width: calc(100% - 740px);
        height: calc(100% - 158px);
        position: fixed;
        top: 158px;
        left: 530px;
        right: 0;
        bottom: 0;
        z-index: 10;
        clip-path: inset(0 0 0 0); /* 限制蒙版显示范围 */
        .masking, .modal-mask{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0,0,0,0);
        }
        .popupModal-wrapper{
            width: 350px;
            height: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .popupModal-wapper-center{
                position: relative;
                border-radius: 24px;
                overflow: hidden;
                padding: 20px;
                border: 1px solid rgb(255, 255, 255, .38);
                box-shadow: 0px 9px 18px 9px rgb(0, 0, 0, .15);
                .popupModal-wrapper-mask{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(68px);
                }
                .orderInfo{
                    width: 100%;
                    height: auto;
                    .orderInfo-content{
                        width: 100%;
                        height: 100%;
                        .orderInfo-content-main{
                            width: 100%;
                            height: 100%;
                            .main-title{
                                width: 100%;
                                font-weight: 400;
                                font-size: 16px;
                                color: rgb(255, 255, 255, .7);
                                line-height: 1;
                                text-align: center;
                                margin-bottom: 13px;
                            }
                            .main-price{
                                font-weight: 400;
                                font-size: 28px;
                                color: #FFFFFF;
                                line-height: 1;
                                text-align: center;
                            }
                            .main-line{
                                width: 100%;
                                height: 1px;
                                margin: 23px 0 5px 0;
                                background: rgb(0, 0, 0, .15);
                            }
                            .main-item{
                                width: 100%;
                                height: auto;
                                display: flex;
                                font-size: 14px;
                                line-height: 1;
                                margin-top: 13px;
                                .item-name{
                                    width: 70px;
                                    flex-shrink: 0;
                                    margin-right: 20px;
                                    font-weight: 400;
                                    color: rgb(255, 255, 255, .7);
                                    text-align: left;
                                }
                                .item-val{
                                    flex: 1;
                                    width: 0;
                                    font-weight: 400;
                                    font-size: 16px;
                                    color: rgb(255, 255, 255, 1);
                                    text-align: right;
                                    line-height: 1;
                                    .tags-main{
                                        display: flex;
                                        .tags-main-item{
                                            display: inline-block;
                                            .tags-main-item-text{
                                                margin-right: 5px;
                                            }
                                        }
                                        .tags-main-img{
                                            width: 34px;
                                            height: 27px;
                                            border-radius: 2px;
                                        }
                                    }
                                    .coCreators-main{
                                        display: flex;
                                        .coCreators-main-item{
                                            width: 30px;
                                            height: 30px;
                                            font-size: 14px;
                                            color: rgb(255, 255, 255, .7);
                                            line-height: 30px;
                                            text-align: center;
                                            border-radius: 50%;
                                            display: inline-block;
                                            cursor: pointer;
                                            overflow: hidden;
                                            margin: 5px;
                                            .coCreators-main-item-avatar{
                                                width: 80%;
                                                height: 80%;
                                                margin: 10%;
                                                img{
                                                    width: 100%;
                                                    height: 100%;
                                                    display: block;
                                                    border-radius: 50%;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            .main-but{
                                width: 80%;
                                height: 50px;
                                margin: 30px auto 0 auto;
                                border-radius: 12px;
                                .main-but-item{
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    cursor: pointer;
                                    justify-content: center;
                                    i{
                                        font-size: 20px;
                                        color: rgb(255, 255, 255, .7);
                                        line-height: 50px;
                                        display: inline-block;
                                        margin-right: 10px;
                                    }
                                    span{
                                        font-weight: 400;
                                        font-size: 18px;
                                        color: #FFFFFF;
                                        line-height: 50px;
                                        text-align: left;
                                    }
                                }
                            }   
                        }
                    }
                }
            }
        }
    }
</style>
  