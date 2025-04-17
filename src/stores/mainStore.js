import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    isEmojiShown: false,
    isRobotListShown: false,
    msgToSent: '',
    icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
    icon2: `${config.resourceUrl}/im/chat-editor-2.png`,
    icon3: `${config.resourceUrl}/im/chat-editor-3.png`,
    icon4: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-keyboard.png`,
    icon5: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-record.png`,
    sendTxt: true,
    recording: false,
    recordDisable: false,
    toRecordCount: 0,
    recordTime: 0,
    $recordTime: null,
    recordTimeout: '',
    recorder: null,
    audioContext: null,
    isRefresh: true,
    isLoading: false,
    loadingTimer: null,
    fullscreenImgSrc: '',
    isFullscreenImgShow: false,
    userUID: null,
    sdktoken: null,
    myInfo: {},
    userInfos: {},
    friendslist: [],
    robotslist: [],
    robotInfos: {},
    robotInfosByNick: {},
    blacklist: [],
    searchedUsers: [],
    searchedTeams: [],
    sessionlist: [],
    sessionMap: {},
    msgs: {},
    currSessionId: null,
    currSessionMsgs: [],
    currSessionLastMsg: null,
    sysMsgs: [],
    customSysMsgs: [],
    customSysMsgUnread: 0,
    noMoreHistoryMsgs: false,
    continueRobotAccid: null,
    chatroomInfos: {},
    currChatroomId: null,
    currChatroom: null,
    currChatroomMsgs: [],
    currChatroomInfo: {},
    currChatroomMembers: [],
    teamlist: [],
    teamMembers: {},
    teamSettingConfig: {},
    sentReceipedMap: {},
    receiptQueryList: [],
    teamMsgReads: [],
    currReceiptQueryTeamId: null,
    teamMsgReadsDetail: {
      readAccounts: [],
      unreadAccounts: [],
    },
    isFullscreenImgShow: false,
    fullscreenImgSrc: '',
    route: null,
    userUID: 'user123', // example user UID
    teamlist: [],
    teamMembers: {},
    userInfos: {},
    myInfo: { avatar: 'path/to/avatar' },
  }),
  getters: {
    route: (state) => state.route,
    continueRobotAccid: (state) => state.continueRobotAccid,
    robotslist: (state) => state.robotslist,
    robotInfos: (state) => state.robotInfos,
    robotInfosByNick: (state) => state.robotInfosByNick,
    supportTouch: () => "ontouchend" in document && "ontouchstart" in document && "ontouchmove" in document,
  },
  actions: {
    showEmoji() {
      this.isEmojiShown = true;
    },
    hideEmoji() {
      this.isEmojiShown = false;
    },
    addEmoji(emojiName) {
      this.msgToSent += emojiName;
      this.hideEmoji();
    },
    chooseRobot(robot) {
      if (robot && robot.account) {
        const len = this.msgToSent.length;
        if (len === 0 || this.msgToSent[len - 1] !== '@') {
          this.msgToSent += `@${robot.nick} `;
        } else {
          this.msgToSent += `${robot.nick} `;
        }
      }
    },
    hideRobotList() {
      this.isRobotListShown = false;
    },
    onInputFocus(e) {
      setTimeout(() => {
        e.target.scrollIntoView();
        pageUtil.scrollChatListDown();
      }, 200);
    },
    swicthMsgType() {
      this.sendTxt = !this.sendTxt;
    },
    toRecord() {
      this.toRecordCount++;
      if (window.stopPlayAudio) {
        window.stopPlayAudio();
      }
      if (location.protocol === 'http:') {
        this.$toast('请使用https协议');
        return;
      }
      if (this.recording) {
        return;
      }
      if (this.toRecordCount > 1 && !this.recorder) {
        this.recordDisable = true;
      }
      if (this.recordDisable || !this.audioContext || !window.AudioContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.$toast('当前浏览器不支持录音');
        return;
      }
      if (this.recorder) {
        this.recorder.record();
        this.resumeAudioContext();
      } else {
        const failed = () => {
          this.recordDisable = true;
          this.$toast('当前浏览器不支持录音');
        };
        try {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
              let input;
              try {
                input = this.audioContext.createMediaStreamSource(stream);
                this.recorder = new Recorder(input);
                this.recorder.record();
                this.resumeAudioContext();
                if (!this.recorder) {
                  failed();
                }
              } catch (e) {
                failed();
              }
            })
            .catch(err => {
              this.$toast('没有权限获取麦克风');
              this.recordDisable = true;
              console.log('No live audio input: ' + err, err.name + ": " + err.message);
            });
        } catch (e) {
          failed();
        }
      }
    },
    runRecorderTime() {
      if (this.recorder) {
        this.recording = true;
        this.recordTime = 0;
        setTimeout(() => {
          this.$recordTime = document.getElementById('recordTime');
        }, 800);
        this.recordTimeout = setTimeout(this.runRecordDuration.bind(this), 1000);
      }
    },
    resumeAudioContext() {
      if (this.audioContext && ~this.audioContext.state.indexOf('suspend')) {
        this.audioContext.resume().then(() => {
          console.log('audioContext suspend state resume');
          this.recorder.record();
          this.runRecorderTime();
        });
      } else {
        this.runRecorderTime();
      }
    },
    runRecordDuration() {
      this.recordTimeout = setTimeout(this.runRecordDuration.bind(this), 1000);
      this.recordTime++;
      if (this.recordTime >= 60) {
        clearTimeout(this.recordTimeout);
        this.sendRecord();
      }
      this.$recordTime.innerText = `00:${this.recordTime > 9 ? this.recordTime : '0' + this.recordTime}`;
    },
    siwtchRecord() {
      if (this.recording) {
        this.sendRecordMsg();
      } else {
        this.toRecord();
      }
    },
    cancelRecord() {
      if (this.recording) {
        this.recording = false;
        clearTimeout(this.recordTimeout);
        if (this.$recordTime) {
          this.$recordTime.innerText = '00:00';
        }
        this.recorder.stop();
        this.recorder.clear();
      }
    },
    sendRecordMsg() {
      setTimeout(this.sendRecord, 500);
    },
    sendRecord() {
      if (this.recording) {
        clearTimeout(this.recordTimeout);
        if (this.recordTime < 2) {
          this.$toast('语音消息最短2s');
          this.cancelRecord();
          return;
        }
        this.recording = false;
        this.$recordTime.innerText = '00:00';
        this.recorder.stop();
        this.recorder.exportWAV(blob => {
          this.$store.dispatch('showLoading');
          this.$store.dispatch('sendFileMsg', {
            scene: this.scene,
            to: this.to,
            type: 'audio',
            blob: blob,
            uploadprogress: obj => {
              console.log('文件总大小: ' + obj.total + 'bytes');
              console.log('已经上传的大小: ' + obj.loaded + 'bytes');
              console.log('上传进度: ' + obj.percentage);
              console.log('上传进度文本: ' + obj.percentageText);
              if (obj.percentage === 100) {
                this.$store.dispatch('hideLoading');
              }
            },
            uploaderror: () => {
              console && console.log('上传失败');
            },
            uploaddone: (error, file) => {
              console.log(error);
            }
          });
        });
        this.recorder.clear();
      }
    },
    showFullscreenImg({ src }) {
        this.fullscreenImgSrc = src;
        this.isFullscreenImgShow = true;
    },
      hideFullscreenImg() {
        this.fullscreenImgSrc = '';
        this.isFullscreenImgShow = false;
    },
    updateLoading(status) {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = setTimeout(() => {
          this.isLoading = status;
        }, 20);
    },
    updateUserUID(loginInfo) {
        this.userUID = loginInfo.uid;
        this.sdktoken = loginInfo.sdktoken;
      },
      updateMyInfo(myInfo) {
        this.myInfo = { ...this.myInfo, ...myInfo };
      },
      updateUserInfos(users) {
        users.forEach(user => {
          const account = user.account;
          if (account) {
            this.userInfos[account] = { ...this.userInfos[account], ...user };
          }
        });
      },
      updateFriends(friends, cutFriends = []) {
        this.friendslist = [...friends];
        this.friendslist = this.friendslist.filter(friend => !cutFriends.includes(friend.account));
      },
      updateRobots(robots) {
        robots = robots.map(item => {
          if (item.avatar) {
            item.originAvatar = item.avatar;
            item.avatar = item.avatar;
          } else {
            item.avatar = config.defaultUserIcon;
          }
          return item;
        });
        this.robotslist = robots;
        this.robotInfos = {};
        robots.forEach(robot => {
          this.robotInfos[robot.account] = robot;
          this.robotInfosByNick[robot.nick] = robot;
        });
      },
      updateBlacklist(blacks) {
        this.blacklist = this.blacklist.filter(item => !blacks.invalid.includes(item.account));
        const addBlacks = blacks.filter(item => item.isBlack);
        const remBlacks = blacks.filter(item => !item.isBlack);
        this.blacklist = [...this.blacklist, ...addBlacks];
        this.blacklist = this.blacklist.filter(item => !remBlacks.includes(item.account));
      },
      updateSessions(sessions) {
        this.sessionlist = [...sessions];
        this.sessionlist.sort((a, b) => b.updateTime - a.updateTime);
        this.sessionlist.forEach(item => {
          this.sessionMap[item.id] = item;
        });
      },
      deleteSessions(sessionIds) {
        this.sessionlist = this.sessionlist.filter(session => !sessionIds.includes(session.id));
      },
      updateMsgs(msgs) {
        let tempSessionMap = {};
        msgs.forEach(msg => {
          const sessionId = msg.sessionId;
          tempSessionMap[sessionId] = true;
          if (!this.msgs[sessionId]) {
            this.msgs[sessionId] = [];
          }
          this.msgs[sessionId] = [...this.msgs[sessionId], msg];
        });
        for (let sessionId in tempSessionMap) {
          this.msgs[sessionId].sort((a, b) => a.time - b.time);
        }
      },
      putMsg(msg) {
        const sessionId = msg.sessionId;
        if (!this.msgs[sessionId]) {
          this.msgs[sessionId] = [];
        }
        this.msgs[sessionId].push(msg);
      },
      deleteMsg(msg) {
        const sessionId = msg.sessionId;
        this.msgs[sessionId] = this.msgs[sessionId].filter(m => m.idClient !== msg.idClient);
      },
      showFullscreenImg({ src }) {
        this.fullscreenImgSrc = src;
        this.isFullscreenImgShow = true;
      },
      hideFullscreenImg() {
        this.fullscreenImgSrc = '';
        this.isFullscreenImgShow = false;
      },
      updateRoute(route) {
        this.route = route;
      },
      getTeamMembers(teamId) {
        // Fetch team members logic
      },
      searchUsers(payload) {
        // Search users logic
      },
      showLoading() {
        // Show loading logic
      },
      hideLoading() {
        // Hide loading logic
      },
      delegateTeamFunction(payload) {
        // Delegate team function logic
      },
  }
});
