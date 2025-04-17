<template>
  <div class="work">
    <div class="work-header">
      <persHeader />
    </div>
    <div class="overlay"></div>
    <div class="work-main">
      <div class="work_main">
        <Transition name="fade-slide" mode="out-in">
          <div class="work_main_top" v-if="currentStep === 1" key="step1">
            <div class="work_main_top_column">
              <div class="item-main">
                <div class="content_top_two">
                  <div class="item-main-two-l inputBg">
                    <div class="input_bg">
                      <div class="input_bg_l"></div>
                      <div class="input_bg_c"></div>
                      <div class="input_bg_r"></div>
                    </div>
                    <div class="item-main-two-l-m relievoShadow" :class="{ focused: nameEr }">
                      <div class="item-main-flex-head">
                        <div class="head-main">
                          <div class="item-main-icon">
                            <i class="icon font_family icon-renwumingcheng"></i>
                          </div>
                          <div class="item-main-name">作品名称</div>
                        </div>
                      </div>
                      <div class="item-main-content">
                        <div class="item-main-time-group-input">
                          <div class="item-main-time-group-input-num">
                            <input 
                              type="text"
                              v-model.number="reqData.name" 
                              placeholder=""
                              maxlength="" 
                              @blur="verifyForm('name')"
                            />
                          </div>
                          <div class="item-main-time-group-input-unit"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-main-two-r inputBg overflowInherit">
                    <div class="input_bg">
                      <div class="input_bg_l"></div>
                      <div class="input_bg_c"></div>
                      <div class="input_bg_r"></div>
                    </div>
                    <div class="item-main-two-r-m relievoShadow">
                      <div class="item-main-flex-head">
                        <div class="head-main">
                          <div class="item-main-icon">
                            <i class="icon font_family icon-biaoqian24"></i>
                          </div>
                          <div class="item-main-name">作品标签</div>
                        </div>
                      </div>
                      <div class="item-main-content">
                        <TagInput
                            :value="reqData.tags"
                            @update:value="handleTagsUpdate"
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="work_main_top_column">
              <div class="item-main">
                <FileUpload :type="reqData.type" :fileData="fileData" @emit-type="findWorkTypeFun" />
              </div>
            </div>
            <div class="work_main_top_column">
            <div class="work_main_top_left">
              <div class="item-main">
                <div class="item-main-desc relievoShadow">
                  <div class="item-main-desc-l">
                    <div class="item-main-desc-l-m">
                      <div class="item-main-desc-l-m-icon" :class="{ focused: coverEr }">
                        <template v-if="defaultCover !== '' || defaultCover == null">
                          <div class="item-defaultCover">
                            <img :src="defaultCover" alt="" />
                            <div class="item-main-desc-l-m-icon-close" @click="closeDefaultCover">
                              <i class="icon font_family icon-shanchulajitong24"></i>
                            </div>
                          </div>
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
                    <div class="item-main-desc-r-m" :class="{ focused: briefEr }">
                      <TextareaWithCounter 
                        v-model="reqData.brief" 
                        :placeholder="desTitle" 
                        :maxLength="200" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-main">
                <div class="item-main-file relievoShadow" :class="{ focused: attachmentUrlEr }" >
                  <div class="item-main-file-content">
                    <div class="file-content">
                      <template v-if="uploadedFiles.length > 0">
                        <div class="file-content-item" v-for="(item, index) in uploadedFiles" :key="index">
                          <div class="item-info">
                            <div class="item-info-main">
                              <div class="item-info-main-l">
                                {{ classifyFileByMimeType(item.mimeType) }}
                              </div>
                              <div class="item-info-main-r">
                                <div class="file-name multi-line-1">{{ item.name }}</div>
                                <div class="file-size">{{ formatFileSize(item.size) }}</div>
                              </div>
                            </div>
                          </div>
                          <div class="item-del">
                            <div class="delPic relievoShadow" @click="removeEventAttener(index)">
                                <i class="icon font_family icon-shanchu20"></i>
                              </div>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="file-content-no">
                          请在上传附件前务必仔细考虑：一旦上传，如果允许二创，则视为您已授权他人免费下载和使用该文件。
                        </div>
                      </template>
                    </div>
                    <div class="file-but relievoShadow">
                      <div class="file-but-mian">
                        <div class="but-mian-icon">
                          <i class="icon font_family icon-jiahaowubeijing20"></i>
                        </div>
                        <div class="but-main-text">作品源件</div>
                        <input
                          type="file"
                          ref="addFile"
                          class="hidden-file-input"
                          @change="handleAttFileChange"
                          accept="*"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-main">
                <div class="item-main-file relievoShadow">
                  <div class="item-main-file-content">
                    <div class="file-content">
                      <template v-if="uploadPatentFiles.length > 0">
                        <div class="file-content-item" v-for="(item, index) in uploadPatentFiles" :key="index">
                          <div class="item-info">
                            <div class="item-info-main">
                              <div class="item-info-main-l">
                                {{ classifyFileByMimeType(item.mimeType) }}
                              </div>
                              <div class="item-info-main-r">
                                <div class="file-name multi-line-1">{{ item.name }}</div>
                                <div class="file-size">{{ formatFileSize(item.size) }}</div>
                              </div>
                            </div>
                          </div>
                          <div class="item-del">
                            <div class="delPic relievoShadow" @click="removeEventPatentener(index)">
                                <i class="icon font_family icon-shanchu20"></i>
                              </div>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="file-content-no">
                          请在上传附件前务必仔细考虑：一旦上传，如果允许二创，则视为您已授权他人免费下载和使用该文件。
                        </div>
                      </template>
                    </div>
                    <div class="file-but relievoShadow">
                      <div class="file-but-mian">
                        <div class="but-mian-icon">
                          <i class="icon font_family icon-jiahaowubeijing20"></i>
                        </div>
                        <div class="but-main-text">作品专利</div>
                        <input
                          type="file"
                          ref="patentFile"
                          class="hidden-file-input"
                          @change="handlePatentFileChange"
                          accept="*"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-main">
                <div class="item-main-flex inputBg">
                  <div class="input_bg">
                    <div class="input_bg_l"></div>
                    <div class="input_bg_c"></div>
                    <div class="input_bg_r"></div>
                  </div>
                  <div class="item-main-flex-main relievoShadow">
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-chuangzuo24"></i>
                        </div>
                        <div class="item-main-name">创作工具</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-time">
                        <div class="item-main-time-group">
                          <div class="item-main-slider">
                            <div class="item-main-slider-num">
                              <input
                                type="text"
                                v-model="reqData.createMethod" 
                                maxlength="64"
                                placeholder="如：AI、AE、PR等软件"
                                @blur="verifyForm('createMethod')"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="work_main_top_right">
              <div class="item-main">
                <div class="item-main-flex inputBg">
                  <div class="input_bg">
                    <div class="input_bg_l"></div>
                    <div class="input_bg_c"></div>
                    <div class="input_bg_r"></div>
                  </div>
                  <div class="item-main-flex-main relievoShadow">
                    <div class="item-main-flex-head">
                      <div class="head-main">
                        <div class="item-main-icon">
                          <i class="icon font_family icon-renwumingcheng"></i>
                        </div>
                        <div class="item-main-name">作品共创者</div>
                      </div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-content-flex">
                        <div class="item-main-slider-num">
                          <div class="item-main-slider-num-userList">
                            <div class="userList-item" v-for="(item, index) in coCreatorList" :key="index">
                              <img :src="item.avatar" alt="" />
                            </div>
                          </div>
                        </div>
                        <div class="item-main-slider-unit relievoShadow" @click="selectResponsiblePerson">
                          <i class="icon font_family icon-jiahaowubeijing20"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-main">
                <div class="item-main-perm textareaBg" style="z-index: 1;">
                  <div class="textarea_bg">
                    <div class="textarea_bg_t"></div>
                    <div class="textarea_bg_c"></div>
                    <div class="textarea_bg_b"></div>
                  </div>
                  <div class="item-main-perm-content">
                    <div class="item-main-perm-top">
                      <div class="item-main-icon">
                        <i class="icon font_family icon-renwumubiao24"></i>
                      </div>
                      <div class="item-main-perm-name">作品商业设置</div>
                    </div>
                    <div class="item-main-content">
                      <div class="item-main-content-flex">
                        <div class="ordinary">
                          <div class="ordinary-main">
                            <div class="item-main-flex-head">
                              <div class="head-main">
                                <div class="item-main-name">
                                  普通型
                                  <i 
                                    class="icon font_family icon-wenhaoyuanquan20 cursorPointer"
                                    @click.stop="findTypeMsgPopupFun(1)"></i>
                                </div>
                              </div>
                            </div>
                            <div class="item-main-content" :class="{ focused: sellOneEr }">
                              <div class="item-main-time-group-input">
                                <div class="item-main-time-group-input-num">
                                  <input 
                                    type="text"
                                    v-model.number="reqData.sellOne" 
                                    placeholder="请设置价格，大于0且最多两位小数"
                                    maxlength="8" 
                                    @input="handleSellOneInput"
                                    @blur="verifyForm('sellOne')"
                                  />
                                </div>
                                <div class="item-main-time-group-input-unit">元</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="enhance">
                          <div class="enhance-main">
                            <div class="enhance-main-top">
                              <div class="item-main-pulldown">
                                <div class="item-main-pulldown-content">
                                  <div class="item-main-pulldown-flex cursorPointer" :class="{ focused: sellOneEr }">
                                    <div class="item-main-pulldown-flex-l">
                                      <div class="item-main-pulldown-flex-l-m">
                                        <div class="item-main-pulldown-flex-l-m-name">
                                          增强型
                                          <i 
                                            class="icon font_family icon-wenhaoyuanquan20 cursorPointer"
                                            @click.stop="findTypeMsgPopupFun(2)"></i>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="item-main-pulldown-flex-c" @click.stop="toggleDropdown('modele5')">
                                      <div class="item-main-pulldown-flex-c-m">
                                        <span class="item-main-pulldown-flex-c-m-name multi-line-1">
                                          <!-- {{ enhancelName }} -->
                                          <template v-if="reqData.sellTwo > 0">
                                            <span v-if="reqData.sellTwoType == 2">{{ reqData.sellTwo }}元/3个月</span>
                                            <span v-else-if="reqData.sellTwoType == 1">{{ reqData.sellTwo }}元/次</span>
                                          </template>
                                        </span>
                                      </div>
                                    </div>
                                    <div class="item-main-pulldown-flex-r" @click.stop="toggleDropdown('modele5')">
                                      <i 
                                        class="icon font_family"
                                        :class="currentDropdown === 'modele5' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                                      >
                                      </i>
                                    </div>
                                  </div>
                                </div>
                                <div class="item-main-pulldown-module dropdown" v-if="currentDropdown === 'modele5'" @click.stop>
                                  <div class="module-content">
                                    <div class="module-content-list overflowYAuto maxHeightAuto">
                                      <div 
                                        class="module-content-list-item displayInitial"
                                        v-for="(item, index) in enhanceList"
                                        :key="index"
                                        @click="findEnhanceFun(item)"
                                      >
                                        <div class="item-main-top">
                                          <div class="item-main-top-flex">
                                            <div class="item-name">{{ item.label }}</div>
                                            <div
                                              class="item-select" 
                                              :class="{ 'item-active': item.value === reqData.sellTwoType }"
                                            >
                                            </div>
                                          </div>
                                        </div>
                                        <div class="item-main-bott" v-if="item.value === reqData.sellTwoType">
                                            <div class="item-main-amount">
                                              <div class="item-main-amount-num">
                                                <input 
                                                  type="text"
                                                  v-model.number="reqData.sellTwo" 
                                                  placeholder="大于0且最多两位小数"
                                                  maxlength="7" 
                                                  @input="handSellTwoInput"
                                                  @blur="verifyForm('sellTwo')"
                                                />
                                              </div>
                                              <div class="item-main-amount-unit" v-if="item.value !== 1">元/3个月</div>
                                              <div class="item-main-amount-unit" v-else>元/次</div>
                                            </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="enhance-border"></div>
                            <div class="enhance-main-bott" :class="{ focused: sellTwoPercentEr }">
                              <div class="item-main-flex-head">
                                <div class="head-main">
                                  <div class="item-main-name">
                                    抽佣
                                    <i 
                                      class="icon font_family icon-wenhaoyuanquan20 cursorPointer"
                                      @click.stop="findTypeMsgPopupFun(3)"></i>
                                  </div>
                                </div>
                              </div>
                              <div class="item-main-content">
                                <div class="item-main-time-group-input">
                                  <div class="item-main-time-group-input-num">
                                    <input 
                                      type="text"
                                      v-model.number="reqData.sellTwoPercent" 
                                      placeholder="请设置抽佣比例，范围为1-100的正整数"
                                      maxlength="4" 
                                      @input="handleSellTwoPercentErInput"
                                      @blur="verifyForm('sellTwoPercent')"
                                    />
                                  </div>
                                  <div class="item-main-time-group-input-unit">%</div>
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
              <div class="item-main">
                <div class="item-main-two">
                  <div class="item-main-two-l inputBg">
                    <div class="input_bg">
                      <div class="input_bg_l"></div>
                      <div class="input_bg_c"></div>
                      <div class="input_bg_r"></div>
                    </div>
                    <div class="item-main-pulldown">
                      <div class="item-main-pulldown-content">
                        <div class="item-main-pulldown-flex cursorPointer" :class="{ focused: originalTypeEr }">
                          <div class="item-main-pulldown-flex-l">
                            <div class="item-main-pulldown-flex-l-m">
                              <div class="item-main-pulldown-flex-l-m-icon">
                                <i class="icon font_family icon-feiyong24"></i>
                              </div>
                              <div class="item-main-pulldown-flex-l-m-name">创作属性</div>
                            </div>
                          </div>
                          <div class="item-main-pulldown-flex-c" @click.stop="toggleDropdown('modele1')">
                            <div class="item-main-pulldown-flex-c-m">
                              <span class="item-main-pulldown-flex-c-m-name multi-line-1">
                                {{ originalTypeName }}
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
                              v-for="(item, index) in originalTypeList"
                              :key="index"
                              @click="findoriginalTypeFun(item)"
                            >
                              <div class="item-name">{{ item.label }}</div>
                              <div
                                class="item-select" 
                                :class="{ 'item-active': item.value === reqData.originalType }"
                              >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="item-main-two-r inputBg">
                    <div class="input_bg">
                      <div class="input_bg_l"></div>
                      <div class="input_bg_c"></div>
                      <div class="input_bg_r"></div>
                    </div>
                    <div class="item-main-pulldown">
                      <div class="item-main-pulldown-content">
                        <div class="item-main-pulldown-flex cursorPointer">
                          <div class="item-main-pulldown-flex-l">
                            <div class="item-main-pulldown-flex-l-m">
                              <div class="item-main-pulldown-flex-l-m-icon">
                                <i class="icon font_family icon-feiyong24"></i>
                              </div>
                              <div class="item-main-pulldown-flex-l-m-name">可见权限</div>
                            </div>
                          </div>
                          <div class="item-main-pulldown-flex-c" @click.stop="toggleDropdown('modele2')">
                            <div class="item-main-pulldown-flex-c-m">
                              <span class="item-main-pulldown-flex-c-m-name multi-line-1">
                                {{ publicTypeName }}
                              </span>
                            </div>
                          </div>
                          <div class="item-main-pulldown-flex-r" @click.stop="toggleDropdown('modele2')">
                            <i 
                              class="icon font_family"
                              :class="currentDropdownType === 'modele2' ? 'icon-a-jiantouxiangshangshousuo24' : 'icon-a-jiantouxiangxiazhankai24'"
                            >
                            </i>
                          </div>
                        </div>
                      </div>
                      <div class="item-main-pulldown-module dropdown" v-if="currentDropdownType === 'modele2'" @click.stop>
                        <div class="module-content">
                          <div class="module-content-list overflowYAuto">
                            <div 
                              class="module-content-list-item"
                              v-for="(item, index) in publicTypeList"
                              :key="index"
                              @click="findPublicTypeFun(item)"
                            >
                              <div class="item-name">{{ item.label }}</div>
                              <div
                                class="item-select" 
                                :class="{ 'item-active': item.value === reqData.publicType }"
                              >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-main">
                <div class="item-main-source relievoShadow" :class="{ focused: citeWorkIdsEr }">
                  <div class="item-main-source-content">
                    <div class="source-content">
                      <div class="source-content-pic" v-if="picList.length > 0">
                        <div class="pic-list">
                            <!-- <div class="list-item" v-for="(item, index) in picList" :key="index">
                              <img :src="item.imgUrl" alt="" />
                              <div class="delPic relievoShadow" @click="removeEventListener(item, index)">
                                <i class="icon font_family icon-guanbiwubeijing20"></i>
                              </div>
                            </div> -->
                            <div class="file-content-item" v-for="(item, index) in picList" :key="index">
                              <div class="item-info">
                                <div class="item-info-main">
                                  <div class="item-info-main-l">
                                    <img :src="item.cover" alt="" />
                                    
                                  </div>
                                  <div class="item-info-main-r">
                                    <div class="file-name multi-line-1">{{ item.name }}</div>
                                    <div class="file-size multi-line-1">{{ item.brief }}</div>
                                  </div>
                                </div>
                              </div>
                              <div class="item-del">
                                <div class="delPic relievoShadow" @click="removeEventListener(item, index)">
                                  <i class="icon font_family icon-shanchu20"></i>
                                </div>
                              </div>
                            </div>
                        </div>
                      </div>
                      <div class="source-content-input">
                        <input type="text" placeholder="平台外引用链接填写位置" v-model="reqData.statement" />
                      </div>
                    </div>
                    <div class="source-but relievoShadow">
                      <div class="source-but-mian" @click="findSourceDeclarationFun">
                        <div class="but-mian-icon">
                          <i class="icon font_family icon-jiahaowubeijing20"></i>
                        </div>
                        <div class="but-main-text">引用声明</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div class="submitTheRelease">
              <div class="submitTheRelease-main">
                <div class="draft" @click="uploadToCOS(1)">
                  <div class="draft-main">存草稿</div>
                </div>
                <div class="publish" @click="goToNextStep">
                  <div class="publish-main">下一步</div>
                </div>
              </div>
            </div>
          </div>
          <div class="work_main_bottom"
            :class="{ focused: descriptionEr }"
            v-else key="step2"
          >
            <ContentManager name="创作片段" v-model:modelValue="contents" />
            <div class="submitTheRelease">
              <div class="submitTheRelease-main">
                <div class="draft" @click="goToPreviousStep">
                  <div class="draft-main">上一步</div>
                </div>
                <div class="draft" @click="uploadToCOS(1)">
                  <div class="draft-main">存草稿</div>
                </div>
                <div class="publish" @click="findShowClauseFun">
                  <div class="publish-main">立即发布</div>
                </div>
              </div>
              <div class="check-clause">
                <div class="check-clause-box" @click="checkboxHandler">
                  <img :src="checkbox" alt="" />
                </div>
                <div class="check-clause-text">发布即代表您已阅读并同意<span @click="findTypeMsgPopupFun(4)">《用户发布作品声明告知条款》</span></div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <!-- <div class="submitTheRelease">
        <div class="submitTheRelease-main">
          <div class="draft" @click="uploadToCOS(1)">
            <div class="draft-main">存草稿</div>
          </div>
          <div class="publish" @click="ispostTask = true">
            <div class="publish-main">下一步</div>
          </div>
        </div>
      </div> -->
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

    <div class="popupModal" v-if="isClause" @click="isClause = false">
      <div class="masking"></div>
      <div class="popupModal-center" @click.stop>
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">确认发布</div>
              <div class="popupModal-main-tips">请阅读并同意《用户发布作品声明告知条款》</div>
              <div class="popupModal-main-but-group">
                <div class="popupModal-main-but relievoShadow" @click="ispostTask = true, checkbox = Check, isClause = false">继续发布</div>
              </div>
            </div>
          </div>
      </div>
    </div>
    
    <div class="popupModal" v-if="ispostTask" @click="isPayType = false">
      <div class="masking"></div>
      <div class="popupModal-center" @click.stop>
          <div class="popupModal-main">
            <div class="popupModal-module"></div>
            <div class="popupModal-main-content">
              <div class="popupModal-main-title">确认发布</div>
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
                  placeholder="请输入您想创建的作品介绍" 
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

    <!-- 选择作品共创者  -->
    <div class="popupModal" v-if="isApplyList" @click="isApplyList = false">
        <div class="masking"></div>
        <div class="personInCharge-center" @click.stop>
              <div class="personInCharge-center-title">选择作品共创者</div>
              <div class="personInCharge-center-select">
                  <div class="search-main">
                      <div class="search-icon">
                          <i class="icon font_family icon-fangdajing24"></i>
                      </div>
                      <div class="search-input">
                          <input 
                              ref="inputRefs"
                              type="text" 
                              v-model="search" 
                              placeholder="Search..." 
                              @keyup.enter="handleEnter"
                          />
                      </div>
                      <div class="search-clear">
                          <i 
                              class="icon font_family icon-shanchuyuanquanbeijing24" 
                              v-if="search !== ''"
                              @click="search = ''"
                          ></i>
                      </div>
                  </div>
              </div>
              <div class="personInCharge-center-list">
                <div class="applies-list">
                  <!-- :class="applyId == item.userId ? 'active' : ''" -->
                  <div
                      class="applies-list-item"
                      v-for="(item, index) in applyListData" 
                      :key="item.userId"
                  >
                      <div class="item-content">
                          <div class="item-content-left">
                              <div class="item-content-left-main">
                                  <div class="item-content-left-main-avatar" @click="findViewPersonalInfo(item.userId)">
                                      <img :src="item.avatar" alt="" />
                                  </div>
                                  <div class="item-content-left-main-info">
                                      <div class="item-content-left-main-info-name">{{ item.username }}</div>
                                      <div class="item-content-left-main-info-tips multi-line-1">{{ item.post }}</div>
                                  </div> 
                              </div>
                          </div>
                          <div class="item-content-right" @click="chooseApply(item)">
                            <i 
                              class="icon font_family"
                              :class="selectedItems.some(selectedItem => selectedItem.userId === item.userId) ? 'icon-yigouxuanyuanxingbeijing24' : 'icon-weigouxuanyuanxingbiankuang24'"
                            ></i>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
              <div class="personInCharge-main-selectBut">
                <div class="personInCharge-main-selectBut-item" @click="isApplyList = false">取消</div>
                <div class="personInCharge-main-selectBut-item" @click="addCoCreator">确定选择</div>
              </div>
          </div>
    </div>

    <!-- 作品来源声明  -->
    <div class="popupModal" v-if="isSourceDeclaration" @click="isSourceDeclaration = false">
        <div class="masking"></div>
        <div class="personInCharge-center" @click.stop>
              <div class="personInCharge-center-title">作品来源声明</div>
              <div class="personInCharge-center-select">
                  <div class="search-main">
                      <div class="search-icon">
                          <i class="icon font_family icon-fangdajing24"></i>
                      </div>
                      <div class="search-input">
                          <input 
                              ref="inputRefs"
                              type="text" 
                              v-model="sourceSearch" 
                              placeholder="输入引入的作品名称、作品ID" 
                              @keyup.enter="handleSourceEnter"
                          />
                      </div>
                      <div class="search-clear">
                          <i 
                              class="icon font_family icon-shanchuyuanquanbeijing24" 
                              v-if="sourceSearch !== ''"
                              @click="sourceSearch = ''"
                          ></i>
                      </div>
                  </div>
              </div>
              <div class="personInCharge-center-list">
                <div class="applies-list">
                  <!-- :class="applyId == item.userId ? 'active' : ''" -->
                  <div
                      class="applies-list-item"
                      v-for="(item, index) in worksListData" 
                      :key="index"
                  >
                      <div class="item-content">
                          <div class="item-content-left">
                              <div class="item-content-left-main works-style">
                                  <div class="item-content-left-main-avatar" @click="findViewRouterInfo(item)">
                                      <img :src="item.cover" alt="" />
                                  </div>
                                  <div class="item-content-left-main-info">
                                      <div class="item-content-left-main-info-name">{{ item.name }}</div>
                                      <div class="item-content-left-main-info-tips multi-line-1">{{ item.brief }}</div>
                                  </div> 
                              </div>
                          </div>
                          <div class="item-content-right" @click="chooseSource(item)">
                            <i 
                              class="icon font_family"
                              :class="sourceItems.some(selectedItem => selectedItem.id === item.id) ? 'icon-yigouxuanyuanxingbeijing24' : 'icon-weigouxuanyuanxingbiankuang24'"
                            ></i>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
              <div class="personInCharge-main-selectBut">
                <div class="personInCharge-main-selectBut-item" @click="isSourceDeclaration = false">取消</div>
                <div class="personInCharge-main-selectBut-item" @click="addSource">确认</div>
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

    <MsgPopup
      v-model="isDialogVisible"
      :title="dialogTitle"
      :content="dialogContent"
      :type="dialogType"
      @close="closeMsgPopup"
      @dialog-result="handleDialogResult"
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
  import { filesCos, categoryGet, aiGenerate } from '@/api/common';
  import { searchUser, worksDraft, worksSave, worksSearch, worksDraftData } from '@/api/work';
  import { missionsPublish } from '@/api/userContent';
  import { uploadFileToCOS } from '@/services/uploadService';
  import { useUploadStore } from '@/stores/uploadStore';
  import { aePublishStore } from '@/stores/publish';
  import { aeUseStore } from '@/stores/user';
  import { aeWorksStore } from '@/stores/works';
  import { useWorkUpload } from "@/stores/workUpload";
  import { setItem, getItem, isNumeric, computeHmac, classifyFileByMimeType, getFileInfoFromUrl } from '@/utils/index';
  import { showPopup } from '@/utils/usePopup';
  import { FILENAMELENGTH } from '@/utils/common';
  import ImageCropper from '@/components/tailor/ImageCropper.vue';
  import TextareaWithCounter from '@/components/TextareaWithCounter/index.vue';
  import SwitchBut from '@/components/SwitchBut.vue';
  import NodeFileUpload from '@/components/upload/nodeFileUpload.vue';
  import FileUpload from '@/components/FileUpload/index.vue';
  import TagInput from '@/components/TagInput/index.vue';
  import MsgPopup from '@/components/msgPopup/msg/index.vue';

  import NoCheck from '@/assets/images/common/noCheck.png';
  import Check from '@/assets/images/common/check.png';

  
  const router = useRouter();
  const userStore = aeUseStore();
  const worksStore = aeWorksStore();
  const publishStore = aePublishStore();
  const userInfo = userStore.getUserInfo;
  const isClause = ref(false);
  const ispostTask = ref(false);
  const currentStep = ref(1); // 当前步骤
  const checkbox = ref(NoCheck); // 勾选用户发布条款
  const nodeList: Ref<{ sort: number; url: string; }[]> = ref([]);
  const fileData = ref<File[]>([]);

  const isUnll = ref(true); // 提交按钮是否禁用
  const isPayType = ref(false); // 是否显示支付方式
  const isPayTypeShow = ref(false); // 是否显示积分支付
  const isIntegral = ref(false); // 是否选择积分支付

  const nameEr = ref(false);
  const coverEr = ref(false);
  const typeEr = ref(false);
  const briefEr = ref(false);
  const originalTypeEr = ref(false);
  const isOnChainEr = ref(false);
  const statementEr = ref(false);
  const citeWorkIdsEr = ref(false);
  const descriptionEr = ref(false);
  const attachmentUrlEr = ref(false);
  const sellOneEr = ref(false);
  const sellTwoPercentEr = ref(false);

  const uploadStore = useUploadStore();
  const worksuploadStore = useWorkUpload();

  const AuthorizationToken = ref('');
  if( userInfo.token == ''){
    AuthorizationToken.value = getItem('token');
  } else {
    AuthorizationToken.value = userInfo.token;
  }


  const goToNextStep = () => {
    currentStep.value = 2; // Switch to work_main_bottom
  };

  const goToPreviousStep = () => {
    currentStep.value = 1; // Switch back to work_main_top
  };

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
    reqData.value = newVal;
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
      businessType: 1,  // 1作品
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
        reqData.value = resultData;
        isshowAi.value = false;
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };
  
  /*********************************/

  const expense = ref(0);
  const isDraft = ref(2); // 1草稿，2发布
  const reqTime= ref([]);
  const isOriginal = ref(true);
  const isOnChain = ref(false);
  const reqData = ref({
    type: null as number | null,
    name: '',
    tags: [],
    urls: [],
    cover: '',
    brief: '',
    createMethod: '',
    coCreators: [],
    isOriginal: null as number | null,
    publicType: 1,
    statementType: null as number | null,
    statement: '',
    citeWorkIds: [],
    isOnChain: 1,
    allowReCreate: null as number | null,
    originalType: null as number | null,
    sellTwoPercent: null as number | null,
    sellTwo: null as number | null,
    sellTwoType: null as number | null,
    sellOne: null as number | null,
    isCommercial: null as number | null,
    attachmentUrl: '',
    patentUrls: [],
  });
  const leavePage = ref(2); // 1:发布成功离开页面，2：非正常离开页面
  const desTitle = ref('作品简介');

  const clippingType = '2'; // 是否裁剪
  const isCropperAvatar = ref(false); // 是否显示裁剪图片弹窗
  const cropperImg = ref<string | ArrayBuffer | null>(null); // 裁剪图片
  const cropperImgName = ref(''); // 裁剪图片名称
  const defaultCover = ref(''); // 裁剪后的默认展示图片
  
  // 介绍 	介绍类型：类型：1文本 2图片 3语音 4视频
  const contents = ref<{ type: string; data: any }[]>([]); // 作品介绍内容
  const convertContents = ref([]); // 作品介绍内容转换

  const resetReqData = () => {
    reqData.value = {
      type: null as number | null,
      name: '',
      tags: [],
      urls: [],
      cover: '',
      brief: '',
      createMethod: '',
      coCreators: [],
      isOriginal: null as number | null,
      publicType: 1,
      statementType: null as number | null,
      statement: '',
      citeWorkIds: [],
      isOnChain: 1,
      allowReCreate: null as number | null,
      originalType: null as number | null,
      sellTwoPercent: null as number | null,
      sellTwo: null as number | null,
      sellTwoType: null as number | null,
      sellOne: null as number | null,
      isCommercial: null as number | null,
      attachmentUrl: '',
      patentUrls: [],
    };
  };


  /** 
   * 标签
   *  **/
  const handleTagsUpdate = (newTags: string[]) => {
    reqData.value.tags = newTags;
  };

  const findWorkTypeFun =  (type: number) => {
    reqData.value.type = type;
  };


  // 获取从草稿列表传参过来的草稿id详情
  const getTaskDraft = () => {
    const resData = {
      id: userInfo.workDraftId
    }
    return new Promise<void>((resolve, reject) => {
      worksDraftData(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        let attr: any = [];
        if(resultData.descriptions.length > 0) {
          resultData.descriptions.forEach(v => {
            let types = '';
            if(v.type == '1') { types = 'text' }
            if(v.type == '2') { types = 'image' }
            if(v.type == '3') { types = 'audio' }
            if(v.type == '4') { types = 'video' }
            if(v.content !== '' && v.content !== undefined && v.content !== null) {
              attr.push({
                type: types,
                data: v.content
              })
            }
          });
        }
        resultData.description = attr;
        defaultCover.value = resultData.cover;
        contents.value = resultData.description;
        convertContents.value = attr;

        coCreatorList.value = resultData.coCreators;
        let coCreatorsId = [];
        coCreatorList.value.forEach((item: any) => {
          coCreatorsId.push(item.userId);
        });

        let citeWorkIdList = [];
        picList.value = resultData.citeWorks;
        if(picList.value.length > 0) {
          picList.value.forEach((item: any) => {
            citeWorkIdList.push(item.workId);
          });
        }
        

        originalTypeName.value = resultData.originalType === 1 ? '原创' : '非原创';
        isOnChain.value = resultData.isOnChain === 1 ? true : false;
        publicTypeName.value = resultData.publicType === 1 ? '所有人可见' : 
                resultData.publicType === 2 ? '仅互关可见' : '仅自己可见';


        // 回显作品文件
        fileData.value = resultData.urls;

        // 回显作品源件
        if(resultData.attachmentUrl !== '') {
          let fileUrl = resultData.attachmentUrl;
          getFileInfoFromUrl(fileUrl).then(info => {
            uploadedFiles.value = [
              {
                mimeType: info.extension,
                name: info.name + '.' + info.extension,
                size: info.size
              }
            ]
          });
        }

        // 回显专利
        if(resultData.patentUrls !== '') {
          let fileUrl = resultData.patentUrls;
          getFileInfoFromUrl(fileUrl).then(info => {
            uploadPatentFiles.value = [
              {
                mimeType: info.extension,
                name: info.name + '.' + info.extension,
                size: info.size
              }
            ]
          });
        }
        resultData.sellOne = Number(resultData.sellOne) / 100;
        resultData.sellTwo = Number(resultData.sellTwo) / 100;
        resultData.sellTwoPercent = Number(resultData.sellTwoPercent) / 100;

        reqData.value = resultData;
        reqData.value.coCreators = coCreatorsId;
        reqData.value.citeWorkIds = citeWorkIdList;
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

  // 普通型价格只能输入数字
  const handleSellOneInput = (event: any) => {
    const value = event.target.value;
    // 使用正则表达式限制输入为数字和最多两位小数
    const regex = /^\d+(\.\d{0,2})?$/;

    if (regex.test(value) && parseFloat(value) > 0) {
      reqData.value.sellOne = value;
    } else {
      // 如果输入不符合要求，则保留之前的合法值
      event.target.value = reqData.value.sellOne || '';
    }
  };

  // 增强型价格只能输入数字
  const handSellTwoInput = (event: any) => {
    const value = event.target.value;
    // 使用正则表达式限制输入为数字和最多两位小数
    const regex = /^\d+(\.\d{0,2})?$/;

    if (regex.test(value) && parseFloat(value) > 0) {
      reqData.value.sellTwo = value;
    } else {
      // 如果输入不符合要求，则保留之前的合法值
      event.target.value = reqData.value.sellTwo || '';
    }
  };

  // 增强型抽佣百分比只能输入数字
  const handleSellTwoPercentErInput = (event: any) => {
    const value = event.target.value;
    // 使用正则表达式限制输入为正整数
    const regex = /^[1-9]\d*$/;

    if (regex.test(value)) {
        const numValue = parseInt(value, 10);
        if (numValue >= 1 && numValue <= 100) {
            reqData.value.sellTwoPercent = numValue;
        } else {
            // 如果输入不符合范围要求，则保留之前的合法值
            event.target.value = reqData.value.sellTwoPercent || '';
        }
    } else {
        // 如果输入不符合正则表达式要求，则保留之前的合法值
        event.target.value = reqData.value.sellTwoPercent || '';
    }
};
  
  

  /** 作品共创者 **/
  const search = ref(''); // 搜索内容
  const coCreatorList = ref<{ userId: number; username: string; avatar: string; }[]>([]); // 展示的共创者列表
  const isApplyList = ref(false); // 显示搜索共创者列表
  const applyListData = ref<{ userId: number; username: string; avatar: string; }[]>([]); // 用户列表数据
  const selectedItems = ref<{ userId: number; username: string; avatar: string; }[]>([]); // 选中的用户数据
  /** 获取作品共创者 ***/
  const selectResponsiblePerson = () => {
    selectedItems.value = coCreatorList.value;
    isApplyList.value = true;
  };

  /** 处理回车事件 搜索作品共创者 ***/
  const handleEnter = () => {
    let reqData = {
      type: 1,
      value: search.value
    };
    getApplyaList(reqData);
  };

  /** 获取作品共创者列表数据 ***/
  const getApplyaList = (reqData: any) => {
    console.log('获取作品共创者列表数据', reqData);
    return new Promise<void>((resolve, reject) => {
      searchUser(reqData).then((response: any) => {
          const { code, message } = response;
          
          if (code !== 200) {
              showPopup(message, 'error', 3000);
              return;
          }
          applyListData.value = response.data;
          
          resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 选择创建者
  const chooseApply = (item: any) => {
    const index = selectedItems.value.findIndex(selectedItem => selectedItem.userId === item.userId);
    if (index === -1) {
      selectedItems.value.push(item); // 如果不在选中列表中，则添加
    } else {
      selectedItems.value.splice(index, 1); // 如果已经在选中列表中，则移除
    }
  };

  // 添加共同创作者
  const addCoCreator = () => {
    // selectedItems.value.forEach(item => {
    //   coCreatorList.value.push(item);
    //   reqData.value.coCreators.push(item.userId);
    // });
    coCreatorList.value = [...selectedItems.value];
    reqData.value.coCreators = selectedItems.value.map(item => item.userId);

    // 清空相关状态
    isApplyList.value = false;
    applyListData.value = [];
    selectedItems.value = [];
    search.value = '';
  };

  // 查看用户个人中心
  const findViewPersonalInfo = (userId: any) => {
    userInfo.othersId = userId;
    router.push('/PersonalHomepage');
  };

  /** 可见权限 **/
  const publicTypeName = ref('所有人可见');
  const publicTypeList = ref([
    { value: 1, label: '所有人可见' },
    { value: 2, label: '仅互关可见' },
    { value: 3, label: '仅自己可见' },
  ]);
  const findPublicTypeFun = (item: any) => {
    reqData.value.publicType = item.value;
    publicTypeName.value = item.label;
    handleClickOutside();
  };

  /** 创作属性 **/
  const originalTypeName = ref('');
  const originalTypeList = ref([
    { value: 1, label: '原创' },
    { value: 2, label: '非原创' },
  ]);
  const findoriginalTypeFun = (item: any) => {
    reqData.value.originalType = item.value;
    originalTypeName.value = item.label;
    handleClickOutside();
  };

  /** 增强型 **/
  const enhancelName = ref('');
  const enhanceList = ref([
    { value: 2, label: '按期限' },
    { value: 1, label: '按次数' },
  ]);
  const findEnhanceFun = (item: any) => {
    reqData.value.sellTwoType = item.value;
    enhancelName.value = item.label;
  };

  // 判断点击弹框外关闭弹框
  const currentDropdown = ref<string | null>(null);
  const currentDropdownType = ref<string | null>(null);
  const toggleDropdown = (dropdownName: string) => {
    if(dropdownName == 'modele2') {
      currentDropdownType.value = currentDropdownType.value === dropdownName ? null : dropdownName;;
    } else {
      currentDropdown.value = currentDropdown.value === dropdownName ? null : dropdownName;
    }
    console.log('currentDropdown.value1', currentDropdown.value);
    document.addEventListener('click', handleClickOutside);
    
  };
  const handleClickOutside = () => {
    currentDropdown.value = null;
    currentDropdownType.value = null;
  };

  // 打开消息弹框 type 1通知、2需要同意的通告
  const isDialogVisible = ref(false);
  const dialogTitle = ref('');
  const dialogContent = ref('');
  const dialogType = ref(1);
  const findTypeMsgPopupFun = (type: number) => {
    if(type == 1) {
      dialogTitle.value = '普通型';
      dialogContent.value = '普通型仅允许出于个人非商业目的（如个人学习或欣赏）对该作品进行查看、欣赏或使用。';
      dialogType.value = 1;
      isDialogVisible.value = true;
    } else if(type == 2) {
      dialogTitle.value = '增强型';
      dialogContent.value = '<h3>二次创作</h3><p>允许购买者对作品进行修改、调整或衍生，创作新的作品（以下简称“二次创作作品”）</p>'+
                            '<h3>商业使用权</h3><p>允许购买者可以将二次创作作品用于商业目的，包括但不限于销售、广告、营销、商业项目等。</p>'+
                            '<h3>分发与展示权</h3><p>允许购买者可以分发、展示或传播二次创作作品，但不得将授权权利转让给第三方。</p>';
      dialogType.value = 1;
      isDialogVisible.value = true;
    } else if(type == 3) {
      dialogTitle.value = '抽佣';
      dialogContent.value = '若购买者购买您的作品后进行二次创作，并通过授权平台获得收益，则须按照您设定的抽佣比例将收益分配给您。';
      dialogType.value = 1;
      isDialogVisible.value = true;
    } else if(type == 4) {
      dialogTitle.value = '用户发布作品声明告知条款';
      dialogContent.value = '<h3>第一条：总则</h3>'+
                              '<p>1、AE平台致力于协助去中心化创业人运用去中心化解决实际问题 提供相关技术支持等服务。</p>'+
                              '<p>2、当您同意本公约并按照页面提示，完成全部的团队创建和数字身份提交并通过平台审核后，成为团队管理者。</p>'+
                              '<p>3、您了解并知悉，平台有权独立决定您创建团队是否通过及团队 内数字身份是否合规。'+
                            '<h3>第二条：定义与解释</h3>'+
                              '<p>1、AE平台旗下去中心化团队组织工具，您可以通过AE平台发行数字身份、活动门票数字证明、作品数字证明、铸造上链分享、传 播、流通您享有版权或自主创作的作品极其相关内容，也可使用平台提供的技术辅助、数据统计工具等。平台将通过区块链技术 及智能合约在双方约定的范围内为您的团队建设与治理、数字内容管理提供便利，平台用户可以在平台内接收AE平台社区内容、 数字身份、数字门票、数字内容等在线内容。</p>。'+
                              '<p>2、AE平台支持各种类型的数字创业者或其他从业者，您可以是画家、作品发布者、活动策划者、接收作品、参与活动、作者、收藏家或其他职业有创造力、公信力、领导力、统筹力的从业者。</p>'+
                              '<p>3、AE平台支持数字身份铸造上链、活动发布、作品专利保护售卖 及空投、优先购、打折卡等功能，数字作品上传支持jpg/GIF图 片、FBX/GLB格式3D模型，将续支持word/PDF/TXT/PPT文本、 MP4/APE/FLAC音乐、MPEG视频等数字资产类型。文件下载支持图 片、zip文件包下载。'+
                              '<p>您作为管理者，对AE平台相关数字作品上传者或提供者及权限开放者，须确认相关铸造上链数字作品及前述数字作品作品相关的封面、创作者姓名、肖像权、标识、作品权益，及您提供的相关 宣传资料、文案等内容为原创或拥有版权以及版权约定内的商业 行为，且上链内容不得二次铸造上链，即您确认享有数字作品铸 造上链相关内容权利及进行前述操作的全部权利，且平台按照与 您约定的方式在平台内或宣传使用数字作品内容不会侵犯第三方 的合法权益，亦无需另行取得第三方同意或向其承担责任。</p>';

      dialogType.value = 2;
      isDialogVisible.value = true;
    }
  };
  const handleDialogResult = (result: 'agree' | 'disagree' | 'timeout') => {
    switch (result) {
      case 'agree':
        console.log('用户同意了公告');
        checkbox.value = Check;
        // 执行同意后的逻辑
        break;
      case 'disagree':
        console.log('用户不同意公告');
        checkbox.value = NoCheck;
        // 执行不同意后的逻辑
        break;
      case 'timeout':
        console.log('对话框超时关闭');
        // 执行超时逻辑
        break;
    }
  };
  const closeMsgPopup = () => {
    isDialogVisible.value = false;
  };

  // 勾选用户发布协议
  const checkboxHandler = () => {
      if (checkbox.value == NoCheck) {
          checkbox.value = Check;
      } else {
          checkbox.value = NoCheck;
      }
  }
  
  // 声明来源
  const picList = ref([]); // 声明来源选中的作用、用户
  const sourceSearch = ref(''); // 查询声明来源
  const worksListData = ref([]);
  const isSourceDeclaration = ref(false);
  const sourceItems = ref([]);

  const findSourceDeclarationFun = () => {
    isSourceDeclaration.value = true;
  };
  /** 处理回车事件 搜索声明来源 ***/
  const handleSourceEnter = () => {
    let reqData = {
      name: sourceSearch.value
    };
    getSourceList(reqData);
  };

  /** 获取声明来源列表数据 ***/
  const getSourceList = (reqData: any) => {
    console.log('获取声明来源列表数据', reqData);
    return new Promise<void>((resolve, reject) => {
      worksSearch(reqData).then((response: any) => {
          const { code, message } = response;
          
          if (code !== 200) {
              showPopup(message, 'error', 3000);
              return;
          }
          worksListData.value = response.data;
          
          resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };

  // 选择声明来源
  const chooseSource = (item: any) => {
    // const index = sourceItems.value.findIndex(selectedItem => selectedItem.id === item.id);
    // if (index === -1) {
    //   sourceItems.value.push(item); // 如果不在选中列表中，则添加
    // } else {
    //   sourceItems.value.splice(index, 1); // 如果已经在选中列表中，则移除
    // }
    sourceItems.value = [];
    sourceItems.value.push(item);
  };

  // 添加声明来源 //	类型：1作品 2用户
  const addSource = () => {
    sourceItems.value.forEach(item => {
      const index = picList.value.findIndex(selectedItem => selectedItem.id === item.id);
      if (index === -1) {
        picList.value.push(item); // 如果不在选中列表中，则添加
      }

      reqData.value.citeWorkIds.push(item.id);
    });
    
    isSourceDeclaration.value = false;
    worksListData.value = [];
    sourceItems.value = [];
    sourceSearch.value = '';
  };

  // 移除选中的来源
  const removeEventListener = (item: any, index: number) => {
    picList.value.splice(index, 1); 
    const workIndex = reqData.value.citeWorkIds.indexOf(item.id);
    if (workIndex !== -1) {
      reqData.value.citeWorkIds.splice(workIndex, 1);
    }
  }

  // 点击图片进行跳转 类型：1作品 2用户
  const findViewRouterInfo = (item: any) => {
    findViewWorksSeeInfo(item.id);
  }

  // 跳转到作品详情
  const findViewWorksSeeInfo =async (item: any) => {
    // let id = item;
    try {
      await router.push({ 
        name: 'WorksDetails', 
        params: { id: workId }
      });
    } catch (error) {
      console.error('路由导航失败:', error);
      showPopup('导航失败，请稍后重试', 'error', 3000);
    }
  }

  // 上传附件
  const addFile = ref<HTMLInputElement | null>(null);
  const replaceIndex = ref<number | null>(null);
  const uploadedFiles = ref<
    Array<{
      name: string;
      url: string;
      mimeType: string;
      progress: number;
    }>
  >([]);
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const handleAttFileChange = () => {
    const target = event.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);

        let allowedFiles = files;
        allowedFiles = files.slice(0, 1); // 只允许一个文件

        allowedFiles.forEach((file) => {
          const fileUrl = URL.createObjectURL(file);
          const mimeType = file.type;
          let progress = 0; // 初始化进度为 0
          
          // 如果是替换操作，更新对应索引的文件
          if (replaceIndex.value !== null) {
            uploadedFiles.value[replaceIndex.value] = {
              name: file.name,
              url: fileUrl,
              mimeType: mimeType,
              progress: progress,
              size: file.size,
            };
            replaceIndex.value = null;
          } else {
            uploadedFiles.value.push({
              name: file.name,
              url: fileUrl,
              mimeType: mimeType,
              progress: progress,
              size: file.size,
            });
          }

          // 模拟上传进度
          const interval = setInterval(() => {
            if (progress < 100) {
              progress = Math.min(progress + 10, 100);
              // 更新对应的 file.progress
              const fileIndex = uploadedFiles.value.findIndex(
                (f) => f.name === file.name
              );
              if (fileIndex !== -1) {
                uploadedFiles.value[fileIndex].progress = progress;
              }
              if (progress === 100) {
                clearInterval(interval);
              }
            }
          }, 500);

          // 保存到状态管理
          worksuploadStore.addAttsFile(file);
        });

        target.value = ""; // 清空文件输入
      }
  };
  const removeEventAttener = (index: number) => {
    uploadedFiles.value.splice(index, 1);
    // 从状态管理中移除文件
    worksuploadStore.removeAttsFile(index);
  }


  
  // 上传专利
  const patentFile = ref<HTMLInputElement | null>(null);
  const replacePatentIndex = ref<number | null>(null);
  const uploadPatentFiles = ref<
    Array<{
      name: string;
      url: string;
      mimeType: string;
      progress: number;
    }>
  >([]);
  const handlePatentFileChange = () => {
    const target = event.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);

        let allowedFiles = files;
        allowedFiles = files.slice(0, 1); // 只允许一个文件

        allowedFiles.forEach((file) => {
          const fileUrl = URL.createObjectURL(file);
          const mimeType = file.type;
          let progress = 0; // 初始化进度为 0
          
          // 如果是替换操作，更新对应索引的文件
          if (replacePatentIndex.value !== null) {
            uploadPatentFiles.value[replacePatentIndex.value] = {
              name: file.name,
              url: fileUrl,
              mimeType: mimeType,
              progress: progress,
              size: file.size,
            };
            replacePatentIndex.value = null;
          } else {
            uploadPatentFiles.value.push({
              name: file.name,
              url: fileUrl,
              mimeType: mimeType,
              progress: progress,
              size: file.size,
            });
          }

          // 模拟上传进度
          const interval = setInterval(() => {
            if (progress < 100) {
              progress = Math.min(progress + 10, 100);
              // 更新对应的 file.progress
              const fileIndex = uploadPatentFiles.value.findIndex(
                (f) => f.name === file.name
              );
              if (fileIndex !== -1) {
                uploadPatentFiles.value[fileIndex].progress = progress;
              }
              if (progress === 100) {
                clearInterval(interval);
              }
            }
          }, 500);

          // 保存到状态管理
          worksuploadStore.addPatentFile(file);
        });

        target.value = ""; // 清空文件输入
      }
  };
  const removeEventPatentener = (index: number) => {
    uploadedFiles.value.splice(index, 1);
    // 从状态管理中移除文件
    worksuploadStore.removePatentFile(index);
  }


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
    // 1 视频类 2 图片类 3 语音类 4 文档类
    // if(reqData.value.type == 'video') {
    //   reqData.value.type = 1
    // } else if(reqData.value.type == 'picture') {
    // }
    // if (reqTime.value.length > 0) {
    //   reqData.value.startTime = reqTime.value[0];
    //   reqData.value.endTime = reqTime.value[1];
    // }
    
    reqData.value.description = attr;
    reqData.value.isCommercial = userInfo.worksType;
    let resData = reqData.value;
    
    return resData;
  };
  
  // 发布作品
  const findShowClauseFun = () => {
    if(checkbox.value == Check) {
      ispostTask.value = true;
    } else {
      isClause.value = true;
    }
  };
  
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
  const totalFileSize = ref(0);
  const publish = async () => {
      isPublishing.value = true;
      convertContents.value = [...contents.value];
      try {
        // 上传封面图片
        if (uploadStore.coverImage) {
          const coverResult = await uploadFileToCOS(uploadStore.coverImage, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value );
          console.log('coverResult', coverResult);
          reqData.value.cover = `https://${coverResult.data.Location}`;
          totalFileSize.value += uploadStore.coverImage.size; // 累加封面图片大小
          if (!coverResult.success) throw coverResult.error;
        }

        // 上传作品文件
        let work = [];
        for (const file of worksuploadStore.worksFile) {
          const detailResult = await uploadFileToCOS(file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          console.log('detailResult', detailResult);
          work.push(`https://${detailResult.data.Location}`)
          reqData.value.urls = work;
          totalFileSize.value += file.size; // 累加作品文件大小
          if (!detailResult.success) throw detailResult.error;
        }

        // 上传简介文件
        let attr = [];
        for (const file of uploadStore.detailFiles) {
          const detailResult = await uploadFileToCOS(file.file, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          console.log('detailResult', detailResult);
          attr.push(`https://${detailResult.data.Location}`)
          let urlArrt = attr.join(',');
          // contents.value[file.id].data = urlArrt;
          
          console.log(convertContents.value);
          convertContents.value[file.id].data = urlArrt;
          totalFileSize.value += file.file.size; // 累加创作过程文件大小
          if (!detailResult.success) throw detailResult.error;
        }


        // 上传附件
        for (const files of worksuploadStore.attsFiles) {
          const detailResult = await uploadFileToCOS(files, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          let url = `https://${detailResult.data.Location}`;
          reqData.value.attachmentUrl = url;
          totalFileSize.value += files.size; // 累加附件大小
          if (!detailResult.success) throw detailResult.error;
        }

        // 上传专利
        for (const files of worksuploadStore.patentFiles) {
          const detailResult = await uploadFileToCOS(files, bucket.value, region.value, sessionToken.value, tmpSecretId.value, tmpSecretKey.value, token.value);
          let url = `https://${detailResult.data.Location}`;
          reqData.value.patentUrls.push(url);
          totalFileSize.value += files.size; // 累加附件大小
          if (!detailResult.success) throw detailResult.error;
        }

        
        console.log('总上传文件大小:', totalFileSize.value); // 输出总上传文件大小
        // 所有文件上传成功后，执行发布操作
        submitContents();
        findupChainPoundage(totalFileSize.value); // 计算链上手续费
        // 清空上传状态
        uploadStore.clearAllFiles();
        worksuploadStore.clearAllFiles();

      } catch (error) {
        console.error('发布失败：', error);
        showPopup('文件上传失败，请重试！', 'error', 3000);
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
    const {
      name,
      type,
      cover,
      brief,
      isOnChain,
      description,
      originalType,
      statement,
      citeWorkIds,
      attachmentUrl,
      sellOne,
      sellTwoPercent,
    } = resData;

    let verifyData = {
      name: name,
      type: type,
      cover: cover,
      brief: brief,
      isOnChain: isOnChain,
      description: description,
      originalType: originalType,
      attachmentUrl: attachmentUrl,
      sellOne: sellOne,
      sellTwoPercent: sellTwoPercent,
    };
    
    // 检查对象中的每个键值对
    for (const key in verifyData) {
      if (verifyData.hasOwnProperty(key)) {
        console.log('resData.key', resData[key]);
        const value = resData[key];
        if(key === 'id') {
          continue;
        }
        if(key === 'originalType') {
          let values = value || 0;
          if(values == 1) {
            citeWorkIdsEr.value = false;
          } else {
            if(citeWorkIds.length > 0 || statement !== '') {
              isUnll.value = true;
              citeWorkIdsEr.value = false;
            } else {
              citeWorkIdsEr.value = true;
              isUnll.value = false;
            }
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
            case 'type':
              typeEr.value = true;
              break;
            case 'cover':
              coverEr.value = true;
              break;
            case 'brief':
              briefEr.value = true;
              break;
            case 'isOnChain':
              isOnChainEr.value = true;
              break;
            case 'description':
              descriptionEr.value = true;
              break;

            case 'originalType':
              originalTypeEr.value = true;
              break;
            case 'attachmentUrl':
              attachmentUrlEr.value = true;
              break;
            case 'sellOne':
              sellOneEr.value = true;
              break;
            case 'sellTwoPercent':
              sellTwoPercentEr.value = true;
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
            case 'type':
              typeEr.value = false;
              break;
            case 'cover':
              coverEr.value = false;
              break;
            case 'brief':
              briefEr.value = false;
              break;
            case 'isOnChain':
              isOnChainEr.value = false;
              break;
            case 'description':
              descriptionEr.value = false;
              break;

            case 'originalType':
              originalTypeEr.value = false;
              break;
            case 'attachmentUrl':
              attachmentUrlEr.value = false;
              break;
            case 'sellOne':
              sellOneEr.value = false;
              break;
            case 'sellTwoPercent':
              sellTwoPercentEr.value = false;
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
      sbumitData.value = resData;
      if(reqData.value.isOnChain !== 1) {
        findSubmitTaskDataFun(resData);
      } else {
        // 判断是否开启积分支付，开启积分支付时判断积分是否够支付，够的话显示积分支付按钮反之不显示
        if(isPointOpen.value == 1) {
          if(Number(integralBalance.value) > Number(expense.value)) {
            isPointOpen.value = 1;
            isPayType.value = true;
            payData.value.type = 2;
          } else {
            isPointOpen.value = 0;
            payData.value.type = 1;
            payFee(16, sbumitData.value);
          }
        } else {
          isPointOpen.value = 0;
          payData.value.type = 1;
          payFee(16, sbumitData.value);
        }
      }
      
    }
  };

  // 保存草稿
  const submitDraft = (data: any) => {
    const resData = data;
    return new Promise<void>((resolve, reject) => {
      worksDraft(resData).then((response: any) => {
        const { code, data, message } = response;
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        showPopup('保存草稿成功！', 'success', 3000);
        router.push({ name: 'PersonalWorks'});
        resolve()
      }).catch((error: any) => {
          reject(error)
      })
    })
  };


  // 提交发布作品数据
  const findSubmitTaskDataFun = (resData: any) => {
    return new Promise<void>((resolve, reject) => {
      worksSave(resData).then((response: any) => {
        const { code, data, message } = response;
        
        const resultData = data;
        if (code !== 200) {
          showPopup(message, 'error', 3000);
            return;
        }
        
        publishStore.questInfo.data = {};
        setItem('work', findClearDraft());
        let id = data.businessId;
        worksStore.worksInfo.currentId = id;
        worksStore.worksInfo.isRouterType = 3;
        router.push({ name: 'WorksDetails', params: { id } });
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
    payFee(16, sbumitData.value);
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
    payFee(15, sbumitData.value);
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
  const findupChainPoundage = (size: number) => {
    console.log('文件总大小size', size);
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
        if(type == 15) {
          payData.value.isPay = false;
          let id = data.workId;
          userInfo.workType = 1;
          setItem('workType', 1);
          setItem('work', findClearDraft());
          convertContents.value = [];
          console.log('积分支付时，成功后清空数据', findClearDraft());
          console.log('积分支付时，成功后清空数据', getItem('work'));
          resetReqData();
          worksStore.worksInfo.currentId = id;
          worksStore.worksInfo.isRouterType = 3;
          router.push({ name: 'WorksDetails', params: { id } });
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
            setItem('work', findClearDraft());
            resetReqData(); // 重置数据
            convertContents.value = [];
            console.log('getItem("work")', getItem('work'))
            publishStore.questInfo.data = {};
            payData.value.isPay = false;
            clearTimeout(timer);
            isActive.value = false;
            let id = data.businessId;
            userInfo.taskType = 1;
            setItem('workType', 1);
            leavePage.value = 1;
            worksStore.worksInfo.currentId = id;
            worksStore.worksInfo.isRouterType = 3;
            router.push({ name: 'WorksDetails', params: { id } });
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
      type: null as number | null,
      name: '',
      tags: [],
      urls: [],
      cover: '',
      brief: '',
      createMethod: '',
      coCreators: [],
      isOriginal: null as number | null,
      publicType: 1,
      statementType: null as number | null,
      statement: '',
      citeWorkIds: [],
      isOnChain: 1,
      allowReCreate: null as number | null,
      originalType: null as number | null,
      sellTwoPercent: null as number | null,
      sellTwo: null as number | null,
      sellTwoType: null as number | null,
      sellOne: null as number | null,
      isCommercial: null as number | null,
      attachmentUrl: '',
      patentUrls: [],
    }
    return reqData;
  }

  /**
   * 封面裁剪
   * **/
  const closeDefaultCover = () => {
    defaultCover.value = '';
    reqData.value.cover = '';
    clearUploadFiles();
  }
  // 上传图片
  const handleImageChange = (file) => {
    const reader = new FileReader();
    const isJPG = file.raw.type === 'image/jpeg';
    const isPNG = file.raw.type === 'image/png';
    if (!isJPG && !isPNG) {
        showPopup('只能上传jpg/png文件', 'error', 3000);
        clearUploadFiles();
        return false;
    }

    const nameSize = file.name.length;
    if(nameSize > FILENAMELENGTH) {
      showPopup('文件名称过长，请修改后再进行上传，谢谢！', 'error', 3000);
      clearUploadFiles();
      return false;
    }

    // 检查文件大小
    const maxSize = 6 * 1024 * 1024;
    if (file.size > maxSize) {
        showPopup('图片大小不能超过6M', 'error', 3000);
        clearUploadFiles();
        return false;
    }
    console.log(reader, 'reader');
    reader.onload = (e) => {
      const target = e.target;
      if (target && typeof target.result === 'string') {
        cropperImg.value = target.result;
        cropperImgName.value = file.name;
        isCropperAvatar.value = true;
      }
    }
    reader.readAsDataURL(file.raw)
  }

  const handleCropperSuccess = (url: any) => {
      defaultCover.value = url;
      isCropperAvatar.value = false;
  };
  const uploadRef = ref<InstanceType<typeof ElUpload> | null>(null);
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
      setItem('work', resData);
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
    if (item == 'cover') {
      if(reqData.value.cover !== '') {
        coverEr.value = false;
      }
    }
    if (item == 'type') {
      if(reqData.value.type !== '') {
        typeEr.value = false;
      }
    }
    if (item == 'brief') {
      if(reqData.value.brief !== '') {
        briefEr.value = false;
      }
    }
    if (item == 'isOnChain') {
      if(reqData.value.isOnChain !== '') {
        isOnChainEr.value = false;
      }
    }
    if (item == 'isOriginal') {
      if(reqData.value.isOriginal !== '') {
        isOriginalEr.value = false;
      }
    }
    
    if (item == 'publicType') {
      if(reqData.value.publicType !== '') {
        publicTypeEr.value = false;
      }
    }
    if (item == 'description') {
      if(reqData.value.description !== '') {
        descriptionEr.value = false;
      }
    }
    isUnll.value = true;
  }

  // 是否上链：0否1是
  watch(() => isOnChain.value, (newVal, oldVal) => {
    
    reqData.value.isOnChain = isOnChain.value ? 1 : 0;
  });

  // 是否原创 0否1是
  watch(() => isOriginal.value, (newVal, oldVal) => {
    reqData.value.isOriginal = isOriginal.value ? 1 : 0;
  });

  // watch(contents, (newContents) => {
  //   console.log('contents changed:', newContents);
  // }, { deep: true });
  

  onMounted(() => {
    if(userInfo.openworkType == 1) {
      if(getItem('work') !== null) {
        reqData.value = getItem('work');
      } else {
        reqData.value = findClearDraft();
      }
      let attr: any = [];
        if(reqData.value.description?.length > 0) {
          reqData.value.description.forEach(v => {
            let types = '';
            if(v.type == '1') { types = 'text' }
            if(v.type == '2') { types = 'image' }
            if(v.type == '3') { types = 'audio' }
            if(v.type == '4') { types = 'video' }
            if(v.content !== '' && v.content !== undefined && v.content !== null) {
              attr.push({
                type: types,
                data: v.content
              })
            }
          });
        }
        reqData.value.description = attr;
        defaultCover.value = reqData.value.cover;
        contents.value = reqData.value.description;
        convertContents.value = attr;

        // coCreatorList.value = reqData.value.coCreators;
        coCreatorList.value = reqData.value.coCreators.filter(item => item && item.userId); // 过滤掉无效项
        let coCreatorsId = [];
        if (coCreatorList.value.length > 0) {
          coCreatorList.value.forEach((item: any) => {
            coCreatorsId.push(item.userId);
          });
        }

        let citeWorkIdList = [];
        picList.value = reqData.value.citeWorkIds;
        if(picList.value?.length > 0) {
          picList.value.forEach((item: any) => {
            citeWorkIdList.push(item.workId);
          });
        }
        if(reqData.value.originalType !== null) {
          originalTypeName.value = reqData.value.originalType === 1 ? '原创' : '非原创';
        }
        if(reqData.value.isOnChain != null) {
          isOnChain.value = reqData.value.isOnChain === 1 ? true : false;
        }
        if(reqData.value.publicType != null) {
          publicTypeName.value = reqData.value.publicType === 1 ? '所有人可见' : 
                  reqData.value.publicType === 2 ? '仅互关可见' : '仅自己可见';
        }
        
        // 回显作品文件
        fileData.value = reqData.value.urls;

        // 回显作品源件
        if(reqData.value.attachmentUrl !== '') {
          let fileUrl = reqData.value.attachmentUrl;
          getFileInfoFromUrl(fileUrl).then(info => {
            uploadedFiles.value = [
              {
                mimeType: info.extension,
                name: info.name + '.' + info.extension,
                size: info.size
              }
            ]
          });
        }

        // 回显专利
        if(reqData.value.patentUrls.length > 0) {
          let fileUrl = reqData.value.patentUrls;
          getFileInfoFromUrl(fileUrl).then(info => {
            uploadPatentFiles.value = [
              {
                mimeType: info.extension,
                name: info.name + '.' + info.extension,
                size: info.size
              }
            ]
          });
        }
        reqData.value.sellOne = Number(reqData.value.sellOne) / 100 || null;
        reqData.value.sellTwo = Number(reqData.value.sellTwo) / 100 || null;
        reqData.value.sellTwoPercent = Number(reqData.value.sellTwoPercent) / 100 || null;

        reqData.value.coCreators = coCreatorsId;
        reqData.value.citeWorkIds = citeWorkIdList;

      if (uploadStore.coverImage instanceof File || uploadStore.coverImage instanceof Blob) {
        defaultCover.value = URL.createObjectURL(uploadStore.coverImage);
      } else {
        defaultCover.value = reqData.value.cover;
      }
      fileData.value = worksuploadStore.worksFile;
      if(worksuploadStore.attsFiles.length > 0) {
        uploadedFiles.value = [
          {
            mimeType: worksuploadStore.attsFiles[0].type,
            name: worksuploadStore.attsFiles[0].name,
            size: worksuploadStore.attsFiles[0].size
          }
        ]
      }

      // let attr: any = [];
      // if(reqData.value.description !== undefined) {
      //   if(reqData.value.description.length > 0) {
      //     reqData.value.description.forEach(v => {
      //       let types = '';
      //       if(v.type == '1') { types = 'text' }
      //       if(v.type == '2') { types = 'image' }
      //       if(v.type == '3') { types = 'audio' }
      //       if(v.type == '4') { types = 'video' }
      //       if(v.content !== '' && v.content !== undefined && v.content !== null) {
      //         attr.push({
      //           type: types,
      //           content: v.content
      //         })
      //       }
      //     });
      //   }
      // }
      // reqData.value.description = attr;

      // fileData.value = reqData.value.urls;
      
    } else if(userInfo.openworkType == 2) {
      getTaskDraft(); // 获取作品草稿
    }
    
    findPointIsOpenFun(); // 判断是否开启积分支付
    findChainBalanceFun(); // 查询用户积分余额
  })
  
</script>

<style lang='scss' scoped>
  @use '@/assets/styles/common.scss';
  @use '@/assets/styles/work.scss';
  @use '@/assets/styles/popupModal.scss';
</style>

function emit(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}
