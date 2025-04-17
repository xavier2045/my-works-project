<template>
  <div class="menu-view" :key="isgoMenu" @click="userInfo.isMsgShow = false">
    <div class="menu-view-conter">
        <!-- <div class="view-bg">
            <img :src="pcBg" alt="" />
        </div> -->
        <ParticleWhirlpool class="inner-background" />
        <div class="view-conter-main">
            <div class="conrer-mian">
                <div class="main-content">
                    <div class="main-content-conter">
                        <SuspMenu class="left-nav" :menuItems="suspMenu" />
                        <div class="setUp-view" v-if="isSetUp" @click.stop>  
                            <div class="setUp-view-main">
                                <div 
                                    class="setUp-view-main-item"
                                    :class="{ 'active': isSetActive === item.id }"
                                    v-for="item in setUpData" 
                                    :key="item.id"
                                    @click="findSetUpClick(item.id)"
                                >
                                    <div class="item-icon">
                                        <i class="icon font_family" :class="item.icon"></i>
                                    </div>
                                    <div class="item-name">{{ item.name }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="pc-conter">
                            <div class="menuBar" :key="refreshPage">
                                <div class="menuBer-mian">
                                    <div class="personal-info">
                                        <div class="avatar flicker" @click="isUserAvatar = true">
                                            <el-image
                                                style="width: 100%; height: 100%"
                                                :src="userData.avatar"
                                                fit="cover"
                                                >
                                                <template #error>
                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                </template>
                                            </el-image>
                                        </div>
                                        <!-- <div class="edit-user-info" @click="isUserAvatar = true">
                                            <i class="icon font_family icon-bianjigerenziliao24"></i>
                                        </div> -->
                                        <div class="personal-data">
                                            <div class="user-basics">
                                                <div class="userName">{{ userData.username }}</div>
                                                <div class="userUuid">
                                                    <div>账号ID：<span @click="copyText(userData.uuid)" title="点击复制ID">{{ userData.uuid }}</span></div>
                                                </div>
                                                <div class="userNft">
                                                    <div class="nft-icon">
                                                        <i class="icon font_family icon-lianjie24"></i>
                                                    </div>
                                                    <div class="nft-value">
                                                        <p 
                                                            class="multi-line-1"
                                                            @click="copyContent"
                                                            title="点击复制钱包地址"
                                                        >
                                                            {{ userData.walletAddress }}
                                                        </p>
                                                        <div class="copy-success" v-if="isCopySuccess">已复制</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="user-stats">
                                                <div class="user-stats-main">
                                                    <div class="stats-main-item">
                                                        <div class="item-value">
                                                            {{ userData.trustValue }}
                                                        </div>
                                                        <div class="item-name">信任值</div>
                                                    </div>
                                                    <span></span>
                                                    <div class="stats-main-item">
                                                        <div class="item-value">
                                                            {{ userData.fanNo }}
                                                        </div>
                                                        <div class="item-name">粉丝数</div>
                                                    </div>
                                                    <span></span>
                                                    <div class="stats-main-item">
                                                        <div class="item-value">
                                                            {{ userData.followNo }}
                                                        </div>
                                                        <div class="item-name">关注数</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="user-domain">
                                                <div class="domain-title">个人领域</div>
                                                <div class="domain-value">
                                                    <div
                                                        class="domain-value-item"
                                                        v-for="(item, index) in splitString(userData.post)" 
                                                        :key="index"
                                                    >
                                                        {{ item }}
                                                    </div>
                                                    <div class="domain-value-item" v-if="!splitString(userData.post).length">
                                                        暂无领域
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="user-concern">
                                                <div class="concern-title">
                                                    <template v-if="userInfo.id !== userId">他的</template>
                                                    <template v-else>我的</template>关注
                                                </div>
                                                <div class="concern-value">
                                                    <div 
                                                        class="concern-value-conter"
                                                        v-for="us in userList" 
                                                        :key="us.userId"
                                                        :title="us.username"
                                                        @click="goUser(us)"
                                                    >
                                                        <div
                                                        class="concern-value-conter-img"
                                                        :class="{ 'dynamicFlicker': us.isRead == 0 }"
                                                        >
                                                            <el-image
                                                                style="width: 100%; height: 100%"
                                                                :src="us.avatar"
                                                                fit="cover"
                                                                >
                                                                <template #error>
                                                                    <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                </template>
                                                            </el-image>
                                                            <i v-if="us.isOnline == 1"></i>
                                                        </div>
                                                        <div class="concern-value-conter-name multi-line-1">{{ us.username }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="operation">
                                                <div class="menu-list">
                                                    <div 
                                                        class="menu-list-li"
                                                        :class="{ 'flag': index == isMenu }"
                                                        @click="findMenuIndex(index)"
                                                        v-for="( items, index ) in menuList"
                                                        :key="index"
                                                    >
                                                        <template v-if="items.path !== ''">
                                                            <template v-if="items.id !== 1 && items.id !== 2 && items.id !== 4 && items.id !== 5 && items.id !== 7">
                                                                <router-link :to='{ name: items.path}'>
                                                                    <div class="menu-center">
                                                                        <div class="menu-center-pic">
                                                                            <i class="icon font_family" :class="items.icon"></i>
                                                                        </div>
                                                                        <div class="menu-center-name">{{ items.name }}</div>
                                                                    </div>
                                                                </router-link>
                                                            </template>
                                                            <template v-else>
                                                                <div class="menu-center">
                                                                    <div class="menu-center-pic">
                                                                        <i class="icon font_family" :class="items.icon"></i>
                                                                    </div>
                                                                    <div class="menu-center-name">{{ items.name }}</div>
                                                                </div>
                                                            </template>
                                                        </template>
                                                        <template v-else-if="items.id == 6">
                                                            <a href="javascript:;" @click="findShowToBePaidDataFun()">
                                                                <div class="menu-center">
                                                                    <div class="menu-center-pic">
                                                                        <i class="icon font_family" :class="items.icon"></i>
                                                                    </div>
                                                                    <div class="menu-center-name">{{ items.name }}<span v-if="noPayNum !== null && noPayNum > 0">{{ noPayNum }}</span></div>
                                                                </div>
                                                            </a>
                                                        </template>
                                                    </div>
                                                </div>
                                                <template v-if="Number(userInfo.id) !== Number(userId)">
                                                    <div class="loginOut" @click="findBackToHomePage()">
                                                        <div class="loginOut-center">
                                                            <div class="loginOut-center-pic">
                                                                <el-image
                                                                    style="width: 100%; height: 100%"
                                                                    :src="userStore.userInfo.avatar"
                                                                    fit="cover"
                                                                    >
                                                                    <template #error>
                                                                        <img src="@/assets/images/common/defaultAvatar.png" alt="Default Image" />
                                                                    </template>
                                                                </el-image>
                                                            </div>
                                                            <div class="loginOut-center-name">返回我的个人主页</div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="loginOut" @click="logout()">
                                                        <div class="loginOut-center">
                                                            <div class="loginOut-center-pic">
                                                                <i class="icon font_family icon-tuichudenglu24"></i>
                                                            </div>
                                                            <div class="loginOut-center-name">退出登录</div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="contentArea">
                                <div class="contentArea-main">
                                    <div class="contentArea-main-conter">
                                        <!-- <router-view v-slot="{ Component }">
                                            <transition mode="out-in">
                                            <component :is="Component" />
                                            </transition>
                                        </router-view> -->
                                        <router-view :key="$route.fullPath" :aiResponse="aiResponse" @open-modal="openModal"></router-view>
                                    </div>
                                </div>
                                <MessageModal
                                    @click.stop
                                    v-if="userInfo.isMsgShow"
                                    :isVisible="userInfo.isMsgShow"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 设置密码弹窗 -->
    <div class="popupModal" v-if="isSetAPassword" @click="isSetAPassword = false, isSetActive = 0">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper" @click.stop>
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="password-from">
                    <div class="password-from-title">{{ passTitle }}</div>
                    <div class="password-prompt">密码须包含字母和数字，长度为8至16位</div>
                    <div class="error-tips">{{ passTips }}</div>
                    <div class="data-from" v-if="isPass == 0">
                        <div class="data-from-pass relievoShadow">
                            <div class="data-from-pad">
                                <input 
                                    :type="isSee ? 'password' : 'text'" 
                                    v-model="password"
                                    placeholder="请输入密码"
                                    maxlength="16"
                                    @input="validatePassword"
                                /> 
                            </div>
                            <div class="data-from-eye">
                                <i 
                                    class="icon font_family"
                                    :class="isSee ? 'icon-biyan24' : 'icon-yanjingguankan20'"
                                    @click="isSee = !isSee"
                                >
                                </i>
                            </div>
                        </div>
                        <div class="data-from-pass relievoShadow">
                            <div class="data-from-pad">
                                <input 
                                    :type="isSees ? 'password' : 'text'" 
                                    v-model="passwords"
                                    placeholder="请再次输入密码"
                                    maxlength="16"
                                    @input="validatePasswords"
                                /> 
                            </div>
                            <div class="data-from-eye">
                                <i 
                                    class="icon font_family"
                                    :class="isSees ? 'icon-biyan24' : 'icon-yanjingguankan20'"
                                    @click="isSees = !isSees"
                                >
                                </i>
                            </div>
                        </div>
                        <div class="form-submit-password relievoShadow" @click="submitEditUserPassword">确 定</div>
                    </div>
                    <div class="data-from" v-if="isPass == 1">
                        <div class="data-from-pass relievoShadow">
                            <div class="data-from-pad">
                                <input 
                                    type="text" 
                                    v-model="oldPassword"
                                    placeholder="请输入旧密码"
                                    maxlength="16"
                                /> 
                            </div>
                            <div class="data-from-eye">
                                
                            </div>
                        </div>
                        <div class="data-from-pass relievoShadow">
                            <div class="data-from-pad">
                                <input 
                                    :type="isSee ? 'password' : 'text'" 
                                    v-model="password"
                                    placeholder="请输入新密码"
                                    maxlength="16"
                                    @input="validatePassword"
                                /> 
                            </div>
                            <div class="data-from-eye">
                                <i 
                                    class="icon font_family"
                                    :class="isSee ? 'icon-biyan24' : 'icon-yanjingguankan20'"
                                    @click="isSee = !isSee"
                                >
                                </i>
                            </div>
                        </div>
                        <div class="data-from-pass relievoShadow">
                            <div class="data-from-pad">
                                <input 
                                    :type="isSees ? 'password' : 'text'" 
                                    v-model="passwords"
                                    placeholder="确认新密码"
                                    maxlength="16"
                                    @input="validatePasswords"
                                /> 
                            </div>
                            <div class="data-from-eye">
                                <i 
                                    class="icon font_family"
                                    :class="isSees ? 'icon-biyan24' : 'icon-yanjingguankan20'"
                                    @click="isSees = !isSees"
                                >
                                </i>
                            </div>
                        </div>
                        <div class="form-submit-password relievoShadow" @click="submitEditUserPassword">保 存</div>
                    </div>
                </div>
            </div>
            <!-- <div class="close" @click="isSetAPassword = false, isSetActive = 0">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div> -->
        </div>
    </div>
    <!-- 设置密码成功弹窗 -->
    <div class="popupModal" v-if="isPassSuccess">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper success">
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="password-from">
                    <div class="success-mian">
                        <div class="success-mian-icon">
                            <i class="icon font_family icon-gouxuanyuanxingbiankuang42"></i>
                        </div>
                        <div class="success-mian-title">{{ passSubmitTips }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 完善个人信息 -->
    <div class="popupModal" v-if="isUserInfo" @click="isUserInfo = false, isSetActive = 0">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper user-info" @click.stop>
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="password-from">
                    <div class="password-from-title">个人信息</div>
                    <div class="password-from-tips">{{ formTips }}</div>
                    <div class="password-from-content">
                        <div class="user-info-item">
                            <div class="item-l">
                                <div class="item-main">
                                    <div class="item-main-flex inputBg relievoShadow overflowInherit">
                                        <div class="input_bg">
                                            <div class="input_bg_l"></div>
                                            <div class="input_bg_c"></div>
                                            <div class="input_bg_r"></div>
                                        </div>
                                        <div class="item-main-icon">
                                            <i class="icon font_family icon-xingbie24"></i>
                                        </div>
                                        <div class="item-main-content">
                                            <div class="item-main-madeBy">
                                                <div class="item-main-madeBy-name">
                                                    <span>性别</span>
                                                </div>
                                                <div class="item-main-madeBy-on">
                                                    <div class="item-main-madeBy-checkbox" @click="checkboxOnChain(1)">
                                                    <span class="item-main-madeBy-checkbox-name" :class="isOnChain1 ? 'falg' : ''">男生</span>
                                                    <span class="item-main-madeBy-checkbox-icon">
                                                        <i 
                                                        class="icon font_family"
                                                        :class="isOnChain1 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20'"
                                                        >
                                                        </i>
                                                    </span>
                                                    </div>
                                                </div>
                                                <div class="item-main-madeBy-of">
                                                    <div class="item-main-madeBy-checkbox" @click="checkboxOnChain(0)">
                                                    <span class="item-main-madeBy-checkbox-name" :class="isOnChain2 ? 'falg' : ''">女生</span>
                                                    <span class="item-main-madeBy-checkbox-icon">
                                                        <i 
                                                        class="icon font_family"
                                                        :class="isOnChain2 ? 'icon-shixinyuanquan20' : 'icon-kongxinyuanquan20' "
                                                        >
                                                        </i>
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item-r">
                                <div class="item-main">
                                    <div class="item-main-flex inputBg relievoShadow overflowInherit">
                                        <div class="input_bg">
                                            <div class="input_bg_l"></div>
                                            <div class="input_bg_c"></div>
                                            <div class="input_bg_r"></div>
                                        </div>
                                        <div class="item-main-icon">
                                            <i class="icon font_family icon-shengri24"></i>
                                        </div>
                                        <div class="item-main-content">
                                            <div class="item-main-time">
                                                <div class="item-main-time-name">生日</div>
                                                <div class="item-main-time-group" >
                                                    <el-date-picker
                                                        v-model="userData.birthday"
                                                        type="date"
                                                        format="YYYY-MM-DD"
                                                        value-format="YYYY-MM-DD"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="user-info-item">
                            <div class="item-l">
                                <div class="item-main">
                                    <div class="item-main-flex inputBg relievoShadow overflowInherit">
                                        <div class="input_bg">
                                            <div class="input_bg_l"></div>
                                            <div class="input_bg_c"></div>
                                            <div class="input_bg_r"></div>
                                        </div>
                                        <div class="item-main-icon">
                                            <i class="icon font_family icon-youxiangdizhi24"></i>
                                        </div>
                                        <div class="item-main-content">
                                            <div class="item-main-time">
                                                <div class="item-main-time-name">邮箱</div>
                                                <div class="item-main-time-group" >
                                                    <input
                                                        type="text" 
                                                        placeholder="邮箱地址" 
                                                        v-model="userData.email" 
                                                        maxlength="64"
                                                        @blur="findIsValidEmail"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item-r">
                                <div class="item-main actAddress">
                                    <div class="item-main-address inputBg relievoShadow overflowInherit">
                                        <div class="input_bg">
                                            <div class="input_bg_l"></div>
                                            <div class="input_bg_c"></div>
                                            <div class="input_bg_r"></div>
                                        </div>
                                        <div class="item-main-icon">
                                            <i class="icon font_family icon-shengshidizhi24"></i>
                                        </div>
                                        <div class="item-main-content">
                                            <div class="item-main-content-m">
                                            <div class="item-main-content-m-title">所在城市</div>
                                            </div>
                                        </div>
                                        <div class="item-main-content-m-adderss">
                                            <location-picker @location-selected="handleLocationSelected"></location-picker>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="user-info-item">
                            <div class="item-l">
                                <div class="item-main">
                                    <div class="item-main-perm textareaBg">
                                        <div class="textarea_bg">
                                            <div class="textarea_bg_t"></div>
                                            <div class="textarea_bg_c"></div>
                                            <div class="textarea_bg_b"></div>
                                        </div>
                                        <div class="item-main-perm-top">
                                            <div class="item-main-icon">
                                            <i class="icon font_family icon-xingquaihao24"></i>
                                            </div>
                                            <div class="item-main-perm-name">兴趣爱好</div>
                                        </div>
                                        <div class="item-main-content">
                                            <!-- <textarea 
                                            type="text"
                                            v-model="userData.hobby" 
                                            placeholder="" 
                                            maxlength="200" 
                                            ></textarea> -->
                                            <TextareaWithCounter 
                                                v-model="userData.hobby" 
                                                :placeholder="'请输入您的兴趣爱好'" 
                                                :maxLength="100" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item-r">
                                <div class="item-main">
                                    <div class="item-main-perm textareaBg">
                                        <div class="textarea_bg">
                                            <div class="textarea_bg_t"></div>
                                            <div class="textarea_bg_c"></div>
                                            <div class="textarea_bg_b"></div>
                                        </div>
                                        <div class="item-main-perm-top">
                                            <div class="item-main-icon">
                                            <i class="icon font_family icon-gexingmingyan24"></i>
                                            </div>
                                            <div class="item-main-perm-name">个性签名</div>
                                        </div>
                                        <div class="item-main-content">
                                            <!-- <textarea 
                                                type="text"
                                                v-model="userData.motto" 
                                                placeholder="" 
                                                maxlength="200" 
                                            ></textarea> -->
                                            <TextareaWithCounter 
                                                v-model="userData.motto" 
                                                :placeholder="'请输入您的个性签名'" 
                                                :maxLength="100" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="user-info-item">
                            <div class="item-main ability">
                                <div class="item-main-ability textareaBg">
                                    <div class="textarea_bg">
                                        <div class="textarea_bg_t"></div>
                                        <div class="textarea_bg_c"></div>
                                        <div class="textarea_bg_b"></div>
                                    </div>
                                    <div class="item-main-ability-top">
                                        <div class="item-main-ability-top-name">
                                            <div class="item-main-icon">
                                                <i class="icon font_family icon-nengliquan24"></i>
                                            </div>
                                            <div class="item-main-ability-name">我的能力</div>
                                        </div>
                                        <div class="item-main-ability-add" @click="findAddAbilityFun">
                                            <i class="icon font_family icon-jiahaowubeijing20"></i>
                                        </div>
                                    </div>
                                    <div class="item-main-content ">
                                        <div
                                            class="ability-item relievoShadow"
                                            v-for="(item, index) in abilityList" :key="index">
                                            <div class="cbility-item-main">
                                                <div class="ability-item-main-name">
                                                    <template v-if="item == ''">
                                                        <input type="text" maxlength="36" v-model="tempValue" @blur="findAddAbilityListFun(index)" />
                                                    </template>
                                                    <template v-else>
                                                        {{ item }}
                                                    </template>
                                                </div>
                                                <div class="ability-item-main-del" @click="findDelAbilityFun(index)">
                                                    <i class="icon font_family icon-guanbi24"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="user-info-submit relievoShadow" @click="submitUserInfo">保存</div>
                    </div>
                </div>
                <div class="user-info-tip" v-if="isAbility">最多可填6个</div>
            </div>
            <!-- <div class="close" @click="isUserInfo = false, isSetActive = 0">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div> -->
        </div>
    </div>
    <!-- 编辑资料 -->
    <div class="popupModal" v-if="isUserAvatar" @click="isUserAvatar = false">
        <div class="modal-mask"></div>
        <div class="popupModal-wrapper edit-info"  @click.stop>
            <div class="popupModal-wapper-center">
                <div class="popupModal-wrapper-mask"></div>
                <div class="editAvatar-from">
                    <div class="editAvatar-from-main">
                        <div class="editAvatar-from-main-title">编辑资料</div>
                        <div class="editAvatar-from-item">
                            <div class="item-avatar">
                                <div class="item-avatar-img">
                                    <img :src="userCover" alt="" />
                                </div>
                                <div class="item-avatar-icon">
                                    <i class="icon font_family icon-zhaoxiangji42"></i>
                                    <div class="upload-icon">
                                        <el-upload
                                            ref="uploadRefs"
                                            class="upload-demo"
                                            action=""
                                            :auto-upload="false"
                                            :show-file-list="false"
                                            drag
                                            :limit="1"
                                            accept="image/*"
                                            :on-change="handleImageChange"
                                        >
                                        </el-upload>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="editAvatar-from-item">
                            <div class="item-name">
                                <div class="item-name-main inputBg relievoShadow overflowInherit">
                                        <div class="input_bg">
                                            <div class="input_bg_l"></div>
                                            <div class="input_bg_c"></div>
                                            <div class="input_bg_r"></div>
                                        </div>
                                    <div class="item-name-main-icon">
                                        <i class="icon font_family icon-renwumingcheng"></i>
                                    </div>
                                    <div class="item-name-main-input">
                                        <div class="userName-main">
                                            <div class="item-main-time-name">用户名</div>
                                            <div class="item-main-time-content">
                                                <input 
                                                    type="text" 
                                                    v-model="userName" 
                                                    placeholder="请输入您的昵称" 
                                                    maxlength="20" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="editAvatar-submit">
                            <div class="cancel close_relievoShadow" @click="isUserAvatar = false">取消</div>
                            <div class="submit relievoShadow" @click="submitEditAvatar">保存</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 待支付弹窗 -->
    <div class="popupModal" v-if="isToBePaid" @click="closePopup">
        <div class="masking"></div>
        <div class="personInCharge-center" @click.stop>
            <div class="personInCharge-center-inof">
                <div class="personInCharge-center-module"></div>
                <div class="personInCharge-center-main">
                    <div class="personInCharge-center-title">待支付</div>
                    <div class="personInCharge-center-list">
                        <div class="applies-list">
                            <div
                                class="applies-list-item"
                                v-for="(item, index) in toBePaid" 
                                :key="index"
                            >
                                <div class="item-content">
                                    <div class="item-content-left">
                                        <div class="item-content-left-main">
                                            <div class="item-content-left-main-avatar">
                                                <img :src="item.cover" alt="" />
                                            </div>
                                            <div class="item-content-left-main-info">
                                                <div class="item-content-left-main-info-name">
                                                    <span>剩</span>
                                                    <span>
                                                        <CountdownComponent
                                                            :type="1"
                                                            :orderTime="item.createTime"
                                                            :validityMinutes="item.minute"
                                                            @countdownFinished="handleCountdownFinished"
                                                        />
                                                    </span>
                                                    <span>自动取消</span>
                                                </div>
                                                <div class="item-content-left-main-info-tips">{{ item.name }}</div>
                                            </div>   
                                        </div>
                                    </div>
                                    <div class="item-content-right" @click="routerPush(item)">
                                        <div class="item-content-right-btn relievoShadow">立即支付</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="close" @click.stop="isToBePaid = false, isMenu = null">
                <i class="icon font_family icon-shanchuyuanquanbeijing24"></i>
            </div> -->
        </div>
    </div>
    <!-- 图片裁剪 -->
    <ImageCropper
        :cropperImg="cropperImg"
        :type="clippingType" 
        :fileName="cropperImgName" 
        v-if="isCropperAvatar" 
        :isShow="isCropperAvatar" 
        @close="handleClose"
        :on-upload-success="handleCropperSuccess" 
    />
    <AttentionList
        v-if="isAttention"
        :isShow="isAttention"
        @close="closeAttentionBase"
    />
    
    <el-drawer v-model="showModal" direction="rtl">
        <template #header>
            <h4>AI智能助手</h4>
        </template>
        <template #default>
            <AIChatModal
                :visible="showModal"
                :type="currentBusinessType"
                :context="additionalContext"
                @close="showModal = false"
                @aiResponse="handleAIResponse"
            />
        </template>
    </el-drawer>
    
    <!-- 意见反馈 弹窗 -->
    <div class="feedback relievoShadow" @click="isNodeModalVisible = !isNodeModalVisible">
        <i class="icon font_family icon-yijianfankui20"></i>
    </div>
    <Feedback
      v-if="isNodeModalVisible"
      :isVisible="isNodeModalVisible"
      :initialContent="nodeContent"
      :maxLength="1000"
      @update:content="updateNodeContent"
      @close="closeNodeBase"
    />
  </div>
</template>

<script lang='ts' setup>
    import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
    import router from '@/router';
    import { ElUpload } from 'element-plus';
    import { showPopup } from '@/utils/usePopup';
    import { FILENAMELENGTH } from '@/utils/common';
    import { copyToClipboard, isPasswordValid, encryptWithMD5, getItem, isValidEmail } from '@/utils/index';
    import { orderPending } from '@/api/pay';
    import { feedbackSave } from '@/api/common';
    import { usersPassword, editUsersPassword, getUsersDetail, editUsersDetail, followLeft } from '@/api/user';
    import Statistic from '@/components/statisticModule/statistic.vue';
    import LocationPicker  from '@/components/TreeSelect/address.vue';
    import MessageModal  from '@/components/message/index.vue';
    import CountdownComponent from '@/components/CountdownComponent/index.vue';
    import ImageCropper from '@/components/tailor/ImageCropper.vue';
    import AttentionList from '@/components/attentionList/index.vue';
    import TextareaWithCounter from '@/components/TextareaWithCounter/index.vue';
    import AIChatModal from '@/components/AIChatModal/index.vue';
    import Feedback from '@/components/feedback/index.vue';
    import ParticleWhirlpool from '@/components/particleWhirlpool/index.vue';
    import SuspMenu from '@/components/suspMenu/index.vue';

    import pcBg from '@/assets/images/pc/pcBg.jpg';

    import { setItem } from '@/utils/index';
    import { aeUseStore } from '@/stores/user';
    const userStore = aeUseStore();
    const userInfo = userStore.getUserInfo;
    const isSetUp = ref(false);
    const isCopySuccess = ref(false);
    const isSetActive = ref(0); // 点击设置按钮，具体弹框的选中值
    const isSee = ref(true); // 是否显示密码1
    const isSees = ref(true); // 是否显示密码2
    const isSetAPassword = ref(false); // 是否显示设置密码弹窗
    const oldPassword = ref(''); // 旧密码
    const password = ref(''); // 密码
    const passwords = ref(''); // 确认密码
    const passTips = ref(''); // 设置密码的提示信息
    const isPassSuccess = ref(false); // 是否显示设置密码成功弹窗
    const isPass = ref(0); // 0没密码 1有密码
    const passTitle = ref('设置密码');
    const passSubmitTips = ref('设置密码成功');
    const isUserInfo = ref(false); // 是否显示用户信息弹窗
    const isOnChain1 = ref(false); 
    const isOnChain2 = ref(false);
    const formTips = ref(''); // 表单提示信息
    const isUserAvatar = ref(false); // 是否显示编辑用户头像和名称弹窗  
    const abilityList = ref<string[]>([]);
    const isAbility = ref(false); // 是否显示能力弹窗超限提醒
    const tempValue = ref(''); // 临时存储能力值
    const noPayNum =  ref<number | null>(null);
    const userName = ref(''); // 用户名
    const userCover = ref(''); // 用户头像
    const userId = ref(''); // 查看他人的用户id
    const isgoMenu = ref(0); // 用于刷新页面
    const refreshPage = ref(0); // 用于刷新页面
    const isAttention = ref(false); // 关注列表

    const clippingType = '1'; // 是否裁剪
    const isCropperAvatar = ref(false); // 是否显示裁剪用户头像弹窗
    const cropperImg = ref<string | ArrayBuffer | null>(null); // 裁剪用户头像
    const cropperImgName = ref(''); // 裁剪用户头像名称

    // 如果没有他人id，则取登录人id
    console.log('userInfo.othersId', userInfo.othersId);
    if(userInfo.othersId !== '') {
        userId.value = userInfo.othersId;
    } else {
        userId.value = userInfo.id;
    }

    // 刷新页面
    refreshPage.value = userInfo.personaHome;

    /** 将字符串转为数组，通过逗号拆分 **/ 
    const splitString = (str: string, delimiter = ',') => {
        if(str !== '' && str !== null && str !== undefined) {
           return str.split(new RegExp(`\\${delimiter}\\s*`)).map((s: string) => s.trim()); 
        } else {
            return [];
        }
    }

    /** 个人数据 ***/
    const userData = ref({
        avatar: '',
        username: '',
        uuid: '',
        trustValue: 0,
        fanNo: 0,
        followNo: 0,
        walletAddress: '',
        gender: 2,
        birthday: '',
        email: '',
        address: '',
        hobby: '',
        motto: '',
        post: '',
        isFollow: 0,
    });
    // userData.value = userInfo;

    /** 获取个人信息 ***/
    const findGetUsersDetailFun = () => {
        let reqData = {
            id: userId.value,
        }
        return new Promise<void>((resolve, reject) => {
            getUsersDetail(reqData).then((response: any) => {
                const { code, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                let attr = [];
                userData.value = response.data;
                if (response.data.post !== undefined && response.data.post !== null) {
                    abilityList.value = splitString(response.data.post);
                    const postData = typeof response.data.post === 'string' 
                        ? splitString(response.data.post)
                        : response.data.post;

                    postData.forEach((item: any) => {
                        attr.push({name: item, percent: 0});
                    });
                } else {
                    abilityList.value = []; // 如果 response.data.post 无效，则设置为空数组
                }
                userStore.userInfo.post = attr;
                setItem('post', attr);
                if(userData.value.gender == 0) {
                    isOnChain1.value = false;
                    isOnChain2.value = true;
                } else if(userData.value.gender == 1) {
                    isOnChain1.value = true;
                    isOnChain2.value = false;
                } else {
                    isOnChain1.value = false;
                    isOnChain2.value = false;
                }
                userName.value = userData.value.username;
                userCover.value = userData.value.avatar;
                userStore.userInfo.isFollow = userData.value.isFollow
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    /** 选择地址 **/
    // 判断是否为空对象
    const isEmptyObject = (obj: Record<string, any>): boolean => {
        return Object.keys(obj).length === 0;
    }
    const handleLocationSelected = (location: {}) => {
        console.log(location);
        if(!isEmptyObject(location)) {
            userData.value.address = location.province.value +','+ location.city.value +','+ location.district.value+','+location.province.label +','+ location.city.label +','+ location.district.label;
        }
        console.log('reqData.value.address', userData.value.address);
    }

    // 性别 0女 1男 2其他
    const checkboxOnChain = (num: number) => {
        if(num !== userData.value.gender) {
            if (isOnChain1.value) {
                isOnChain1.value = false;
                isOnChain2.value = true;
                userData.value.gender = 0;
            } else {
                isOnChain1.value = true;
                isOnChain2.value = false;
                userData.value.gender = 1;
            }
        }
    }


    /** 点击复制NFT **/
    const copyContent = async () => {
        await copyToClipboard(userData.value.walletAddress);
        showCopySuccess();
    };
    /** 显示文本已复制到剪贴板，2秒后自动关闭 ***/
    const showCopySuccess = () => {
        isCopySuccess.value = true;
      setTimeout(() => {
        isCopySuccess.value = false;
      }, 2000);
    };
    /** 点击复制账号ID **/
    const copyText = async (data: any) => {
        await copyToClipboard(data);
        showCopySuccess();
    };

    /** 左侧菜单 **/
    const isSuspMenu = ref<number | null>(null);
    const suspMenu = ref([
        { name: '首页', path: '/', icon: 'icon-shouye24' },
        { name: '个人中心', path: '/PersonalHomepage', icon: 'icon-geren24' },
        { name: '任务', path: '/TaskList', icon: 'icon-woderenwu24-2' },
        { name: 'Dao', path: '/dao/pageTwo', icon: 'icon-jihui24' },
        { name: '钱包', path: '/personalHomepage/MyWallet', icon: 'icon-qianbao24' },
        { name: '设置', path: '', icon: 'icon-shezhi24' },
    ]);

    const isAbsolute = (path: any) => {
        return path.startsWith('/');
    }

    const findSuspMenuIndex = (index: number) => {
        isSuspMenu.value = index;
        userInfo.othersId = '';
        if(index == 2 || index == 3) {
            showPopup('功能正在开发中，敬请期待！', 'error', 3000);
        }
    }
    /** 根据url判断选中侧边栏菜单项 **/
    const findSuspMenuPath = () => {
        const currentUrl = window.location.href;
        if(currentUrl.includes('personalHomepage') && currentUrl.includes('MyWallet') || currentUrl.includes('billingDetail')){
            isSuspMenu.value = 4;
        } else if(currentUrl.includes('dao')){
            isSuspMenu.value = 3;
        } else if(currentUrl.includes('taskList')){
            isSuspMenu.value = 2;
        } else if(currentUrl.includes('personalHomepage')){
            isSuspMenu.value = 1;
        }
    }

    /** 设置菜单 ***/
    const setUpData = [
        {id: 1, name: '密码', icon: 'icon-mima20'},
        {id: 2, name: '个人信息', icon: 'icon-gerenxinxi20'},
        {id: 3, name: '皮肤设置', icon: 'icon-pifu20'},
        {id: 4, name: '常见问题', icon: 'icon-wenhaoyuanquan20'},
        {id: 5, name: '意见反馈', icon: 'icon-yijianfankui20'}
    ];

    /**
     * 个人菜单
     * **/
    const isMenu = ref<number | null>(null);
    interface MenuItem {
        id: number;
        name: string;
        icon: string;
        path: string;
    }   
    const menuList = ref<MenuItem[]>([]);
    const getMenuList = () => {
        if(userInfo.othersId !== '') {
            userId.value = userInfo.othersId;
        } else {
            userId.value = userInfo.id;
        }
        if(userInfo.id == userId.value) {
            menuList.value = [
                {id: 3, name: '我的作品', icon: 'icon-wodexuqiu24-2', path: 'PersonalWorks'},
                {id: 2, name: '我的任务', icon: 'icon-woderenwu24-2', path: 'MyTask'},
                {id: 1, name: '我的活动', icon: 'icon-wodehuodong24-2', path: 'ActivitiesToJoin'},
                {id: 4, name: '我的自组织', icon: 'icon-zizuzhi34', path: 'SelfOrganization'},
                {id: 5, name: '我的知识库', icon: 'icon-suipian24', path: 'NoteList'},
                {id: 6, name: '待支付', icon: 'icon-daizhifu20', path: ''},
                {id: 7, name: '社区互动', icon: 'icon-shequn24', path: 'CommunityInt'},
            ]
        } else {
            menuList.value = [
                {id: 3, name: 'Ta的作品', icon: 'icon-wodexuqiu24-2', path: 'PersonalWorks'},
                {id: 2, name: 'Ta的任务', icon: 'icon-woderenwu24-2', path: 'MyTask'},
                {id: 1, name: 'Ta的活动', icon: 'icon-wodehuodong24-2', path: 'ActivitiesToJoin'},
                {id: 4, name: 'Ta的自组织', icon: 'icon-zizuzhi34', path: 'SelfOrganization'},
            ]
        }
    }

    const findMenuIndex = (index: number) => {
        isMenu.value = index;
        if(index == 1 || index == 2 || index == 3 || index == 4 || index == 6) {
            showPopup('功能正在开发中，敬请期待！', 'error', 3000);
          }
    }
    /** 根据url判断选中菜单项 **/
    const findMenuPath = () => {
        const currentUrl = window.location.href;
        if(currentUrl.includes('activitiesToJoin')){
            isMenu.value = 2;
        } else if(currentUrl.includes('myTask')){
            isMenu.value = 1;
        } else if(currentUrl.includes('personalWorks')){
            isMenu.value = 0;
        } else if(currentUrl.includes('selfOrganization')){
            isMenu.value = 3;
        } else if(currentUrl.includes('communityInt')){
            isMenu.value = 4;
        }
    }

    /** 待支付订单列表 **/
    // 定义正确的类型
    interface Payment {
        id: number;
        type: number;
        validity: number;
        name: string;
        time: string;
        avatar: string;
    }
    const isToBePaid = ref(false);
    const toBePaid = ref<Payment[]>([]);
    const findToBePaidDataFun = async () => {
        let reqData = {}
        return new Promise<void>((resolve, reject) => {
            orderPending(reqData).then((response: any) => {
                const { code, data, message } = response;
                const resultData = data;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }

                toBePaid.value = resultData;
                noPayNum.value = resultData.length || null;
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };
    /**  倒计时结束回调 **/
    const handleCountdownFinished = () => {
        findToBePaidDataFun()
    };

    // 判断是否弹出待支付订单
    const findShowToBePaidDataFun = () => {
        if(toBePaid.value.length > 0) {
            isToBePaid.value = true;
        } else {
            showPopup('暂无待支付订单！', 'error', 3000);
        }
    };

    const closePopup = () => {
        isToBePaid.value = false;
    };

    /** 跳转支付页面 **/
    const routerPush = (item: any) => {
        // taskType: 1, // 1 创建进去大任务详情 2 大任务手续费待支付进去大任务详情 3 大任务指定责任人质押费待支付进去任务详情
        // daoType: 1, // 1 Dao子列表页面进入Dao详情 2 待支付进去Dao详情
        // subTaskType: 1, // 1 正常流程进入子任务详情 2 待支付进去子任务详情
        // 业务类型：发布任务上链费用：2 发布任务赏金：4 创建DAO：6 发布子任务上链费用：8 指定子任务责任人：10 发布子任务赏金：12
        let id = item.businessId;
        userInfo.minute = item.minute;
        userInfo.createTime = item.createTime;
        userInfo.businessType = item.businessType;
        setItem('minute', item.minute);
        setItem('createTime', item.createTime);
        setItem('businessType', item.businessType);
        if(item.businessType == 2 || item.businessType == 4) {
            if(item.businessType == 2) {
                userInfo.taskType = 2;
                setItem('taskType', 2);
            } else if(item.businessType == 4) {
                userInfo.taskType = 3;
                setItem('taskType', 3);
            }
            router.push({ name: 'TataskDetails', params: { id } });
        } else if(item.businessType == 6) {
            userInfo.daoType = 2;
            setItem('daoType', 2);
            router.push({ name: 'TeamDetails', params: { id } });
        } else if(item.businessType == 8) {
            userInfo.subTaskType = 2;
            setItem('subTaskType', 2);
            router.push({ name: 'subTaskDetails', params: { id } });
        } else if(item.businessType == 10 || item.businessType == 12) {
            isToBePaid.value = false;
            userInfo.subTaskType = 2;
            setItem('subTaskType', 2);
            router.push({ name: 'DaoDetails', params: { id } });
        }

    };

    /**
     * isOnline	是否在线 0否1是
     * isRead	是否已读 0否 1是(包含没有发布)
     * belongType	未读类型： 1任务 2作品 3 活动
     * **/ 
    interface ListItem {
        avatar: string;
        belongId: number | null;
        belongType: number | null;
        isOnline: number;
        isRead: number;
        userId: number;
        username: string;
    }
    const userList = ref<ListItem[]>([]);
    /** 获取我的关注 列表 ***/
    const findGetFollowLeftFun = () => {
        let reqData = {
            id: userId.value,
        }
        return new Promise<void>((resolve, reject) => {
            followLeft(reqData).then((response: any) => {
                const { code, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                userList.value = response.data.slice(0, 4);
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    const displayedAvatars = ref<ListItem[]>(userList.value.slice(0, 4));
    let timer: number | null = null;

    

    /** 进去用户详情 **/
    const goUser = (item: any) => {
        userInfo.othersId = item.userId;
        isgoMenu.value ++;
        getMenuList();
        findGetFollowLeftFun();
        findGetUsersDetailFun();
        router.push({ name: 'PersonalHomepage' });
    };

    /** 返回我的首页 **/
    const findBackToHomePage = () => {
        userInfo.othersId = '';
        isgoMenu.value ++;
        getMenuList();
        findGetFollowLeftFun();
        findGetUsersDetailFun();
        router.push({ name: 'PersonalHomepage' });
    };

    watch(() => userInfo.othersId, (newValue) => {
        if(newValue !== '') {
            userId.value = userInfo.othersId;
        } else {
            userId.value = userInfo.id;
        }
    });

    watch(() => userInfo.personaHome, (newValue) => {
        refreshPage.value = userInfo.personaHome;
        findToBePaidDataFun();
    });


    /** 设置菜单点击事件 **/
    const findSetUpClick = (item: number) => {
        // 1密码设置 2个人信息 3皮肤设置 4常见问题 5意见反馈
        isSetActive.value = item;
        if(item === 1) {
            if (userStore.getUserInfo.hasLoginPassword !== '' && userStore.getUserInfo.hasLoginPassword !== undefined && userStore.getUserInfo.hasLoginPassword !== null) {
                isPass.value = userStore.getUserInfo.hasLoginPassword;
            } else {
                if(getItem('hasLoginPassword') !== '' && getItem('hasLoginPassword') !== undefined && getItem('hasLoginPassword') !== null) {
                    isPass.value = getItem('hasLoginPassword'); 
                }
            }
            if(isPass.value === 0) {
                passTitle.value = '设置密码';
                passSubmitTips.value = '设置密码成功';
            } else if(isPass.value === 1) {
                passTitle.value = '修改密码';
                passSubmitTips.value = '修改密码成功';
            }
            isSetAPassword.value = true;
        } else if(item === 2) {
            isUserInfo.value = true;
        } else if(item === 3) {
            
        } else if(item === 4) {
            
        } else if(item === 5) {
            isNodeModalVisible.value = true;
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        const setUpView = document.querySelector('.setUp-view');
        if (setUpView && !setUpView.contains(event.target as Node)) {
            isSetUp.value = false;
        }
    };
    watch(isSetUp, async (newValue) => {
        if (newValue) {
            // 确保 DOM 更新后再添加事件监听器
            await nextTick();
            setTimeout(() => {
              document.addEventListener('click', handleClickOutside);  
            })
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
    });

    /** 判断密码格式是否正确， 密码是否一致,密码只能由字母大小写和数字组成，8-16位之间 ***/
    const validatePassword= () => {
        let pw = password.value;
        let pws = passwords.value;
        if (isPasswordValid(pw)) {
            if (pws !== '') {
                if (isPasswordValid(pws)) {
                    if (pw === pws) {
                        passTips.value = '';
                    } else {
                        passTips.value = '两个密码输入不一致，请重新输入'; 
                    }
                } else {
                    passTips.value = '两个密码输入不一致，请重新输入'; 
                }
            } else {
                passTips.value = '';
            }
        } else {
            passTips.value = '密码必须包含字母和数字，长度为8至16位';
        }
    };
    const validatePasswords= () => {
        let pw = password.value;
        let pws = passwords.value;
        if (isPasswordValid(pws)) {
            if (pw !== '') {
                if (isPasswordValid(pw)) {
                    if (pw === pws) {
                        passTips.value = '';
                    } else {
                        passTips.value = '两个密码输入不一致，请重新输入'; 
                    }
                } else {
                    passTips.value = '两个密码输入不一致，请重新输入'; 
                }
            } else {
                passTips.value = '';
            }
        } else {
            passTips.value = '密码必须包含字母和数字，长度为8至16位';
        }
    };

    /** 提交设置密码 **/
    const submitEditUserPassword = () => {
        if(passTips.value !== '') {
            return false;
        }
        if(isPass.value === 0){
            let reqData = {
                password: encryptWithMD5(password.value)
            }
            return new Promise<void>((resolve, reject) => {
                usersPassword(reqData).then((response: any) => {
                    const { code, message } = response;
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    isSetAPassword.value = false;
                    isSetActive.value = 0;
                    showPopups();
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        } else if(isPass.value === 1) {
            let reqData = {
                oldPassword: encryptWithMD5(oldPassword.value),
                password: encryptWithMD5(password.value)
            }
            return new Promise<void>((resolve, reject) => {
                editUsersPassword(reqData).then((response: any) => {
                    const { code, message } = response;
                    if (code !== 200) {
                        showPopup(message, 'error', 3000);
                        return;
                    }
                    isSetAPassword.value = false;
                    isSetActive.value = 0;
                    showPopups();
                    resolve()
                }).catch((error: any) => {
                    reject(error)
                })
            })
        }
    };

    /** 显示成功弹框，3秒后自动关闭 ***/
    const showPopups = () => {
        isPassSuccess.value = true;
      setTimeout(() => {
        isPassSuccess.value = false;
      }, 3000);
    };

    /** 校验邮箱格式 ***/
    const findIsValidEmail = () =>{
        if(isValidEmail(userData.value.email)) {
            formTips.value = '';
            return true;
        } else {
            formTips.value = '邮箱格式不对，请重新输入!';
            return false;
        }
    }

    /** 点击按钮添加能力 **/
    const findAddAbilityFun = () => {
        let abilityLength = abilityList.value.length;
        if(abilityLength < 6) {
            abilityList.value.push('');
            isAbility.value = false;
        } else {
            showabilityTips();
        }
    };

    /** 显示添加能力超限，2秒后自动关闭 ***/
    const showabilityTips = () => {
        isAbility.value = true;
      setTimeout(() => {
        isAbility.value = false;
      }, 2000);
    };

    /** 获取填写的能力信息 **/
    const findAddAbilityListFun = (index: number) => {
        abilityList.value[index] = tempValue.value;
        tempValue.value = '';
    };

    /** 删除填写的个人能力 **/
    const findDelAbilityFun = (index: number) => {
        abilityList.value.splice(index, 1);
    };

    /** 修改个人信息 **/
    const submitUserInfo = () => {
        if(formTips.value !== '') {
            return false;
        }
        let reqData = {
            gender: userData.value.gender,
            birthday: userData.value.birthday,
            email: userData.value.email,
            address: userData.value.address,
            hobby: userData.value.hobby,
            motto: userData.value.motto,
            post: abilityList.value.join(','),	
            
        }
        return new Promise<void>((resolve, reject) => {
            editUsersDetail(reqData).then((response: any) => {
                const { code, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                isUserInfo.value = false;
                isSetActive.value = 0;
                findGetUsersDetailFun();
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

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
                console.log('cropperImg.value', cropperImg.value);
                isCropperAvatar.value = true;
            }
        }
        reader.readAsDataURL(file.raw)
    }

    const handleCropperSuccess = (url) => {
        userCover.value = url;
        isCropperAvatar.value = false;
    };
    const uploadRefs = ref<InstanceType<typeof ElUpload> | null>(null);
    const handleClose = () => {
        isCropperAvatar.value = false;
        cropperImg.value = null;
        cropperImgName.value = "";
        // 重置上传状态
        userCover.value = '';
        clearUploadFiles();
    };
    const clearUploadFiles = () => {
        // 清除 el-upload 的文件列表
        uploadRefs.value.clearFiles();
    };

    
    // 头像裁剪URl
    const findGetImageUrlFun = (urls: string[]) => {
        userCover.value = urls[0];
        console.log('头像裁剪URl', userCover.value);
    };

    /** 修改头像和昵称 **/
    const submitEditAvatar = () => {
        let reqData = {
            avatar: userCover.value,
            username: userName.value
        }
        return new Promise<void>((resolve, reject) => {
            editUsersDetail(reqData).then((response: any) => {
                const { code, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                    return;
                }
                isUserAvatar.value = false;
                findGetUsersDetailFun();
                userInfo.avatar = userCover.value;
                userInfo.userName = userName.value;
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    };

    const startCarousel = () => {
        timer = window.setInterval(() => {
            const firstItem = displayedAvatars.value.shift();
            if (firstItem) {
            setTimeout(() => {
                displayedAvatars.value.push(userList.value[(userList.value.indexOf(displayedAvatars.value[displayedAvatars.value.length - 1]) + 1) % userList.value.length]);
                userList.value.push(firstItem);
            }, 1000); // 等待1秒以完成透明度的变化
            }
        }, 3000); // 每3秒触发一次
    };

    const logout = () => {
        userInfo.id = '';
        userInfo.avatar = '';
        userInfo.userName = '';
        userInfo.token = '';
        userInfo.refreshToken = '';
        router.push('/');
    };

    // 关闭粉丝列表
    const closeAttentionBase = () => {
        isAttention.value = false;
    };


    // AI模块

    const modalVisible = ref(false);
    const aiResponse  = ref({});
    const modalType = ref('');
    const showModal = ref(false);
    const currentBusinessType = ref('postTask');
    const additionalContext = ref('当前用户身份：VIP客户');
    // 打开弹框和获取路由
    const openModal = (type: string) => {
        modalType.value = type;
        showModal.value = true;
        modalVisible.value = true;
        currentBusinessType.value = type;
    };

    const handleAIResponse = (payload: { content: string; type: string }) => {
        // 根据type处理不同业务逻辑
        console.log('AI生成内容:', payload);
        aiResponse.value = payload.content;
        console.log('收到AI返回的数据:', aiResponse.value);
    };

    // 意见反馈
    const isNodeModalVisible = ref(false); // 是否显示意见反馈操作弹窗
    const nodeContent = ref<string>('');
    // 提交意见反馈
    const updateNodeContent = (newContent: any) => {
        console.log('newContent', newContent);
        return new Promise<void>((resolve, reject) => {
            feedbackSave(newContent).then((response: any) => {
                const { code, message } = response;
                if (code !== 200) {
                    showPopup(message, 'error', 3000);
                return;
                }
                showPopup('意见反馈成功，管理员正在处理哦！', 'success', 3000);
                closeNodeBase();
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    }
    // 关闭意见反馈
    const closeNodeBase = () => {
        isNodeModalVisible.value = false;
    };


    
    onMounted(() => {
        getMenuList();
        findSuspMenuPath();
        findMenuPath();
        findToBePaidDataFun();
        // startCarousel();
        if(userData.value.uuid === '') {
            findGetUsersDetailFun();
            findGetFollowLeftFun();
        }
    });
    onBeforeUnmount(() => {
      if (timer) {
        clearInterval(timer);
      }
    });
</script>

<style lang='scss' scoped>
    @use '@/assets/styles/common.scss';
    @use '@/assets/styles/personalHomepage.scss';
    
    :deep(.el-popper.is-light) {
        background: rgba(255,255,255,0.14);
        backdrop-filter: blur(36px);
    }
    
    :deep(.el-popper.is-light) {
        background: rgba(255,255,255,0.14) !important;
        backdrop-filter: blur(36px);
    }
    :deep(.el-picker__popper){
        background: rgba(255,255,255,0.04) !important;
        backdrop-filter: blur(6px);
    }
    :deep(.el-picker__popper) {
        /* 修改样式 */
        background-color: rgba(255,255,255,0.04) !important;
        backdrop-filter: blur(6px);
    }
    .feedback{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: fixed;
        top: calc(50% + 90px);
        right: 20px;
        transform: translateY(-50%);
        background: rgba(229, 229, 229, 0.08);
        backdrop-filter: blur(40px);
        box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.3), -1px -1px 6px rgba(255, 255, 255, 0.6);
        i{
            font-size: 30px;
            color: #fff;
            text-align: center;
            line-height: 50px;
            transition: all 0.3s;
            display: block;
            cursor: pointer;
        }
    }
    .inner-background{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
    }
    .menu-list-li{
        width: 100%;
        height: 42px;
        border-radius: 21px;
        transition: all 0.3s;
        margin-bottom: 10px;
      }
      .menu-list-li:hover{
        box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.6), 0 -2px 5px rgba(99, 99, 217, 0.4);
        background: linear-gradient(to bottom, rgba(60, 60, 150, .4), rgba(40, 40, 100, .3));
      }
      .menu-list-li.flag{
        box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.6), 0 -2px 5px rgba(99, 99, 217, 0.4);
        background: linear-gradient(to bottom, rgba(60, 60, 150, .5), rgba(40, 40, 100, .4)) !important;
      }
      .loginOut-center:hover{
        box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.6), 0 -2px 5px rgba(99, 99, 217, 0.4);
        background: linear-gradient(to bottom, rgba(60, 60, 150, .4), rgba(40, 40, 100, .3));
      }
      
      /* Custom style for left navigation */
      :deep(.left-nav) {
        position: absolute;
        left: -100px !important;
        z-index: 10;
      }
</style>
