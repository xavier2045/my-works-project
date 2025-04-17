<template>
  <div class="postATask">
    <div class="postATask-header">
      <persHeader />
    </div>
    <div class="overlay"></div>
    <div class="postATask-main">
      <!-- <div class="postATask_title">
        <div class="postATask_title_icon">
          <i class="icon font_family icon-fabuxuqiu34"></i>
        </div>
        <div class="postATask_title_name">发布任务</div>
      </div> -->
      <div class="postATask_main">
        <div class="postATask_main_top">
          <div class="postATask_main_top_left">
            <div class="item-main">
              <div class="item-main-flex">
                <div class="item-main-flex-main" :class="{ focused: nameEr }">
                  <div class="item-main-flex-head">
                    <div class="head-main">
                      <div class="item-main-icon">
                        <i class="icon font_family icon-renwumingcheng"></i>
                      </div>
                      <div class="item-main-name">任务名称</div>
                    </div>
                  </div>
                  <div class="item-main-content">
                    <div class="item-main-time">
                      <div class="item-main-time-group">
                        <div class="item-main-slider">
                          <div class="item-main-slider-num">
                            <input
                              type="text"
                              v-model="reqData.name" 
                              maxlength="64"
                              @blur="verifyForm('name')"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-two">
                <div class="item-main-two-l">
                  <div class="item-main-two-l-m" :class="{ focused: payAmountEr }">
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-feiyong24"></i>
                        </div>
                        <div class="item-main-name">任务报酬</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-time-group-input">
                        <div class="item-main-time-group-input-num">
                          <input 
                            type="text"
                            v-model.number="reqData.payAmount" 
                            placeholder=""
                            maxlength="10" 
                            @input="handlePayAmountInput"
                            @blur="verifyForm('payAmount')"
                          />
                        </div>
                        <div class="item-main-time-group-input-unit">元</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main-two-r">
                  <div class="item-main-two-r-m" :class="{ focused: trustValueEr }">
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-xinren24"></i>
                        </div>
                        <div class="item-main-name">信任值</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-time-group-input">
                        <div class="item-main-time-group-input-num">
                          <input 
                            type="text"
                            v-model.number="reqData.trustValue" 
                            placeholder="输入0-100" 
                            maxlength="9"
                            @input="handleInput"
                            @blur="verifyForm('trustValue')"
                          />
                        </div>
                        <div class="item-main-time-group-input-unit"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-pulldown">
                <div class="item-main-pulldown-content">
                  <div class="item-main-pulldown-flex cursorPointer" :class="{ focused: categoryNameEr }">
                    <div class="item-main-pulldown-flex-l">
                      <div class="item-main-pulldown-flex-l-m">
                        <div class="item-main-pulldown-flex-l-m-icon">
                          <i class="icon font_family icon-hangyeleixing24"></i>
                        </div>
                        <div class="item-main-pulldown-flex-l-m-name">所属行业</div>
                      </div>
                    </div>
                    <div class="item-main-pulldown-flex-c" @click.stop="toggleDropdown('modele1')">
                      <div class="item-main-pulldown-flex-c-m">
                        <span class="item-main-pulldown-flex-c-m-name multi-line-1" :title="reqData.categoryName">
                          {{ reqData.categoryName }}
                        </span>
                      </div>
                    </div>
                    <div class="item-main-pulldown-flex-r" @click.stop="toggleDropdown('modele1')">
                      <i 
                        class="icon font_family"
                        :class="currentDropdown === 'modele1' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                      >
                      </i>
                    </div>
                  </div>
                </div>
                <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele1'" @click.stop>
                  <div class="module-content">
                    <div class="module-content-list overflowYAuto">
                      <div 
                        class="module-content-list-item"
                        v-for="(item, index) in indList"
                        :key="index"
                        :class="{ 'item-active': item.id === reqData.categoryId }"
                        @click="findIndListFun(item), verifyForm('categoryName')"
                      >
                        <div class="item-name">{{ item.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-two">
                <div class="item-main-two-l">
                  <div class="item-main-two-l-m" :class="{ focused: dayEr }">
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-rili24"></i>
                        </div>
                        <div class="item-main-name">任务周期</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-time-group-input">
                        <div class="item-main-time-group-input-num">
                          <input 
                            type="text"
                            v-model.number="reqData.day" 
                            placeholder=""
                            maxlength="4" 
                            @input="handleDayInput"
                            @blur="verifyForm('day')"
                          />
                        </div>
                        <div class="item-main-time-group-input-unit">天</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main-two-r">
                  <div class="item-main-two-r-m" :class="{ focused: nodeChangeTimesEr }">
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-jiediankexiugai24"></i>
                        </div>
                        <div class="item-main-name">节点可改</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-time-group-input">
                        <div class="item-main-time-group-input-num">
                          <input 
                            type="text"
                            v-model.number="reqData.nodeChangeTimes" 
                            placeholder="输入0~2"
                            maxlength="1" 
                            @input="findNodeModificationTimes"
                            @blur="verifyForm('nodeChangeTimes')"
                          />
                        </div>
                        <div class="item-main-time-group-input-unit">次</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-two">
                <div class="item-main-two-l" style="position: relative;">
                  <div class="item-main-two-l-m" :class="{ focused: nodePeriodEr }" @click.stop>
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-a-jiedian243"></i>
                        </div>
                        <div class="item-main-name">单节点周期</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-time-group-input">
                        <div class="item-main-time-group-input-num" @click="toggleDropdown('modele4')">
                          <input 
                            type="text"
                            v-model.number="reqData.nodePeriod" 
                            placeholder=""
                            maxlength="3" 
                            @input="handleNumberInput('nodePeriod', $event)"
                            @blur="verifyForm('nodePeriod')"
                            
                          />
                        </div>
                        <div class="item-main-time-group-input-unit" @click.stop="toggleDropdown('modele4')">
                          <i 
                            class="icon font_family"
                            :class="currentDropdown === 'modele4' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                          >
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele4'" @click.stop>
                    <div class="module-content">
                      <div class="module-content-list nodeList">
                        <div class="tips">为了确保任务的明确性，建议您上传各节点的具体标准或要求。</div>
                        <div class="node-content overflowYAuto">
                          <div 
                            class= "node-item"
                            v-for="(item, index) in nodeList" 
                            :key="index"
                          >
                            <div class="node-item-name">
                              <div class="node-item-name-main">
                                <div :class="['node-icon', index === nodeList.length - 1 ? 'last-node-icon' : '']">
                                  <i class="icon font_family icon-rili24"></i>
                                </div>
                                <div class="node-txt">节点{{ item.sort }}</div>
                              </div>
                            </div>
                            <div class="node-item-operation">
                              <div class="operation-main">
                                <template v-if="item.url !== ''">
                                  <div class="operation-but" @click="findSeeNodeUrlFun(item)">查看</div>
                                  <div class="operation-but" @click="findDelNodeUrlFun(index)">删除</div>
                                </template>
                                <template v-else>
                                  <div class="operation-but">
                                    <NodeFileUpload
                                      upload-type="*"
                                      :index="index"
                                      upload-name ='上传标准'
                                      :on-upload-success="findGetImageUrlFun"
                                    />
                                  </div>
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-main-two-r">
                  <div class="item-main-two-r-m" :class="{ focused: nodeChangeHourEr }">
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-a-jiedian243"></i>
                        </div>
                        <div class="item-main-name">修改期限</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-time-group-input">
                        <div class="item-main-time-group-input-num">
                          <input 
                            type="text"
                            v-model.number="reqData.nodeChangeHour" 
                            placeholder=""
                            maxlength="4" 
                            @input="handlenodeChangeHourInput"
                            @blur="verifyForm('nodeChangeHour')"
                          />
                        </div>
                        <div class="item-main-time-group-input-unit">时</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main">
                <div class="item-main-pulldown">
                  <div class="item-main-pulldown-content">
                    <div class="item-main-pulldown-flex cursorPointer" :class="{ focused: categoryNameEr }">
                      <div class="item-main-pulldown-flex-l">
                        <div class="item-main-pulldown-flex-l-m">
                          <div class="item-main-pulldown-flex-l-m-icon">
                            <i class="icon font_family icon-quanxian24"></i>
                          </div>
                          <div class="item-main-pulldown-flex-l-m-name">交付方式</div>
                        </div>
                      </div>
                      <div class="item-main-pulldown-flex-c" @click.stop="toggleDropdown('modele2')">
                        <div class="item-main-pulldown-flex-c-m">
                          <div class="item-main-madeBy">
                            <div class="item-main-madeBy-item">
                              <div class="item-main-madeBy-checkbox" @click="checkboxOnChain(0)">
                                <span class="item-main-madeBy-checkbox-icon">
                                  <i 
                                    class="icon font_family"
                                    :class="isOnChain1 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                  >
                                  </i>
                                </span>
                                <span class="item-main-madeBy-checkbox-name" :class="!isOnChain1 ? 'falg' : ''">产品</span>
                              </div>
                            </div>
                            <div class="item-main-madeBy-line"></div>
                            <!-- <div class="item-main-madeBy-item">
                              <div class="item-main-madeBy-checkbox" @click="checkboxOnChain(1)">
                                <span class="item-main-madeBy-checkbox-icon">
                                  <i 
                                    class="icon font_family"
                                    :class="isOnChain2 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                  >
                                  </i>
                                </span>
                                <span class="item-main-madeBy-checkbox-name" :class="!isOnChain2 ? 'falg' : ''">方案</span>
                              </div>
                            </div>
                            <div class="item-main-madeBy-line"></div> -->
                            <div class="item-main-madeBy-item">
                              <div class="item-main-madeBy-checkbox" @click="checkboxOnChain(2)">
                                <span class="item-main-madeBy-checkbox-icon">
                                  <i 
                                    class="icon font_family"
                                    :class="isOnChain3 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                  >
                                  </i>
                                </span>
                                <span class="item-main-madeBy-checkbox-name" :class="!isOnChain3 ? 'falg' : ''">产品+方案</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="item-main-pulldown-flex-r" @mouseenter.stop="toggleDropdown('modele3')">
                        <i class="icon font_family icon-wenhaoyuanquan20"></i>
                      </div>
                    </div>
                  </div>
                  <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele2'" @click.stop>
                    <div class="module-content">
                      <div class="module-content-open">
                        <div class="module-content-open-list">
                          <div class="module-content-open-list-item">
                            <div class="item-name">
                              <div class="item-main-madeBy-checkbox" @click="findInOpenFun(0)">
                                  <span class="item-main-madeBy-checkbox-icon">
                                    <i 
                                      class="icon font_family"
                                      :class="isOpen1 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                    >
                                    </i>
                                  </span>
                                  <span class="item-main-madeBy-checkbox-name" :class="isOpen1 ? 'falg' : ''">可公开</span>
                                </div>
                            </div>
                          </div>
                          <div class="module-content-open-list-line"></div>
                          <div class="module-content-open-list-item">
                            <div class="item-name">
                              <div class="item-main-madeBy-checkbox" @click="findInOpenFun(1)">
                                  <span class="item-main-madeBy-checkbox-icon">
                                    <i 
                                      class="icon font_family"
                                      :class="isOpen2 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                    >
                                    </i>
                                  </span>
                                  <span class="item-main-madeBy-checkbox-name" :class="isOpen2 ? 'falg' : ''">不可公开</span>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele3'" @click.stop>
                    <div class="module-content">
                      <div class="module-content-tips overflowYAuto">
                        <div
                          class="module-content-tips-item"
                          v-for="(item, index) in deliveryTips"
                          :key="index"
                          >
                          <div class="item-value">{{ item. value }}</div>
                          <div class="item-label">{{ item.label }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <div class="item-main">
              <div class="item-main-desc">
                <div class="item-main-desc-l">
                  <div class="item-main-desc-l-m">
                    <div class="item-main-desc-l-m-icon" :class="{ focused: coverEr }">
                      <template v-if="defaultCover !== '' || defaultCover == null">
                        <img :src="defaultCover" alt="" />
                      </template>
                      <template v-else>
                        <el-upload
                          ref="uploadRef"
                          class="upload-demo"
                          action=""
                          :auto-upload="false"
                          :show-file-list="false"
                          drag
                          :limit="1"
                          accept="image/*"
                          :on-change="handleImageChange"
                        >
                        <div class="upload-main">
                          <div class="upload-main-icon">
                            <div class="icon-main-bg">
                              <i class="icon font_family icon-jiahaowubeijing20"></i>
                            </div>
                          </div>
                          <div class="upload-main-text">上传封面</div>
                        </div>
                        </el-upload>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="item-main-desc-r">
                  <div class="item-main-desc-r-m" :class="{ focused: isCoverBgColor }">
                    <TextareaWithCounter 
                      v-model="reqData.coverDescription" 
                      :placeholder="desTitle" 
                      :maxLength="200" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="postATask_main_top_right">
            <div class="item-main">
              <div class="item-main-perm">
                <div class="item-main-perm-content" :class="{ focused: competencyRequirementEr }">
                  <div class="item-main-perm-top">
                    <div class="item-main-icon">
                      <i class="icon font_family icon-gongzuojingyan24"></i>
                    </div>
                    <div class="item-main-perm-name">能力要求</div>
                  </div>
                  <div class="item-main-content">
                    <TextareaWithCounter 
                      v-model="reqData.competencyRequirement" 
                      :placeholder="'请输入任务的能力要求'" 
                      :maxLength="500" 
                      @blur="verifyForm('competencyRequirement')"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="item-main">
              <div class="item-main-perm">
                <div class="item-main-perm-content" :class="{ focused: targetEr }">
                  <div class="item-main-perm-top">
                    <div class="item-main-icon">
                      <i class="icon font_family icon-renwumubiao24"></i>
                    </div>
                    <div class="item-main-perm-name">任务目标</div>
                  </div>
                  <div class="item-main-content">
                    <TextareaWithCounter 
                      v-model="reqData.target" 
                      :placeholder="'请输入任务的任务目标'" 
                      :maxLength="500" 
                      @blur="verifyForm('target')"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="item-switch">
              <div class="item-switch-main">
                <div class="item-switch-main-title">任务是否紧急</div>
                <div class="item-switch-main-switch">
                  <SwitchBut v-model="switchValue" /> 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="postATask_main_bottom" :class="{ focused: descriptionEr }">
          <ContentManager name="任务介绍" v-model:modelValue="contents" />
        </div>
      </div>
      <div class="submitTheRelease">
        <div class="submitTheRelease-main">
          <div class="draft" @click="uploadToCOS(1)">
            <div class="draft-main">存草稿</div>
          </div>
          <div class="publish" @click="ispostTask = true">
            <div class="publish-main">发布</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ai-but" @click="findShowAiPopupModal">Ai</div>

    <PayBg :payData="payData" @close="closePayModal" v-if="payData.isPay" @button-click="pointsDeduction" />

    <div class="popupModal" v-if="isPayType" @click="isPayType = false">
      <div class="masking"></div>
      <div class="popupModal-center" @click.stop>
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">订单明细</div>
              <div class="popupModal-main-compAmt">
                <div class="compAmt-name">NFT费用</div>
                <div class="compAmt-val">¥{{ expense }}</div>
              </div>
              <div class="popupModal-item-content" v-if="isPointOpen == 1">
                <div class="item-content-icon" @click="isIntegral = !isIntegral">
                  <i 
                    class="icon font_family"
                    :class="isIntegral ? 'icon-gouxuanyuanxingbiankuang24' : 'icon-weigouxuanyuanxingbiankuang24'"
                  ></i>
                </div>
                <div class="item-content-txt">{{ expense }}积分可抵NFT费用{{ expense }}元（可用积分{{ integralBalance }}）</div>
              </div>
              <div class="item-content-reward">
                <div class="item-content-reward-name">订单总费用</div>
                <div class="item-content-reward-val">
                  <template v-if="isIntegral">¥{{ Number(expense) - Number(expense) }}</template>
                  <template v-else>¥{{ Number(expense) }}</template>
                </div>
              </div>
              <div class="popupModal-main-but-group">
                <template v-if="isIntegral">
                  <div class="popupModal-main-but relievoShadow" @click="findPayWithPointsFun">
                    <div class="exhibit-publish-main">
                      <div class="exhibit-publish-name">立即支付</div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="popupModal-main-but relievoShadow" @click="findAggregatePayFun">
                    <div class="exhibit-publish-main">
                      <div class="exhibit-publish-name">立即支付</div>
                    </div>
                  </div>
                </template>
              </div>
              <!-- <div class="popupModal-main-but-group">
                <div class="popupModal-main-but ae-btn" @click="findAggregatePayFun">聚合支付</div>
                <div class="popupModal-main-but ae-btn" v-if="isPointOpen == 1" @click="findPayWithPointsFun">积分支付</div>
              </div> -->
            </div>
          </div>
          <!-- <div class="close" @click="isPayType = false">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div> -->
      </div>
    </div>
    
    <div class="popupModal" v-if="ispostTask" @click="isPayType = false">
      <div class="masking"></div>
      <div class="popupModal-center" @click.stop>
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">发布确认</div>
              <div class="popupModal-main-tips">是否确认发布内容</div>
              <div class="popupModal-main-but-group">
                <div class="popupModal-main-but close_relievoShadow" @click="ispostTask = false">取消</div>
                <div class="popupModal-main-but relievoShadow" @click="uploadToCOS(2)">确定</div>
              </div>
            </div>
          </div>
          <!-- <div class="close" @click="isPayType = false">
              <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
          </div> -->
      </div>
    </div>

    <div class="popupModal" v-if="isshowAi" @click="isshowAi = false">
      <div class="masking"></div>
      <div class="popupModal-center" @click.stop>
          <div class="popupModal-main" style="width: 500px;">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-textarea" style="width: 100%;height: 300px;">
                <TextareaWithCounter 
                  v-model="aiContent" 
                  placeholder="请输入您想创建的任务介绍" 
                  :maxLength="1000" 
                />
              </div>
              <div class="popupModal-main-but-group">
                <div class="popupModal-main-but close_relievoShadow" @click="findCloseAiFun">取消</div>
                <div class="popupModal-main-but relievoShadow" @click="submitAiFun">发送</div>
              </div>
            </div>
          </div>
      </div>
    </div>

    <ImageCropper 
      :cropperImg="cropperImg" 
      :type= "clippingType"
      :fileName="cropperImgName" 
      v-if="isCropperAvatar" 
      :isShow="isCropperAvatar" 
      @close="handleClose"
      :on-upload-success="handleCropperSuccess"
      :aspectRatio="[3, 4]"
    />
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted, nextTick, onBeforeUnmount, Ref, watch, defineEmits } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElUpload } from 'element-plus';
  import ContentManager from '@/components/module/ContentManager.vue';
  import persHeader from '@/components/header/persHeader.vue';
  import ImageUpload from '@/components/upload/index.vue';
  import PayBg from '@/components/pay/index.vue';
  import { upChainPoundages, pointIsOpen, orderSave, orderQuery, chainBalance } from '@/api/pay';
  import { setMissionsDraft, getMissionsDraft } from '@/api/task';
  import { filesCos, categoryGet, aiGenerate } from '@/api/common';
  import { missionsPublish } from '@/api/userContent';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
  import { aePublishStore } from '@/stores/publish';
  import { aeUseStore } from '@/stores/user';
  import { setItem, getItem, isNumeric, computeHmac, filterInputNumber } from '@/utils/index';
  import { showPopup } from '@/utils/usePopup';
  import { FILENAMELENGTH } from '@/utils/common';
  import ImageCropper from '@/components/tailor/ImageCropper.vue';
  import TextareaWithCounter from '@/components/TextareaWithCounter/index.vue';
  import SwitchBut from '@/components/SwitchBut.vue';
  import NodeFileUpload from '@/components/upload/nodeFileUpload.vue';

  const router = useRouter();
  const userStore = aeUseStore();
  const publishStore = aePublishStore();
  const userInfo = userStore.getUserInfo;
  const ispostTask = ref(false);
  const nodeList: Ref<{ sort: number; url: string; }[]> = ref([]);

  const isUnll = ref(true); // 提交按钮是否禁用
  const isPayType = ref(false); // 是否显示支付方式
  const isPayTypeShow = ref(false); // 是否显示积分支付
  const nameEr = ref(false);
  const coverEr = ref(false);
  const targetEr = ref(false);
  const payAmountEr = ref(false);
  const dayEr = ref(false);
  const trustValueEr = ref(false);
  const descriptionEr = ref(false);
  const isCoverBgColor = ref(false);
  const categoryNameEr = ref(false);
  const competencyRequirementEr = ref(false);
  const nodeChangeTimesEr = ref(false);
  const nodePeriodEr = ref(false);
  const nodeChangeHourEr = ref(false);
  const isIntegral = ref(false); // 是否选择积分支付

  const uploadStore = useUploadStore();

  const AuthorizationToken = ref('');
  if( userInfo.token == ''){
    AuthorizationToken.value = getItem('token');
  } else {
    AuthorizationToken.value = userInfo.token;
  }


  // AI模块
  // 定义props
  const props = defineProps({
    aiResponse: {
      type: String,
      default: ''
    }
  });
  const emit = defineEmits(['open-modal', 'aiResponse']);
  const isshowAi = ref(false); // 是否显示AI
  const aiContent = ref(''); // AI内容
  const findShowAiPopupModal = () => {
    // isshowAi.value = true;
    // aiContent.value= '';
    emit('open-modal', '1'); // 触发父组件打开弹框
  }

  // 监听props的变化
  watch(() => props.aiResponse, (newVal: any) => {
    console.log('----------------------', newVal);
    reqData.value = newVal;
    const matchedCategory = indList.value.find(item => item.name === newVal.categoryName);
    if (matchedCategory) {
      reqData.value.categoryId = matchedCategory.id;
    } else {
      console.error('未找到匹配的 categoryId');
    }
    if(newVal.resultType !== '') {
      checkboxOnChain(Number(newVal.resultType))
    }
    if (reqData.value.isPublic = 1) {
      isOpen1.value = true;
      isOpen2.value = false;
    } else if (reqData.value.isPublic = 0) {
      isOpen1.value = false;
      isOpen2.value = true;
    }
  });

  const findCloseAiFun = () => {
    isshowAi.value = false
  }
  const handleUpdate = (content: any) => {
    reqData.value = content;
  };
  
  const submitAiFun = async () => {
    const resData = {
      description: aiContent.value,
      businessType: 1,  // 1任务
      llmType: 2, // 4 3 2 1
      llmModel: "moonshot-v1-8k"  // deepseek-chat gpt-4o-mini moonshot-v1-8k ep-20250115145030-v9qkm
    }
    return new Promise<void>((resolve, reject) => {
      aiGenerate(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        console.log('0000000000000', resultData)
        reqData.value = resultData;
        isshowAi.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };
  

  const expense = ref(0);
  const isDraft = ref(2); // 1草稿，2发布
  const reqTime= ref([]);
  const switchValue = ref(false);
  const reqData = ref({
    name: '',
    payAmount: null as number | null,
    trustValue: null as number | null,
    target: '',
    competencyRequirement: '',
    day: null as number | null,
    cover: '',
    coverDescription: '',
    description: [],
    categoryId: null as number | null,
    categoryName: '',
    nodePeriod: null as number | null,
    nodeChangeTimes: null as number | null,
    nodeChangeHour: null as number | null,
    resultType: 0,
    isPublic: 0,
    isUrgent: 0,
    nodeStandards: []
  });
  const leavePage = ref(2); // 1:发布成功离开页面，2：非正常离开页面
  const desTitle = ref('任务封面描述');

  const clippingType = '2'; // 是否裁剪
  const isCropperAvatar = ref(false); // 是否显示裁剪图片弹窗
  const cropperImg = ref<string | ArrayBuffer | null>(null); // 裁剪图片
  const cropperImgName = ref(''); // 裁剪图片名称
  const defaultCover = ref(''); // 裁剪后的默认展示图片
  
  // 介绍 	介绍类型：类型：1文本 2图片 3语音 4视频
  const contents = ref<{ type: string; data: any }[]>([]); // 任务介绍内容
  const convertContents = ref<{ type: string; data: any }[]>([]); // 任务介绍内容转换

  const resetReqData = () => {
    reqData.value = {
      name: '',
      payAmount: null as number | null,
      trustValue: null as number | null,
      target: '',
      competencyRequirement: '',
      day: null as number | null,
      cover: '',
      coverDescription: '',
      description: [],
      categoryId: null as number | null,
      categoryName: '',
      nodePeriod: null as number | null,
      nodeChangeTimes: null as number | null,
      nodeChangeHour: null as number | null,
      resultType: 0,
      isPublic: 0,
      isUrgent: 0,
      nodeStandards: []
    };
  };

  // 获取从草稿列表传参过来的草稿id详情
  const getTaskDraft = () => {
    const resData = {
      id: userInfo.taskDraftId
    }
    return new Promise<void>((resolve, reject) => {
      getMissionsDraft(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        console.log('0000000000000', resultData)
        let attr: any = [];
        if(resultData.description.length > 0) {
          resultData.description.forEach(v => {
            let types = '';
            if(v.type == '1') { types = 'text' }
            if(v.type == '2') { types = 'image' }
            if(v.type == '3') { types = 'audio' }
            if(v.type == '4') { types = 'video' }
            if(v.content !== '' && v.content !== undefined && v.content !== null) {
              attr.push({
                type: types,
                content: v.content
              })
            }
          });
        }
        resultData.description = attr;
        defaultCover.value = resultData.cover;
        contents.value = resultData.description;
        reqData.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 控制信任值只能输入0-100
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    // 防止XSS攻击
    if (!/^\d*$/.test(value)) {
      showPopup('请输入有效的数字！', 'error', 3000);
      return;
    }

    const numValue = Number(value);

    if (Number.isNaN(numValue)) {
      reqData.value.trustValue = null;
    } else if (numValue >= 0 && numValue <= 100) {
      reqData.value.trustValue = numValue;
    } else {
      showPopup('请输入0~100之间的数字！', 'error', 3000);
      // 统一处理边界条件
      reqData.value.trustValue = Math.max(0, Math.min(100, numValue));
    }
  };

  // 节点可修改次数 只能输入0-2
  const findNodeModificationTimes = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    // 防止XSS攻击
    if (!/^\d*$/.test(value)) {
      showPopup('请输入有效的数字！', 'error', 3000);
      return;
    }

    const numValue = value === '' ? '' : Number(value);
    if (Number.isNaN(numValue)) {
      reqData.value.nodeChangeTimes = null;
    } else if (numValue >= 0 && numValue <= 2) {
      reqData.value.nodeChangeTimes = numValue;
    } else {
      showPopup('请输入0~2之间的数字！', 'error', 3000);
      // 统一处理边界条件
      if(numValue !== '') {
        reqData.value.nodeChangeTimes = Math.max(0, Math.min(2, numValue));
      }
      
    }
  };
  
  // 任务报酬只能输入数字
  const handlePayAmountInput = (event: any) => {
    const value = event.target.value;
    if (!filterInputNumber(value)) {
      payAmountEr.value = true;
      // reqData.value.payAmount = null;
      return false;
    } else {
      payAmountEr.value = false;
      reqData.value.payAmount = value;
    }
    // if (!isNaN(numericValue) && numericValue > 0) {
    //     reqData.value.payAmount = numericValue;
    // } else {
    //     reqData.value.payAmount = null;
    // }
  }

  // 任务周期只能输入数字
  const handleDayInput = (event: any) => {
    reqData.value.day = isNumeric(event.target.value);
    if( reqData.value.day < 1 ) {
      reqData.value.day = null;
    }
  }

  // 修改期限只能输入数字
  const handlenodeChangeHourInput = (event: any) => {
    reqData.value.nodeChangeHour = isNumeric(event.target.value);
    if (reqData.value.nodeChangeTimes > 0) {
      if( reqData.value.nodeChangeHour <= 0 ) {
        reqData.value.nodeChangeHour = null;
        showPopup('节点修改次数不为0，需要设置修改期限', 'error', 3000);
      }
    } else if(reqData.value.nodeChangeTimes == 0) {
      reqData.value.nodeChangeHour = 0;
    }
  }

  // 单节点周期
  const handleNumberInput = (field: any, event: any) => {
    reqData.value[field] = isNumeric(event.target.value);
    if (parseInt(reqData.value[field], 10) < 1) {
      reqData.value[field] = '';
    }
    if(field == 'nodePeriod') {
      if(Number(reqData.value.nodePeriod) <= Number(reqData.value.day)) {
        let day = parseInt(reqData.value.day, 10);
        let nodePeriod = parseInt(reqData.value.nodePeriod, 10);
        if (!isNaN(day) && !isNaN(nodePeriod) && day !== '' && nodePeriod !== '') {
            const arrayLength = Math.ceil(day / nodePeriod);
            nodeList.value = Array.from({ length: arrayLength }, (_, i) => ({
              sort: i + 1,
              url: ''
            }));
        } else {
          nodeList.value= [];
        }
      } else {
        showPopup('单节点周期不能大于任务周期，请修改！', 'error', 3000);
      }
    }
  }

  // 所属行业
  const indList = ref([]);
  const findCategoryGetFun = () => {
    const resData = {
      type: 1,
    }
    return new Promise<void>((resolve, reject) => {
      categoryGet(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        indList.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 判断点击弹框外关闭弹框
  const currentDropdown = ref<string | null>(null);
  const toggleDropdown = (dropdownName: string) => {
    if(dropdownName == 'modele2') {
      currentDropdown.value = dropdownName;
    } else {
      currentDropdown.value = currentDropdown.value === dropdownName ? null : dropdownName;
    }
    console.log('currentDropdown.value1', currentDropdown.value);
    document.addEventListener('click', handleClickOutside);
    
  };
  const handleClickOutside = () => {
    currentDropdown.value = null;
  };

  // 选中的行业
  const findIndListFun = (item: any) => {
    reqData.value.categoryId = item.id;
    reqData.value.categoryName = item.name;
    currentDropdown.value = null;
  }

  // 交付方式 1:产品 3:方案 2:产品+方案
  const isOnChain = ref(0); 
  const isOnChain1 = ref(true); 
  const isOnChain2 = ref(false);
  const isOnChain3 = ref(false);
  const checkboxOnChain = (num: number) => {
    isOnChain.value = num;
    if (num == 0) {
      isOnChain1.value = true;
      isOnChain2.value = false;
      isOnChain3.value = false;
      reqData.value.resultType = 1;
      isExpense.value = false;
    } else if (num == 1) {
      isOnChain1.value = false;
      isOnChain2.value = true;
      isOnChain3.value = false;
      reqData.value.resultType = 2;
      isExpense.value = false;
    } else if (num == 2) {
      isOnChain1.value = false;
      isOnChain2.value = false;
      isOnChain3.value = true;
      reqData.value.resultType = 2;
      isExpense.value = true;
    }
  }

  // 1:公开 0:不公开
  const isOpen = ref(0); 
  const isOpen1 = ref(false);
  const isOpen2 = ref(false);
  const findInOpenFun = (num: number) => {
    isOpen.value = num;
    if (num == 0) {
      isOpen1.value = true;
      isOpen2.value = false;
      reqData.value.isPublic = 1;
    } else if (num == 1) {
      isOpen1.value = false;
      isOpen2.value = true;
      reqData.value.isPublic = 0;
    }
  };

  // 交付方式提示
  const deliveryTips = ref([
    { value: '1', label: '产品：指有形物品或无形服务' },
    // { value: '2', label: '方案：指为实现特定目标或解决特定问题而设计的详细计划、策略或方法' },
    { value: '2', label: '产品+方案：有形物品或无形服务+为实现特定目标或解决特定问题而设计的详细 计划、策略或方法' }
  ])

   //获取上传标准
  const findGetImageUrlFun = (index: number, urls: any) => {
    nodeList.value[index].url = urls;
    console.log('nodeList.value', nodeList.value); 
  };
  // 查看上传标准
  const findSeeNodeUrlFun = (item: any) => {
    window.open(item.url);
  };
  // 删除上传标准
  const findDelNodeUrlFun = (index: number) => {
    nodeList.value[index].url = '';
    uploadStore.removeNodeFile(index)
  };

  const getData = () => {
    console.log('Submitted convertContents:', convertContents.value);
    // 你可以在这里处理提交的内容
    let attr: any = [];
    convertContents.value.forEach(v => {
      let types = '';
      if(v.type === 'text') { types = '1' }
      if(v.type === 'image') { types = '2' }
      if(v.type === 'audio') { types = '3' }
      if(v.type === 'video') { types = '4' }
      if(v.data !== '' && v.data !== undefined && v.data !== null) {
        attr.push({
          type: types,
          content: v.data
        })
      }
    });
    // if (reqTime.value.length > 0) {
    //   reqData.value.startTime = reqTime.value[0];
    //   reqData.value.endTime = reqTime.value[1];
    // }
    console.log('111111111111', attr);
    
    reqData.value.resultType = reqData.value.resultType == 0 ? 1 : reqData.value.resultType;
    reqData.value.name = reqData.value.name;
    reqData.value.payAmount = reqData.value.payAmount;
    reqData.value.trustValue = reqData.value.trustValue;
    reqData.value.target = reqData.value.target;
    reqData.value.competencyRequirement = reqData.value.competencyRequirement;
    reqData.value.day = reqData.value.day;
    reqData.value.cover = reqData.value.cover;
    reqData.value.categoryId = reqData.value.categoryId;
    reqData.value.categoryName = reqData.value.categoryName;
    reqData.value.coverDescription = reqData.value.coverDescription;
    reqData.value.description = attr;

    let resData = reqData.value;
    
    return resData;
  };
  
  // 发布任务

  // 获取cos配置
  const bucket = ref('');
  const region = ref('');
  const sessionToken = ref('');
  const tmpSecretId = ref('');
  const tmpSecretKey = ref('');
  const token = ref('');

  const isPublishing = ref(false);
  // 上传前获取参数
  const uploadToCOS = async (index: number) => {
    isDraft.value = index;
    ispostTask.value = false;
    let resData = {};
    return new Promise<void>((resolve, reject) => {
        filesCos(resData).then((response: any) => {
            const { code, data, message } = response;
            
            const resultData = data;
            if (code !== 200) {
              showPopup(message, 'error', 3000);
                return;
            }
            
            bucket.value = resultData.bucket;
            region.value = resultData.region;
            sessionToken.value = resultData.sessionToken;
            tmpSecretId.value = resultData.tmpSecretId;
            tmpSecretKey.value = resultData.tmpSecretKey;
            token.value = resultData.token;

            publish();
            resolve()
        }).catch((error: any) => {
            reject(error)
        })
    })
  
  };
  
  // 上传提交过的所有文件
  const publish = async () => {
      isPublishing.value = true;
      convertContents.value = [...contents.value];
      try {
        // 上传封面图片
        if (uploadStore.coverImage) {
          const coverResult = await uploadFileToCOS(uploadStore.coverImage, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value );
          console.log('coverResult', coverResult);
          reqData.value.cover = `https://${coverResult.data.Location}`;
          if (!coverResult.success) throw coverResult.error;
        }

        // 上传详情文件
        let attr = [];
        for (const file of uploadStore.detailFiles) {
          const detailResult = await uploadFileToCOS(file.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          console.log('detailResult', detailResult);
          attr.push(`https://${detailResult.data.Location}`)
          let urlArrt = attr.join(',');
          // contents.value[file.id].data = urlArrt;
          
          console.log(convertContents.value);
          convertContents.value[file.id].data = urlArrt;
          // contents.value[file.id].data = `https://${detailResult.data.Location}`;
          if (!detailResult.success) throw detailResult.error;
        }

        // 上传节点标准文件
        let nodeAttr = [];
        for (const files of uploadStore.nodeFiles) {
          const detailResult = await uploadFileToCOS(files.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          console.log('节点标准文件序号', files.isprevious);
          let url = `https://${detailResult.data.Location}`;
          nodeList.value[files.isprevious].url = url;
          // contents.value[files.id].data = urlArrt;
          reqData.value.nodeStandards = nodeList.value;
          // contents.value[file.id].data = `https://${detailResult.data.Location}`;
          if (!detailResult.success) throw detailResult.error;
        }

        // 所有文件上传成功后，执行发布操作
        submitContents();
        // 清空上传状态
        uploadStore.clearAllFiles();

      } catch (error) {
        console.error('发布失败：', error);
        showPopup('发布失败，请重试！', 'error', 3000);
      } finally {
        isPublishing.value = false;
      }
  };


  const sbumitData = ref({});
  const submitContents = () => {
    let resData = getData();
    isUnll.value = true;
    
    // 根据是否保存草稿进行判断， 1草稿，2发布
    if(isDraft.value == 1) {
      submitDraft(resData);
      return;
    }

    // 检查对象中的每个键值对
    for (const key in resData) {
      if (resData.hasOwnProperty(key)) {
        console.log('resData.key', resData[key]);
        const value = resData[key];
        if(key === 'id') {
          continue;
        }
        if(key === 'trustValue') {
          let values = value || 0;
          if(values <= 0) {
            trustValueEr.value = true;
            isUnll.value = false;
          } else {
            trustValueEr.value = false;
          }
        }
        if(key === 'description') {
          if(value.length < 1) {
            descriptionEr.value = true;
            isUnll.value = false;
          } else {
            descriptionEr.value = false;
          }
        }
        if (value === '' || value === null || value === undefined) {
          console.log(`键 ${key} 的值为空`);
          switch (key) {
            case 'name':
              nameEr.value = true;
              break;
            case 'payAmount':
              payAmountEr.value = true;
              break;
            case 'target':
              targetEr.value = true;
              break;
            case 'competencyRequirement':
              competencyRequirementEr.value = true;
              break;
            case 'day':
              dayEr.value = true;
              break;
            case 'cover':
              coverEr.value = true;
              break;
            case 'coverDescription':
              isCoverBgColor.value = true;
              break;
            case 'categoryName':
              categoryNameEr.value = true;
              break;
            default:
              break;
          }
          isUnll.value = false;
        } else {
          switch (key) {
            case 'name':
              nameEr.value = false;
              break;
            case 'payAmount':
              payAmountEr.value = false;
              break;
            case 'target':
              targetEr.value = false;
              break;
            case 'competencyRequirement':
              competencyRequirementEr.value = false;
              break;
            case 'day':
              dayEr.value = false;
              break;
            case 'cover':
              coverEr.value = false;
              break;
            case 'coverDescription':
              isCoverBgColor.value = false;
              break;
            case 'categoryName':
              categoryNameEr.value = false;
              break;
            default:
              break;
          }
        }
      }
    }
    console.log('isUnll.value', isUnll.value)
    if(!isUnll.value){
      showPopup('您还有未填的信息！', 'error', 3000);
      return false;
    } else {
      // findSubmitTaskDataFun(resData);
      sbumitData.value = resData;
      // 判断是否开启积分支付，开启积分支付时判断积分是否够支付，够的话显示积分支付按钮反之不显示
      if(isPointOpen.value == 1) {
        if(Number(integralBalance.value) > Number(expense.value)) {
          isPointOpen.value = 1;
          isPayType.value = true;
          payData.value.type = 2;
        } else {
          isPointOpen.value = 0;
          payData.value.type = 1;
          payFee(2, sbumitData.value);
        }
      } else {
        isPointOpen.value = 0;
        payData.value.type = 1;
        payFee(2, sbumitData.value);
      }
    }
  };

  // 保存草稿
  const submitDraft = (data: any) => {
    const resData = data;
    return new Promise<void>((resolve, reject) => {
      setMissionsDraft(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        showPopup('保存草稿成功！', 'success', 3000);
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };


  // 提交发布任务数据
  const findSubmitTaskDataFun = (resData: any) => {
    return new Promise<void>((resolve, reject) => {
      missionsPublish(resData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        
        publishStore.questInfo.data = {};
        // setItem('postATask', findClearDraft());
        payFee(resultData);
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 聚合支付
  const findAggregatePayFun = () => {
    isPayType.value = false;
    payData.value.type = 1;
    payFee(2, sbumitData.value);
  }

  // 积分支付
  const findPayWithPointsFun = () => {
    isPayType.value = false;
    payData.value.type = 2;
    payData.value.payAmount = expense.value;
    payData.value.poundage = 0;
    payData.value.mps = 0;
    payData.value.isPay = true;
  }
  // 积分支付-立即支付
  const pointsDeduction = () => {
    payFee(1, sbumitData.value);
  };


  // 查询积分余额
  const integralBalance = ref(0);
  const findChainBalanceFun = () => {
    // type 1积分 2支付
    let reqData = {
      type: 1
    }
    return new Promise<void>((resolve, reject) => {
      chainBalance(reqData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
          return;
        }
        
        integralBalance.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

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
  }

  // 计算链上手续费
  const isExpense = ref(false);
  const findupChainPoundage = () => {
    let resData = {
      type: 1
    };
    isExpense.value = true;
    return new Promise<void>((resolve, reject) => {
      upChainPoundages(resData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        
        expense.value = resultData.upChainPoundage;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 判断是否开启显示积分支付，开启的话显示积分支付和聚合支付按钮，不开启则直接显示聚合支付二维码
  const isPointOpen = ref(0); // 0 关闭，1 开启
  const findPointIsOpenFun = () => {
    return new Promise<void>((resolve, reject) => {
      pointIsOpen({}).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        
        isPointOpen.value = resultData;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  }

  // 创建支付订单
  const orderNo = ref(''); // 订单号
  const payFee = (type: number, taskData: any) => {
    let timestamp = Date.now();
    let content = type + '0' + expense.value + timestamp;
    let userId = '';
    if(userStore.userInfo.id !== '') {
      userId = userStore.userInfo.id;
    } else {
      userId = getItem('id');
    }

    let reqData = {
      businessData: taskData,
      businessType: type,
      amount: 0,
      poundage: expense.value,
      timeStamp: timestamp,
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
        if(type == 1) {
          payData.value.isPay = false;
          let id = data.missionId;
          userInfo.taskType = 1;
          setItem('taskType', 1);
          setItem('postATask', findClearDraft());
          convertContents.value = [];
          console.log('积分支付时，成功后清空数据', findClearDraft());
          console.log('积分支付时，成功后清空数据', getItem('postATask'));
          resetReqData();
          router.push({ name: 'TataskDetails', params: { id } });
        } else {
          
          orderNo.value = resultData.orderNo;
          payData.value.payUrl = resultData.qrcode;
          payData.value.payAmount = expense.value;
          payData.value.isPay = true;
          findOrderResult();
        }
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
        ;

        if (code === 200) {
          if (data.orderStatus == 2) {
            showPopup(message, 'success', 3000);
            setItem('postATask', findClearDraft());
            resetReqData(); // 重置数据
            convertContents.value = [];
            console.log('getItem("postATask")', getItem('postATask'))
            publishStore.questInfo.data = {};
            payData.value.isPay = false;
            clearTimeout(timer);
            isActive.value = false;
            let id = data.businessId;
            userInfo.taskType = 1;
            setItem('taskType', 1);
            leavePage.value = 1;
            router.push({ name: 'TataskDetails', params: { id } });
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
        } else if(code === 500) {
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

  const findClearDraft = () => {
    let reqData = {
      name: '',
      payAmount: null as number | null,
      trustValue: null as number | null,
      target: '',
      competencyRequirement: '',
      day: null as number | null,
      cover: '',
      coverDescription: '',
      description: [],
      categoryId: null as number | null,
      categoryName: '',
      nodePeriod: null as number | null,
      nodeChangeTimes: null as number | null,
      nodeChangeHour: null as number | null,
      resultType: 0,
      isPublic: 0,
      isUrgent: 0,
      nodeStandards: []
    }
    return reqData;
  }

  /**
   * 封面裁剪
   * **/
   const uploadRef = ref<InstanceType<typeof ElUpload> | null>(null);
  // 上传图片
  const handleImageChange = (file) => {
    const reader = new FileReader();
    const isJPG = file.raw.type === 'image/jpeg';
    const isPNG = file.raw.type === 'image/png';
    if (!isJPG && !isPNG) {
      showPopup('只能上传jpg/png文件', 'error', 3000);
      // 清除文件列表
      clearUploadFiles();
      return false;
    }

    const nameSize = file.name.length;
    if (nameSize > FILENAMELENGTH) {
      showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
      // 清除文件列表
      clearUploadFiles();
      return false;
    }

    const maxSize = 6 * 1024 * 1024;
    if (file.size > maxSize) {
      showPopup('图片大小不能超过6M', 'error', 3000);
      // 清除文件列表
      clearUploadFiles();
      return false;
    }

    // 文件条件通过，进行读取操作
    reader.onload = (e) => {
      const target = e.target;
      if (target && typeof target.result === 'string') {
        cropperImg.value = target.result;
        cropperImgName.value = file.name;
        isCropperAvatar.value = true;
      }
    };
    reader.readAsDataURL(file.raw);
  };

  const handleCropperSuccess = (url: any) => {
      defaultCover.value = url;
      isCropperAvatar.value = false;
  };
  
  const handleClose = () => {
    isCropperAvatar.value = false;
    cropperImg.value = null;
    cropperImgName.value = "";
    // 重置上传状态
    defaultCover.value = '';
    clearUploadFiles();
  };
  const clearUploadFiles = () => {
    // 清除 el-upload 的文件列表
    uploadRef.value.clearFiles();
  };


  // 页面卸载时停止重试并清除定时器
  onBeforeUnmount(() => {
    isActive.value = false;
    if(leavePage.value !== 1) {
      let resData = getData();
      console.log('页面注销后缓存的resData', resData);
      setItem('postATask', resData);
    }
    clearTimeout(timer);
  });

  // 在路由变化时停止重试并清除定时器
  router.beforeEach((to, from, next) => {
    isActive.value = false;
    clearTimeout(timer);
    next();
  });
  

  // 判断是否为空对象
  const isEmptyObject = (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
  }

  // 监听填的数据进行验证
  const verifyForm = (item: any) => {
    if (item == 'name') {
      if(reqData.value.name !== '') {
        nameEr.value = false;
      }
    }
    if (item == 'payAmount') {
      if(reqData.value.payAmount !== '') {
        payAmountEr.value = false;
      }
    }
    if (item == 'target') {
      if(reqData.value.natargetme !== '') {
        targetEr.value = false;
      }
    }
    if (item == 'competencyRequirement') {
      if(reqData.value.competencyRequirement !== '') {
        competencyRequirementEr.value = false;
      }
    }
    if (item == 'day') {
      if(reqData.value.day !== '') {
        dayEr.value = false;
      }
    }
    if (item == 'cover') {
      if(reqData.value.cover !== '') {
        coverEr.value = false;
      }
    }
    if (item == 'coverDescription') {
      if(reqData.value.coverDescription !== '') {
        isCoverBgColor.value = false;
      }
    }
    if (item == 'categoryName') {
      if(reqData.value.categoryName !== '') {
        categoryNameEr.value = false;
      }
    }
    if (item == 'trustValue') {
      if(reqData.value.trustValue !== '') {
        trustValueEr.value = false;
      }
    }
    if (item == 'description') {
      if(reqData.value.description !== '') {
        descriptionEr.value = false;
      }
    }
    isUnll.value = true;
  }

  // 监听是否紧急
  watch(() => switchValue.value, (newVal, oldVal) => {
    
    reqData.value.isUrgent = switchValue.value ? 1 : 0;
  });

  onMounted(() => {
    if(userInfo.openPostAtaskType == 1) {
      if(getItem('postATask') !== null) {
        reqData.value = getItem('postATask');
      } else {
        reqData.value = findClearDraft();
      }
      
    } else if(userInfo.openPostAtaskType == 2) {
      getTaskDraft(); // 获取任务草稿
    }
    
    findCategoryGetFun(); // 获取行业列表
    findupChainPoundage(); // 计算链上手续费
    findPointIsOpenFun(); // 判断是否开启积分支付
    findChainBalanceFun(); // 查询用户积分余额
  })
  
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/common.scss';
  @use '@/assets/styles/postATask.scss';
  @use '@/assets/styles/popupModal.scss';
</style>

function emit(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}
