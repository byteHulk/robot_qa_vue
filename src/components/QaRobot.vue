<template>
  <!-- 主站对接小木 -->
  <div id="qarobot">
    <div
      class="chatBtn"
      id="chat-btn"
      data-toggle="tooltip"
      v-if="is_show == true && isFullPage == false"
    >
      <!-- <div class="chat-btn-inner" id="chat-btn-inner"> -->
      <span class="btn-img" id="chat-btn-icon"></span>
      <!-- <span class="btn-txt" id="chat-btn-txt">学堂小木</span>
            </div> -->
      <div
        class="first-enter adsorb-right"
        id="first-enter"
        v-if="!showQarobotTip && xiaoMuIconTip"
      >
        {{ xiaoMuIconTip
        }}<i class="close-first-enter-icon" id="close-first-enter-icon"></i>
      </div>
    </div>
    <div id="chatbox" :class="isFullPage ? 'fullpage' : 'icontype'">
      <!-- DIRECT CHAT PRIMARY -->
      <div class="wrap-drag">
        <label
          id="robot_label_top"
          class="robot_label_top"
          v-if="!isFullPage"
        ></label>
        <div class="robot-name">
          <div class="name">
            {{
              isFullPage
                ? "base.Qarobot.YuketangFAQ"
                : $t("base.Qarobot.XuetangXiaoMu")
            }}
          </div>
          <div class="close" v-if="!isFullPage">
            <a href="#" class="box-close">
              <!-- close-icon or hide-icon -->
              <span
                class="close-img hide-icon"
                :style="{ transform: `rotateY(${this.isRight ? 180 : 0}deg)` }"
              ></span>
            </a>
          </div>
        </div>
        <!-- 五种flag: say_hello, no_feedback, feedbackend, poem, try -->
        <!-- !item.flag to==> item.flag !='say_hello' && item.flag !='no_feedback' && item.flag !='feedbackend' && item.flag !='poem' && item.flag !='try' -->
        <div class="chat-content">
          <div
            class="chat-item fc"
            v-for="(item, index) in items"
            :key="index"
            :class="
              item.isTranslate && item.rid ? 'istranslate_' + item.rid : ''
            "
          >
            <input
              type="hidden"
              id="timer"
              v-if="item.timer"
              :value="item.timer"
            />
            <!-- study_flag是积极小木（学习前中后一些计划、鼓励、推荐）的标示字段 与一期小木分开 -->
            <template v-if="!item.study_flag">
              <div
                v-if="item.uid == -1"
                class="loading-wrapper fc"
                :id="'rid_' + item.rid"
              >
                <div class="typing_loader"></div>
              </div>
              <span v-if="item.uid == 0" class="img fl"></span>
              <img
                v-if="item.uid == 1 && is_show_usericon"
                class="ques-img fr"
                :src="imageSrc"
              />
              <div
                v-if="item.uid == 0"
                :class="
                  item.flag !== 'say_hello' &&
                  item.flag !== 'no_feedback' &&
                  item.flag !== 'feedbackend' &&
                  !item.timer
                    ? 'item-content feedback fl'
                    : 'item-content fl'
                "
              >
                <div
                  :class="
                    ((item.flag != 'say_hello' &&
                      item.flag != 'no_feedback' &&
                      item.flag != 'feedbackend' &&
                      item.flag != 'poem' &&
                      item.flag != 'try') ||
                      item.flag == 'no_feedback') &&
                    !item.hasImage &&
                    !item.isVideo &&
                    !item.isAudio
                      ? !!item.title
                        ? 'details title-hide-show'
                        : 'details hide-show'
                      : 'details'
                  "
                >
                  <div
                    v-if="
                      item.flag != 'say_hello' &&
                      item.flag != 'no_feedback' &&
                      item.flag != 'feedbackend' &&
                      item.flag != 'poem' &&
                      item.flag != 'try' &&
                      !item.timer
                    "
                    class="details-child"
                  >
                    <div class="details-content" v-html="item.message"></div>
                  </div>

                  <div v-if="item.timer" class="details-child">
                    <div class="details-content" v-html="item.message"></div>
                    <div class="timer-options">
                      <!-- 是的，没有 -->
                      <a class="timer" href="#" @click="getFeedback('True')"
                        >{{ "Yes" }}
                      </a>
                      <a class="timer" href="#" @click="getFeedback('False')">{{
                        "No"
                      }}</a>
                    </div>
                  </div>

                  <div
                    v-if="item.flag == 'poem'"
                    class="details-child"
                    :style="
                      item.isTranslate
                        ? 'position:relative;'
                        : 'position:relative;padding-right:80px;'
                    "
                  >
                    <div class="details-content" v-html="item.message"></div>
                    <div
                      v-if="
                        typeof item.questions == 'object' &&
                        !isNaN(item.questions.length)
                      "
                      class="flay-try-ques"
                      style="
                        position: absolute;
                        bottom: 0px;
                        right: 0px;
                        padding-bottom: 0;
                      "
                    >
                      <span
                        v-for="(ques, index) in item.questions"
                        :key="index"
                        class="xt_question"
                        @click="getAnswerAuto($event, ques, item.flag)"
                        v-html="ques"
                      ></span>
                    </div>
                  </div>
                  <div v-if="item.flag == 'say_hello'" class="details-child">
                    <div class="details-content" v-html="item.message"></div>
                    <div
                      v-if="
                        typeof item.questions == 'object' &&
                        !isNaN(item.questions.length)
                      "
                      class="flay-try-ques"
                    >
                      <span
                        v-for="(ques, index) in item.questions"
                        :key="index"
                        class="xt_question"
                        @click="
                          getAnswerAuto(
                            $event,
                            ques.question,
                            ques.flag,
                            ques.data
                          )
                        "
                        v-html="ques.question"
                      ></span>
                    </div>
                  </div>
                  <div v-if="item.flag == 'feedbackend'" class="details-child">
                    <div class="details-content" v-html="item.message"></div>
                  </div>
                  <div v-if="item.flag == 'try'" class="details-child">
                    <div class="details-content" v-html="item.message"></div>
                    <div
                      v-if="
                        typeof item.questions == 'object' &&
                        !isNaN(item.questions.length)
                      "
                      class="flay-try-ques"
                    >
                      <span
                        v-for="(ques, index) in item.questions"
                        :key="index"
                        class="xt_question"
                        @click="
                          getAnswerAuto(
                            $event,
                            ques.question,
                            ques.flag,
                            ques.data
                          )
                        "
                        v-html="ques.question"
                      ></span>
                    </div>
                  </div>
                </div>

                <!-- 来源source -->
                <a
                  v-if="item.source && item.url"
                  class="source source-click"
                  :href="item.url"
                  target="blank"
                  >{{ item.source }}</a
                >
                <a
                  v-if="item.source && !item.url"
                  class="source source-unclick"
                  href="javascript:;"
                  >{{ item.source }}</a
                >
                <div
                  v-if="
                    !item.source &&
                    item.flag != 'say_hello' &&
                    item.flag != 'no_feedback' &&
                    item.flag != 'feedbackend' &&
                    item.flag != 'poem' &&
                    item.flag != 'try' &&
                    !item.timer &&
                    !item.isOnlyImg &&
                    !item.isVideo &&
                    !item.isAudio
                  "
                  class="split_10"
                  style="
                    position: relative;
                    width: 100%;
                    height: 0;
                    margin-bottom: 10px;
                  "
                ></div>
                <!-- 有用、无用 -->
                <div
                  v-if="
                    item.flag !== 'say_hello' &&
                    item.flag !== 'no_feedback' &&
                    item.flag !== 'feedbackend' &&
                    !item.timer
                  "
                  class="praise-wrap"
                >
                  <span
                    class="praise-btn praise-no"
                    @click="selectedPraise($event, item.rid, 'False')"
                    >{{ $t("base.Qarobot.Disagreeing") }}</span
                  >
                  <span
                    class="praise-btn praise-ok"
                    @click="selectedPraise($event, item.rid, 'True')"
                    >{{ $t("base.Qarobot.Agreeing") }}</span
                  >
                  <span
                    v-if="
                      'rid' in item &&
                      item.rid &&
                      !item.isTranslate &&
                      !item.isOnlyImg &&
                      !item.isOnlyVideo
                    "
                    class="praise-btn praise-translate"
                    @click="translatePraise($event, item.rid, index)"
                    >{{ $t("base.Qarobot.Translate") }}</span
                  >
                </div>
              </div>
              <div
                v-if="item.uid == 1"
                class="item-content item-content-right fr"
                v-html="item.message"
              ></div>
            </template>
            <!--  积极小木-->
            <template v-if="item.study_flag">
              <span class="img fl"></span>
              <div class="item-content fl">
                <!-- 刚开始学习（学习前）提醒制定学习计划 -->
                <div
                  v-if="item.study_flag == 'study_plan'"
                  class="details-child study-plan"
                >
                  <div class="details-content">
                    <div class="item-msg-warp">
                      {{ base.Qarobot.JiJiQaTip }}
                      <div class="plan-week">
                        <div class="plan-question">
                          (1)&nbsp;{{ base.Qarobot.JiJiQaTip1 }}
                        </div>
                        <div class="plan-choice">
                          <input
                            checked
                            type="radio"
                            name="plan_week"
                            value="1"
                          />
                          <i>1</i>
                          <input type="radio" name="plan_week" value="3" />
                          <i>3</i>
                          <input type="radio" name="plan_week" value="5" />
                          <i>5</i>
                          <input type="radio" name="plan_week" value="7" />
                          <i>7</i>
                        </div>
                      </div>
                      <div class="plan-day">
                        <div class="plan-question">
                          (2)&nbsp;{{ base.Qarobot.JiJiQaTip2 }}
                        </div>
                        <div class="plan-choice">
                          <input
                            checked
                            type="radio"
                            name="plan_day"
                            value="1"
                          />
                          <i>1</i>
                          <input type="radio" name="plan_day" value="2" />
                          <i>2</i>
                          <input type="radio" name="plan_day" value="3" />
                          <i>3</i>
                          <input type="radio" name="plan_day" value="5" />
                          <i>5</i>

                          <!-- <template v-for="(index,choice) in item.hour_of_day" >

                                                                        <input v-if="index==0" checked type="radio"  name="plan_day" :value="choice" >
                                                                        <input v-else type="radio"  name="plan_day" :value="choice" >
                                                                        <i v-text="choice"></i>
                                                                </template> -->
                        </div>
                      </div>
                      <div class="plan-bottom">
                        <span class="submit-plan">{{ Commit }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 学习中落下进度提醒(包含加油鼓励 后端拼接) -->
                <div
                  v-if="item.study_flag == 'study_remind'"
                  class="details-child"
                >
                  <div class="details-content">
                    <div class="item-msg-warp" v-html="item.content"></div>
                  </div>
                </div>
                <!-- 学习中期没有进度提醒，只有普通加油鼓励 -->
                <div
                  v-if="item.study_flag == 'no_study_remind'"
                  class="details-child"
                >
                  <div class="details-content">
                    <div class="item-msg-warp" v-html="item.content"></div>
                  </div>
                </div>
                <!-- 学习后期课程推荐 -->
                <!-- <div v-if="item.study_flag=='study_recommend'" class="details-child" >
                                        <div class="details-content">
                                            <div class="item-msg-warp" >{{$t('base.Qarobot.learnTip')}}
                                                <div class="recommend-content">
                                                    <span  v-for="itemSmall in item.content"  :data-jump-url="itemSmall.url">{{itemSmall.name}}</span>
                                                </div>
                                            </div>
                                        </div>

                                </div> -->
              </div>
            </template>
          </div>
          <div class="chat-item fc">
            <div style="height: 20px" />
          </div>
        </div>
        <div class="chat-ques" id="chat-ques">
          <textarea
            class="ques"
            :placeholder="$t('base.Qarobot.TextAreaPlaceholder')"
            name="question"
            @blur="textAreaBlur($event)"
            @focus="textAreaFocus($event)"
            @input="inputEvent($event)"
            @keyup="trimQuestion($event)"
            @click="trimQuestion($event)"
            v-model="question"
            @keydown.enter="getAnswer($event)"
          ></textarea>
          <div class="send-btn-box">
            <div
              :class="
                isFocusSendBtn ? 'send-btn-wrap isfocus' : 'send-btn-wrap'
              "
            >
              <button
                class="send-btn"
                id="send-btn"
                @click="sendBtnAnswer($event)"
              >
                {{ $t("Send") }}
              </button>
              <div
                class="btn-typs-box"
                id="btn-typs-box"
                @mouseover="selectTypeMouseover($event)"
                @mouseout="selectTypeMouseout($event)"
              >
                {{ default_answer_type.name }}
                <div
                  :class="
                    show_typs_select_box
                      ? 'types_select_box show_types'
                      : 'types_select_box'
                  "
                >
                  <div class="show_typs_select_wrap">
                    <span
                      v-for="(type, index) in answer_type"
                      :key="index"
                      @click="changeSendType(type)"
                      :class="
                        default_answer_type.id == type.id
                          ? 'type_select selected_type'
                          : 'type_select'
                      "
                    >
                      {{ type.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <label id="robot_label" class="robot_label" v-if="!isFullPage"></label>
      <!-- <div class="report-entrance">
                <div class="report-entrance-close">X</div>
                <div class="report-entrance-content">
                    <span>Hi,xxx :</span>
                    <div class="content-text">
                        &nbsp;&nbsp;&nbsp;&nbsp;本课程采用了混合式教学，为了更好的教学效果，请给我反馈你的真实学习体验吧！
                        <a href="" target="_blank">
                            ==>去填问卷
                        </a>
                    </div>
                    <span class="teacher_name">xxx</span>
                </div>
            </div> -->
    </div>
  </div>
</template>

<script>
import { plat, platInfo } from "../utils/customize";
import XtPlayer from "../utils/XtPlayer.min.js";
import AudioPlayer from "../utils/AudioPlayer.js";
import util from "@/utils/util";
let Util = {
  type: function (val) {
    switch (toString.call(val)) {
      case "[object Date]":
        return "date";
      case "[object RegExp]":
        return "regexp";
      case "[object Arguments]":
        return "arguments";
      case "[object Array]":
        return "array";
      case "[object Error]":
        return "error";
    }

    if (val === null) return "null";
    if (val === undefined) return "undefined";
    if (val !== val) return "nan";
    if (val && val.nodeType === 1) return "element";

    val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);
    return typeof val;
  },
  extend: function () {
    var that = this;
    var src,
      copyIsArray,
      copy,
      name,
      options,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (
      typeof target !== "object" &&
      !(toString.call(target) == "[object Function]")
    ) {
      target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (length === i) {
      target = this;
      --i;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (
            deep &&
            copy &&
            (copy instanceof Object || (copyIsArray = copy instanceof Array))
          ) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && src instanceof Array ? src : [];
            } else {
              clone = src && src instanceof Objec ? src : {};
            }

            // Never move original objects, clone them
            target[name] = arguments.callee(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  },
  clone4: function (obj) {
    switch (this.type(obj)) {
      case "object":
        var copy = {};
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            copy[key] = clone(obj[key]);
          }
        }
        return copy;

      case "array":
        var copy = new Array(obj.length);
        for (var i = 0, l = obj.length; i < l; i++) {
          copy[i] = clone(obj[i]);
        }
        return copy;

      case "regexp":
        // from millermedeiros/amd-utils - MIT
        var flags = "";
        flags += obj.multiline ? "m" : "";
        flags += obj.global ? "g" : "";
        flags += obj.ignoreCase ? "i" : "";
        return new RegExp(obj.source, flags);

      case "date":
        return new Date(obj.getTime());

      default:
        // string, number, boolean, 其他
        return obj;
    }
  },
  getCSS: function (curEle) {
    //curEle--Element

    var valObj = null;

    if (/MSIE (6|7|8)/.test(navigator.userAgent)) {
      valObj = curEle.currentStyle;
    } else {
      valObj = window.getComputedStyle(curEle, null);
    }

    return function (attr) {
      var reg = null;
      var val = null;
      if (attr === "opacity") {
        val = valObj["filter"];
        //把获取到的结果剖析，获取里面的数字，让数字除以100才和标准浏览器保持一致
        reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
        return reg.test(val) ? reg.exec(val)[1] / 100 : 1;
      } else {
        val = valObj[attr];
      }
      reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;
      return reg.test(val) ? parseFloat(val) : val;
    };
  },
  getCSSWidthAttr: function (curEle, attr) {
    var reg = null;
    var val = null;

    if (/MSIE (6|7|8)/.test(navigator.userAgent)) {
      if (attr === "opacity") {
        val = curEle.currentStyle["filter"];
        //把获取到的结果剖析，获取里面的数字，让数字除以100才和标准浏览器保持一致
        reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
        return reg.test(val) ? reg.exec(val)[1] / 100 : 1;
      } else {
        val = curEle.currentStyle[attr];
      }
      reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;
      return reg.test(val) ? parseFloat(val) : val;
    } else {
      val = window.getComputedStyle(curEle, null)[attr];
      reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;
      return reg.test(val) ? parseFloat(val) : val;
    }
  },
  overflowhidden: function (text, rows, str) {
    //第一种脑抽式写法，需要不断的写入html不断的修改，次数较多，但是很好地将设定的行数填充满。所以实现效果还是蛮好的。
    var style = this.getCSS(text);
    var lineHeight = style("line-height"); //获取到line-height样式设置的值 必须要有
    var at = rows * parseInt(lineHeight); //计算包含文本的div应该有的高度
    var tempstr = str; //获取到所有文本
    text.innerHTML = tempstr; //将所有文本写入html中
    var len = tempstr.length;
    var i = 0;
    if (text.offsetHeight <= at) {
      //如果所有文本在写入html后文本没有溢出，那不需要做溢出处理
      /*text.innerHTML = tempstr;*/
      return false;
    } else {
      //否则 一个一个字符添加写入 不断判断写入后是否溢出
      var temp = "";
      text.innerHTML = temp;
      while (text.offsetHeight <= at) {
        temp = tempstr.substring(0, i + 1);
        i++;
        text.innerHTML = temp;
      }
      var slen = temp.length;
      tempstr = temp.substring(0, slen - 1);
      len = tempstr.length;
      text.innerHTML = tempstr.substring(0, len - 5) + "..."; //替换string后面5个字符
      text.height = at + "px"; //修改文本高度 为了让CSS样式overflow：hidden生效
      return true;
    }
  },
  overflowhiddenByMiddleSplit: function (text, rows, str) {
    //第二种没那么脑抽式写法，二分处理文本数据，修改html的次数相对而言较少。但是只能够满足设置的行数要求，在最后一行可能会有大面积的空白。
    var style = this.getCSS(text);
    var lineHeight = style["line-height"];
    var at = rows * parseInt(lineHeight);
    var tempstr = str;
    text.innerHTML = tempstr;
    var len = tempstr.length;
    var i = 0;
    if (text.offsetHeight <= at) {
      //如果所有文本在写入html后文本没有溢出，那不需要做溢出处理
      /*text.innerHTML = tempstr;*/
      return false;
    } else {
      //否则 二分处理需要截断的文本
      var low = 0;
      var high = len;
      var middle;
      while (text.offsetHeight > at) {
        middle = (low + high) / 2;
        text.innerHTML = tempstr.substring(0, middle); //写入二分之一的文本内容看是否需要做溢出处理
        if (text.offsetHeight < at) {
          //不需要 则写入全部内容看是否需要 修改low的值
          text.innerHTML = tempstr.substring(0, high);
          low = middle;
        } else {
          //写入二分之一的文本内容依旧需要做溢出处理 再对这二分之一的内容的二分之一的部分做判断
          high = middle - 1; //修改high值
        }
      }
      tempstr = tempstr.substring(0, high) + "...";
      text.innerHTML = tempstr;
      if (text.offsetHeight > at) {
        tempstr = tempstr.substring(0, high - 3) + "...";
      }
      text.innerHTML = tempstr;
      text.height = at + "px";
      return true;
    }
  },
  parseQueryUrl: function (url) {
    //为了防止误会：url所带参数中不要有：# , 因为location.hash是以#开始的。而且url中参数（？）和 hash（#）是有顺序的：先是 ？，后是 #
    var reg_url = /^[^\?]+\?([\w\W]+)$/,
      reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
      _re = /\%[0-9A-Z]{2}/, //解析encodeURIComponent对中文的编码文本
      arr_url = reg_url.exec(url),
      ret = {};
    if (arr_url && arr_url.length > 0 && arr_url[1].indexOf("#") != -1) {
      ret["hash"] = arr_url[1].substr(arr_url[1].indexOf("#") + 1);
      arr_url[1] = arr_url[1].substring(0, arr_url[1].indexOf("#"));
    }
    if (arr_url && arr_url[1]) {
      var str_para = arr_url[1],
        result;
      while ((result = reg_para.exec(str_para)) != null) {
        var _res = result[2];
        if (_re.test(_res)) {
          ret[result[1]] = decodeURIComponent(_res);
        } else {
          ret[result[1]] = _res;
        }
      }
    }
    return ret;
  },
  getCookie(name) {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  },
  //从数组里随机一个元素
  randomFromArr(arr) {
    if (!arr) return;
    var randomNum = Math.floor(Math.random() * arr.length);
    return arr[randomNum];
  },
};

export default {
  name: "qarobot",
  components: {},
  // props: ["course_id"],
  data() {
    return {
      chat_id: null,
      qaTimer: null,
      // 小木当前的对话数组 包括小木的回答和用户发送的
      items: [],
      videoList: [],
      audioList: [],
      question: "",
      inputData: "",
      tag: "", //问题分类标记
      debug: false,
      isFullPage: false,
      local_lang: "zh", //国际化
      isBlur: true,
      iszhinput: false,
      iszhinputEnd: false,
      tem_remind: null,
      temp_question: "",
      default_answer_type: { id: 0, name: "问谷雨" },
      answer_type: [
        { id: 0, name: "问谷雨" },
        { id: 1, name: "问客服" },
      ],
      show_typs_select_box: false,
      algos: ["quiz", "forum", "synthetic", "aibot"],
      // 提问的问题
      questions_arr: [],
      // 回答的问题
      answers_arr: [],
      // 当前课程-videoId
      videoId: "",
      ccid: "", //如果是视频学习单元，ccid
      // 反馈 是 否
      is_feedback: "",
      // 提问者id
      user_id: "",
      //是否显示提问者头像
      course_id: "",
      is_show_usericon: false,
      // 是否是打招呼
      is_flag: "",
      // 是否为开通课
      is_show: false,
      is_show_box: false,
      isFocusSendBtn: false,
      //是否学霸模式
      is_scholar: false,
      isClick: "",
      isRight: true,
      flag_an: true,
      knowledge_points: null,
      current_point: null,
      knowledgeAnswerHandler: null,
      bindVideoMenusHandler: 0,
      getRemindHandler: null,
      // 学习中期的定时器加油鼓励 5分钟和40分钟
      fiveTimeout: null,
      fourtyTimeout: null,
      fzwidth: "",
      posObj: {},
      xiaoMuIconTip: "嗨～我是你的智能学习助理小木。学习中有问题可以来问我哦！", //小木icon右上角提示语，从接口获取
      encourageArr: [
        "你若想尝试一下勇者的滋味，一定要像个真正的勇者一样，豁出全部的力量去行动，这时你的恐惧心理将会为勇猛果敢所取代&nbsp;&nbsp;——丘吉尔",
        "  既然我已经踏上这条道路，那么，任何东西都不应妨碍我沿着这条路走下去。&nbsp;&nbsp;——康德",
        " 书不记，熟读可记；义不精，细思可精；惟有志不立，直是无著力处。&nbsp;&nbsp;——朱熹",
        "今天很残酷，明天很残酷，后天很美好，但是绝大多数人死在明天晚上，见不到后天的太阳。&nbsp;&nbsp;——马云",
        " 我可以接受失败，但我不能接受放弃！&nbsp;&nbsp;——迈克尔乔丹",
        " 如果今天是你生命的最后一天，你想做什么？你今天要做什么？&nbsp;&nbsp;——乔布斯",
        "你知道，有些鸟儿是注定不会被关在牢笼里的，它们的每一片羽毛都闪耀着自由的光辉。&nbsp;&nbsp;——《肖申克的救赎》",
        " 我只能送你到这里了，剩下的路你要自己走，不要回头。&nbsp;&nbsp;——《千与千寻》",
        "一个人并不是生来要被打败的，你尽可以把他消灭掉，可就是打不败他。&nbsp;&nbsp;——《老人与海》",
      ],
    };
  },
  watch: {
    "$route.params"(n, o) {
      console.log(n, o);
      if (
        n &&
        o &&
        (n.leaf_id != o.leaf_id || n.classroom_id != o.classroom_id)
      ) {
        var pathName = window.location.pathname;
        if (/^\/learn\/.*/g.test(pathName) && pathName.indexOf("video") != -1) {
          this.videoId = n.leaf_id;
        } else {
          this.videoId = "";
        }
      }
    },
    learnVideoCCID: function (n, o) {
      var pathName = window.location.pathname;
      if (/^\/learn\/.*/g.test(pathName) && pathName.indexOf("video") != -1) {
        this.ccid = n;
        if (this.is_show) this.knowledge();
      } else {
        this.ccid = "";
      }
    },
  },
  computed: {
    showQarobotTip: {
      //是否第一次进来
      get: function () {
        return "";

        return this.$store.state.show_qarobot_tip;
      },
    },
    imageSrc: {
      // 提问者头像
      get: function () {
        return "";

        return this.$store.state.loginAvatar;
      },
    },
    ques_nickname: {
      // 提问者昵称
      get: function () {
        return "";

        return this.$store.state.loginName;
      },
    },
    learnVideoCCID: {
      //视频学习单元ccid
      get: function () {
        return "";
        // return this.$store.state.learnVideoCCID;
      },
    },
  },
  created() {
    var $this = this;
    $this.$nextTick(function () {
      // console.log($this.i18n,'$this.$i18n')
      // $this.local_lang = 'zh';
      // $this.local_lang = $this.$i18n.locale;
      $this.xiaoMuIconTip =
        $this.local_lang.indexOf("zh") == -1
          ? "Hi~I’m Xiaomu, your intelligent learning assistant. Feel free to ask me questions when you are stuck! "
          : "嗨～我是你的智能学习助理小木。学习中有问题可以来问我哦！";

      if ($this.debug) {
        $this.is_show = true;
        $this.videoId = "53834"; //数据结构上-videoId
        $this.ccid = "79E909186B11A9289C33DC5901307461";
        $this.startQA();
      } else {
        // 提取主站课件videoId
        // /learn/:products_sign/:course_sign/:classroom_id/video/:leaf_id
        var hostName = window.location.hostname;
        var pathName = window.location.pathname;
        if (/^\/learn\/.*/g.test(pathName)) {
          var isVideo = false;
          if (pathName.indexOf("video") != -1) isVideo = true;
          if (isVideo) {
            $this.videoId = $this.$route.params.leaf_id;
            $this.ccid = $("#qarobot-innter").attr("ccid");
          }
          // if(/0\.0\.0\.0|localhost|xt\.yuketang\.cn|next\.xuetangonline\.com/gi.test(hostName)){
          //     $this.is_show = true;
          // }
        }
        $this.is_show = true;
        $this.startQA();
        // if($this.is_show){
        //     $this.startQA();
        // }else{
        //     $this.qa_ajax({
        //         url: '/api/v1/lms/xiaomu/courses/xiaomu_switch/',
        //         type: 'get',
        //         async: false,
        //         data: {"course_id": $this.course_id},
        //         success: function (response) {
        //             response = response.data;
        //             //{"msg": "", "data": {"switch": true}, "success": true}
        //             if (response.success) {
        //                 if("switch" in response.data){
        //                     $this.is_show = response.data.switch;
        //                 }
        //             }
        //             console.log
        //             $this.startQA();
        //         },
        //         error: function(error){
        //             $this.startQA();
        //         }
        //     });
        // }
      }
    });
  },
  mounted() {},
  methods: {
    startQA() {
      var $this = this;

      // console.log($this.is_show,'$this.is_show')
      if ($this.is_show) {
        $this.getAnswerTypes();
        if ($this.isFullPage) {
          $this.imageSrc =
            "https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/b6ce32912ffa1c5959b0da6ceb9ce27e.avatar@2x.png";
          $this.ques_nickname = "";
          $this.user_id = "";
        } else {
          let id = localStorage.getItem("user_id");
          if (!id) {
            $this.user_id = Array(8)
              .fill(1)
              .map((e) => Math.floor(Math.random() * 10))
              .join("");
            localStorage.setItem("user_id", $this.user_id);
          } else {
            $this.user_id = id;
          }
          $this.course_id = "course-v1:TsinghuaX+30240184_2X+sp";
          // $this.user_id = "";
          // $this.user_id = $this.$Cookie.get("k") ? $this.$Cookie.get("k") : '';
          $this.getQaHelloTip(); //获取小木提示语言
        }
        $this.qaInit();
        // 视频知识点拓扑图
        if (!$this.isFullPage) {
          this.knowledge();
        }
        //清华小木：三门课
        if (
          $this.course_id == "course-v1:TsinghuaX+80512073X+2018_T1" ||
          $this.course_id == "course-v1:TsinghuaX+00740123X+2018_T1" ||
          $this.course_id == "course-v1:TsinghuaX+30700313X+2018_T1"
        ) {
          $this.qinghuaXiaomu();
        } else if ($this.is_show) {
          // $this.promptByStudyTime();
        }
        // if ($this.isFullPage) {
        //   $this.showChat(true);
        // }
      }
    },
    qaFolder(ele_child) {
      // 超出展开按钮
      var ele_father = ele_child.parent();
      // 初始化
      var child_height = ele_child.outerHeight();
      var father_height = ele_father.outerHeight();
      var _isshow = false;
      if (ele_father.hasClass("title-hide-show")) {
        var titleH = ele_father.find(".title-box").outerHeight() + 10;
        if (child_height > titleH + 212) {
          _isshow = true;
          ele_father.css({
            "max-height": titleH + 212 + "px",
          });
        }
      }
      if (ele_father.hasClass("hide-show") && child_height > father_height) {
        _isshow = true;
      } else if (
        ele_father.hasClass("hide-show") &&
        child_height <= father_height
      ) {
        ele_father.removeClass("hide-show");
        ele_father.parent().find(".split_10").remove();
      }
      var show_btn = ele_father.find(".fold-show");
      if (_isshow && show_btn.length <= 0) {
        show_btn = $(
          '<a class="fold-show"><span class="ellipsis">...</span><span class="arrow"></span></a>'
        ).appendTo(ele_father);
        // 点击展开
        show_btn.on("click", function () {
          if ($(this).attr("class") == "fold-show") {
            $(this).parent().hasClass("hide-show") &&
              $(this).parent().removeClass("hide-show");
            $(this).parent().hasClass("title-hide-show") &&
              $(this)
                .parent()
                .removeClass("title-hide-show")
                .attr("title", "1")
                .css({
                  "max-height": "100%",
                });
            $(this).attr("class", "fold-hide");
            return false;
          } else {
            if ($(this).parent().attr("title")) {
              var titleH =
                $(this).parent().find(".title-box").outerHeight() + 10;
              $(this)
                .parent()
                .addClass("title-hide-show")
                .css({
                  "max-height": titleH + 212 + "px",
                });
            } else $(this).parent().addClass("hide-show");
            $(this).attr("class", "fold-show");
            return false;
          }
        });
      }
    },
    getAnswerTypes() {
      var $this = this;
      this.qa_ajax({
        url: "/api/v1/lms/xiaomu/courses/answer_type",
        type: "get",
        async: false,
        data: { course_id: $this.course_id },
        success: function (response) {
          let resData = JSON.parse(response.data);
          if (resData.length) {
            $this.answer_type = resData;
          }
        },
      });
    },
    getQaHelloTip() {
      //小木提示语
      var $this = this;
      if ($this.user_id) {
        this.qa_ajax({
          url: "/api/v1/lms/xiaomu/courses/reminder/word",
          type: "get",
          data: {
            course_id: $this.course_id,
            user_id: $this.user_id,
            language: "chinese",
            // $this.local_lang.indexOf("zh") != -1
            //   ? "chinese"
            //   : $this.local_lang.indexOf("en") != -1
            //   ? "english"
            //   : $this.local_lang,
          },
          success: function (response) {
            response = JSON.parse(response.data);
            if (response.success) {
              $this.xiaoMuIconTip = response.message;
            }
          },
        });
      }
    },
    changeSendType(type) {
      this.default_answer_type = type;
      if (type.name === "问客服") {
        this.question = "小姐姐微信";
        this.getAnswer();
      }
      // console.log(type)
      setTimeout(
        function () {
          this.show_typs_select_box = false;
        }.bind(this),
        200
      );
    },
    changeShowQarobotTip() {
      this.$store.commit("changeShowQarobotTip", true);
    },
    destroyDomListener() {
      var doc = document;
      this.items = []; //清空问答内容
      $(doc)
        .off("mousedown.qa")
        .off("mousemove.qa")
        .off("mouseup.qa")
        .off("click.qa");
      $(window).off("keyup.qa");
      $("#report-entrance").remove();
      $("#qarobot-zhishi").hide();
      $("#qarobot-innter").html("");
      $(".close-image-view").off();
      $(".image-view-box").off();
      this._stopVideoListPlay();
      this.unbindRemindItems();
    },
    qaInit() {
      // 小木初始化
      var $this = this;
      var clickX,
        clickY,
        mdClickX,
        mdClickY,
        leftOffset,
        chatBtnLetOffset,
        chatBtnWidth,
        chatBtnTopOffset,
        chatBtnHeight;
      var chatBtnMVLeft;
      var dragging = false,
        labBtnMD = false,
        labBtnTopMD = false,
        chatBtnMD = false,
        firstEnterMD = false;
      var changeImageStyleTimer = null;
      var doc = document;
      var labBtn = $("#robot_label");
      var labBtnTop = $("#robot_label_top");
      var chatContentHeight = 460;
      var pannelWidth = "",
        winWidth,
        winHeight;
      var chatbtnDrayCursor = null,
        catbtnMDTime = 0,
        catbtnMUTime = 0;
      var mdTarget = null;
      $(doc).on({
        "mousedown.qa": function (e) {
          var _target = e.target; //被操作的元素
          mdTarget = _target;
          mdClickX = e.pageX;
          mdClickY = e.pageY;
          if (
            _target.id === "chat-btn" ||
            _target.id === "chat-btn-icon" ||
            _target.id === "first-enter"
          ) {
            //小木图标可拖拽移动位置，并吸附左右边
            if (_target.id === "chat-btn" || _target.id === "chat-btn-icon")
              chatBtnMD = true;
            if (_target.id === "first-enter") firstEnterMD = true;
            catbtnMDTime = new Date().getTime(); //鼠标按下的时刻
            chatBtnLetOffset = $("#chat-btn")[0].getBoundingClientRect().left; //相对视窗距离
            chatBtnTopOffset = $("#chat-btn")[0].getBoundingClientRect().top; //相对视窗距离
            chatBtnWidth = $("#chat-btn").outerWidth();
            chatBtnHeight = $("#chat-btn").outerHeight();

            winWidth =
              window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth;
            winHeight =
              window.innerHeight ||
              document.documentElement.clientHeight ||
              document.body.clientHeight;
          }
          if (_target.id === "robot_label") {
            //左右拖拽提问窗口大小
            labBtnMD = true;
            leftOffset = $("#chatbox").offset().left; //相对小木问答窗口距离
          }
          if (_target.id === "robot_label_top") {
            //上下拖拽提问窗口大小
            labBtnTopMD = true;
            chatContentHeight = $(".chat-content").height(); //中间问答高度
          }
        },
        "mousemove.qa": function (e) {
          var _target = e.target; //被操作的元素
          clickX = e.pageX;
          clickY = e.pageY;
          if (chatBtnMD) {
            //小木icon鼠标mousedown后，开始拖动
            dragging = true;
            $("#chat-btn").addClass("draging");
            $("body").css("-webkit-user-select", "none");
            var _left = clickX - mdClickX + chatBtnLetOffset,
              _top = clickY - mdClickY + chatBtnTopOffset;
            if (_left + chatBtnWidth >= winWidth) {
              _left = winWidth - chatBtnWidth;
            } else {
              _left = _left <= 0 ? 0 : _left;
            }
            if (_top + chatBtnHeight >= winHeight) {
              _top = winHeight - chatBtnHeight;
            } else {
              _top = _top <= 0 ? 0 : _top;
            }
            chatBtnMVLeft = _left;
            $("#chat-btn").css({ left: _left + "px", top: _top + "px" });
            let boxTop = _top - 300;
            let screenHeight = window.innerHeight;
            boxTop < 0 ? (boxTop = 0) : boxTop;

            if (boxTop + 608 > screenHeight) {
              boxTop = screenHeight - 608;
            }
            // console.log(screenHeight,'screenHeight')
            // console.log((boxTop + 608),'(boxTop + 608)')
            // console.log(boxTop,'(boxTop + 608)')
            $("#chatbox").css({ top: boxTop + "px" });
          }
          if (labBtnMD) {
            //问答窗口label鼠标mousedown后，开始左右拖动
            dragging = true;
            $("body").css("-webkit-user-select", "none");
            // 判断第几个拖动按钮
            // 第一个拖动按钮左边不出界
            if (clickX > 400) {
              labBtn.eq(0).css("left", clickX - leftOffset + "px"); // 按钮移动
              labBtn
                .eq(0)
                .prev()
                .width(clickX - leftOffset + "px"); // 窗口移动

              if (changeImageStyleTimer) clearTimeout(changeImageStyleTimer);
              changeImageStyleTimer = setTimeout(function () {
                $this._changeAnswerImageStyle();
                $this.judgeOverflowX($("#ques-remind-bpx li")); // window resize改变:输入提醒超出状态
              }, 0);
            }
          }
          if (labBtnTopMD) {
            //问答窗口label鼠标mousedown后，开始上下拖动
            dragging = true;
            $("body").css("-webkit-user-select", "none");
            if (clickY <= 0) clickY = 0;
            var dragHeight = chatContentHeight - (clickY - mdClickY);
            if (dragHeight < 460) dragHeight = 460;
            $(".chat-content").height(dragHeight);
          }
        },
        "mouseup.qa": function (e) {
          var _target = e.target; //被操作的元素
          e.cancelBubble = true;
          if (
            mdTarget &&
            mdTarget.id == "close-first-enter-icon" &&
            _target.id == "close-first-enter-icon" &&
            !dragging
          ) {
            $("#first-enter").css("display", "none");
            // _target.style.display = 'none'
            // $this.changeShowQarobotTip();
          }
          if (labBtnMD) {
            //问答窗口左右拖动label鼠标抬起
            labBtnMD = false;
            $this._changeAnswerImageStyle();
            $this.judgeOverflowX($("#ques-remind-bpx li")); // window resize改变:输入提醒超出状态
          }
          if (labBtnTopMD) {
            //问答窗口上下拖动label鼠标抬起
            labBtnTopMD = false;
          }
          if (chatBtnMD || firstEnterMD) {
            //小木icon鼠标抬起
            chatBtnMD = false;
            firstEnterMD = false;
            if (chatbtnDrayCursor) clearTimeout(chatbtnDrayCursor);
            $("#chat-btn").removeClass("draging");
            var catbtnMUTime = new Date().getTime(); //鼠标抬起时刻
            if (!dragging) {
              //触发点击事件
              if (catbtnMUTime - catbtnMDTime < 600)
                $this.showChat($this.is_show_box != true);
            } else {
              //吸附左右边
              if (chatBtnMVLeft + chatBtnWidth / 2 <= winWidth / 2) {
                $this.isRight = false;
                $("#chatbox").css(
                  "left",
                  - $("#chatbox").outerWidth()
                );
                $("#chat-btn").animate(
                  {
                    //左边
                    left: 0,
                  },
                  "fast",
                  function () {
                    $("#first-enter").removeClass("adsorb-right");
                  }
                );
              } else {
                $this.isRight = true;
                $("#chatbox").css(
                  "left",
                  winWidth + $("#chatbox").outerWidth()
                );
                $("#chat-btn").animate(
                  {
                    //右边
                    left: winWidth - chatBtnWidth,
                  },
                  "fast",
                  function () {
                    $("#first-enter").addClass("adsorb-right");
                  }
                );
              }
            }
          }
          dragging = false;
          $("body").css("-webkit-user-select", "text");
        },
        "click.qa": function (e) {
          // 视频中的小木提问
          var _target = e.target;
          //$this.windowClickEvent(e);//点击提问窗口外围关闭小木
          if (
            _target.id.indexOf("question_text_wrap") != -1 ||
            _target.id.indexOf("question_text") != -1
          ) {
            if (!$("#question_text").attr("qalink")) {
              var _msg =
                $("#question_text")
                  .attr("question")
                  .replace(/\(.*\)/, "") ||
                $("#question_text")
                  .text()
                  .replace("小木提问：", "")
                  .replace(/\(.*\)/, "");
              var curTime =
                $("#question_text").attr("cur_time") ||
                $(".xt_video_player")[0].currentTime;
              var questionId = $("#question_text").attr("question_id") || "";
              var _obj = {
                msg: _msg,
                video_id: $this.videoId,
                cur_time: curTime,
                question_id: questionId,
                question_source: "active_question",
                usertype: "click",
              }; // 新添加字段
              $this.clickSendMessage(e, _obj);
            }
          }
        },
      });
      //赞、踩点击效果
      $(".praise-btn")
        .off("click")
        .on("click", function () {
          $(this).addClass("selected");
        });
      $(".close")
        .off("click")
        .on("click", function (e) {
          //小木提问主窗口提问close按钮
          e = window.event || e;
          e.stopPropagation();
          e.cancelBubble = true;
          $this.is_show_box = false;
          $this._stopAllAudio(); //暂停所有语音
          pannelWidth = labBtn[0].getBoundingClientRect().left;
          var winWidth =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
          $("#chatbox").animate(
            {
              left: $this.isRight
                ? winWidth + $("#chatbox").outerWidth()
                : -(pannelWidth + 4),
            },
            {
              duration: "slow",
            }
          );
          $this.hideReminBox(); // 隐藏输入提示框
          //$(window).off('click');//弃用
          return false;
        });
      $(window)
        .off("keyup.qa")
        .on("keyup.qa", function (e) {
          //键盘事件
          var keyCode = e.keyCode;
          if (keyCode == 27) {
            //ESC按键关闭输入提醒
            $this.hideReminBox();
          }
        });
      $("#qarobot")
        .off("click")
        .on("click", function (e) {
          //小木内点击
          e = e || window.event;
          var _target = e.target;
          var _targetParent = _target.parentNode;
          var targetTagName = _target.tagName.toLowerCase();
          var targetParentTagName = _targetParent.tagName.toLowerCase();
          if (!$(_target).hasClass("chatBtn")) {
            //target是小木icon禁止事件冒泡，阻止默认行为
            e.stopPropagation();
            e.cancelBubble = true;
          }
          if (targetTagName == "a" || targetParentTagName == "a") {
            //点击超链接
            if (
              (targetTagName == "a" && !_target.getAttribute("href")) ||
              (targetParentTagName == "a" &&
                !_targetParent.getAttribute("href"))
            ) {
              //点击没有连接的<a href=''>xxx</a>, 发问
              e.stopPropagation();
              e.cancelBubble = true;
              var noLinkAnswer =
                targetTagName == "a"
                  ? $(_target).text()
                  : $(_targetParent).text();
              $this.question = noLinkAnswer;
              $this.getAnswer(e); // 立即：发问
              return false;
            }
          }
          if (targetTagName != "a" && !_target.getAttribute("href")) {
            e.stopPropagation();
            e.cancelBubble = true;
          }
          var mouseX = e ? e.pageX : 0;
          var mouseY = e ? e.pageY : 0;
          var remindBox = $("#ques-remind-bpx");
          if (remindBox.hasClass("show")) {
            var remindBoxLeft = remindBox.offset().left;
            var remindBoxRight = remindBoxLeft + remindBox.outerWidth();
            var remindBoxTop = remindBox.offset().top;
            var remindBoxBottom = remindBox.outerHeight();
            if (
              remindBoxLeft > mouseX ||
              remindBoxRight < mouseX ||
              remindBoxTop > mouseY ||
              remindBoxBottom < mouseY
            ) {
              // 小木内点击提示窗之外隐藏
              $this.hideReminBox();
            }
          }
          if (
            targetTagName != "textarea" &&
            targetTagName != "a" &&
            !$(_target).hasClass("chatBtn")
          )
            return false;
        });
      $("textarea.ques")
        .off("compositionstart")
        .on("compositionstart", function (e) {
          $this.compositionstart(e); // 处理中文输入法：开始
        });
      $("textarea.ques")
        .off("compositionend")
        .on("compositionend", function (e) {
          $this.compositionend(e); // 处理中文输入法：结束
        });
    },
    uuid() {
      // 生成uuid
      return "xxxxxyxxxxxyxx4xxxyxxxxxyxxxxxyxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    qa_ajax(params) {
      // 全局ajax封装
      var $this = this;
      // 测试数据
      if ($this.debug) {
        //ai-robot.aminer.cn/
        https: if (params.url == "/api/v1/lms/xiaomu/courses/answer_type")
          params.url = "/resources/mock-data/answer_type.json";
        if (params.url == "/api/v1/u/user/basic_profile/")
          params.url = "/resources/mock-data/basic_profile.json";
        if (params.url.indexOf("/api/v1/lms/learn/course/chapter") != -1)
          params.url = "/resources/mock-data/course_chapter.json";
        if (params.url.indexOf("/api/v1/lms/service/playurl/") != -1)
          params.url = "/resources/mock-data/video.json";
        if (params.url == "/api/v1/lms/xiaomu/courses/get_answer/")
          params.url = "/resources/mock-data/test.json";
        if (params.url == "/api/v1/lms/xiaomu/courses/knowledge_point/")
          params.url = "/resources/mock-data/knowledge.json";
        if (params.url == "/api/v1/lms/xiaomu/courses/input_hint/")
          params.url = "/resources/mock-data/remind.json";
        if (params.url.indexOf("/api/v1/lms/xiaomu/courses/translate") != -1)
          params.url = "/resources/mock-data/test-translate.json";
        if (params.url == "/api/v1/lms/xiaomu/courses/xiaomu_switch/")
          params.url = "/resources/mock-data/xiaomu_switch.json";
        if (params.url == "/api/v1/lms/xiaomu/courses/reminder/word")
          params.url = "/resources/mock-data/reminder_word.json";
        if (params.url == "/api/v1/lms/xiaomu/courses/video_click/record")
          params.url = "/resources/mock-data/video_click_record.json";
        // 积极小木初始化
        if (params.url.indexOf("assistant") != -1 && params.type == "get") {
          // 学习进度状态
          params.url = "/resources/mock-data/studytime.json";
        }
        if (params.url.indexOf("assistant") != -1 && params.type == "post") {
          // 提交学习计划
          params.url = "/resources/mock-data/submitplan.json";
          params.type = "get";
        }
        // 混合教学报告的学生端问卷入口 相关假数据
        if (params.url == "/newcloud/api/mix/survey/entrance/")
          params.url = "/resources/mock-data/report.json";
        params.url = "http://localhost:3300" + params.url;
        // params.url = 'https://www.xuetangx.com' + params.url
      } else {
        params.url = params.url.replace(
          "/api/v1/lms/xiaomu/courses",
          "/journal_robot"
        );
        params.url = "https://ai-robot.aminer.cn" + params.url;
      }
      var videoIdAndCcid = {};
      // if($this.videoId){
      //     videoIdAndCcid["video_id"] = $this.videoId;
      // }
      // if($this.ccid){
      //     videoIdAndCcid["ccid"] = $this.ccid;
      // }
      params.data = Object.assign(
        "data" in params ? params.data : {},
        videoIdAndCcid
      );
      if (params.async === undefined) {
        params.async = true;
      }
      if (params.success && typeof params.success == "function") {
        var _success = params.success;
        params.success = (function (fn) {
          return function (data) {
            fn({
              data: data,
            });
          };
        })(_success);
      }
      var _headers = {};
      // var newCsrftoken = Util.getCookie("csrftoken");
      // if(newCsrftoken){
      //     _headers['Content-Type'] = 'application/json';
      //     _headers['X-CSRFToken'] = newCsrftoken;
      // }else{
      //     _headers['Content-Type'] = 'application/json';
      // }

      // _headers['django-language'] = $this.local_lang; //语言
      // _headers['Accept-Language'] = $this.local_lang; //语言
      // _headers['xtbz'] = platInfo(plat(),'xtbz'); //业务线标识
      // _headers['x-client'] = util.isMobile?'h5':'web'; //业务线标识

      params["headers"] = _headers;
      $.ajax(params);
    },
    // 清华学生定制随堂小木 只在三门课程里加入 与积极小木互斥 不同时用
    qinghuaXiaomu() {
      var $this = this;
      $this.chat_id = $this.uuid(); // 生成当前会话ID
      var s_data = {
        answer_type: $this.default_answer_type.id,
        question: "",
        course_id: $this.course_id,
        flag: "init",
        user_id: $this.user_id,
        chat_id: $this.chat_id,
        url: window.location.href,
        ques_nickname: $this.ques_nickname,
      };

      var order = $this.items.length - 1;
      var loadingId = "qinghuaqa";
      $this.showLoading(order, loadingId);

      $this.qa_ajax({
        url: "/api/v1/lms/xiaomu/courses/get_answer",
        type: "get",
        data: s_data,
        success: function (response) {
          // 返回数据才做操作
          if (response.data.results && response.data.results.length > 0) {
            var answerdata = response.data.results;
            if (answerdata && answerdata.length > 0) {
              $this.is_flag = !!answerdata[0].flag;
              for (var i = 0; i < answerdata.length; i++) {
                answerdata[i]["kp_question"] = s_data.question || "";
                var _data = answerdata[i];
                $this.parseAnswerMessage(_data); // 解析answer.message图片
                if (i == 0) {
                  $this.items.splice(order + 1, 1, _data);
                } else {
                  $this.items.push(_data);
                }
                $this.showChat(false); // false 不使用say_hello
                // this.answers_arr.push(_data.message)
              }
              $this.$nextTick(function () {
                $this._changeAnswerImageStyle();
                $this.loadVideo(); // 加载视频
                $this.loadAudio(); //加载音频
                $this.playVideoAnswer();
                // 对话框滚轮定位
                // $(".chat-content").scrollTop($(".chat-content")[0].scrollHeight)
                setTimeout(function () {
                  $(".chat-content").scrollTop(
                    $(".chat-content")[0].scrollHeight
                  );
                }, 100);
                // 展开、收起
                var showList = $(".details-child");
                for (var i = 0; i < showList.length; i++) {
                  var _item = showList.eq(i);
                  var _itemParent = showList.eq(i).parent();
                  if (
                    _itemParent.hasClass("hide-show") ||
                    _itemParent.hasClass("title-hide-show")
                  ) {
                    $this.qaFolder(showList.eq(i));
                  }
                }
              });
            }
          }
        },
        error: function () {
          $this.items.splice(order + 1, 1); //删除loading
        },
      });
    },
    // 根据学习当前阶段（前中后期）积极小木发动
    promptByStudyTime() {
      var $this = this;

      var order = $this.items.length - 1;
      var loadingId = "studyqa";
      $this.showLoading(order, loadingId);

      this.qa_ajax({
        url: "/api/v1/lms/xiaomu/courses/" + $this.course_id + "/assistant/",
        type: "get",
        data: {},
        success: function (res) {
          res.data =
            typeof res.data == "string" ? JSON.parse(res.data) : res.data;
          var status = res.data.study_status;
          if (status == 0 || status == 1 || status == 2) {
            $this.items.splice(order + 1, 1, res.data);
            $this.showChat(false); // false 不使用say_hello
          }
          $this.$nextTick(function () {
            if (status == 0) {
              // 学习前期
              $this.planInTheBeginning(res);
            } else if (status == 1) {
              // 学习中期
              $this.remindInTheMiddle();
            } else if (status == 2) {
              // 学习后期
              $(".recommend-content span").click(function () {
                $this.jumpRecommend($(this).data("jump-url"));
              });
            }
            setTimeout(function () {
              $(".chat-content").scrollTop($(".chat-content")[0].scrollHeight);
            }, 100);
          });
        },
        error: function () {
          $this.items.splice(order + 1, 1); //删除loading
        },
      });
    },
    // 提交学习计划
    submitPlan() {
      var $this = this;

      var order = $this.items.length - 1;
      var loadingId = "planqa";
      $this.showLoading(order, loadingId);

      this.qa_ajax({
        url: "/api/v1/lms/xiaomu/courses/" + $this.course_id + "/assistant/",
        type: "post",
        data: {
          schedule_days: $("input[name='plan_week']:checked").val(),
          schedule_hours: $("input[name='plan_day']:checked").val(),
        },
        success: function (data) {
          // $('.submit-plan').text(`Committed`).css('background-color', '#ccc').off();
          $(".submit-plan")
            .text(`Committed`)
            .css("background-color", "#ccc")
            .off();
          var platTipData = {
            study_flag: "no_study_remind",
            content: `base.Qarobot.SuccessOrderLearnTip`,
          };
          $this.items.splice(order + 1, 1, platTipData);
          $this.showChat(false); // false 不使用say_hello
        },
        error: function () {
          $this.items.splice(order + 1, 1); //删除loading
        },
      });
    },
    // 刚开始学习（学习前）提醒制定学习计划
    planInTheBeginning(res) {
      var $this = this;
      /*  this.items.push(res.data)
            this.showChat(false);//false 不使用say_hello */
      $(".submit-plan").click(function () {
        $this.submitPlan();
      });
    },
    // 学习中 根据学习计划（已制定计划） 提醒进度追赶 ，加油鼓励
    remindInTheMiddle(res) {
      var $this = this;
      this.fiveTimeout = setTimeout(function () {
        var content = Util.randomFromArr($this.encourageArr);
        $this.items.push({
          study_flag: "no_study_remind",
          content: content,
        });
        $this.showChat(false); // false 不使用say_hello
      }, 300000); // 5分钟是300000ms
      this.fourtyTimeout = setTimeout(function () {
        var content = Util.randomFromArr($this.encourageArr);
        $this.items.push({
          study_flag: "no_study_remind",
          content: content,
        });
        $this.showChat(false); // false 不使用say_hello
      }, 2400000); // 40分钟是2400000ms
    },
    // 学习后期（学习后）一些课程推荐
    jumpRecommend(url) {
      var $this = this;
      // 点击推荐课程后后期不再推荐
      var newWin = window.open("", "_blank");
      this.qa_ajax({
        url:
          "/api/v1/lms/xiaomu/courses/" +
          $this.course_id +
          "/assistant/feedback/",
        type: "post",
        success: function () {
          newWin.location.href = url;
        },
      });
    },
    windowClickEvent: function (e) {
      //点击其他区域关闭小木
      var $this = this;
      var e = e || window.event;
      var keyCode = e.keyCode || e.which || e.charCode;
      var _target = e.target || e.srcElement;
      var mouseX = e.pageX;
      var mouseY = e.pageY;
      var labBtn = $("#chatbox").find("#robot_label");
      var qaOffsetLeft = labBtn[0].getBoundingClientRect().left;
      if (
        qaOffsetLeft > 0 &&
        mouseX > qaOffsetLeft &&
        !$(_target).hasClass("point") &&
        !(!!_target.id || _target.id == "question_text")
      ) {
        $(".close").trigger("click");
      }
    },
    resizeImageView() {
      // window resize改变image view 弹层
      var $this = this;
      var img = $(".image-view-box").find(".show-img");
      var w = +img.attr("source-width"),
        h = +img.attr("source-height");
      var winW = $(window).width(),
        _w = w,
        _h = h;
      if (w >= winW) {
        _w = winW * 0.9;
        _h = (_w * h) / w;
      }
      // img.css({
      //     'width': _w + 'px',
      //     'margin-left': (-1 * _w * 0.5) + 'px',
      //     'margin-top': (-1 * _h * 0.5) + 'px'
      // })
      img.animate(
        {
          top: "50%",
          left: "50%",
          width: _w + "px",
          opacity: "1",
          "margin-left": -1 * _w * 0.5 + "px",
          "margin-top": -1 * _h * 0.5 + "px",
        },
        100,
        "swing"
      );
    },
    _resizeVideoView() {
      // window resize改变video view 弹层
      var $this = this;
      var videoBox = $(".image-view-box").find(".video-box");
      var w = +videoBox.attr("source-width"),
        h = +videoBox.attr("source-height");
      var winW = $(window).width(),
        _w = w,
        _h = h;
      // if(w >= winW){
      //     _w = winW * 0.9
      //     _h = _w * h / w
      // }
      videoBox.css({
        width: _w + "px",
        height: _h + "px",
        "margin-left": -1 * _w * 0.5 + "px",
        "margin-top": -1 * _h * 0.5 + "px",
      });
    },
    _windowResize() {
      // window resize触发回调
      var $this = this;
      if ($(".image-view-box").hasClass("show-view")) {
        this.resizeImageView();
        this._resizeVideoView();
      }
    },
    _showImageViewBox(url) {
      // 显示图片全屏预览
      var $this = this;
      var imageViewBox = $(".image-view-box");
      if (imageViewBox.length <= 0) {
        imageViewBox = $(
          '<div class="image-view-box"><div class="loading"><div></div><div></div><div></div><div></div><div></div></div><span class="close-image-view"></span></div>'
        ).appendTo("body");
      }
      $(".image-view-box").find(".loading").fadeIn("fast");
      imageViewBox.find(".show-img").remove();
      imageViewBox.find(".video-box").remove();
      $(".close-image-view")
        .off()
        .on("click", function (e) {
          $this.closeImageViewBox(e, "img");
        });
      imageViewBox.off().on("click", function (e) {
        // 点击遮罩关闭图片预览窗口
        e = window.event || e;
        e.stopPropagation();
        e.cancelBubble = true;
        var target = e.target || e.srcElement;
        var currentTarget = e.currentTarget;
        if (
          target.classList.value.indexOf("image-view-box") != -1 &&
          currentTarget.classList.value.indexOf("image-view-box") != -1
        )
          $this.closeImageViewBox(e, "img");
        return false;
      });
      var image = new Image();
      image.src = url;
      if (image.complete) {
        var w = image.width,
          h = image.height;
        imageViewBox.append(
          '<img class="show-img" src="' +
            url +
            '" source-width="' +
            w +
            '" source-height="' +
            h +
            '" style="position:absolute;top:' +
            $this.posObj["top"] +
            "px;left:" +
            $this.posObj["left"] +
            "px;width:" +
            $this.posObj["width"] +
            'px;height:auto;opacity:0.8;" />'
        );
        $this.resizeImageView();
        $(".image-view-box").find(".loading").fadeOut("fast");
        image = null;
      } else {
        image.onload = function () {
          var w = image.width,
            h = image.height;
          imageViewBox.append(
            '<img class="show-img" src="' +
              url +
              '" source-width="' +
              w +
              '" source-height="' +
              h +
              '" style="position:absolute;top:' +
              $this.posObj["top"] +
              "px;left:" +
              $this.posObj["left"] +
              "px;width:" +
              $this.posObj["width"] +
              'px;height:auto;opacity:0.8;" />'
          );
          $this.resizeImageView();
          $(".image-view-box").find(".loading").fadeOut("fast");
          image = null;
        };
      }
      imageViewBox.fadeIn("fast").addClass("show-view");
    },
    closeImageViewBox(e, type) {
      // 关闭--image view 弹层
      var $this = this;
      e = e || window.event;
      if (type == "img") {
        //注意：IE、Firefox3+、Opera9.5、Chrome、Safari支持，在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，我们需要做个兼容。
        var clientRect = $($this.posObj["target"])[0].getBoundingClientRect();
        var docTop = document.documentElement.clientTop; // 非IE为0，IE为2
        var docLeft = document.documentElement.clientLeft; // 非IE为0，IE为2
        $this.posObj["top"] = clientRect.top - docTop;
        $this.posObj["left"] = clientRect.left - docLeft;
        $this.posObj["width"] = $($this.posObj["target"]).width();
        $this.posObj["height"] = $($this.posObj["target"]).height();

        $(".image-view-box")
          .find(".show-img")
          .animate(
            {
              top: $this.posObj["top"] + "px",
              left: $this.posObj["left"] + "px",
              width: $this.posObj["width"] + "px",
              margin: "0",
              opacity: "0.8",
            },
            100,
            "linear",
            function () {
              $(".image-view-box").fadeOut("fast").removeClass("show-view");
            }
          );
      } else {
        $(".image-view-box").fadeOut("fast").removeClass("show-view");
      }
      $this._stopVideoListPlay(); // 停止所有的播放

      e.stopPropagation();
      e.cancelBubble = true;

      return false;
    },
    _stopVideoListPlay: function () {
      var $this = this;
      $this._stopAllAudio();
      $(".xt_video_player").each(function (i, ele) {
        ele.pause();
      });
      if ($this.videoList.length > 0) {
        // stop并删除：多余的video
        for (var i = 0; i < $this.videoList.length; i++) {
          var _video = $this.videoList[i];
          _video["dom"].trigger("pause");
          _video["dom"].trigger("destroy"); //清除hls播放
        }
        $this.videoList.length = 0;
      }
    },
    showVideoViewBox(_d) {
      // 显示视频全屏播放弹窗
      var $this = this;
      var videoViewBox = $(".image-view-box");
      if (videoViewBox.length <= 0) {
        videoViewBox = $(
          '<div class="image-view-box"><div class="loading"><div></div><div></div><div></div><div></div><div></div></div><span class="close-image-view"></span></div>'
        ).appendTo("body");
      }
      $(".image-view-box").find(".loading").fadeIn("fast");
      videoViewBox.find(".show-img").remove();
      videoViewBox.find(".video-box").remove();
      $this._stopVideoListPlay(); // 停止所有的播放
      $(".close-image-view")
        .off()
        .on("click", function (e) {
          $this.closeImageViewBox(e, "video");
        });
      videoViewBox.off().on("click", function (e) {
        // 点击遮罩关闭图片预览窗口
        var target = e.target;
        var currentTarget = e.currentTarget;
        if (
          target.classList.value.indexOf("image-view-box") != -1 &&
          currentTarget.classList.value.indexOf("image-view-box") != -1
        )
          $this.closeImageViewBox(e, "video");
      });
      $this.qa_ajax({
        url:
          "/api/v1/lms/service/playurl/" + _d.video_ccsourse + "/?appid=10000",
        type: "get",
        data: {},
        success: function (response) {
          var videoData = response.data.data;
          $(".image-view-box").find(".loading").fadeOut("fast");
          var w = 868,
            h = 426;
          _d.vertical_name = !!_d.sequential_name
            ? _d.vertical_name + " - " + _d.sequential_name
            : _d.vertical_name;
          videoViewBox.append(
            '<div class="video-box" source-width="' +
              w +
              '" source-height="' +
              h +
              '" style="position:absolute;top:50%;left:50%;height:auto;">' +
              '<div class="video-play-box" style="width:618px;">' +
              '<div class="qa-video-chap-title-source">' +
              '<span class="qa-video-chap-title">' +
              _d.vertical_name +
              "</span>" +
              '<span class="qa-video-chap-source">' +
              `base.Qarobot.VideoDialogTip1` +
              _d.chapter_name +
              "</span>" +
              "</div>" +
              '<div class="qarobot-video-wrap" id="qarobot-video-wrap" style="height:326px;"></div>' +
              "</div>" +
              '<div class="video-info-box" style="width:250px;height:' +
              h +
              'px">' +
              '<div class="info-title">' +
              _d.course_title +
              "</div>" +
              //+ '<img class="info-poster" src="' + _d.course_img + '" />'
              //+ '<span class="org_name">' + `base.Qarobot.VideoDialogTip2` + _d.org_name + '</span>'
              //+ '<span class="total_enrollment_number">' + `base.Qarobot.VideoDialogTip3` + _d.total_enrollment_number + '</span>'
              '<span class="desc">' +
              `base.Qarobot.VideoDialogTip4` +
              _d.course_desc +
              "</span>" +
              //+ '<a href="' + _d.course_url + '" class="goto-about" target="_blank">'+`base.Qarobot.VideoDialogTip5`+'</a>'
              "</div>" +
              "</div>"
          );
          $this._resizeVideoView();
          var quality20 =
            videoData.sources.quality20[0] || videoData.sources.quality10[0];
          var quality10 = videoData.sources.quality10[0];

          var player = new XtPlayer($("#qarobot-video-wrap"), {
            id: _d.video_ccsourse,
            sku_id: "",
            classroom_id: "",
            cid: _d.course_id,
            cc: "",
            userId: "",
            isDrag: true,
            isAbleOcclusion: false,
            lob: "plat2",
            isHeart: false,
            heartSrc: "",
            autoplay: true,
            server: "vod",
            serverType: "video",
            language: $this.local_lang, //语言
            hiddenQuestion: true,
            hiddenKnowledgePoint: true,
            duration: 0,
            volume: {
              value: 0.8,
            },
            speed: {
              show: true,
              value: 1.0,
              speedValue: [2.5, 2.0, 1.5, 1.0, 0.5],
            },
            isShowControls: true, //【必须】是否显示控制栏
            isShowProgress: true, //【必须】是否显示进度条
            urls: {
              //视频地址列表: vodUrls、liveUrls、cdnUrls
              vodUrls: {
                url_default: "url_480P",
                url_270P: quality10,
                url_480P: quality20,
              },
              liveUrls: {
                url_default: "url_480P",
                url_270P: "",
                url_480P: "",
              },
              cdnUrls: [],
            },
            caption: {
              //字幕配置
              show: false,
            },
            position: 0,
            startTime: _d.video_time,
            endTime: 0,
            debug: false,
          });
          $this.videoList.push({
            type: "full",
            dom: player,
          });
        },
      });
      videoViewBox.fadeIn("fast").addClass("show-view");
    },
    generateItem(_uid, _message, qid, isTranslate, _head, source) {
      // 组装-问、答数据结构
      var item = {};
      item.uid = _uid;
      item.head = _head || "";
      item.message = _message;
      item.qid = qid || "";
      if (isTranslate) {
        item.isTranslate = true;
      }
      item.source = source || "";
      return item;
    },
    generateLoadingItem(_uid, rid) {
      // 组装-问、答数据结构
      var item = {};
      item.uid = _uid;
      item.rid = rid || "";
      return item;
    },
    showLoading: function (order, rid) {
      var $this = this;
      var item_loading = $this.generateLoadingItem(-1, rid);
      $this.items.splice(order + 1, 0, item_loading);
      $this.$nextTick(function () {
        $this._changeAnswerImageStyle();
        $this.loadVideo(); //加载视频
        $this.loadAudio(); //加载音频
        $this.playVideoAnswer();
        // 对话框滚轮定位
        var loadingDOM = $("#rid_" + rid).parent();
        if (loadingDOM) {
          var firstAnswerTop = $(".chat-item:first").offset().top;
          var loadingTop = loadingDOM.offset().top;
          $(".chat-content")
            .animate(
              {
                scrollTop: loadingTop - firstAnswerTop,
              },
              {
                duration: "fast",
                easing: "swing",
                queue: "qanew",
                complete: function () {},
                done: function () {},
                fail: function () {},
                always: function () {},
              }
            )
            .dequeue("qanew");
        }

        // 展开、收起
        var showList = $(".details-child");
        for (var i = 0; i < showList.length; i++) {
          var _item = showList.eq(i);
          var _itemParent = showList.eq(i).parent();
          if (
            _itemParent.hasClass("hide-show") ||
            _itemParent.hasClass("title-hide-show")
          ) {
            $this.qaFolder(_item);
          }
        }
      });
    },
    textAreaBlur: function (e) {
      // textarea失去焦点触发--未使用
      var $this = this;
      $this.isBlur = true;
      //$this.hideReminBox()//（与输入提醒有冲突）
    },
    textAreaFocus: function (e) {
      // textarea获取焦点触发
      this.isBlur = false;
    },
    compositionstart: function (e) {
      // 处理中文输入法：开始
      this.iszhinput = true;
      this.iszhinputEnd = false;
    },
    compositionend: function (e) {
      // 处理中文输入法：结束
      this.iszhinput = false;
      this.iszhinputEnd = true;
      if (this.tem_remind) {
        // 中文输入中，mouseover提醒项，发问
        //this.iszhinputEnd = false;
        //this.question = this.tem_remind;
        this.tem_remind = null;
        //this.getAnswer(e); // 立即：发问
      }
      this.trimQuestion(e);
    },
    showTipRemindBox: function (msg, e) {
      // 显示mouseover，提示
      var $this = this;
      if ($("#tip-remind-box").length <= 0)
        $("body").append(
          '<div id="tip-remind-box" class="tip-remind-box"></div>'
        );
      var clientX = e.clientX + 10,
        clientY = e.clientY - 30;
      $("#tip-remind-box").css({
        left: clientX + "px",
        top: clientY + "px",
      });
      if ($("#tip-remind-box").html() != msg) {
        $("#tip-remind-box").html(msg);
      }
      if (!$("#tip-remind-box").hasClass("show")) {
        $("#tip-remind-box").addClass("show");
      }
      clientY = e.clientY - $("#tip-remind-box").outerHeight();
      $("#tip-remind-box").css({
        top: clientY + "px",
      });
    },
    hideTipRemindBox: function () {
      // 隐藏mouseover，提示
      $("#tip-remind-box").removeClass("show");
    },
    bindRemindItems: function () {
      // 给输入提醒列表绑定鼠标事件
      var $this = this;
      $(".remind-items li")
        .off("mouseover")
        .on("mouseover", function (e) {
          $(".remind-items li.current").removeClass("current");
          $(this).addClass("current");
          if ($this.iszhinput) {
            // 中文输入中，获取hover选中的提示文本
            $this.tem_remind = $(this).attr("txt") || $(this).text();
          }
        });
      $("#ques-remind-bpx")
        .off("mousemove")
        .on("mousemove", function (e) {
          var target = e.target,
            msg = null;
          if ($(target).hasClass("remind-item")) {
            msg = $(target).text();
          }
          if ($(target).hasClass("remind-hightlight")) {
            target = target.parentNode;
            msg = $(target).text();
          }
          if (
            msg &&
            ($(target).attr("overflow-x") || $(target).attr("content"))
          ) {
            if ($(target).attr("content")) msg = $(target).attr("content");
            $this.showTipRemindBox(msg, e); // 显示mouseover，提示
          }
        });
      $("#ques-remind-bpx")
        .off("mouseout")
        .on("mouseout", function (e) {
          // 鼠标移除提醒框，移除所选
          $(".remind-items li").removeClass("current");
          if ($this.iszhinput) {
            // 中文输入中，退出提示区域
            $this.tem_remind = null;
          }
          $this.hideTipRemindBox();
        });
      $(".remind-items li")
        .off("click")
        .on("click", function (e) {
          var msg = $(this).attr("txt");
          $this.question = msg;
          $this.tag = $(this).attr("tag"); //选择的输入提醒选项，tag=2
          $this.getAnswer(e); // 立即：发问
        });
    },
    bindRemindItemsMousemove: function () {
      // 给输入提醒窗口绑定mousemove事件，触发后立即解绑该事件，并立即绑定其他DOM事件
      var $this = this;
      $(".remind-items li")
        .off("mousemove")
        .on("mousemove", function (e) {
          $this.bindRemindItems();
          $(".remind-items li").off("mousemove");
          $(this).trigger("mouseover");
        });
    },
    unbindRemindItems: function () {
      // 解绑输入提醒窗口的DOM事件
      var $this = this;
      $(".remind-items li").off("mousemove");
      $(".remind-items li").off("click");
      $(".remind-items li").off("mouseover");
      $("#ques-remind-bpx").off("mousemove");
      $("#ques-remind-bpx").off("mouseout");
    },
    nextRemindTimeIndex: function (keyCode) {
      // 键盘up、down上下建获取下一项提示索引
      var $this = this;
      $this.hideTipRemindBox();
      if (!this.iszhinput) {
        // 如果是中文输入，就不会触发up，down上下选择行为
        var _index = 0;
        var _len = $(".remind-items li").length,
          currentItem = $(".remind-items li.current");
        if (currentItem.length > 0) {
          _index = $(".remind-items li").index(currentItem);
          $(".remind-items li").removeClass("current");
          if (keyCode == 38) _index <= 0 ? (_index = _len - 1) : (_index -= 1);
          if (keyCode == 40) _index >= _len - 1 ? (_index = 0) : (_index += 1);
          if ((_index + 1) / _len > 1) {
            var _top =
              $(".remind-items li").outerHeight() * (_index - (_len - 1));
            $("#ques-remind-bpx").scrollTop(_top);
          } else $("#ques-remind-bpx").scrollTop(0);
        }
        $(".remind-items li:eq(" + _index + ")").addClass("current");
        return _index;
      }
    },
    showRemindBox: function (data) {
      // 解析提醒数据，并显示提醒窗口
      var $this = this;
      var len = data.length;
      if (len > 0) {
        var _list = '<ul class="remind-items">';
        var reg = new RegExp($this.question, "g");
        var zhReg = new RegExp($this.inputData, "g");
        for (var i = 0; i < len; i++) {
          var isCurrent = "";
          if (data[i].content) {
            if (
              (!!$this.question && data[i].text == $this.question) ||
              (!!$this.inputData && data[i].text == $this.inputData)
            ) {
              //用户的输入能完全匹配上输入提醒中一项数据，设置成选中状态
              isCurrent = "current";
              $this.tag = data[i].tag;
            }
            var _item = !!$this.question
              ? data[i].text.replace(
                  reg,
                  '<font class="remind-hightlight">' +
                    $this.question +
                    "</font>"
                )
              : data[i].text;
            _item +=
              "@" +
              data[i].content.replace(
                reg,
                '<font class="remind-hightlight">' + $this.question + "</font>"
              );
            var tag =
              data[i].tag || data[i].tag == 0
                ? 'tag="' + data[i].tag + '"'
                : "";
            _list +=
              '<li class="remind-item ' +
              isCurrent +
              '" ' +
              tag +
              ' content="' +
              data[i].content +
              '" txt="' +
              data[i].text +
              '">' +
              _item +
              "</li>";
          } else {
            if (
              (!!$this.question && data[i].text == $this.question) ||
              (!!$this.inputData && data[i].text == $this.inputData)
            ) {
              isCurrent = "current";
              $this.tag = data[i].tag;
            }
            var tag =
              data[i].tag || data[i].tag == 0
                ? 'tag="' + data[i].tag + '"'
                : "";
            var _item = !!$this.question
              ? data[i].text.replace(
                  reg,
                  '<font class="remind-hightlight">' +
                    $this.question +
                    "</font>"
                )
              : data[i].text;
            _list +=
              '<li class="remind-item ' +
              isCurrent +
              '" ' +
              tag +
              ' txt="' +
              data[i].text +
              '">' +
              _item +
              "</li>";
          }
        }
        _list += "</ul>";
        if ($("#ques-remind-bpx").length > 0) {
          $("#ques-remind-bpx").html(_list);
        } else {
          $("#chat-ques").append(
            '<div class="ques-remind-bpx" id="ques-remind-bpx">' +
              _list +
              "</div>"
          );
        }
        $("#ques-remind-bpx")
          .scrollTop(0)
          .css({
            top: -($(".remind-items li").outerHeight() * len + 12) + "px",
          })
          .addClass("show");
        $this.judgeOverflowX($("#ques-remind-bpx li"));
      }
    },
    judgeOverflowX: function (domList) {
      // window resize改变:输入提醒超出状态
      $(domList).each(function (i) {
        var _that = this;
        if (
          _that.offsetWidth > _that.clientWidth ||
          _that.scrollWidth > _that.offsetWidth
        ) {
          $(_that).attr("overflow-x", "yes");
        } else {
          $(_that).removeAttr("overflow-x");
        }
      });
    },
    hideReminBox: function () {
      // 隐藏：输入提醒窗口
      var $this = this;
      $("#ques-remind-bpx").removeClass("show");
      $this.hideTipRemindBox();
    },
    inputEvent: function (e) {
      this.inputData = e.data; // input事件中输入数据，e.data可以获取中文输入过程中的字母
    },
    sendBtnAnswer: function (e) {
      //发送按钮
      if (this.isFocusSendBtn) {
        this.getAnswer(e);
      }
      this.isFocusSendBtnFu();
      e.stopPropagation();
      e.cancelBubble = true;
      return false;
    },
    selectTypeMouseover(e) {
      e.stopPropagation();
      e.cancelBubble = true;
      this.show_typs_select_box = true;
      return false;
    },
    selectTypeMouseout(e) {
      e.stopPropagation();
      e.cancelBubble = true;
      this.show_typs_select_box = false;
      return false;
    },
    isFocusSendBtnFu: function () {
      //是否激活发送按钮
      if (!!this.question || !!this.inputData) {
        this.isFocusSendBtn = true;
      } else {
        this.isFocusSendBtn = false;
      }
    },
    trimQuestion: function (e) {
      // 用户输入问题过程中取出开头和结尾空格，并给出相关提醒
      var $this = this;
      var keyCode = e.keyCode;
      // $this.unbindRemindItems(); // 解绑输入提醒窗口的DOM事件--去掉！
      if (keyCode == 32) {
        //空格键
        this.question = this.question.replace(/^\s*/g, ""); // 空格键去除
        this.inputData = this.inputData
          ? this.inputData.replace(/^\s*/g, "")
          : ""; // 空格键去除
      }
      if ($this.iszhinputEnd) {
        $this.iszhinputEnd = false;
      }
      if (keyCode != 13) $this.tag = ""; //回车enter按键

      this.isFocusSendBtnFu();

      if (
        !$this.isBlur &&
        keyCode != 38 &&
        keyCode != 40 &&
        keyCode != 27 &&
        (!!this.question || !!this.inputData)
      ) {
        var s_data = {
          question: $this.question || this.inputData,
          course_id: $this.course_id,
          user_id: $this.user_id,
          chat_id: $this.chat_id,
          ques_nickname: $this.ques_nickname,
        };
        if ($this.getRemindHandler) clearTimeout($this.getRemindHandler);
        (function (_data) {
          $this.getRemindHandler = setTimeout(
            function () {
              $this.qa_ajax({
                // url: '/api/v1/lms/xiaomu/courses/input_hint/',
                url: "/journal_robot/input_hint",
                type: "get",
                data: _data,
                success: function (response) {
                  var res = JSON.parse(response.data);
                  if (res.success) {
                    if (
                      $this.question == _data.question ||
                      $this.inputData == _data.question
                    ) {
                      //if($this.inputData){
                      $this.showRemindBox(res.data); // 解析提醒数据并显示提示窗口
                      $this.bindRemindItems(); // 给输入提醒列表绑定鼠标事件
                      //}
                    } else {
                      $this.hideReminBox();
                    }
                  }
                },
              });
            }.bind($this),
            300
          );
        })(s_data);
      } else if (
        (keyCode == 38 || keyCode == 40) &&
        $("#ques-remind-bpx").hasClass("show")
      ) {
        e.preventDefault();
        var _index = $this.nextRemindTimeIndex(keyCode); // 键盘up、down上下建获取下一项提示索引
        if (_index != undefined) {
          $this.question = $(".remind-items li:eq(" + _index + ")").attr("txt");
          $this.tag = $(".remind-items li:eq(" + _index + ")").attr("tag");
        }
        $this.bindRemindItemsMousemove(); // 给输入提醒窗口绑定mousemove事件
      } else {
        $this.hideReminBox();
      }
    },
    encodeHTNML: function (str) {
      if (str.length == 0) return str;
      str = str.replace(/</g, "&lt;");
      str = str.replace(/>/g, "&gt;");
      str = str.replace(/\{/g, "");
      str = str.replace(/\}/g, "");
      str = str.replace(/\n/g, "");
      str = str.replace(/\r/g, "");
      str = str.replace(/\f/g, "");
      str = str.replace(/\t/g, "");
      str = str.replace(/\v/g, "");
      return str;
    },
    getAnswer: function (e, _obj) {
      // 用户提问
      //  取消回车换行默认行为
      e = e || window.event;
      //直接触发提问
      e.preventDefault();
      var $this = this;
      var _arg = arguments;
      $this.hideReminBox(); // 隐藏输入提醒窗口
      var _ques = $this.encodeHTNML(this.question); // 转义用户输入的HTML
      if ($this.iszhinputEnd) {
        // 如果是中文输入刚刚结束，就阻断发问
        $this.iszhinputEnd = false;
        return false;
      }
      if ($.trim(_ques) != null && $.trim(_ques) != "") {
        this.temp_question = $.trim(_ques);
        this.question = $.trim(_ques);
        $this.sendMessage(null, _obj); // 发问
        // 清空数据
        $this.inputData = "";
        $this.question = "";
      } else {
        this.question = $.trim(this.question);
      }
    },
    getAnswerAuto: function (e, ques, _flag, _data) {
      // flag-建议性问答
      var $this = this;
      var _ques = $this.encodeHTNML(ques); // 转义用户输入的HTML
      this.question = _ques;
      this.temp_question = this.question;
      $this.sendMessage(_flag, _data);
      this.question = "";
    },
    knowledgeGetAnswer: function (e, _obj) {
      var $this = this;
      $this.question = _obj.msg;
      delete _obj.msg;
      $this.getAnswer(e, _obj);
    },
    selectedPraise(e, rid, _type) {
      // 有用、无用-反馈, @click
      var $this = this;
      var $currentTarget = $(e.currentTarget);
      var $parent = $currentTarget.parent();
      if (!$parent.hasClass("is-selected")) {
        $parent.addClass("is-selected");
        $parent.find(".praise-btn").removeClass("selected");
        $currentTarget.addClass("selected");
        $this.qa_ajax({
          url: "/api/v1/lms/xiaomu/courses/feedback",
          type: "get",
          data: {
            rid: rid,
            feedback: _type,
          },
          success: function (response) {
            var feedbackAnswer = response.data;
          },
        });
      }
    },
    translatePraise(e, rid, order) {
      //翻译 @click
      var $this = this;
      $this.fetchTranslate(rid, order);
    },
    clickSendMessage: function (e, _obj) {
      // 视频拓扑图知识点click发问、视频上方小木提问click发问
      var $this = this;
      e = e || window.event;
      var _target = e.target || e.srcElement;
      _target = _target + _obj.msg;
      var _time = $this.is_show_box == true ? 200 : 500; //问答窗口是否开启
      if ($this.is_show_box != true) {
        $this.showChat(true, null, () => {
          if ($this.current_point === _target) {
            return false;
            // if($this.knowledgeAnswerHandler) clearTimeout($this.knowledgeAnswerHandler)
          }
          $this.current_point = _target;
          if ($this.knowledgeAnswerHandler)
            clearTimeout($this.knowledgeAnswerHandler);
          if (_obj.msg) $this.knowledgeGetAnswer(e, _obj);
        }); // 传入false不使用sayhello
      } else {
        if ($this.current_point === _target) {
          return false;
          // if($this.knowledgeAnswerHandler) clearTimeout($this.knowledgeAnswerHandler)
        }
        $this.current_point = _target;
        $this.knowledgeAnswerHandler = setTimeout(
          function () {
            if ($this.knowledgeAnswerHandler)
              clearTimeout($this.knowledgeAnswerHandler);
            $this.knowledgeAnswerHandler = null;
            if (_obj.msg) $this.knowledgeGetAnswer(e, _obj);
          }.bind(this),
          _time
        );
      }
    },
    fetchTranslate(rid, order) {
      //请求翻译问答数据
      var $this = this;
      var translateDOM = $(".chat-item.istranslate_" + rid);
      if (translateDOM.length > 0) {
        var firstAnswerTop = $(".chat-item:first").offset().top;
        var translateAnswerTop = translateDOM.offset().top;
        $(".chat-content")
          .animate(
            {
              scrollTop: translateAnswerTop - firstAnswerTop - 49,
            },
            {
              duration: "fast",
              easing: "swing",
              queue: "qatip",
              complete: function () {},
              done: function () {},
              fail: function () {},
              always: function () {
                translateDOM.find(".item-content").addClass("tip-shadow");
                (function (translateDOM) {
                  setTimeout(() => {
                    translateDOM
                      .find(".item-content")
                      .removeClass("tip-shadow");
                  }, 2000);
                })(translateDOM);
              },
            }
          )
          .dequeue("qatip");
        return;
      }
      var s_data = {
        course_id: $this.course_id,
        user_id: $this.user_id,
        chat_id: $this.chat_id,
        url: window.location.href,
        rid: rid,
      };
      var currentLoading = $("#rid_" + rid);
      if (currentLoading.length > 0) {
        // 对话框滚轮定位
        var loadingDOM = currentLoading.parent();
        var firstAnswerTop = $(".chat-item:first").offset().top;
        var loadingTop = loadingDOM.offset().top;
        $(".chat-content")
          .animate(
            {
              scrollTop: loadingTop - firstAnswerTop,
            },
            {
              duration: "fast",
              easing: "swing",
              queue: "qaloading",
              complete: function () {},
              done: function () {},
              fail: function () {},
              always: function () {},
            }
          )
          .dequeue("qaloading");
        return;
      }

      $this.showLoading(order, rid);

      $this.qa_ajax({
        url: "/api/v1/lms/xiaomu/courses/translate",
        type: "get",
        data: s_data,
        success: function (response) {
          var translateAnswer = JSON.parse(response.data);
          // (function(translateAnswer){
          //     setTimeout(()=>{

          var isQid = false;
          var item_right = null;
          //question
          if (
            "question_translate" in translateAnswer &&
            !!translateAnswer.question_translate &&
            translateAnswer.question_translate !== "None"
          ) {
            isQid = true;
            item_right = $this.generateItem(
              1,
              translateAnswer.question_translate,
              translateAnswer.qid,
              true
            );
            $this.items.splice(order + 1, 1, item_right); //在被翻译的后面插入翻译问题、答案
            delete translateAnswer.question_translate;
          } else {
            $this.items.splice(order + 1, 1); //删除loading
          }
          translateAnswer["kp_question"] = s_data.question || "";
          translateAnswer.isTranslate = true;
          translateAnswer.rid = rid;
          if (
            translateAnswer.flag == "poem" &&
            "questions" in translateAnswer
          ) {
            //translateAnswer.questions = ['Another one'];
            delete translateAnswer.questions;
          }
          $this.parseAnswerMessage(translateAnswer); // 解析answer.message图片
          $this.items.splice(isQid ? order + 2 : order + 1, 0, translateAnswer);

          $this.$nextTick(function () {
            $this._changeAnswerImageStyle();
            $this.loadVideo(); // 加载视频
            $this.loadAudio(); //加载音频
            $this.playVideoAnswer();
            // 对话框滚轮定位
            translateDOM = $(".chat-item.istranslate_" + rid);
            if (translateDOM.length > 0) {
              var firstAnswerTop = $(".chat-item:first").offset().top;
              var translateAnswerTop = translateDOM.offset().top;
              //$('.chat-content').scrollTop($('.chat-content')[0].scrollHeight);
              $(".chat-content")
                .animate(
                  {
                    scrollTop: translateAnswerTop - firstAnswerTop - 49,
                  },
                  {
                    duration: "fast",
                    easing: "swing",
                    queue: "qa",
                    complete: function () {},
                    done: function () {},
                    fail: function () {},
                    always: function () {},
                  }
                )
                .dequeue("qa");
            }

            // 展开、收起
            var showList = $(".details-child");
            for (var i = 0; i < showList.length; i++) {
              var _item = showList.eq(i);
              var _itemParent = showList.eq(i).parent();
              if (
                _itemParent.hasClass("hide-show") ||
                _itemParent.hasClass("title-hide-show")
              ) {
                $this.qaFolder(_item);
              }
            }
          });

          //     }, 3000);
          // })(translateAnswer);
        },
        error: function () {
          $this.items.splice(order + 1, 1); //删除loading
        },
      });
    },
    sendMessage(_flag, _data) {
      // 发送问题，取答案
      var $this = this;
      if (_flag == "poem") {
        $this.questions_arr.push(`base.Qarobot.OneMoreFirst`);
      } else {
        $this.questions_arr.push($this.question);
      }
      //作诗==Poetize、再来一首==One more first
      var s_data = {
        answer_type: $this.default_answer_type.id,
        question: $this.question,
        course_id: $this.course_id,
        user_id: $this.user_id,
        // 'chat_id': $this.chat_id,
        // course_id: "course-v1:TsinghuaX+30240184_2X+sp",
        // user_id: "15028531",
        chat_id: "37f8eabf53ea554eee89fefab2f5088acfdf",
        // flag: "say_hello",
        // 'url': window.location.href,
        ques_nickname: $this.ques_nickname,
      };
      if (_flag && _flag != "poem") s_data.flag = _flag;
      if ($this.tag != "") s_data.tag = $this.tag;
      $this.tag = ""; // 使用完tag后，清空
      if (_data) {
        if (_data.usertype == "click") {
          delete _data.usertype;
          s_data = Util.extend(s_data, _data || {});
        } else {
          s_data.data = JSON.stringify(_data);
        }
      }
      // question
      var item_right = $this.generateItem(1, $this.temp_question, "");
      $this.items.push(item_right);

      var order = $this.items.length - 1;
      var loadingId = "sendqa";
      $this.showLoading(order, loadingId);

      $this.$nextTick(function () {
        // 对话框滚轮定位
        $(".chat-content").scrollTop($(".chat-content")[0].scrollHeight);
        // 展开、收起
        var showList = $(".details-child");
        for (var i = 0; i < showList.length; i++) {
          var _item = showList.eq(i);
          var _itemParent = showList.eq(i).parent();
          if (
            _itemParent.hasClass("hide-show") ||
            _itemParent.hasClass("title-hide-show")
          ) {
            $this.qaFolder(_item);
          }
        }
      });
      $this.qa_ajax({
        url: "/api/v1/lms/xiaomu/courses/get_answer",
        type: "get",
        data: s_data,
        success: function (response) {
          var answerdata = JSON.parse(response.data).results;
          if (answerdata && answerdata.length > 0) {
            for (var i = 0; i < answerdata.length; i++) {
              answerdata[i]["kp_question"] = s_data.question || "";
              if (answerdata[i].flag == "poem") {
                answerdata[i].questions = [`base.Qarobot.OneMoreFirst`];
              }
              $this.parseAnswerMessage(answerdata[i]); // 解析answer.message图片
              if (i == 0) {
                $this.items.splice(order + 1, 1, answerdata[i]);
              } else {
                $this.items.push(answerdata[i]);
              }

              // if(!answerdata[i].flag_try&&!answerdata[i].flag){
              //     this.answers_arr.push(answerdata[i].message)
              // }
              // else if(answerdata[i].flag||answerdata[i].flag_try){
              //     this.answers_arr.push(answerdata[i].questions)
              // }
            }
          } else {
            var loadingDOM = $("#rid_" + loadingId).parent();
            loadingDOM.remove();
          }
          $this.$nextTick(function () {
            $this._changeAnswerImageStyle();
            $this.loadVideo(); // 加载视频
            $this.loadAudio(); //加载音频
            $this.playVideoAnswer();
            // 对话框滚轮定位
            setTimeout(function () {
              $(".chat-content").scrollTop($(".chat-content")[0].scrollHeight);
            }, 100);
            // 展开、收起
            var showList = $(".details-child");
            for (var i = 0; i < showList.length; i++) {
              var _item = showList.eq(i);
              var _itemParent = showList.eq(i).parent();
              if (
                _itemParent.hasClass("hide-show") ||
                _itemParent.hasClass("title-hide-show")
              ) {
                $this.qaFolder(_item);
              }
            }
          });

          //     },2000);
          // })(answerdata);
        },
        error: function () {
          $this.items.splice(order + 1, 1); //删除loading
        },
      });
    },
    _getImgNaturalStyle(img, callback) {
      // 获取图片的原始尺寸
      var nWidth, nHeight;
      if (img.naturalWidth) {
        // 现代浏览器
        nWidth = img.naturalWidth;
        nHeight = img.naturalHeight;
      } else {
        // 传统方式
        var image = new Image();
        image.src = img.src;
        image.onload = function () {
          callback(img, image.width, image.height);
          image = null;
        };
      }
      return [nWidth, nHeight];
    },
    _changeAnswerImageStyle() {
      // 初始化、拖动窗口大小时候动态改变图片尺寸
      var $this = this;
      // var videoPoster = $(".qarobot-chat-video-poster")
      // if(videoPoster.length > 0){
      //     for(var _n=0; _n<videoPoster.length;_n++){
      //         var _pimg = $(videoPoster[_n])
      //         var pw = _pimg.parent().width()
      //         _pimg.css({"height": (pw*9/16) + "px"})
      //     }
      // }
      function changeImageStyle(img, w, h) {
        var parentWidth = $(img).parent().width();
        if (parentWidth > w) {
          $(img).css({
            width: w + "px",
            height: "auto",
          });
        } else {
          $(img).css({
            "max-width": "100%",
            height: "auto",
          });
        }
      }
      var imgs = $(".answer-img");
      if (imgs.length > 0) {
        for (var n = 0; n < imgs.length; n++) {
          var _img = imgs[n];
          var wh = $this._getImgNaturalStyle(_img, changeImageStyle);
          if (wh[0] && wh[1]) changeImageStyle(_img, wh[0], wh[1]);
        }
      }
      imgs.off();
      imgs.on("click", function (e) {
        var thisClassname = $.trim(
          $(this).attr("class").replace("answer-img", "")
        );

        //注意：IE、Firefox3+、Opera9.5、Chrome、Safari支持，在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，我们需要做个兼容。
        var clientRect = this.getBoundingClientRect();
        var docTop = document.documentElement.clientTop; // 非IE为0，IE为2
        var docLeft = document.documentElement.clientLeft; // 非IE为0，IE为2

        $this.posObj = {
          target: "img." + thisClassname,
          top: clientRect.top - docTop,
          left: clientRect.left - docLeft,
          width: $(this).width(),
          height: $(this).height(),
        };

        $this._showImageViewBox(this.src);
      });
    },
    _stopAllAudio: function (obj) {
      var $this = this;
      if ($this.audioList.length) {
        for (var i = 0; i < $this.audioList.length; i++) {
          var _player = $this.audioList[i];
          if (_player) {
            if ((obj && _player != obj) || !obj) {
              _player.pause();
            }
          }
        }
      }
    },
    loadAudio: function () {
      //加载音频
      var $this = this;
      $this._stopAllAudio();
      var audioBoxs = $(".simple-audio");
      if (audioBoxs.length > 0) {
        audioBoxs.each(function (e) {
          //初始化音频
          var _that = this;
          if ($(_that).attr("audio-url")) {
            var audioUrl = $(_that).attr("audio-url");
            $(_that).removeAttr("audio-url");
            var _player = new AudioPlayer($(_that), {
              type: "vocie",
              url: audioUrl,
              autoplay: false,
              startTime: 0,
            });
            _player.on(
              "play",
              function (e, obj) {
                $this._stopAllAudio(obj);
              }.bind(this)
            );
            $this.audioList.push(_player);
          }
        });
      }
    },
    loadVideo: function () {
      // 加载视频
      var $this = this;
      var videoSubTitleBoxs = $(".video-msg-subtitle.unload");
      var videoAnswers = $(".video-msg-warp-video.unload");
      if (videoAnswers.length > 0) {
        // 加载视频
        videoAnswers.each(function (e) {
          var _that = this;
          var videoId = $(_that).find(".video-msg-play-btn").attr("video_id");
          var videoCcsourse = $(_that)
            .find(".video-msg-play-btn")
            .attr("video_ccsourse");
          var courseId = $(_that).find(".video-msg-play-btn").attr("course_id");
          var videoTime = $(_that)
            .find(".video-msg-play-btn")
            .attr("video_time");
          $(_that).find(".video-msg-video-box").find(".loading").fadeIn("fast");
          $this.qa_ajax({
            url:
              "/api/v1/lms/service/playurl/" + videoCcsourse + "/?appid=10000",
            type: "get",
            data: {},
            success: function (response) {
              var videoData = response.data.data;
              $(_that)
                .find(".video-msg-video-box")
                .find(".loading")
                .fadeOut("fast");
              $(_that)
                .find(".video-msg-play-btn")
                .find(".video-msg-play-btn-arr")
                .removeClass("_opacity");
              $(_that).removeClass("unload");
              var quality20 =
                videoData.sources.quality20[0] ||
                videoData.sources.quality10[0];
              var quality10 = videoData.sources.quality10[0];

              var player = new XtPlayer($(_that).find(".video-msg-video-box"), {
                id: videoCcsourse,
                sku_id: "",
                classroom_id: "",
                cid: courseId,
                cc: "",
                userId: "",
                isDrag: true,
                isAbleOcclusion: false,
                lob: "plat2",
                isHeart: false,
                heartSrc: "",
                autoplay: false,
                server: "vod",
                serverType: "video",
                language: $this.local_lang, //语言
                hiddenQuestion: true,
                hiddenKnowledgePoint: true,
                duration: 0,
                volume: {
                  value: 0.8,
                },
                speed: {
                  show: false,
                },
                isShowControls: false, //【必须】是否显示控制栏
                isShowProgress: false, //【必须】是否显示进度条
                urls: {
                  //视频地址列表: vodUrls、liveUrls、cdnUrls
                  vodUrls: {
                    url_default: "url_270P",
                    url_270P: quality20,
                  },
                },
                caption: {
                  //字幕配置
                  show: false,
                },
                position: 0,
                startTime: videoTime,
                endTime: 0,
                debug: false,
              });
            },
          });
        });
      }
      if (videoSubTitleBoxs.length > 0) {
        videoSubTitleBoxs.each(function (e) {
          var _that = this;
          var subTitle = $(_that).attr("sub-title");
          $(_that).removeAttr("sub-title");
          var isOver = Util.overflowhidden(_that, 3, subTitle);
          $(_that).addClass("_margin-bottom");
          if (isOver) {
            var _dataEle = $(_that)
              .parent()
              .parent()
              .find(".video-msg-warp-video")
              .find(".video-msg-play-btn");
            var _href = "",
              _target = "";
            if (typeof _dataEle.attr("href") != "undefined") {
              //视频答案：如果是课件外链视频，就新开tab打开页面
              _href = "href=" + _dataEle.attr("href");
              _target = ' target="_blank"';
            }
            $(_that).html(
              $(_that).html() +
                '<a class="video-msg-subtitle-btn" ' +
                _href +
                _target +
                "> " +
                `base.Qarobot.VideoLinkTip` +
                "</a>"
            );
          }
          $(_that).removeClass("unload");
        });
      }
    },
    playVideoAnswer: function () {
      // 播放视频
      var $this = this;
      var videoSubTitlebtns = $(".video-msg-subtitle-btn");
      var videoAnswers = $(".video-msg-warp-video");

      function clickEvent(_dataEle, _bool) {
        //打开视频播放dialog
        if (+_dataEle.attr("is_joined")) {
          // nothing
        } else {
          var _data = {
            chapter_id: _dataEle.attr("chapter_id"),
            course_title: _dataEle.attr("course_title"),
            vertical_id: _dataEle.attr("vertical_id"),
            course_desc: _dataEle.attr("course_desc"),
            vertical_name: _dataEle.attr("vertical_name"),
            course_id: _dataEle.attr("course_id"),
            is_joined: _dataEle.attr("is_joined"),
            video_pos: _dataEle.attr("video_pos"),
            course_img: _dataEle.attr("course_img"),
            video_id: _dataEle.attr("video_id"),
            video_ccsourse: _dataEle.attr("video_ccsourse"),
            course_url: _dataEle.attr("course_url"),
            sequential_name: _dataEle.attr("sequential_name"),
            chapter_name: _dataEle.attr("chapter_name"),
            sequential_id: _dataEle.attr("sequential_id"),
            video_time: _dataEle.attr("video_time"),
            video_name: _dataEle.attr("video_name"),
            org_name: _dataEle.attr("org_name"),
            kp: _dataEle.attr("kp"),
            kp_question: _dataEle.attr("kp_question"),
            total_enrollment_number: _dataEle.attr("total_enrollment_number"),
          };
          if ($this.user_id) {
            $this.qa_ajax({
              url: "/api/v1/lms/xiaomu/courses/video_click/record",
              type: "get",
              data: {
                course_id: $this.course_id,
                user_id: $this.user_id,
                video_id: _data.video_id,
                question: _data.kp_question,
                kp: _data.kp,
                language:
                  $this.local_lang.indexOf("zh") != -1
                    ? "chinese"
                    : $this.local_lang.indexOf("en") != -1
                    ? "english"
                    : $this.local_lang,
              },
              success: function (response) {
                response = response.data;
                if (response.success) {
                }
              },
            });
          }
          $this.showVideoViewBox(_data);
        }
      }
      if (videoAnswers.length > 0) {
        videoAnswers.off();
        videoAnswers.on("click", function (e) {
          var target = e.target;
          var targetTagName = target.tagName.toLowerCase();
          if (!target.getAttribute("href")) {
            //如果是外链视频答案，就阻止时间冒泡和默认事件
            e.stopPropagation();
            e.cancelBubble = true;
          }
          var currentTarget = e.currentTarget;
          var _dataEle = $(this).find(".video-msg-play-btn");
          clickEvent(_dataEle);
          if (!target.getAttribute("href")) {
            return false;
          }
        });
      }
      if (videoSubTitlebtns.length > 0) {
        videoSubTitlebtns.off().on("click", function (e) {
          var target = e.target;
          var targetTagName = target.tagName.toLowerCase();
          if (!target.getAttribute("href")) {
            //如果是外链视频答案，就阻止时间冒泡和默认事件
            e.stopPropagation();
            e.cancelBubble = true;
          }
          var currentTarget = e.currentTarget;
          var _dataEle = $(this)
            .parent()
            .parent()
            .find(".video-msg-warp-video")
            .find(".video-msg-play-btn");
          clickEvent(_dataEle);
          if (!target.getAttribute("href")) {
            return false;
          }
        });
      }
    },
    mvArrRepeat(data) {
      // questions去重复
      var $this = this;
      var _arr = [],
        _sources = [],
        _answers = [];
      var questions = null,
        sources = null,
        answers = null;
      if (data.flag || data.flag_try) {
        questions = data.questions;
      }
      if (data.flag_try) {
        sources = data.sources;
        answers = data.answers;
      }
      if (questions && questions.length > 0) {
        for (var i = 0; i < questions.length; i++) {
          var ques = questions[i];
          if (_arr.length > 0) {
            for (var j = 0; j < _arr.length; j++) {
              var s_ques = _arr[j];
              if (s_ques != ques && j >= _arr.length - 1) {
                _arr.push(ques);
                if (sources && sources.length > 0 && !!sources[i])
                  _sources.push(sources[i]);
                if (answers && answers.length > 0 && !!answers[i])
                  _answers.push(answers[i]);
              }
            }
          } else {
            _arr.push(ques);
            if (sources && sources.length > 0 && !!sources[i])
              _sources.push(sources[i]);
            if (answers && answers.length > 0 && !!answers[i])
              _answers.push(answers[i]);
          }
        }
        data.questions = _arr;
        if (data.flag_try) {
          data.sources = _sources;
          data.answers = _answers;
        }
      }
    },
    parseAnswerMessage(_data) {
      // 解析回答数据
      var $this = this;
      this.mvArrRepeat(_data); // questions去重复
      var s_msg = _data.message || null;
      if (s_msg)
        s_msg = s_msg
          .replace(/\r\n/g, "<br>")
          .replace(/\n\r/g, "<br>")
          .replace(/\n/g, "<br>")
          .replace(/\r/g, "<br>");
      var tem_msgs = s_msg;
      var question = _data.question || null,
        tem_question = question;
      var isSource = !!_data.source;
      var isTranslate = !!_data.isTranslate;
      // var translateMark = '';
      // if(isTranslate){
      //     translateMark = 'istranslate';
      // }
      // var rid = '', _rid = _data.rid;
      // if(_rid){
      //     if(translateMark) rid = 'rid="' + _rid + '" ' + translateMark;
      //     else rid = 'rid="' + _rid + '"';
      // }
      var _title =
        _data.title ||
        _data.course_title ||
        _data.video_name ||
        _data.sequential_name ||
        _data.chapter_name ||
        _data.vertical_name;
      if (
        s_msg &&
        /\[\d+\]:\s*[http:\/\/|https:\/\/|\/\/].*/.test(s_msg) &&
        /!\[.*\]\[\d+\]/.test(s_msg)
      ) {
        // 解析图片地址
        _data.hasImage = true;
        var tem_msg = s_msg.split("<br>");
        if (tem_msg && tem_msg.length > 0) {
          for (var i = 0; i < tem_msg.length; i++) {
            var source_item = tem_msg[i];
            var _item = $.trim(tem_msg[i]);
            if (_item == "") {
              if (i == tem_msg.length - 1) {
                tem_msgs = tem_msgs.replace(source_item, "");
              } else {
                tem_msgs = tem_msgs.replace(source_item + "<br>", "");
              }
            }
            if (/^\[\d+\]:\s*[http:\/\/|\/\/].*$/.test(_item)) {
              var _arr = /^\[(\d+)\]:\s*([http:\/\/|\/\/].*)$/.exec(_item);
              var num = _arr[1];
              var url = _arr[2];
              var _arr1 = new RegExp(
                "!\\[(.[^\\[\\]]*)\\]\\[" + num + "\\]",
                "g"
              ).exec(s_msg);
              var title = _arr1[1];
              s_msg = s_msg.replace("<br>" + source_item, "");
              tem_msgs = tem_msgs.replace("<br>" + source_item, "");
              s_msg = s_msg.replace(
                new RegExp(
                  "\\<br\\s*\\/{0,1}\\>\\s*!\\[.[^\\[\\]]*\\]\\[" + num + "\\]",
                  "g"
                ),
                '<img class="answer-img ' +
                  $this.uuid() +
                  '" alt="' +
                  title +
                  '" src="' +
                  url +
                  '"  />'
              );
              tem_msgs = tem_msgs.replace(
                new RegExp(
                  "\\<br\\s*\\/{0,1}\\>\\s*!\\[.[^\\[\\]]*\\]\\[" + num + "\\]",
                  "g"
                ),
                '<img class="answer-img ' +
                  $this.uuid() +
                  '" alt="' +
                  title +
                  '" src="' +
                  url +
                  '"  />'
              );
            }
          }
        }
      }
      if (s_msg) {
        s_msg = $.trim(s_msg);
      }
      if (tem_msgs) {
        tem_msgs = $.trim(tem_msgs);
      }
      if (
        question &&
        /\[\d+\]:\s*[http:\/\/|https:\/\/|\/\/].*/.test(question) &&
        /!\[.*\]\[\d+\]/.test(question)
      ) {
        // 解析原始答案图片
        _data.hasImage = true;
        _data.hasQuestionImage = true;
        var tem_quests = question.split("<br>");
        if (tem_quests && tem_quests.length > 0) {
          for (var j = 0; j < tem_quests.length; j++) {
            var source_item = tem_quests[j];
            var _item = $.trim(tem_quests[j]);
            if (_item == "") {
              if (j == tem_quests.length - 1) {
                tem_question = tem_question.replace(source_item, "");
              } else {
                tem_question = tem_question.replace(source_item + "<br>", "");
              }
            }
            if (/^\[\d+\]:\s*[http:\/\/|\/\/].*$/.test(_item)) {
              var _arr = /^\[(\d+)\]:\s*([http:\/\/|\/\/].*)$/.exec(_item);
              var num = _arr[1];
              var url = _arr[2];
              var _arr1 = new RegExp(
                "!\\[(.[^\\[\\]]*)\\]\\[" + num + "\\]",
                "g"
              ).exec(question);
              var title = _arr1[1];
              question = question.replace("<br>" + source_item, "");
              tem_question = tem_question.replace("<br>" + source_item, "");
              question = question.replace(
                new RegExp(
                  "\\<br\\s*\\/{0,1}\\>\\s*!\\[.[^\\[\\]]*\\]\\[" + num + "\\]",
                  "g"
                ),
                '<img class="answer-img ' +
                  $this.uuid() +
                  '" alt="' +
                  title +
                  '" src="' +
                  url +
                  '"  />'
              );
              tem_question = tem_question.replace(
                new RegExp(
                  "\\<br\\s*\\/{0,1}\\>\\s*!\\[.[^\\[\\]]*\\]\\[" + num + "\\]",
                  "g"
                ),
                '<img class="answer-img ' +
                  $this.uuid() +
                  '" alt="' +
                  title +
                  '" src="' +
                  url +
                  '"  />'
              );
            }
          }
        }
      }
      if (question) {
        question = $.trim(question);
      }
      if (tem_question) {
        tem_question = $.trim(tem_question);
      }
      var isOnlyImg = false;
      var isVideo = false;
      var isAudio = false;
      var isOnlyAudio = false;
      var isOnlyVideo = false;
      var isVideoTitle = false;
      if (/^\<img(.*)\/\>$/.test(s_msg)) {
        // 是否为纯图片答案
        var _imgarr = /^\<img(.*)\/\>$/.exec(s_msg);
        if (_imgarr[1].indexOf("<img") == -1 && _imgarr[1].indexOf("/>") == -1)
          isOnlyImg = true;
      }
      if (/\<a\s{1,}.*\>/.test(s_msg)) {
        // 将答案中的超链接添加 target='_blank'
        s_msg = s_msg.replace("<a", "<a target='_blank' ");
      }
      if (/\<audio\s{1,}.*?src=["|']([^\s]*?)["|']\s{1,}.*?\>/.test(s_msg)) {
        // 解析答案中的audio
        isAudio = true;
        //替换所有的<audio src="xxxxx.mp3">xxx</audio>为：<div class="simple-audio" audio-url="xxxx.mp3"></div>
        var findAudioReg = /\<audio\s{1,}.*?src=["|']([^\s]*?)["|']\s{1,}.*?\>.*?\<\/audio\>/g; //记录音频url
        var findAudioSplitReg = /\<audio\s{1,}.*?src=["|'][^\s]*?["|']\s{1,}.*?\>.*?\<\/audio\>/g; //不记录音频url

        //先分析是否：纯音频、文案音频混排、多音频混排等等
        var temp_msg_arr = s_msg.split(findAudioSplitReg);
        if (temp_msg_arr && temp_msg_arr.length) {
          var msgSplitLen = temp_msg_arr.length;
          if (msgSplitLen == 2) {
            //一个音频
            if (
              $.trim(temp_msg_arr[0]) == "" &&
              $.trim(temp_msg_arr[1]) == ""
            ) {
              isOnlyAudio = true;
            }
          } else {
            //多个音频--暂时不用
          }
        }
        //填充语音DOM
        s_msg = s_msg.replace(
          findAudioReg,
          '<div class="simple-audio" audio-url="${1}"></div>'
        );
      }
      if (_data.reply_type == "video") {
        // 解析视频答案
        isVideo = true;
        // 视频定位字幕文案
        isVideoTitle =
          ("video_caption" in _data && !!_data.video_caption) ||
          ("course_desc" in _data && !!_data.course_desc);
        //var videoWarpClassList = isVideoTitle ? 'video-msg-warp padding-warp' : _title ? 'video-msg-warp padding-warp' : 'video-msg-warp';
        var videoWarpClassList = isVideoTitle
          ? "video-msg-warp padding-warp"
          : "video-msg-warp";
        var videoSubtitleBox = "";
        if (isVideoTitle) {
          var videoSubtitle = _data.video_caption || _data.course_desc;
          videoSubtitleBox =
            '<div class="video-msg-subtitle unload" sub-title="' +
            videoSubtitle +
            '"></div>';
        }
        // else if (_title) {
        //     videoSubtitleBox = '<div class="video-msg-subtitle unload" sub-title="' + _title + '"></div>';
        // }
        // _data.is_joined = _data.is_joined ? 1 : 0
        // var _href = !!_data.is_joined ? 'href="' + _data.course_url + '"' : ''
        // var _target = !!_data.is_joined ? 'target="_blank"' : ''
        if (!isVideoTitle && !_title) isOnlyVideo = true;
        _data.is_joined = 0;
        var _href = "";
        var _target = "";
        _data.org_name = _data.org_name || "";
        _data.video_id = _data.video_id || "";
        var num = _data.total_enrollment_number || 0;
        if ($this.local_lang == "zh") {
          _data.total_enrollment_number =
            +num < 10000
              ? num + "人"
              : num < 1000000
              ? Math.round(num / 1000) / 10 + "万人"
              : Math.round(num / 100000) / 10 + "百万";
        } else {
          _data.total_enrollment_number = num;
        }

        s_msg =
          '<div class="' +
          videoWarpClassList +
          '">' +
          videoSubtitleBox +
          '<div class="video-msg-warp-video unload">' +
          // + '<img class="qarobot-chat-video-poster video-poster" src="'+_data.course_img+'" />'
          '<img class="qarobot-chat-video-poster video-poster" style="display:block;opacity:0;" src="https://static-cdn.xuetangx.com/xtassets/qarobot/qarobot-chat-video-poster.png" />' +
          '<div class="video-msg-video-box"><div class="loading"><div></div><div></div><div></div><div></div><div></div></div></div>' +
          "<a " +
          _href +
          ' class="video-msg-play-btn" ' +
          'chapter_id="' +
          _data.chapter_id +
          '" ' +
          'course_title="' +
          _data.course_title +
          '" ' +
          'vertical_id="' +
          _data.vertical_id +
          '" ' +
          'course_desc="' +
          _data.course_desc +
          '" ' +
          'vertical_name="' +
          _data.vertical_name +
          '" ' +
          'course_id="' +
          _data.course_id +
          '" ' +
          'is_joined="' +
          _data.is_joined +
          '" ' +
          'video_pos="' +
          _data.video_pos +
          '" ' +
          'course_img="' +
          _data.course_img +
          '" ' +
          'video_id="' +
          _data.video_id +
          '" ' +
          'video_ccsourse="' +
          _data.video_ccsourse +
          '"' +
          'course_url="' +
          _data.course_url +
          '" ' +
          'sequential_name="' +
          _data.sequential_name +
          '" ' +
          'chapter_name="' +
          _data.chapter_name +
          '" ' +
          'sequential_id="' +
          _data.sequential_id +
          '" ' +
          'video_time="' +
          _data.video_time +
          '" ' +
          'video_name="' +
          _data.video_name +
          '" ' +
          'org_name="' +
          _data.org_name +
          '" ' +
          'kp="' +
          _data.kp +
          '" ' +
          'kp_question="' +
          _data.kp_question +
          '" ' +
          'total_enrollment_number="' +
          _data.total_enrollment_number +
          '" ' +
          _target +
          ">" +
          '<span class="video-msg-play-btn-arr blue_play_btn _opacity">' +
          "</span></a>";
      }
      _data.isOnlyImg = isOnlyImg;
      _data.isVideo = isVideo;
      _data.isAudio = isAudio;
      _data.isOnlyAudio = isOnlyAudio;
      _data.isOnlyVideo = isOnlyVideo;
      _data.isVideoTitle = isVideoTitle;
      if (_title) {
        // 处理答案中的title
        if (_data.reply_type == "video") {
          // 添加视频答案title
          s_msg +=
            '<span class="video-msg-title">' + _title + "</span></div></div>";
        } else {
          var _msg =
            '<div class="item-msg-warp"><div class="title-box" style="margin-bottom:10px;"><font>问：</font>' +
            _title;
          if (_data.hasImage)
            _msg =
              '<div class="item-msg-warp"><div style="margin-bottom:10px;"><font>问：</font>' +
              _title;
          if (question) _msg += "<div>" + question + "</div></div>";
          else _msg += "</div>";
          if (isOnlyImg) {
            _msg =
              '<div class="item-msg-warp"><div style="margin-bottom:10px;"><font>问：</font>' +
              _title;
            if (question) _msg += "<div>" + question + "</div></div>";
            else _msg += "</div>";
            _msg += "<font>答：</font>" + s_msg;
          } else _msg += "<font>答：</font>" + s_msg;
          s_msg = _msg + "</div>";
        }
      } else {
        if (_data.reply_type == "video") {
          //视频答案没有title的情况
          s_msg = s_msg;
        } else if (isOnlyImg)
          s_msg = '<div class="item-msg-warp onlyimg">' + s_msg + "</div>";
        else s_msg = '<div class="item-msg-warp">' + s_msg + "</div>";
      }
      _data.message = s_msg;
    },
    // 视频扩谱图知识点----渲染单个图谱，及 bind点击事件
    showKnowledgePoint(data, changezt) {
      var $this = this;
      //当graph为真的时候展示‘先修知识点’、‘后修知识点’，当graph为false的时候展示‘相关知识点’, 默认为false
      var isGraph = "graph" in data ? data.graph : false;
      function getListHTML(l, d, t, o) {
        var _h = "";
        for (var i = 0; l > 0 && d[i] && i < l; i++) {
          var mb = i == l - 1 ? 'style="margin-bottom:0px;"' : "";
          _h +=
            "<li " +
            mb +
            " " +
            d.length +
            '><span class="point">' +
            d[i] +
            '<img src="https://static-cdn.xuetangx.com/xtassets/xuetangx/scholar_delete.png" alt=""></span><div style="clear:both;zoom:-1;"></div></li>';
        }
        return _h;
      }

      function getH(l) {
        //return l * 36 + (l - 1) * 12;
        return l * 36;
      }

      function getCSS(maxH, minH) {
        return (
          "top:" +
          ((maxH - minH) / 2 + 18) +
          "px;bottom:" +
          ((maxH - minH) / 2 + 18) +
          "px"
        );
      }

      $this.knowledgeAnswerHandler
        ? clearTimeout($this.knowledgeAnswerHandler)
        : null;
      if (data) {
        var _html = "",
          _infohtml = "",
          _dialog_show = "",
          _dialoghtml = "",
          htmlLeft = "",
          htmlRight = "",
          leftCSS = "",
          rightCSS = "",
          preLen = "prerequisites" in data ? data.prerequisites.length : 0,
          aboutLen = data.about.length,
          leftH = getH(preLen),
          rightH = getH(aboutLen),
          minH = Math.min(leftH, rightH),
          maxH = Math.max(leftH, rightH);
        htmlLeft += getListHTML(preLen, data.prerequisites);
        htmlRight += getListHTML(aboutLen, data.about);

        //以maxH为基准，修改minH的top和bottom
        minH == leftH ? (leftCSS += getCSS(maxH, minH)) : null;
        minH == rightH ? (rightCSS += getCSS(maxH, minH)) : null;
        // if(!htmlLeft && !htmlRight){
        //     $("#qa .konwledgeTree").html('<div class="sameup-null"></div>')
        //     return false
        // }
        //判断htmlLeft和htmlRight是否有数据，添加没有数据的展示样式
        var addLeftClass = !!htmlLeft ? "" : "no-left";
        var addRightClass = !!htmlRight ? "" : "no-right";
        var rudiusleftClass = !!htmlLeft ? "" : "left_rudis";
        var rudiusrightClass = !!htmlRight ? "" : "left_rudis";
        if ($this.is_scholar) {
          //学霸模式加载
          $(".status").hide();
          $this.is_show = true;
          _html +=
            '<div class="scholar"><div class="title">学霸模式</div><div class="testswitch">' +
            '<input class="testswitch-checkbox" id="onoffswitch" type="checkbox" checked>' +
            '<label class="testswitch-label" for="onoffswitch">' +
            '<span class="testswitch-inner" data-on="ON" data-off="OFF"></span>' +
            '<span class="testswitch-switch"></span></label></div>' +
            '<span class="remind"><img src="https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/reminds.png" alt="提醒"></span>' +
            '<div class="entry w185"><div class="entry-trangle"></div>' +
            '<p class="f11">学霸模式:开启后，当你在点击下图中的知识点时候，将会帮助小木优化知识结构，告诉小木哪些知识点不合适出现在这里。快来试试吧!</p></div>' +
            '<span class="scholar_change" id="scholar_change">换一批<img src="https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/scholar_change.png"></span></div>' +
            '<div class="scholar_info"><div class="scholar_img"><img id="scholarimg" src="" alt=""></div>' +
            '<div class="scholar_name"></div><div class="scholar_number"><img src="https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/scholar_number.png">学点' +
            '<span id="scholar_number"></span></div><div class="scholar_rank scholar_number">' +
            '<img src="https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/scholar_rank.png">全服排名<span id="scholar_rank"></span></div></div>' +
            ' <div class="remind_text"><span class="reminds" id="dwreminds"><img style="vertical-align: middle;" src="https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/reminds01.png" alt="提醒"><span class="dwtext" style="font-size:11px;margin-left:3px;color:#818A92;">段位保护机制</span></span> ' +
            '<div class="entrys w185" id="dwentrys"><div class="entry-trangle"></div>' +
            '<p class="f11 fitex">段位保护机制：当您被扣分下降段位时，系统会自动触发对您当前段位的三次保护机制，当您连续三次被扣分时将会下降段位，加油吧，骚年～</p></div></div>' +
            '<div class="knowledge1 left_ml ' +
            (isGraph ? "" : "no-graph") +
            '"><ul class="know_left">' +
            htmlLeft +
            '<label style="' +
            leftCSS +
            '"></label><div class="left_qp"><div class="dialog-border"><div class="grage"></div>' +
            '<div class="enjor"><img src="" alt=""><i class="enjor_text"></i></div></div></div></ul>' +
            '<div class="selectedBox"><span class="sameup point ' +
            addLeftClass +
            " " +
            addRightClass +
            '">' +
            data.knowledge_point +
            '<i class="left_y' +
            rudiusleftClass +
            '"></i><i class="rights_ru' +
            rudiusrightClass +
            '"></i></span></div>' +
            '<ul class="know_right">' +
            htmlRight +
            '<label style="' +
            rightCSS +
            '"></label>' +
            '<div class="right_qp"><div class="dialog-border"><div class="grage"></div>' +
            '<div class="enjor"><img src="" alt=""><i class="enjor_text"></i></div>' +
            '</div></div></ul><div class="mark"><span class="know_xianxiu" style="display:none;">先修知识点</span><span class="know_about">相关知识点</span></div></div></div>';
        } else {
          $this.is_show = true;
          var scholarxb = [
            "course-v1:TsinghuaX+30240184+sp",
            "course-v1:TsinghuaX+30240243X+sp",
            "course-v1:TsinghuaX+30700313X+sp",
            "course-v1:MITx+6_00_1x+sp",
          ];
          var is_allow = $.inArray($this.course_id, scholarxb);
          if (is_allow >= 0) {
            firsr_scholar();
            _html +=
              '<div class="scholar"><div class="title">学霸模式</div><div class="testswitch">' +
              '<input class="testswitch-checkbox" id="onoffswitch" type="checkbox">' +
              '<label class="testswitch-label" for="onoffswitch">' +
              '<span class="testswitch-inner" data-on="ON" data-off="OFF"></span>' +
              '<span class="testswitch-switch"></span></label></div></div>' +
              '<div class="knowledge1 ' +
              (isGraph ? "" : "no-graph") +
              '" id="knowledge1"><ul class="know_left">' +
              htmlLeft +
              '<label style="' +
              leftCSS +
              '"></label></ul>' +
              '<div class="selectedBox"><span class="sameup point ' +
              addLeftClass +
              " " +
              addRightClass +
              '">' +
              data.knowledge_point +
              '<i class="left_y' +
              rudiusleftClass +
              '"></i><i class="rights_ru' +
              rudiusrightClass +
              '"></i></span></div>' +
              '<ul class="know_right">' +
              htmlRight +
              '<label style="' +
              rightCSS +
              '"></label></ul></div>';
          } else {
            _html +=
              '<div class="knowledge1 ' +
              (isGraph ? "" : "no-graph") +
              '"><ul class="know_left">' +
              htmlLeft +
              '<label style="' +
              leftCSS +
              '"></label></ul>' +
              '<div class="selectedBox"><span class="sameup point ' +
              addLeftClass +
              " " +
              addRightClass +
              '">' +
              data.knowledge_point +
              '<i class="left_y' +
              rudiusleftClass +
              '"></i><i class="rights_ru' +
              rudiusrightClass +
              '"></i></span></div>' +
              '<ul class="know_right">' +
              htmlRight +
              '<label style="' +
              rightCSS +
              '"></label></ul></div>';
          }
          var markHTML = isGraph
            ? '<span class="know_xianxiu">' +
              "base.Qarobot.PrerequisiteKnowledge" +
              '</span><span class="know_about">' +
              "base.Qarobot.FollowUpKnowledge" +
              "</span>"
            : '<span class="know_related">' +
              "base.Qarobot.RelatedKnowledgeTip" +
              "</span>";
          $("#qa .mark").html(markHTML);
        }
        $("#qa .konwledgeTree").html(_html);
        if (navigator.userAgent.indexOf("Firefox") >= 0) {
          $(".w185").css("width", "185px");
          $(".f11").addClass("jrfox");
        } else {
          $(".w185").css("width", "196px");
          $(".fitex").css("margin-top", "-8px");
        }
        if (changezt) {
          scholar_change();
        }
        //小木新功能上线提示接口
        function firsr_scholar() {
          $this.qa_ajax({
            //url: "http://apimock.xuetangx.com/mock/451/course/{course_id}/xiaomu_taste/",
            url:
              "/api/v1/lms/xiaomu/courses/" +
              $this.course_id +
              "/xiaomu_taste/",
            type: "get",
            data: {
              func: "is_kp",
            },
            success: function (res) {
              if (res.data.is_kp) {
                $this.showChat(true, true);
              }
            },
          });
        }
        /* 开启学霸模式切换 */
        $("#onoffswitch").on("click", function () {
          clickSwitch();
        });
        var clickSwitch = function () {
          if ($("#onoffswitch").is(":checked")) {
            $(".status").hide();
            $this.is_scholar = true;
            $this.knowledge($this.is_scholar);
            setTimeout(function () {
              //定时器
              $this.initScholar();
            }, 2000);
          } else {
            $this.is_scholar = false;
            $this.knowledge();
          }
        };
        $this.isClick = true;
        $(".left_ml ul li span").on({
          mouseenter: function (e) {
            $(this).find("img").show();
          },
          mouseleave: function (e) {
            $(this).find("img").hide();
          },
          click: function (e) {
            if ($this.isClick && $this.flag_an) {
              $this.isClick = false;
              var _this = $(this);
              var mun, widths;
              widths = $(this).outerWidth(true) + 20;
              $(".left_ml ul li span ").removeClass("actives");
              $(this).addClass("actives");
              var lss = $(this).attr("class");
              $(this)
                .parent()
                .each(function () {
                  mun = $(this).index();
                });
              if ($this._dialog_show == false) {
                deleteScholar($this._dialog_show);
              } else {
                _dialoghtml +=
                  '<div id="dialogBg"></div>' +
                  '<div class="animateds">' +
                  '<div class="ts_info">提示</div>' +
                  '<div class="ts_answer">同学，确定此知识点无关？</div>' +
                  '<div class="ts_choose">不再提示</div>' +
                  '<div class="ts_jg"><span class="left" id="sures">确定</span><span class="right" id="nosures">取消</span></div>' +
                  "</div>";
                $("body").append(_dialoghtml);
                fadins($("#dialogBg"), $(".animateds"));
              }
            }
            /*删除知识点动画*/
            function anmationScholar() {
              _this
                .animate(
                  { width: "36px", height: "36px" },
                  "fast",
                  "linear",
                  function () {
                    _this.addClass("circle-label-rotate");
                    /*  setTimeout(function () {//定时器
                                    _this.removeClass('circle-label-rotate');
                                    _this.addClass('shake');
                                }, 1000); */
                  }
                )
                .addClass("circle")
                .html('<div class="innertext">Bye</div>')
                .animate(
                  {
                    opacity: "0",
                  },
                  1000,
                  function () {}
                );
            }
            /*删除知识点数据*/
            function deleteScholar(status) {
              $this.qa_ajax({
                //url: 'http://apimock.xuetangx.com/mock/451/courses/%7Bcourse_id%7D/kp_delete/',
                url:
                  "/api/v1/lms/xiaomu/courses/" +
                  $this.course_id +
                  "/kp_delete/",
                type: "get",
                data: {
                  video_id: $this.videoId,
                  first_label: $(".sameup.point").text(),
                  second_label: _this.text(),
                  is_notice: status,
                },
                success: function (res) {
                  var deletedata =
                    typeof res.data == "string"
                      ? JSON.parse(res.data)
                      : res.data;
                  var scholar_img = scholarImages[deletedata.index];
                  var scholar_text = deletedata.level;
                  var scholar_change = deletedata.change;

                  if ($(".actives").parent().parent().hasClass("know_left")) {
                    var tops =
                      minH == leftH ? mun * 48 + (maxH - minH) / 2 : mun * 48;
                    $(".left_qp").show().addClass("shows");
                    $(".left_qp").css("top", tops);
                    $(".left_qp").css("right", widths);
                    setTimeout(function () {
                      //定时器
                      $(".left_qp").hide().removeClass("shows");
                      anmationScholar();
                    }, 1500);
                    setTimeout(function () {
                      //定时器
                      var silcedata = data.prerequisites;
                      silcedata.splice(mun, 1);
                      $this.showKnowledgePoint(data);
                      if (deletedata.level_changed === 0) {
                        $this.initScholar();
                      }
                    }, 3000);
                  } else if (
                    $(".actives").parent().parent().hasClass("know_right")
                  ) {
                    if (scholar_change > 0) {
                      $(".enjor img").attr(
                        "src",
                        "https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/scholar_adds.png"
                      );
                      $(".enjor_text").text("哎呦，不错哦~");

                      $(".grage").text("+" + deletedata.change + "分");
                      $(".right_qp").addClass("minus");
                    } else {
                      $(".enjor img").attr(
                        "src",
                        "https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/scholar_minues.png"
                      );
                      $(".enjor_text").text("别闹，认真点~");
                      $(".grage").text(deletedata.change + "分");
                      $(".right_qp").addClass("add");
                    }
                    var tops =
                      minH == rightH ? mun * 48 + (maxH - minH) / 2 : mun * 48;
                    $(".right_qp").show().addClass("shows");
                    $(".right_qp").css("top", tops);
                    $(".right_qp").css("left", widths);
                    setTimeout(function () {
                      //定时器
                      $(".right_qp").hide().removeClass("shows");
                      anmationScholar();
                    }, 1500);
                    setTimeout(function () {
                      //定时器
                      var silcedata = data.about;
                      silcedata.splice(mun, 1);
                      $this.showKnowledgePoint(data);
                      if (deletedata.level_changed != 0) {
                        $this.flag_an = false;
                      }
                      if (silcedata.length == 1) {
                        var yewidth = $(".left_ml").width();
                        var leftwidtf = $(".selectedBox").width();
                        $this.fzwidth = yewidth - leftwidtf;
                        $(".know_right").css("width", $this.fzwidth);
                      }
                      if (silcedata.length == 0) {
                        $(".know_right").css("width", $this.fzwidth);
                      }
                      if (deletedata.level_changed === 0) {
                        $this.initScholar();
                      }
                    }, 3000);
                  }
                  if (deletedata.level_changed === -1 && !deletedata.is_first) {
                    _infohtml +=
                      '<div id="dialogBg"></div>' +
                      '<div id="dialog" class="animated">' +
                      ' <div class="bgs xj">' +
                      '<img src="https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/bg_3.png" alt="" class="s kol" />' +
                      '<img src="' +
                      scholar_img +
                      '" class="animated bounceInDown wz " width="112"height="145" alt="">' +
                      '<div class="texts xjs">段位下降</div>' +
                      '<div class="submitBtn claseDialogBtn closes">重新再战</div>' +
                      "</div></div>";
                    setTimeout(function () {
                      //定时器
                      $("body").append(_infohtml);
                      fadins($("#dialogBg"), $("#dialog"));
                      $this.flag_an = true;
                    }, 5000);
                  } else if (
                    deletedata.level_changed === 1 ||
                    (deletedata.level_changed === -1 && deletedata.is_first)
                  ) {
                    _infohtml +=
                      '<div id="dialogBg"></div>' +
                      '<div id="dialog" class="animated">' +
                      ' <div class="bgs">' +
                      '<img src="https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/bg_2.png" alt="" class="animated bounceInDown" />' +
                      '<img src="' +
                      scholar_img +
                      '" class="animated bounceInDown wz " width="112"height="145" alt="">' +
                      '<div class="texts scdj">' +
                      scholar_text +
                      "</div>" +
                      '<div class="submitBtn claseDialogBtn" id="submitBtn">收下荣誉</div>' +
                      "</div></div>";
                    setTimeout(function () {
                      //定时器
                      $("body").append(_infohtml);
                      $(".scdj").fadeOut().fadeIn(5000);
                      fadins($("#dialogBg"), $("#dialog"));
                      $this.flag_an = true;
                    }, 5000);
                  }
                  $("body").on("click", ".submitBtn", function () {
                    fadouts($("#dialogBg"), $("#dialog"));
                    $this.initScholar();
                  });
                },
              });
            }
            function fadins(dom, doms) {
              dom.fadeIn(300);
              doms.fadeIn();
            }
            function fadouts(dom, doms) {
              dom.fadeOut().remove();
              doms.fadeOut(300).remove();
            }
            //弹窗选择事件
            $(".ts_choose").click(function () {
              $(".ts_choose").toggleClass("check");
            });
            $(".ts_jg span").click(function () {
              var btnstatus = $(this).attr("id");
              if (btnstatus == "sures") {
                if ($(".ts_choose").hasClass("check")) {
                  deleteScholar(false);
                } else {
                  deleteScholar(true);
                }
              } else {
                $this.isClick = true;
              }
              fadouts($("#dialogBg"), $(".animateds"));
            });
          },
        });
        $(".remind").on({
          mouseenter: function (e) {
            $(".entry").show();
          },
          mouseleave: function (e) {
            $(".entry").hide();
          },
        });
        $("#dwreminds")
          .off()
          .on({
            mouseenter: function (e) {
              $(".entrys").show();
            },
            mouseleave: function (e) {
              $(".entrys").hide();
            },
          });
        $("#scholar_change").click(function () {
          if ($this.isClick) {
            scholar_change();
          }
        });
        function getSrceenWH() {
          var w, h, className;
          w = $(window).width();
          h = $(window).height();
          $("#dialogBg").width(w).height(h);
        }
        //换一换接口逻辑
        function scholar_change() {
          $this.qa_ajax({
            //url: 'http://apimock.xuetangx.com/mock/451/courses/%7Bcourse_id%7D/kp_change/',
            url:
              "/api/v1/lms/xiaomu/courses/" + $this.course_id + "/kp_change/",
            type: "get",
            data: {
              first_label: $(".sameup.point").text(),
              index: "",
            },
            success: function (res) {
              var alldata =
                typeof res.data == "string" ? JSON.parse(res.data) : res.data;
              if (alldata.status == "OK") {
                var changedeta = alldata.extend;
                var newlist = [];
                for (var i = 0, len = changedeta.length; i < len; i++) {
                  newlist.push(changedeta[i].second_level);
                }
                data.about = newlist;
                $this.showKnowledgePoint(data);
                $this.initScholar();
              } else if (
                alldata.status == "Concept has no more extend concepts"
              ) {
                _infohtml +=
                  '<div id="dialogBg"></div>' +
                  '<div id="dialog" class="animated">' +
                  '<img src="https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/no_answer.png" class="ys_anwer" width="180"height="119" alt="">' +
                  '<div class="answer">天啦噜，同学题库被你答爆了~</div>' +
                  '<div class="submitBtn claseDialogBtn closes">关闭</div>' +
                  "</div>";
                $("body").append(_infohtml);
                $("#dialogBg").fadeIn(300);
                $("#dialog").fadeIn();
                data.about = [];
                $this.showKnowledgePoint(data);
                $("body").on("click", ".submitBtn", function () {
                  $("#dialogBg").fadeOut().remove();
                  $("#dialog").fadeOut(300).remove();
                });
              }
            },
          });
        }
        getSrceenWH();
        window.onresize = function () {
          getSrceenWH();
        };
        $(window).resize();
        if ($this.is_show && !$this.is_scholar) {
          $("#qa .point, .sameup")
            .off("click")
            .on("click", function (e) {
              // 拓扑图click添加新字段
              var _obj = {
                video_id: $this.videoId,
                question_source: "wobudong",
              };
              if ($(this).hasClass("sameup")) {
                _obj["concept_relation"] = "itself";
                _obj["origin_concept"] = $(this).text();
              } else if ($(this).parent().parent().hasClass("know_left")) {
                _obj["concept_relation"] = "prerequisites";
                _obj["origin_concept"] = $(".sameup.point").text();
              } else if ($(this).parent().parent().hasClass("know_right")) {
                _obj["concept_relation"] = "about";
                _obj["origin_concept"] = $(".sameup.point").text();
              }
              _obj["msg"] = $(this).text();
              _obj.usertype = "click";
              var str = JSON.stringify(_obj);
              $this.qa_ajax({
                url:
                  "/api/v1/lms/xiaomu/courses/" +
                  $this.course_id +
                  "/kp_click/",
                type: "get",
                data: {
                  video_id: $this.videoId,
                  first_label: _obj.origin_concept,
                  second_label: _obj.msg,
                },
                success: function (res) {},
              });
              $this.clickSendMessage(e, _obj);
            });
        }
        $("#qa .mark span").animate(
          {
            opacity: 1,
          },
          150,
          "swing",
          function () {}
        );
        $("#qa .knowledge1").animate(
          {
            opacity: 1,
          },
          200,
          "swing",
          function () {}
        );
      }
    },
    initScholar() {
      /*初始化学霸模式数据*/
      var $this = this;
      $this.qa_ajax({
        //url: 'http://apimock.xuetangx.com/mock/451/courses/%7Bcourse_id%7D/kp_game/',
        url: "/api/v1/lms/xiaomu/courses/" + $this.course_id + "/kp_game/",
        type: "get",
        data: {
          video_id: $this.videoId,
        },
        success: function (res) {
          var scholardata =
            typeof res.data == "string" ? JSON.parse(res.data) : res.data;
          var scholardatalevel = scholardata.level;
          $("#scholarimg").attr("src", scholarImages[scholardata.index]);
          $(".scholar_name").text(scholardatalevel);
          $("#scholar_number").text(scholardata.score);
          $("body #scholar_rank").text(
            scholardata.rank + "/" + scholardata.total
          );
          $this._dialog_show = scholardata.is_notice;
          var is_first = scholardata.is_first;
          var first_src =
            "https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/no_sort.png";
          if (is_first) {
            $("#scholarimg").attr("src", first_src);
            $("#scholar_rank").text("--");
            $(".scholar_name").text("");
          }
        },
      });
    },
    // 视频扩谱图知识点----加载数据、渲染列表 及 bind切换事件
    knowledge(scholar) {
      var $this = this;

      if ($this.videoId) {
        if (!$this.bindVideoMenusHandler) {
          $this.bindVideoMenusHandler = 1;
          $("#sequence-list[role='tablist']")
            .find("a.seq_video")
            .on("click", function (e) {
              $this.knowledge();
            });
        }
        if (scholar) {
          //var url = "http://apimock.xuetangx.com/mock/451/courses/%7Bcourse_id%7D/kp_get/"
          var url =
            "/api/v1/lms/xiaomu/courses/" + $this.course_id + "/kp_get/";
          var datas = {
            video_id: $this.videoId,
            ccid: $this.ccid || "",
          };
        } else {
          var url = "/api/v1/lms/xiaomu/courses/knowledge_point/";
          var datas = {
            course_id: $this.course_id,
            video_id: $this.videoId,
            ccid: $this.ccid || "",
          };
        }
        $this.qa_ajax({
          url: url,
          type: "get",
          data: datas,
          success: function (res) {
            res = typeof res.data == "string" ? JSON.parse(res.data) : res.data;
            if (res.success || res.status) {
              $this.knowledge_points = res = res.data;
              if (res.length > 0) {
                var _listMenus = "";
                // 显示标签导航,知识点
                for (var i = 0; i < res.length; i++) {
                  var lastChild =
                    i == res.length - 1 ? 'style="margin-right:0;"' : "";
                  i == 0
                    ? (_listMenus +=
                        '<li class="addbj" ' +
                        lastChild +
                        " order=" +
                        i +
                        ">" +
                        res[i].knowledge_point +
                        "<label></label></li>")
                    : (_listMenus +=
                        "<li " +
                        lastChild +
                        " order=" +
                        i +
                        ">" +
                        res[i].knowledge_point +
                        "<label></label></li>");
                }
                var _html =
                  '<div id="qa" class="qa-points">' +
                  '<ul class="listStyle">' +
                  _listMenus +
                  '<div style="clear:both;zoom:-1;"></div>' +
                  "</ul>" +
                  '<div style="postion:relative;background:#FCFCFC;padding:20px;">' +
                  '<div class="mark status" style="background:none;padding:0;"><span class="know_xianxiu">' +
                  "base.Qarobot.PrerequisiteKnowledge" +
                  '</span><span class="know_about">' +
                  "base.Qarobot.FollowUpKnowledge" +
                  "</span></div>" +
                  '<div class="konwledgeTree"></div>' +
                  "</div>" +
                  "</div>";
                $("#qarobot-zhishi").show();
                $("#qarobot-innter").html(_html);
                // 默认渲染第一个知识点
                if (scholar) {
                  $this.showKnowledgePoint($this.knowledge_points[0], scholar);
                  //scholar_change();
                } else {
                  $this.showKnowledgePoint($this.knowledge_points[0]);
                }
                // 点击导航，显示当前内容9999
                $(".listStyle li").on("click", function () {
                  if ($this.isClick) {
                    $(".listStyle li").removeClass("addbj"),
                      $(this).addClass("addbj");
                    if (scholar) {
                      $this.showKnowledgePoint(
                        $this.knowledge_points[$(this).attr("order")],
                        scholar
                      );
                      $this.initScholar();
                    } else {
                      $this.showKnowledgePoint(
                        $this.knowledge_points[$(this).attr("order")]
                      );
                    }
                  }
                });
              }
            }
          },
        });
      } else {
        $("#qarobot-zhishi").hide();
        $("#qarobot-innter").html("");
      }
    },
    showChat: function (flag, message_flag, fn) {
      // 打开小木窗口
      var $this = this;
      var left = $("#chatbox").css("left");
      var btnLeft = $("#chat-btn").css("left");
      var winWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      var chatBtnWidth = $("#chat-btn").outerWidth();
      left = parseInt(left);
      $this.is_show_box = true;
      if (!$this.isFullPage) {
        $("#chatbox").animate(
          {
            left: $this.isRight ? winWidth - $("#chatbox").outerWidth() : 0,
            // 0,
          },
          {
            duration: "fast",
          }
        );
      }

      // $(window).on('click', function (e) {//弃用
      //     $this.windowClickEvent(e)
      // })
      // 点击后第一次打招呼
      if (!$this.is_flag) {
        $this.chat_id = $this.uuid(); // 生成当前会话ID
      }
      //触发say hello
      if (flag) {
        var s_data = {};
        if (message_flag) {
          s_data = {
            answer_type: $this.default_answer_type.id,
            question: "",
            course_id: $this.course_id,
            flag: "message_flag",
            user_id: $this.user_id,
            chat_id: $this.chat_id,
            url: window.location.href,
            ques_nickname: $this.ques_nickname,
          };
        } else {
          s_data = {
            answer_type: $this.default_answer_type.id,
            question: "",
            course_id: $this.course_id,
            flag: "say_hello",
            user_id: $this.user_id,
            chat_id: $this.chat_id,
            url: window.location.href,
            ques_nickname: $this.ques_nickname,
          };
        }

        var order = $this.items.length - 1;
        var loadingId = "initqa";
        $this.showLoading(order, loadingId);

        $this.qa_ajax({
          url: "/api/v1/lms/xiaomu/courses/get_answer",
          type: "get",
          //async: false,
          data: s_data,
          success: function (response) {
            var answerdata = JSON.parse(response.data).results;
            // (function(answerdata){
            //     setTimeout(()=>{

            if (answerdata && answerdata.length > 0) {
              $this.is_flag = !!answerdata[0].flag;
              for (var i = 0; i < answerdata.length; i++) {
                answerdata[i]["kp_question"] = s_data.question || "";
                var _data = answerdata[i];
                if ("questions" in _data && $this.isFullPage) {
                  _data["questions"] = [];
                }
                var as = JSON.stringify(_data);
                $this.parseAnswerMessage(_data); // 解析answer.message图片
                //$this.items.push(_data);
                if (i == 0) {
                  $this.items.splice(order + 1, 1, _data); //删除loading，并插入第一个答案
                } else $this.items.push(_data);
              }
              if (fn) fn();
              $this.$nextTick(function () {
                $this._changeAnswerImageStyle();
                $this.loadVideo(); // 加载视频
                $this.loadAudio(); //加载音频
                $this.playVideoAnswer();
                // 对话框滚轮定位
                // $(".chat-content").scrollTop($(".chat-content")[0].scrollHeight)
                setTimeout(function () {
                  $(".chat-content").scrollTop(
                    $(".chat-content")[0].scrollHeight
                  );
                }, 100);
                // 展开、收起
                var showList = $(".details-child");
                for (var i = 0; i < showList.length; i++) {
                  var _item = showList.eq(i);
                  var _itemParent = showList.eq(i).parent();
                  if (
                    _itemParent.hasClass("hide-show") ||
                    _itemParent.hasClass("title-hide-show")
                  ) {
                    $this.qaFolder(showList.eq(i));
                  }
                }
              });
            } else {
              var loadingDOM = $("#rid_" + loadingId).parent();
              loadingDOM.remove();
            }

            //     }, 2000);
            // })(answerdata);
          },
          error: function () {
            $this.items.splice(order + 1, 1); //删除loading
          },
        });
      }
      // 去除小木是否解决了你的疑惑
      /* if($('#timer').val() == undefined){
            if($this.question==""||$this.question==null){
                var timer = setTimeout(function(){
                    //var rone = $this.generateItem(0,'小沐是否解除了你的疑惑？','');
                    var itemTime = {
                        "uid" : "0",
                        "timer": true,
                        "message" : "<div class='item-msg-warp'>小木是否解除了你的疑惑？</div>"
                    };

                    $this.items.push(itemTime);
                    $this.$nextTick(function(){
                        // 对话框滚轮定位
                        $(".chat-content").scrollTop($(".chat-content")[0].scrollHeight);
                    });

                },300000);
            }
        }else{
            clearTimeout(timer);
        } */
      $(window).unbind("resize.qawin");
      $(window).bind("resize.qawin", function () {
        $this._windowResize();
      });
    },
    getFeedback: function (isUse) {
      var $this = this;
      // 反馈接口 穿参：isUse
      if (!this.is_feedback) {
        this.items.push({
          uid: "0",
          flag: "feedbackend",
          message:
            "<div class='item-msg-warp'>谢谢反馈O(∩_∩)O~~小木会继续努力成为更博学的人</div>",
        });
        this.is_feedback = isUse;
        this.$nextTick(function () {
          // 对话框滚轮定位
          setTimeout(function () {
            $(".chat-content").scrollTop($(".chat-content")[0].scrollHeight);
          }, 100);
        });
      }
      return false;
    },
  },
  transitions: {
    expand: {
      beforeEnter: function (el) {
        el.textContent = "beforeEnter";
      },
      enter: function (el) {
        el.textContent = "enter";
      },
      afterEnter: function (el) {
        el.textContent = "afterEnter";
      },
      beforeLeave: function (el) {
        el.textContent = "beforeLeave";
      },
      leave: function (el) {
        el.textContent = "leave";
      },
      afterLeave: function (el) {
        el.textContent = "afterLeave";
      },
    },
  },
  beforeDestroy() {
    this.destroyDomListener();
  },
  destroyed() {
    this.destroyDomListener();
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
* {
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  -ms-font-smoothing: antialiased;
  -o-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.chatBtn,
.chatBtn * {
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.chatBtn {
  cursor: pointer;
  display: block;
  width: 52px;
  padding: 0 6px;
  height: auto;
  text-decoration: none;
  position: fixed;
  top: 80%;
  left: calc(100vw - 50px);
  z-index: 999;
}
.chatBtn .first-enter {
  position: absolute;
  bottom: 0;
  left: 100%;
  padding: 10px 15px;
  line-height: 20px;
  color: #fff;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.64);
  font-size: 14px;
  width: 203px;
}
.chatBtn .first-enter.adsorb-right {
  bottom: 0;
  right: 100%;
  left: unset;
}
.chatBtn .first-enter .close-first-enter-icon {
  position: absolute;
  right: -10px;
  top: -10px;
  display: block;
  width: 40px;
  height: 40px;
  cursor: pointer;
  opacity: 0.8;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAEhQTFRF////////////////////////////////////////////////////////////////////////////////////////AAAA////Ptj3WQAAABd0Uk5T9hAP0crZBgIDBBMS99PS1c3aERoWFQD5vKOxAAAAl0lEQVQoz3XSWxKDIBBE0U58K0SjAvvfaQCV6aEqfN5ToIPC/1nwfp7qOLwTLMaeuu8tXISxCauSfQtdn45yHyWxf4/8DC13z8Dy9AtESr/hEekPXEK9gHc2rNQF0h7qBPEcngf8/pYEPBdPCjUXCfS8ItDzikB3EVS9CPzQqp7vwE4RXqY79Kd1jZnTUWdf/wzjwldSrR+9LS3iAeFLgQAAAABJRU5ErkJggg==")
    center center no-repeat;
  background-size: 25%;
}
.chatBtn .first-enter .close-first-enter-icon:hover {
  opacity: 1;
}
.chatBtn .chat-btn-inner {
  position: relative;
  cursor: pointer;
  display: block;
  height: 43px;
  overflow: hidden;
  text-decoration: none;
  border-radius: 30px;
  background: rgba(43, 43, 43, 0.8);
}
.chatBtn .btn-img {
  width: 40px;
  height: 40px;
  background-image: url("https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/c232f109b91ee651cea250c7019be6a9.qa-btn-icon-6x.png");
  background-size: 100% 100%;
  display: block;
  background-repeat: no-repeat;
}
.chatBtn .btn-txt {
  position: relative;
  display: inline-block;
  font-size: 12px;
  color: #fff;
  text-align: left;
  padding-left: 43px;
  height: 43px;
  cursor: pointer;
  line-height: 43px;
  font-family: PingFang SC, Arial, Helvetica, sans-serif;
}
.chatBtn.draging {
  cursor: move;
}

#chatbox {
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  -ms-font-smoothing: antialiased;
  -o-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  z-index: 99999999;
}
#chatbox,
#chatbox * {
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
#chatbox :-webkit-scrollbar-track-piece {
  width: 2px;
  height: 2px;
}
#chatbox ::-webkit-scrollbar-thumb {
  border-width: 0px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0);
  border-radius: 0px;
  background: #bbb;
}
#chatbox ::-webkit-scrollbar-thumb:hover {
  background: #999;
}
#chatbox ::-webkit-scrollbar-thumb:hover {
  background: #c3c3c3;
}
#chatbox ::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
#chatbox.icontype {
  height: 608px;
  position: fixed;
  bottom: 0;
  // left: -403px;
  left: calc(100vw + 400px);
  z-index: 10000;
  top: unset;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
#chatbox.fullpage {
  position: fixed;
  z-index: 10000;
  bottom: 0;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
}
#chatbox a {
  text-decoration: none;
  color: #469cff;
}
#chatbox ul {
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
  -webkit-padding-start: 0px;
}

#chatbox .wrap-drag {
  width: 400px;
  float: left;
  // height: 100%;
  height: 608px;
}

#chatbox.fullpage .wrap-drag {
  position: absolute;
  width: 900px;
  float: none;
  left: 50%;
  margin-left: -450px;
  border: 1px solid rgba(215, 215, 215, 0.5);
  border-top: none;
}
#chatbox label.robot_label {
  top: 0;
  right: 0px;
  width: 3px;
  height: 100%;
  display: block;
  position: absolute;
  z-index: 9999;
  cursor: ew-resize !important;
  left: 400px;
  background: transparent;
}
#chatbox label.robot_label_top {
  top: -3px;
  right: 0px;
  left: 0;
  width: 100%;
  height: 3px;
  display: block;
  position: absolute;
  z-index: 9999;
  cursor: ns-resize !important;
  background: transparent;
}
.robot-name {
  position: relative;
  height: 36px;
  line-height: 36px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid rgba(234, 231, 231, 1);
}
.robot-name .name {
  color: #000;
  font-size: 16px;
  float: left;
  margin: 0 0 0 10px;
}
#chatbox.fullpage .robot-name .name {
  float: none;
  text-align: center;
}

.robot-name .close {
  position: relative;
  width: 36px;
  height: 36px;
  color: #333;
  font-size: 14px;
  float: right;
  margin: 0;
  opacity: 1;
}
.robot-name .close a {
  position: relative;
  display: block;
  width: 36px;
  height: 36px;
  cursor: pointer;
  color: #fff;
  text-decoration: none;
}
.close a .close-img {
  position: absolute;
  display: block;
  top: 10px;
  right: 10px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  overflow: hidden;
  -webkit-transform: scale(0.9);
  -moz-transform: scale(0.9);
  -ms-transform: scale(0.9);
  -o-transform: scale(0.9);
  transform: scale(0.9);
  transition: transform 0.2s;
  -moz-transition: transform 0.2s; /* Firefox 4 */
  -webkit-transition: transform 0.2s; /* Safari 和 Chrome */
  -o-transition: transform 0.2s; /* Opera */
}
.close a .close-img.hide-icon {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAHtQTFRFioqKiYmJioqKjo6OioqKioqKioqKi4uLiYmJioqKi4uLiYmJioqKi4uLioqKiYmJioqKioqKjIyMioqKiYmJhoaGioqKh4eHjo6OmZmZf39/f39/ioqKiIiIioqKi4uLioqKiYmJioqKioqKiYmJioqKjIyMAAAAioqKKHCnaAAAACh0Uk5TyBzHG76qma2tvc7Ot7bR0hjLH8TBFbAiEgUIAroPswslKb/GzNQqAK1LYi8AAACzSURBVDjLnZPZEsIgDEVx3/fdqtWSFv7/C2WilFICGeUpwzkzLcmNUMwRvwovWdiywrIlPJdaWl5i6QunmS6rmmPpCdtNwD2h1w15U1jvCN4QDnuKO+E8IXkt3G80t0K+iPCvcH3E+Ee4HKMchWwc5ygM3CW0OQpDdytJIRsxn2B/kn+madQ83Si+1WZY/fSw+HHzgVGqI9KR40NrYj9Nx94szkqDWxygVg/c6kHxz/IG5w23DpciSGPo9AAAAABJRU5ErkJggg==")
    center center no-repeat;
  background-size: 100%;
}
.close a .close-img.close-icon:before,
.close a .close-img.close-icon:after {
  height: 2px;
  content: "";
  position: absolute;
  height: 1px;
  width: 100%;
  top: 50%;
  left: 0;
  margin-top: -1px;
  background: #333;
}
.close:hover a .close-img {
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
  transform: scale(1.1);
}
.close:hover a .close-img.hide-icon {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAHVQTFRFNzc3MzMzMzMzLy8vMzMzNDQ0MzMzMzMzNDQ0MjIyMzMzMzMzNDQ0MzMzMTExNTU1NDQ0MTExNDQ0MzMzNDQ0OTk5MzMzAAAAQEBAMzMzMzMzMzMzMzMzLi4uMDAwMjIyMzMzNDQ0MzMzMzMzMTExAAAAMzMzukNbTQAAACZ0Uk5THMjHG76Zqr23ttHSy8QfGMEVrbAiEgUCCM66D7MLJSm/xszUKgDhmqkZAAAArUlEQVQ4y52T2RKDIAxF7V67b9q9SrT8/yeWScWIBDItT3c4Z0bJkryFk/wqFKq0scbYE14LrSyvMLrC6aqruuUYHWGz8rgjjIY+7wrbNcM7wn7HcRKyGctb4X7juRWeaYA3wuUR4l8hPwY5CudDmKMwpUvocxQmdKtYQfyE+JPyM02h5vFCyaU2zRrHmyW3Wx4YkwfxkZOHVh57szhLDbQ4wK0e0OpB+c/yeucDbViPPsz4ZnEAAAAASUVORK5CYII=")
    center center no-repeat;
  background-size: 100%;
}
.close a .close-img.close-icon:before {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

.close a .close-img.close-icon:after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.chat-content {
  position: relative;
  background-color: #fff;
  width: 100%;
  height: 460px;
  overflow-y: scroll;
  //   padding-bottom: 10px;
}
#chatbox.fullpage .chat-content {
  background-color: #fff;
  width: 100%;
  height: calc(100% - 116px);
  overflow-y: scroll;
}
.chat-ques {
  position: relative;
  width: 100%;
  background: #ffffff;
  border-top: 1px solid rgba(234, 231, 231, 1);
}
#chat-ques,
#chat-ques * {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.chat-ques .ques {
  position: relative;
  width: 100%;
  height: 72px;
  padding: 12px 14px;
  font-size: 14px;
  border: none;
  line-height: 22px;
  box-sizing: content-box;
  outline: none;
  resize: none;
}
#chatbox.fullpage .chat-ques .ques {
  height: 80px;
}
.chat-ques .ques-remind-bpx {
  position: absolute;
  width: 86.5%;
  left: 0px;
  top: -30px;
  min-height: 30px;
  background: #fff;
  z-index: 99999;
  padding: 6px 11px;
  border-radius: 4px 4px 0 0;
  display: none;
  opacity: 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
}
.chat-ques .ques-remind-bpx.show {
  display: block;
  opacity: 1;
  -webkit-transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -ms-transition: opacity 0.3s ease-in-out;
  -o-transition: opacity 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
}
.chat-ques .ques-remind-bpx ul.remind-items {
  position: relative;
  outline: none;
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
}
.chat-ques .ques-remind-bpx ul li.remind-item {
  position: relative;
  outline: none;
  display: block;
  width: 100%;
  height: 30px;
  margin: 0;
  padding: 0 6px;
  line-height: 30px;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #4a4a4a;
  font-size: 13px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.chat-ques .ques-remind-bpx ul li.remind-item .remind-hightlight {
  color: #4c95ff;
}
.chat-ques .ques-remind-bpx ul li.remind-item.current {
  background: #f5f5f5;
}
.chat-ques .ques-remind-bpx ul li.remind-item:last-child {
  border-bottom: none;
}
.tip-remind-box {
  position: fixed;
  padding: 5px 8px 5px 10px;
  margin: 0;
  line-height: 20px;
  max-width: 350px;
  color: #4a4a4a;
  font-size: 13px;
  text-align: justify;
  z-index: 99999;
  border-radius: 5px 5px 5px 0;
  display: none;
  opacity: 0;
  background-color: #fcfcfa;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
}
.tip-remind-box.show {
  display: block;
  opacity: 1;
  -webkit-transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -ms-transition: opacity 0.3s ease-in-out;
  -o-transition: opacity 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
}
#ques-remind-bpx :-webkit-scrollbar-track-piece {
  width: 0px;
  height: 0px;
}
#ques-remind-bpx ::-webkit-scrollbar-thumb {
  border-width: 0px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0);
  border-radius: 0px;
  background: #bbb;
}
#ques-remind-bpx ::-webkit-scrollbar-thumb:hover {
  background: #999;
}
#ques-remind-bpx ::-webkit-scrollbar-thumb:hover {
  background: #c3c3c3;
}
#ques-remind-bpx ::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
.chat-ques .ques::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.26);
}
.chat-ques .ques:-moz-placeholder {
  color: rgba(0, 0, 0, 0.26);
}
.chat-ques .ques::-moz-placeholder {
  color: rgba(0, 0, 0, 0.26);
}
.chat-ques .ques:-ms-input-placeholder {
  color: rgba(0, 0, 0, 0.26);
}
.chat-ques .send-btn-box {
  position: relative;
  width: 100%;
  height: 34px;
  background: #fff;
}
.chat-ques .send-btn-box .send-btn-wrap {
  position: absolute;
  top: 0;
  right: 14px;
  height: 28px;
}
.chat-ques .send-btn-box .send-btn-wrap .send-btn {
  position: relative;
  margin: 0;
  padding: 0 14px;
  border: 0;
  height: 28px;
  text-align: center;
  font-size: 15px;
  color: #999;
  cursor: pointer;
  background: #ddd;
  line-height: 28px;
  border-radius: 4px;
  outline: none;
  float: right;
}
.chat-ques .send-btn-box .send-btn-wrap .btn-typs-box {
  position: relative;
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  color: #4182fa;
  text-align: center;
  font-size: 14px;
  padding-right: 15px;
  margin-right: 20px;
  cursor: pointer;
  float: right;
}
.chat-ques .send-btn-box .send-btn-wrap .btn-typs-box:before,
.chat-ques .send-btn-box .send-btn-wrap .btn-typs-box:after {
  content: "";
  position: absolute;
  height: 1px;
  width: 5px;
  top: 50%;
  right: 0px;
  background: #4182fa;
}
.chat-ques .send-btn-box .send-btn-wrap .btn-typs-box:before {
  transform: rotate(45deg);
}
.chat-ques .send-btn-box .send-btn-wrap .btn-typs-box:after {
  left: unset;
  right: 3px;
  transform: rotate(-45deg);
}
.chat-ques .send-btn-box .send-btn-wrap.isfocus .send-btn {
  background: #4182fa;
  color: rgba(255, 255, 255, 0.8);
}
.chat-ques .send-btn-box .send-btn-wrap.isfocus .send-btn:hover {
  color: #fff;
}
.chat-ques .send-btn-box .send-btn-wrap .btn-typs-box .types_select_box {
  position: absolute;
  padding: 5px;
  display: none;
  opacity: 0;
  bottom: 27px;
  left: unset;
  right: -23px;
  z-index: 999999;
  -webkit-transition: opacity 0.2s ease-in-out;
  -moz-transition: opacity 0.2s ease-in-out;
  -ms-transition: opacity 0.2s ease-in-out;
  -o-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
}
.chat-ques
  .send-btn-box
  .send-btn-wrap
  .btn-typs-box
  .types_select_box.show_types {
  display: block;
  opacity: 1;
}
.chat-ques
  .send-btn-box
  .send-btn-wrap
  .btn-typs-box
  .types_select_box
  .show_typs_select_wrap {
  position: relative;
  padding: 5px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
}
.chat-ques
  .send-btn-box
  .send-btn-wrap
  .btn-typs-box
  .types_select_box
  .show_typs_select_wrap
  .type_select {
  position: relative;
  display: block;
  padding: 0 15px;
  border-bottom: 1px solid #f5f5f5;
  white-space: nowrap;
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
.chat-ques
  .send-btn-box
  .send-btn-wrap
  .btn-typs-box
  .types_select_box
  .show_typs_select_wrap
  .type_select:last-child {
  border-bottom: none;
}
.chat-ques
  .send-btn-box
  .send-btn-wrap
  .btn-typs-box
  .types_select_box
  .show_typs_select_wrap
  .type_select:hover,
.chat-ques
  .send-btn-box
  .send-btn-wrap
  .btn-typs-box
  .types_select_box
  .show_typs_select_wrap
  .type_select.selected_type {
  color: #4182fa;
}
.chat-ques .send-btn-box .send-btn-wrap:after {
  content: "";
  display: block;
  zoom: -1;
  clear: both;
}

.chat-item {
  position: relative;
  margin: 0px 0px 0px 10px;
  /* overflow: hidden; */
}
.chat-item:first-child {
  margin-top: 15px;
}
.chat-item .loading-wrapper {
  position: relative;
  width: 100%;
  padding-top: 20px;
  height: 50px;
}
.chat-item .loading-wrapper .typing_loader {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  -webkit-animation: typing 1s linear infinite alternate;
  -moz-animation: Typing 1s linear infinite alternate;
  animation: typing 1s linear infinite alternate;
  margin: 0px auto; /* Not necessary- its only for layouting*/
  position: relative;
  left: -12px;
}
@-webkit-keyframes typing {
  0% {
    background-color: rgba(179, 196, 210, 1);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 0.2),
      24px 0px 0px 0px rgba(179, 196, 210, 0.2);
  }
  25% {
    background-color: rgba(179, 196, 210, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 2),
      24px 0px 0px 0px rgba(179, 196, 210, 0.2);
  }
  75% {
    background-color: rgba(179, 196, 210, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 0.2),
      24px 0px 0px 0px rgba(179, 196, 210, 1);
  }
}

@-moz-keyframes typing {
  0% {
    background-color: rgba(179, 196, 210, 1);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 0.2),
      24px 0px 0px 0px rgba(179, 196, 210, 0.2);
  }
  25% {
    background-color: rgba(179, 196, 210, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 2),
      24px 0px 0px 0px rgba(179, 196, 210, 0.2);
  }
  75% {
    background-color: rgba(179, 196, 210, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 0.2),
      24px 0px 0px 0px rgba(179, 196, 210, 1);
  }
}

@keyframes typing {
  0% {
    background-color: rgba(179, 196, 210, 1);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 0.2),
      24px 0px 0px 0px rgba(179, 196, 210, 0.2);
  }
  25% {
    background-color: rgba(179, 196, 210, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 2),
      24px 0px 0px 0px rgba(179, 196, 210, 0.2);
  }
  75% {
    background-color: rgba(179, 196, 210, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(179, 196, 210, 0.2),
      24px 0px 0px 0px rgba(179, 196, 210, 1);
  }
}
.chat-item .img {
  display: block;
  width: 40px;
  height: 40px;
  margin-right: 5px;
  background: url("https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/c46ec93c9b5448792cabd092b0809afe.chatwin-qa-icon-6x.png")
    center center no-repeat;
  background-size: 100%;
}
.chat-item .ques-img {
  display: block;
  width: 30px;
  height: 30px;
  margin-right: 5px;
  border-radius: 15px;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.fc {
  clear: both;
}
.item-content {
  position: relative;
  width: auto;
  max-width: 70%;
  font-size: 13px !important;
  color: #333333;
  line-height: 20px !important;
  background-color: #fcfcfc;
  padding: 0px;
  margin-bottom: 15px;
  border-radius: 0 12px 12px 12px;
  word-break: break-all;
  word-wrap: break-word;
  text-align: justify;
}
@-webkit-keyframes tipshadow {
  0% {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  25% {
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
  }
  75% {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

@-moz-keyframes tipshadow {
  0% {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  25% {
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
  }
  75% {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

@keyframes tipshadow {
  0% {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  25% {
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
  }
  75% {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}
.item-content.tip-shadow {
  -webkit-animation: tipshadow 0.5s 3;
  -moz-animation: tipshadow 0.5s 3;
  animation: tipshadow 0.5s 3;
}
.item-content.feedback {
  margin-bottom: 40px;
}
.item-content.feedback .praise-wrap {
  position: absolute;
  display: block;
  min-width: 162px;
  width: 100%;
  height: 19px;
  bottom: -18px;
  left: 0;
}
.praise-wrap span.praise-btn {
  position: relative;
  display: inline-block;
  height: 13px;
  float: right;
  margin-top: 6px;
  line-height: 13px;
  color: #999;
  font-size: 12px;
  margin-left: 15px;
  padding-left: 19px;
  cursor: pointer;
}
.praise-wrap span.praise-translate {
  margin-left: 0;
}
.praise-wrap span.praise-btn:hover {
  color: #48a3ff;
}
.praise-wrap.is-selected span.praise-btn:hover {
  position: relative;
  display: inline-block;
  height: 13px;
  float: right;
  margin-top: 6px;
  line-height: 13px;
  color: #b3c4d2;
  font-size: 12px;
  margin-left: 15px;
  padding-left: 19px;
  cursor: default;
}
.praise-wrap.is-selected span.praise-translate:hover {
  color: #48a3ff;
}
.praise-wrap.is-selected span.praise-btn.selected,
.praise-wrap.is-selected span.praise-btn.selected:hover {
  color: #48a3ff;
}
.praise-wrap span.praise-translate:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAnCAMAAABQShoEAAAABGdBTUEAALGPC/xhBQAAAPxQTFRFmpqaoaGhmZmZmpqamZmZnZ2dmpqamZmZm5ubmpqampqamZmZmZmZnp6emZmZmpqampqampqaoqKim5ubmZmZmZmZm5ubnZ2dmZmZmpqampqanZ2dmZmZmZmZmZmZmpqamZmZmpqampqampqamZmZmpqampqamZmZmpqan5+fmpqampqamZmZmpqamZmZmpqaoaGhm5ubmZmZmZmZmZmZmpqampqampqamZmZmpqampqampqamZmZnJycmpqamZmZmZmZmpqam5ubnJycmpqampqampqan5+fn5+f////nZ2dm5ubqqqqmZmZmZmZnZ2dm5ubqqqqAAAAmZmZErphBwAAAFN0Uk5T0RPs7xQvuu4zz8zS6xUt1OrWFhfX5yknGdnlGtrk+8XQuGpbCj/+BUwQ96ni8nuaGyGgwYyrpHf9iZxi4RL09vNoQDHjK+glGAI0ZgNBqA1CBgA6jKq1AAAA10lEQVQ4y+3UR1MCQRAF4EUQRCQIKiDRRBDJKEgS2AWW7Pb7//+Fm+xhqMeRg32aqf4O06+rRhNlRYxr/XDTbJ3N5O/4CzivVMj6Ga5tCB5dgXaAdUBuLy4uGdo6NNwEGBKXD6EpQ+IPYvbAkIRvcR9lSMw7PM4ZklgcqTpDkkiiQZHUmj2O6HT/6LzRdHkCMjorjr6ANkXWJ/BNH77oAtUFna4FlPI0ggrw9Epzes4hU6RhvqSRndPEC+/44Gt5K8OGzP5KubvlDKO1+ge1LXgw3ghFx2sPRzSzWkymEjoAAAAASUVORK5CYII=")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap span.praise-ok:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABxElEQVR4AayTNb9UMRDFF3f3ig53tx53dyqooMZdG7R6Da7Pk+CWK8GvTfjRIN+FM89lffe6/jOZc04q0yI9u1Ya+0AaulDpRSNSpSz1brxC+faf9JKDytiH0qeXp7XuXjSQAcLQXr5mkDL0U3yk8UXBKisrewIY1rrhxDYDGFS9qChgRUXQA737UatpSgvQULU0yYGSpsx9bL4XLq2RvqX7b6hfXgAhzAD8sF/5yRXeUeEf3F9u80kX5dM9HqhSfx+dvWfvgkFQVONjBdAZ4dNpCHJEerSx7Xc3X77spTx7CwP9aoKfl048ly3FbhA6mpPihXuDl6/ybQf3FsBD+Oc+4E7Nh2gsrt/juq65X+c7TC+/NrnJTIC/8jXOqyFcfXMi9rGKRZh/EVr0ueHao00tFXIfMMI3+K9bQRV68WIU4nYCKh0MV4ZsjReMKQvw9OnTXaHyJ2WSJeUANgvzmNUuGxAVHmePlQ0IMy/j/HIi8gbCyOi91xLNtsA7Wvdmc2Ovqfdpj3DjnR13tGQLVyJ8u5nPSMdJBtbpeLD06Joy9nmaPNMxhuJD0XFn43IVLTu8y5XVfQj+TxlcGh2+EMtACwAA9liXB5IsIrEAAAAASUVORK5CYII=")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap span.praise-no:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABwklEQVR4AbWTs59fQRTFd2ObTWzbfWw7VVIldWw2YbVNzJ9nJtY8TPx0J580wf+Sc4O18fwG36tzi1rsEMJ0lT4dwp1VhkTlWxoqSN/mS29DGeHSivybYDh/Sz/ZXgq7oXUHgJ4xrODTDuHGWyvf0iQbCh6tE75dz2/pJUdhyMvruIf06JIy9nGZdz4tksZ+wWdxvSPS0QwG8jd7yl6XTirfHlaevdagFHnxfITq8jd7XAGIUO8jpD3NAjx+/HgrePhOmWRBswCVDvogFzbrBQObBSideKby6VMqlWrdPEDP7mIdNVS3BTeeB2W8rwr06TR+zje4EdxkKiL7yN94L2fh/wWiuizq+oJymiYAsA97bsMRJ/smGozv16Uepl4F3VFljUGFEE5A5MeFoQNQ/9ryoKtPn7ZnrWLjNwBvcWSc/5QX9UXX7GWhV+pju1v5yQW+Af5RKQ3F/yBPU/rzgKKGHrwRSV/C3+Vai26/oM4NhpWUBG25rzlXpQaggoZ2UukBPbaDh2HODceW89iwTBrDKw1ZGNrJ38e1bqMMfRVvaXSjgZw/VP4XV08Ze5cNMLjRwH8dtBK5vIP8nWFp1Hffb1bXlweJ+BqWAAAAAElFTkSuQmCC")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap span.praise-translate:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAnCAMAAABQShoEAAAABGdBTUEAALGPC/xhBQAAAPxQTFRFQoP7QoP6TYz/QYL7QYL6QYL/Q4b/QYP7QoL7QYP6QYL6QYL7QoP6RIL/SYb/QYP7QoP6Rov/QoP6Q4X/RIP/QYL6QYL7QoL6QoL7R4X/QYP/RYn/QoP6QoP7QYL7QYL7Q4T6QYL7Q4P8RYb7UI//Q4T8QYP7QoP6QoP7Zpn/TZn/QoP6QYP6QYP7QoP7QoP6QoT/RoP/QoP7QYP6QoP7QYP6QoL7QoP7QoP7QYL7QYP6QYL8QoL6R47/QYP7QoP7QoT6QYL7RIP7RIL/QYL7QYL/QoP7RYP/Sor/gP//RYT6QYL6Var/Q4X7QYP6Ton/QoP7Var/AAAAQYL6jed4sQAAAFN0Uk5T7NEU7zMvE+66z8zr0i0V6tQW1hcp1+fZ5RknGtrk9/tquEw/EFv+0MUFCqni8nuaGyHBoIyk/XeriZxi4RL29GjzQDHjK+glGAI0ZgNBqA1CBgCijjkOAAAA10lEQVQ4y+3UR1MCQRAF4EUQRCQIKiDRRBDJKEgS2AWW7Pb7//+Fm+xhqMeRg32aqf4O06+rRhNlRYxr/XDTbJ3N5O/4CzhdKmQNf9Y2BI+uQDvAOqArL7RLhrZuB3x+huTiBsEpQxIIYXbHkNyG8fDIkJj3iM0ZkngUqTpDkkiiSZHUGj2O6HT/6LzRdHkCMr5WHH0CbYqsDvBNH77oAtUFna4FlIo0ggrw9E5zyuZQeKVhvmWQn9PEn9P44Gt5KcOGzP5KubvlDOO1+ge1LXgw2ghFx2sPSvqzWpsHmqoAAAAASUVORK5CYII=")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap span.praise-ok:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABqklEQVR4AbWTw7scURTEb2x7E9u2ze6OjVVmlaxjcxNuYvft2Lb1rM3D31Kvztie83017d/UObeuilVLbJiWxm3TwdEF19BBZVKmjYWE1VDbTI07loPX0w+gftpAARgam+VcQLwuM26jX1qwQQfQkICCRbcwwO/YwU/zNiamBRx1EQ3YZh6Bg/1AjYeUK6OWZY6+a8OBQWDJ3FtolhTAuIoWlo2tnNtJEVusok4of6EOgTfljxZeR+e4sNkX0Yoff+HLL/jRQYIPELrT0lge/N6Cc2jEd87znQqBU0eW3MEYiZSkgV2M9s3HRb1RSZbMlga2U7cI+rrQRjeefyTjiQ94xN9eCkVHI/jtXy9jCd0/VVJscYusYqpAiREd/vbGaoXfocyBD/6plaiXksM7mETIt0igRntelM67jS5ZAaoDqMsbvwienB0giy1rWe2sAblieyRj2QNqzJf9KzsihdiMJui7f2sGA6dfR2MJN10+Mm1sMmysDxdnvEqc8Hyl19E+AVrX0ZqGTvP6ZcR+5s3dAuXxWbgkuOIiSA/F2YIb6CXnzPNGlYuqBTbTagPATPPzAAAAAElFTkSuQmCC")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap span.praise-no:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABp0lEQVR4AbWUg69cURDGz9Y2g9q2cVHbVtSN2jipbZsXdVDbth207/0t3/tmbe8kc3x+gzvnqqLJYBs1DQerqVepN2PVdHDDcHE9qKaLK7qNScZJtJaxYWFhCKZtQBUu3hcYDy3SbMyPVa7PInQGYTOlp67j+VfaftTh2n7evxMGWhjDA5+VgkdlKDTSR4AyFk/F69AmN9ZQD6ssRLcwmJCXMhaPY4GXuOgtDHADyhH4liEMKQhQO4kGXPg19CSaFgQ43EVfTj6qmShfEKBhY4nUkcpSmKZBBL2LBzrYQt2RLXCYhZ6890HGhE2UwlcBuleKOuP6s9BFd7CckHMEvjAsNOf4ScjD3idRm8DnBN/mwY1MwQb2K1ms0yNBbQ6hstQq9S/PnpXIJP9DHTTknWVS6FHvmJCl1J2iPPw/Og3wBCD3tKNoorIVuai7GCfjiKf1s9tuVM8axhRUlHctuQquSRWEXlK20nkDKtHDr8NOo2PIYxdvpExUruLLlYPFgV9bBc5/M+z2OQMlfwyxVL4ew70gBgSs8hHdwWSCztOzrVIamd4rA0IbXhFrL2bHAAAAAElFTkSuQmCC")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap.is-selected span.praise-translate:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAnCAMAAABQShoEAAAABGdBTUEAALGPC/xhBQAAAPxQTFRFQoP7QoP6TYz/QYL7QYL6QYL/Q4b/QYP7QoL7QYP6QYL6QYL7QoP6RIL/SYb/QYP7QoP6Rov/QoP6Q4X/RIP/QYL6QYL7QoL6QoL7R4X/QYP/RYn/QoP6QoP7QYL7QYL7Q4T6QYL7Q4P8RYb7UI//Q4T8QYP7QoP6QoP7Zpn/TZn/QoP6QYP6QYP7QoP7QoP6QoT/RoP/QoP7QYP6QoP7QYP6QoL7QoP7QoP7QYL7QYP6QYL8QoL6R47/QYP7QoP7QoT6QYL7RIP7RIL/QYL7QYL/QoP7RYP/Sor/gP//RYT6QYL6Var/Q4X7QYP6Ton/QoP7Var/AAAAQYL6jed4sQAAAFN0Uk5T7NEU7zMvE+66z8zr0i0V6tQW1hcp1+fZ5RknGtrk9/tquEw/EFv+0MUFCqni8nuaGyHBoIyk/XeriZxi4RL29GjzQDHjK+glGAI0ZgNBqA1CBgCijjkOAAAA10lEQVQ4y+3UR1MCQRAF4EUQRCQIKiDRRBDJKEgS2AWW7Pb7//+Fm+xhqMeRg32aqf4O06+rRhNlRYxr/XDTbJ3N5O/4CzhdKmQNf9Y2BI+uQDvAOqArL7RLhrZuB3x+huTiBsEpQxIIYXbHkNyG8fDIkJj3iM0ZkngUqTpDkkiiSZHUGj2O6HT/6LzRdHkCMr5WHH0CbYqsDvBNH77oAtUFna4FlIo0ggrw9E5zyuZQeKVhvmWQn9PEn9P44Gt5KcOGzP5KubvlDOO1+ge1LXgw2ghFx2sPSvqzWpsHmqoAAAAASUVORK5CYII=")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap.is-selected span.praise-ok:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABxElEQVR4AayTNb9UMRDFF3f3ig53tx53dyqooMZdG7R6Da7Pk+CWK8GvTfjRIN+FM89lffe6/jOZc04q0yI9u1Ya+0AaulDpRSNSpSz1brxC+faf9JKDytiH0qeXp7XuXjSQAcLQXr5mkDL0U3yk8UXBKisrewIY1rrhxDYDGFS9qChgRUXQA737UatpSgvQULU0yYGSpsx9bL4XLq2RvqX7b6hfXgAhzAD8sF/5yRXeUeEf3F9u80kX5dM9HqhSfx+dvWfvgkFQVONjBdAZ4dNpCHJEerSx7Xc3X77spTx7CwP9aoKfl048ly3FbhA6mpPihXuDl6/ybQf3FsBD+Oc+4E7Nh2gsrt/juq65X+c7TC+/NrnJTIC/8jXOqyFcfXMi9rGKRZh/EVr0ueHao00tFXIfMMI3+K9bQRV68WIU4nYCKh0MV4ZsjReMKQvw9OnTXaHyJ2WSJeUANgvzmNUuGxAVHmePlQ0IMy/j/HIi8gbCyOi91xLNtsA7Wvdmc2Ovqfdpj3DjnR13tGQLVyJ8u5nPSMdJBtbpeLD06Joy9nmaPNMxhuJD0XFn43IVLTu8y5XVfQj+TxlcGh2+EMtACwAA9liXB5IsIrEAAAAASUVORK5CYII=")
    center center no-repeat;
  background-size: 12px 12px;
}

.praise-wrap.is-selected span.praise-no:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABwklEQVR4AbWTs59fQRTFd2ObTWzbfWw7VVIldWw2YbVNzJ9nJtY8TPx0J580wf+Sc4O18fwG36tzi1rsEMJ0lT4dwp1VhkTlWxoqSN/mS29DGeHSivybYDh/Sz/ZXgq7oXUHgJ4xrODTDuHGWyvf0iQbCh6tE75dz2/pJUdhyMvruIf06JIy9nGZdz4tksZ+wWdxvSPS0QwG8jd7yl6XTirfHlaevdagFHnxfITq8jd7XAGIUO8jpD3NAjx+/HgrePhOmWRBswCVDvogFzbrBQObBSideKby6VMqlWrdPEDP7mIdNVS3BTeeB2W8rwr06TR+zje4EdxkKiL7yN94L2fh/wWiuizq+oJymiYAsA97bsMRJ/smGozv16Uepl4F3VFljUGFEE5A5MeFoQNQ/9ryoKtPn7ZnrWLjNwBvcWSc/5QX9UXX7GWhV+pju1v5yQW+Af5RKQ3F/yBPU/rzgKKGHrwRSV/C3+Vai26/oM4NhpWUBG25rzlXpQaggoZ2UukBPbaDh2HODceW89iwTBrDKw1ZGNrJ38e1bqMMfRVvaXSjgZw/VP4XV08Ze5cNMLjRwH8dtBK5vIP8nWFp1Hffb1bXlweJ+BqWAAAAAElFTkSuQmCC")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap.is-selected span.praise-translate.selected:before,
.praise-wrap.is-selected span.praise-translate.selected:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAnCAMAAABQShoEAAAABGdBTUEAALGPC/xhBQAAAPxQTFRFQoP7QoP6TYz/QYL7QYL6QYL/Q4b/QYP7QoL7QYP6QYL6QYL7QoP6RIL/SYb/QYP7QoP6Rov/QoP6Q4X/RIP/QYL6QYL7QoL6QoL7R4X/QYP/RYn/QoP6QoP7QYL7QYL7Q4T6QYL7Q4P8RYb7UI//Q4T8QYP7QoP6QoP7Zpn/TZn/QoP6QYP6QYP7QoP7QoP6QoT/RoP/QoP7QYP6QoP7QYP6QoL7QoP7QoP7QYL7QYP6QYL8QoL6R47/QYP7QoP7QoT6QYL7RIP7RIL/QYL7QYL/QoP7RYP/Sor/gP//RYT6QYL6Var/Q4X7QYP6Ton/QoP7Var/AAAAQYL6jed4sQAAAFN0Uk5T7NEU7zMvE+66z8zr0i0V6tQW1hcp1+fZ5RknGtrk9/tquEw/EFv+0MUFCqni8nuaGyHBoIyk/XeriZxi4RL29GjzQDHjK+glGAI0ZgNBqA1CBgCijjkOAAAA10lEQVQ4y+3UR1MCQRAF4EUQRCQIKiDRRBDJKEgS2AWW7Pb7//+Fm+xhqMeRg32aqf4O06+rRhNlRYxr/XDTbJ3N5O/4CzhdKmQNf9Y2BI+uQDvAOqArL7RLhrZuB3x+huTiBsEpQxIIYXbHkNyG8fDIkJj3iM0ZkngUqTpDkkiiSZHUGj2O6HT/6LzRdHkCMr5WHH0CbYqsDvBNH77oAtUFna4FlIo0ggrw9E5zyuZQeKVhvmWQn9PEn9P44Gt5KcOGzP5KubvlDOO1+ge1LXgw2ghFx2sPSvqzWpsHmqoAAAAASUVORK5CYII=")
    center center no-repeat;
  background-size: 12px 12px;
}
.praise-wrap.is-selected span.praise-ok.selected:before,
.praise-wrap.is-selected span.praise-ok.selected:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABd0lEQVR4AcTTM3xdURwH8BpTbRt7uTzz3lvbGIv907Vb3bUMD5Ix+5IlzpQ5Ng9i/0/0bL93fb9Hv/+qnHy0YrZNQ/yJF/GHrj98e9pQg4hKg8o59deJrDOQ2Jk6TPi7ZdSHi5cpwwDREBjzj6nDRJQFw3Dtf8owDPt3KCw7bKhnT8LYlW9tm92F4oynSJ7XqPgcAsNfp6JUPRc36iVChx416FSOw34SkIkQ2LeI5RqRtyAlZ50F3bvV++b/Q1v1Yn7K/L9pk3+0jhtUDIUgsf+q8U7o1Gno0E+I5JgXixc+GItXSaArfw1zDUbxb+Ec8/c+GInnqcAG4R5IzJ/FaeJvffOL+SUYymzyMHOGhVWEYI77k54KOmQJC6+6W7IWklCfVthXEBKnCP8PC0MyPiQLexCzQseKwsIwxzcyAnuKBg4mVySAYWYLC/tiJ15A0HnCcDG/CHvqK5AwH1X/MN+vVctx/bG8o1IF71xV584Cdmx+DLQEAHJsGqnQ9oIXAAAAAElFTkSuQmCC")
    center center no-repeat;
  background-size: 13px 13px;
}
.praise-wrap.is-selected span.praise-no.selected:before,
.praise-wrap.is-selected span.praise-no.selected:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 13px;
  height: 13px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABcUlEQVR4AWKgG/AF0FLXcFPDYBjAcZlwd5cdXc41Ce4uI7L/WNlw1nNt3sDIvrDgTMy4a/MG9+ZwcvdJZai3/1qex8L5hONeCnJ/jyau1vVZf6Y/4bhcbydr9gwDzXLcRQElE+pbbybalIudpWhtc3nwHzTTeDGZCXzVW7QFcztGQTX0un7qf2AHXeUG1VPGsqMdYcLxUCAwBcXdwkS8ijDAsgHrv8pAXfcIFww4Zj0ZxwQ+9x3OcrmECvXVLczATraFiYU7XaN6AplpD3Pc4wUmXBIKWDICQpr2TJfh+OBMD7OAc6lQpymodzq9/8YZkDJQN6hQ753lR31RJ5ACnieg1uheSdYej9XXh8uvhtOmnBMu3xpidMWyE/eGpus4L9NQC4nAo21RgWf1ea5bjgLmDRjUAz00vdUn4DkTxrL3XhZKmC0mD3uGCcgDBgy42zvctEcwwIt/UHWNWTjaJWfixJLbspbcnCrI7xNiGAwAAAkMGqn5GuddAAAAAElFTkSuQmCC")
    center center no-repeat;
  background-size: 13px 13px;
}

.item-content.feedback:hover .praise-wrap {
  display: block;
}
.item-content-right {
  background-color: #469cff;
  color: #fff;
  text-align: left;
  margin-right: 5px;
  border-radius: 12px 0 12px 12px;
  border: none;
  padding: 10px 14px;
}
.details {
  position: relative;
  overflow: hidden;
  height: auto;
}
.details.hide-show {
  max-height: 212px !important;
  overflow: hidden;
}
.details.title-hide-show {
  overflow: hidden;
}
.details-child a {
  color: #469cff !important;
}
.details-child a:hover {
  text-decoration: underline !important;
}
.details-content .item-msg-warp {
  position: relative;
  margin: 12px 14px;
}
.flay-try-ques,
.timer-options {
  padding: 14px;
  padding-top: 0px;
}
.details-content .item-msg-warp.onlyimg {
  margin: 0;
}
.item-msg-warp font {
  color: #b1b1b1;
}
.item-msg-warp img.answer-img {
  position: relative;
  display: block;
  margin: 0px auto;
  margin-top: 15px;
  max-width: 100%;
  height: auto;
  cursor: pointer;
  border: 0;
  -ms-interpolation-mode: bicubic;
  vertical-align: middle;
}
.details-content .item-msg-warp.onlyimg img.answer-img {
  margin: 0 auto;
  margin-buttom: 0;
}
.source {
  display: block;
  font-size: 12px !important;
  min-height: 20px;
  line-height: 20px !important;
  margin: 0px 14px 14px 12px;
}
.source-click {
  cursor: pointer;
  color: #469cff !important;
}
.source-click:hover {
  text-decoration: underline !important;
}
.source-unclick {
  cursor: default;
  color: #b1b1b1 !important;
  text-decoration: none;
}
.details-content .video-msg-warp {
  position: relative;
  padding: 0;
  margin: 0;
  min-height: 67px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.details-content .video-msg-warp.padding-warp {
  position: relative;
  margin: 12px 14px;
}
.video-msg-warp.padding-warp .video-msg-subtitle {
  position: relative;
  display: block;
  line-height: 20px;
  font-size: 13px;
  color: #333333;
  text-align: justify;
}
.video-msg-warp.padding-warp .video-msg-subtitle._margin-bottom {
  margin-bottom: 6px;
}
.video-msg-warp.padding-warp .video-msg-subtitle a.video-msg-subtitle-btn {
  position: relative;
  color: #469cff;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}
.details-content .video-msg-warp .video-msg-warp-video {
  position: relative;
  display: block;
  padding: 0;
  margin: 0;
}
.video-msg-warp .video-msg-warp-video img.video-poster {
  position: relative;
  display: block !important;
  margin: 0px auto;
  margin-bottom: 0px;
  max-width: 100%;
  height: auto;
  cursor: pointer;
  border: 0;
  -ms-interpolation-mode: bicubic;
  vertical-align: middle;
}
.video-msg-warp .video-msg-warp-video img.video-poster.hide {
  opacity: 0;
}
.video-msg-warp .video-msg-warp-video .video-msg-video-box {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.video-msg-warp .video-msg-warp-video .video-msg-play-btn {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  cursor: pointer;
  z-index: 100;
  display: inline;
}
.video-msg-warp-video .video-msg-play-btn .video-msg-play-btn-arr {
  position: absolute;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.65)
    url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMTYgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uL+aSreaUviAyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTIzLjc4NjQ0NDUsMTcuOTMwMTE4OCBMMTMuMzE4NjU2LDI1LjE2MzY1ODcgQzEyLjIxOTM4OCwyNS45MjMyODQyIDEwLjY5MTczMTcsMjUuNjc2OTY0OSA5LjkwNjU0MDMxLDI0LjYxMzQ4OTIgQzkuNjEwMjIyMjYsMjQuMjEyMTUxNCA5LjQ1MDkzMDM3LDIzLjczMTI3MTEgOS40NTA5MzAzNywyMy4yMzgwNjU2IEw5LjQ1MDkzMDM3LDguNzcwOTg1OTYgQzkuNDUwOTMwMzcsNy40NjQwNzY4NCAxMC41NDYwNDY3LDYuNDA0NjE3NjggMTEuODk2OTQxMSw2LjQwNDYxNzY4IEMxMi40MDY3NDYsNi40MDQ2MTc2OCAxMi45MDM4MTA3LDYuNTU4NzIzIDEzLjMxODY1Niw2Ljg0NTM5Mjg4IEwyMy43ODY0NDQ1LDE0LjA3ODkzMjcgQzI0Ljg4NTcxMjUsMTQuODM4NTU4MiAyNS4xNDAzMjE5LDE2LjMxNjQ3MzcgMjQuMzU1MTMwNSwxNy4zNzk5NDk0IEMyNC4xOTgyNDQyLDE3LjU5MjQzODcgMjQuMDA2MDg1MywxNy43NzgzNDA4IDIzLjc4NjQ0NDUsMTcuOTMwMTE4OCBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5o6n5Lu2L+aSreaUvuWZqC/op4bpopEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNS4wMDAwMDAsIC05My4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Imljb24v5pKt5pS+LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LjAwMDAwMCwgODcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbi/mkq3mlL4iPgogICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0iTWFzayIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJldmVub2RkIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iY29sb3Iv6YCa55SoL2ZmZmZmZiIgbWFzaz0idXJsKCNtYXNrLTIpIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==")
    16px center no-repeat;
  background-size: 20px 20px;
  z-index: 2;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 50px;
  height: 50px;
  top: 50%;
  left: 50%;
  margin-top: -25px;
  margin-left: -25px;
  pointer-events: auto;
  border-radius: 40px;
}
.video-msg-warp-video
  .video-msg-play-btn
  .video-msg-play-btn-arr.blue_play_btn {
  background: rgba(65, 130, 250, 0.8)
    url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMTYgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzLjIgKDcyNjQzKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uL+aSreaUviAyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTIzLjc4NjQ0NDUsMTcuOTMwMTE4OCBMMTMuMzE4NjU2LDI1LjE2MzY1ODcgQzEyLjIxOTM4OCwyNS45MjMyODQyIDEwLjY5MTczMTcsMjUuNjc2OTY0OSA5LjkwNjU0MDMxLDI0LjYxMzQ4OTIgQzkuNjEwMjIyMjYsMjQuMjEyMTUxNCA5LjQ1MDkzMDM3LDIzLjczMTI3MTEgOS40NTA5MzAzNywyMy4yMzgwNjU2IEw5LjQ1MDkzMDM3LDguNzcwOTg1OTYgQzkuNDUwOTMwMzcsNy40NjQwNzY4NCAxMC41NDYwNDY3LDYuNDA0NjE3NjggMTEuODk2OTQxMSw2LjQwNDYxNzY4IEMxMi40MDY3NDYsNi40MDQ2MTc2OCAxMi45MDM4MTA3LDYuNTU4NzIzIDEzLjMxODY1Niw2Ljg0NTM5Mjg4IEwyMy43ODY0NDQ1LDE0LjA3ODkzMjcgQzI0Ljg4NTcxMjUsMTQuODM4NTU4MiAyNS4xNDAzMjE5LDE2LjMxNjQ3MzcgMjQuMzU1MTMwNSwxNy4zNzk5NDk0IEMyNC4xOTgyNDQyLDE3LjU5MjQzODcgMjQuMDA2MDg1MywxNy43NzgzNDA4IDIzLjc4NjQ0NDUsMTcuOTMwMTE4OCBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5o6n5Lu2L+aSreaUvuWZqC/op4bpopEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNS4wMDAwMDAsIC05My4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Imljb24v5pKt5pS+LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LjAwMDAwMCwgODcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbi/mkq3mlL4iPgogICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0iTWFzayIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJldmVub2RkIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iY29sb3Iv6YCa55SoL2ZmZmZmZiIgbWFzaz0idXJsKCNtYXNrLTIpIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==")
    16px center no-repeat;
  background-size: 20px 20px;
  display: none;
}
.video-msg-warp-video .video-msg-play-btn .video-msg-play-btn-arr._opacity {
  filter: alpha(opacity=0);
  -moz-opacity: 0;
  -khtml-opacity: 0;
  opacity: 0;
}
.video-msg-warp .video-msg-title {
  position: absolute;
  width: 100%;
  height: 26px;
  left: 0;
  bottom: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  line-height: 26px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 10px;
  padding-right: 10px;
  margin: 0;
  z-index: 2;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.details-content .simple-audio {
  position: relative;
  display: block;
  padding: 0;
  margin: 5px auto;
}
.details-content .simple-audio:after {
  content: "";
  clear: both;
  display: block;
}
.fold-show {
  position: absolute;
  display: block;
  height: 20px;
  width: 45px;
  right: 7px;
  bottom: 0px;
  cursor: pointer;
  background: #fff;
}
.fold-show .ellipsis {
  position: absolute;
  display: inline-block;
  top: 0;
  left: 0;
  height: 17px;
  line-height: 17px;
  padding: 0 5px;
  text-align: center;
  color: #333333;
}
.fold-show .arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #469cff;
  right: 2px;
  bottom: 3px;
}
.fold-hide {
  position: absolute;
  display: block;
  height: 15px;
  width: 36px;
  right: 2px;
  bottom: -3px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.3);
}
.fold-hide .ellipsis {
  display: none;
}
.fold-hide .arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #469cff;
  right: 8px;
  bottom: 5px;
}
.xt_question {
  display: block;
  cursor: pointer;
  color: #469cff !important;
  font-size: 13px !important;
  line-height: 20px !important;
}
.xt_question:hover {
  text-decoration: underline;
}
a.timer {
  display: inline-block;
  text-decoration: none;
  margin-right: 55px;
  color: #469cff !important;
  margin-top: 5px;
}
.image-view-box {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  overflow: auto;
  background: rgba(0, 0, 0, 0.7);
}
.image-view-box .loading,
.video-msg-video-box .loading {
  position: absolute;
  width: 62px;
  height: 44px;
  left: 50%;
  top: 50%;
  display: none;
  margin-left: -31px;
  margin-top: -22px;
}
.image-view-box .loading > div,
.video-msg-video-box .loading > div {
  background-color: #fff;
  width: 4px;
  height: 35px;
  border-radius: 2px;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  display: inline-block;
  -webkit-animation: line-scale-pulse-out 0.9s 0s infinite
    cubic-bezier(0.85, 0.25, 0.37, 0.85);
  animation: line-scale-pulse-out 0.9s 0s infinite
    cubic-bezier(0.85, 0.25, 0.37, 0.85);
}
.image-view-box .loading > div:nth-child(1),
.image-view-box .loading > div:nth-child(5),
.video-msg-video-box .loading > div:nth-child(1),
.video-msg-video-box .loading > div:nth-child(5) {
  -webkit-animation-delay: 0.4s !important;
  animation-delay: 0.4s !important;
}
.image-view-box .loading > div:nth-child(2),
.image-view-box .loading > div:nth-child(4),
.video-msg-video-box .loading > div:nth-child(2),
.video-msg-video-box .loading > div:nth-child(4) {
  -webkit-animation-delay: 0.2s !important;
  animation-delay: 0.2s !important;
}
@-webkit-keyframes line-scale-pulse-out {
  0% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }

  50% {
    -webkit-transform: scaley(0.4);
    transform: scaley(0.4);
  }

  100% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }
}

@keyframes line-scale-pulse-out {
  0% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }

  50% {
    -webkit-transform: scaley(0.4);
    transform: scaley(0.4);
  }

  100% {
    -webkit-transform: scaley(1);
    transform: scaley(1);
  }
}
.image-view-box .close-image-view {
  position: absolute;
  display: block;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  overflow: hidden;
}
.image-view-box .close-image-view:before,
.image-view-box .close-image-view:after {
  height: 1px;
  content: "";
  position: absolute;
  height: 1px;
  width: 100%;
  top: 50%;
  left: 0;
  margin-top: -1px;
  background: #fff;
}
.image-view-box .close-image-view:before {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

.image-view-box .close-image-view:after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.image-view-box .close-image-view:hover:before,
.image-view-box .close-image-view:hover:after {
  background: #1ebcc5;
}
.image-view-box .video-box {
  background: #fff;
  border-radius: 3px;
  padding: 0;
  margin: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  zoom: -1;
  overflow: hidden;
  clear: both;
}
.image-view-box .video-box .video-play-box {
  position: relative;
  padding: 20px;
  float: left;
  height: auto;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.image-view-box .video-box .video-play-box .qa-video-chap-title-source {
  position: relative;
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
}
.qa-video-chap-title-source .qa-video-chap-title {
  position: relative;
  display: block;
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  text-align: left;
  color: #000;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.qa-video-chap-title-source .qa-video-chap-source {
  position: relative;
  display: block;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  text-align: left;
  color: #747474;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.image-view-box .video-box .video-play-box .qarobot-video-wrap {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.image-view-box .video-box .video-info-box {
  position: relative;
  padding: 20px;
  box-shadow: -1px 0 26px rgba(0, 0, 0, 0.1);
  float: left;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.video-box .video-info-box .info-title {
  position: relative;
  width: 100%;
  line-height: 22px;
  max-height: 44px;
  overflow: hidden;
  text-align: left;
  color: #000;
  font-size: 18px;
  margin-bottom: 20px;
}
.video-info-box img.info-poster {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  margin: 0px auto;
  margin-bottom: 10px;
  border-radius: 2px;
}
.video-info-box .org_name,
.video-info-box .total_enrollment_number,
.video-info-box .desc {
  position: relative;
  display: block;
  width: 100%;
  line-height: 18px;
  font-size: 12px;
  text-align: left;
  color: #4a4a4a;
}
.video-info-box .org_name,
.video-info-box .total_enrollment_number {
  margin-bottom: 10px;
}
.video-info-box .desc {
  overflow: hidden;
  max-height: 90px;
}
.video-info-box .goto-about {
  position: relative;
  display: block;
  width: 210px;
  height: 43px;
  line-height: 43px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  margin-top: 25px;
  background: #3171eb;
  // background: -webkit-gradient(linear, 0 0, 0 0, from(#24BAFD), to(#3171EB));
  // background: -webkit-linear-gradient(left, #24BAFD, #3171EB);
  // background: -moz-linear-gradient(left, #24BAFD, #3171EB);
  // background: -o-linear-gradient(left, #24BAFD, #3171EB);
  // background: -ms-linear-gradient(left, #24BAFD, #3171EB);
  // background: linear-gradient(left, #24BAFD, #3171EB);
  // filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = #24BAFD, endColorstr = #3171EB);
  color: #ffffff;
  text-shadow: none;
  text-decoration: none;
}
.video-info-box .goto-about:hover {
  background: #24bafd;
  // background: -webkit-gradient(linear, 0 0, 0 0, from(#24BAFD), to(#3171EB));
  // background: -webkit-linear-gradient(left, #24BAFD, #3171EB, #3171EB);
  // background: -moz-linear-gradient(left, #24BAFD, #3171EB, #3171EB);
  // background: -o-linear-gradient(left, #24BAFD, #3171EB, #3171EB);
  // background: -ms-linear-gradient(left, #24BAFD, #3171EB, #3171EB);
  // background: linear-gradient(left, #24BAFD, #3171EB, #3171EB);
  // filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = #24BAFD, endColorstr = #3171EB);
}
/*******视频扩谱图知识点样式********/
#qa,
#qa:before,
#qa:after {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
  padding: 0;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  -ms-font-smoothing: antialiased;
  -o-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}
#qa *,
#qa *:before,
#qa *:after {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

#qa h2 {
  position: relative;
  margin: 15px 0;
  color: #666;
  font-size: 16px;
}
#qa {
  position: relative;
  width: 100%;
  margin: 0px auto;
  transition: all 3s;
  -webkit-transition: all 3s;
}
#doms {
  transition: all 3s;
  -webkit-transition: all 3s;
  min-height: 300px;
}
.listStyle {
  position: relative;
  list-style: none;
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  margin-top: 18px;
  margin-bottom: 10px;
  padding-left: 0 !important;
}

.listStyle li {
  position: relative;
  display: block;
  float: left;
  margin-right: 20px;
  margin-bottom: 15px;
  padding: 0px 18px;
  height: 32px;
  line-height: 32px;
  border-radius: 32px;
  border: 1px solid rgb(221, 219, 219);
  cursor: pointer;
  color: #333;
  font-size: 14px;
}
.listStyle li label {
  position: absolute;
  display: none;
  bottom: -10px;
  left: 50%;
  margin-left: -5px;
  margin-bottom: 0;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top: 5px solid #2095f3;
}
.listStyle .addbj {
  background-color: #ff9243;
  color: #fff;
  border: none;
}
.listStyle .addbj label {
  /* display: block; */
  display: none;
}
.listStyle li:hover {
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.11);
}
.konwledgeTree {
  position: relative;
  width: 100%;
}
.konwledgeTree .sameup-null {
  position: relative;
  height: 200px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAABGdBTUEAALGPC/xhBQAAAFdQTFRF5ubm5+fn5ubm5eXl5+fn5ubm5eXl5eXl5+fn5ubm5ubm5ubm5ubm5eXl5ubm5ubm5ubm5eXl5ubm5ubm5+fn5+fn6urq7+/v5eXl5ubm5+fnAAAA5ubmhxnIFwAAABx0Uk5Tbz+PT1+vn9B/cL/gsM9QkN/voPAgYDAQgMBAADbR5n0AAAWRSURBVHja7Z3pops4DIW5WdnDamPg/Z+z6UznTppgycikWKn8XwmfF8BHRyaaPqRFAuLWvqL4cInjU8ca5Hip5/9adRm5gozV/HurThxBdDq/tkKxA1H1vNTqiBlIucxxbz0rEGXleBvJW0B0NQNt5AOSQhxzwQZknOE2cAFJEZCKCUg/Y03xAGlQkBsPkBoFKViAjDPeWIAMfxOI4gCSO4CMHECMgAiIgAiIgAiIgAjIazvGlzRNz/FJcwYpzw/bmvOJK4h63vYXI0uQw0LIWbMD0efl/bFmBqILm4qkeIHYVTFwTIIDuQFhZ0YgsAaT8AEpwLhacwHB5NaBC0iFBNZMQDo0suQBkqCRDQ8QPLbiAeIQqj8FZOQA0n0KiEtqJfkUkEFABERABERABGQXkOMlve8/6zSNOsYg3eXRWVLFTEH0ZV5v3Q0QZNEqmmp2IBZFAzMhBwdilfxqxQoEUJhgXTwwEMiCDGqwoYHASlnPBgSRLivNBaQi/lxoIKh1t2YCgtv5FA8Q3Lp7YwHi8IMFC5DE4QdZgAyfAnLz8SCHBOKVPQtJ+/VyhTcOwZYXA721Gu+1RnyCtwZJ3gyS2WLbjTNWCv+9qxXEITi3xeJvFO26HGJLXnN+wZtndRv6WncJtgpkm+fZS/Isd7mJ2qfldMVmll6ZnsYeBr3PZnekd8JqL8pIHxA02NA7oV3vDjJ0TyIWrOidAGxMbSC6JW1GfgVn1FkJP4agsYwIjwOD6r+qXX//xIczo3karfv2q4PFu2+pHJO23blaqst0XL6Y3MmqbhkTlwpwvfx8v8LpGUiNVxlhfXw/2xamSFu6xS7th4yXE/tlhpgVJ86UT/3QDto1VD33QubrjdfJw4xtm5V1H/3DJDGJXhM6Ng99mDsceIHnELtkyI0xzVBOhDYOQ5MPQ6nXh5ZDc//ffOh3qh/ZqQmIgAiIgAjIZ4Kor+PxSzEH0afvArYi6nYH6b6OcXxa36vPlpx0JYo6xXF6iCO1CYiKv4uFqsNxzXXEr/m7i/sblzr8n1h2OhkRBumeaukK59ffxUMBkVLCh/999lelygdEL5SaOs6PzlL0VTu9QscLkQf6xmq5RLN26VTgELpx9dpysvIAIMpyMbXDLgc486zGhtRa4lrTxAefTgVzkEjPAp1QkeQgj07tyD4WpBNSAsiN5hb4pyF5hRrq2HJjybTzEOPRtAKkKMG2JGAuRKROrcgrBLEWYbakZiUImjnqyZ0Kpp3w2G4dCNqpwCpxSIbeyLPSnn5cBinoaUCX3HZBnpX2hHBEmlnQ3PIxDOCzcl2evfSYHU4WDlvsDhYOe7LHxVSjyMvLeqPYB+RP2Zwcjlq0P5rEryXGs/BANjee7QUy0W94gYHgd5lsYgGCH6fd8ADZ2q+1Gwj6fpNNTECwIem5gCBDkk1sQECHFGT1Cg0EckiBG+zgQIBbcDOxArF6vW4TMxDL7OondiCTfhUhUH9VkCD358nvb10GT0YECnIflT7/907c5olLcilYkF9bLeesY+AgnulpAREQAREQAREQH5C9io43B9mrDHxzkORTQBxU8SsLEK8S16BAfEpcgwJBxWRAKQvrQyoZ3cIRFkhPHpDQPm2TkS8kMBBIuYQlv9A+NtRTzAIhgthfuJAS1/A+/2QZE6xEM8DvWJXt2vURKMikX57wDtplmF8W6x4rTefcxdke7CfSysbcr+1qcrdSU/nWm4AIiIAIiIAIyM/m8lnzjgOIl0wpIG8AcagQMCxAHDyvNx4gPqceBwXiI1MGBYLKlAMXEEym1FxAkCHpJzYgoEyZT3xAoMl11ZxA7DJl+67DON51nEj/Z8fjjeei0GTKAEEWrKJmnDiCkGTKMEGmn2fpGZO1xtxK/d4/ktOcBERAkPYDDYuOj8d+A68AAAAASUVORK5CYII=")
    center center no-repeat;
  background-size: 50% 50%;
  width: 200px;
  margin: 30px auto;
}
.knowledge1 {
  position: relative;
  display: table;
  margin: 40px auto;
  opacity: 0;
}
.knowledge1:after {
  content: "";
  display: block;
  zoom: -1;
  clear: both;
}
.knowledge1 ul {
  position: relative;
  display: table-cell;
  padding: 0;
  margin: 0;
  padding-left: 0 !important;
  vertical-align: middle;
}
.knowledge1 ul li {
  position: relative;
  list-style: none;
  height: 36px;
  margin-bottom: 0px;
}
.knowledge1 ul li:last-child {
  margin-bottom: 0;
}
.know_left {
  padding-right: 0;
}
.know_left label {
  position: absolute;
  border-right: 1px solid #d8d8d8;
  display: inline-block;
  right: 0;
  top: 18px;
  bottom: 18px;
  margin-bottom: 0px !important;
}
.know_left li span {
  position: relative;
  display: block;
  width: auto;
  cursor: pointer;
  padding: 0px 15px;
  margin-right: 23px;
  font-size: 14px;
  color: #fa4949;
  height: 36px;
  line-height: 36px;
  float: right;
  max-width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 50px;
}
.know_left li span:hover {
  text-shadow: 0 2px 14px rgba(250, 73, 73, 0.4);
}
.no-graph .know_left li span {
  color: #4182fa;
}
.no-graph .know_left li span:hover {
  text-shadow: 0 2px 14px rgba(65, 130, 250, 0.4);
}
.know_right {
  padding-left: 0;
}
.know_right label {
  border-right: 1px solid #d8d8d8;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 18px;
  bottom: 18px;
  margin-bottom: 0px !important;
}
.know_right li span {
  position: relative;
  display: block;
  width: auto;
  padding: 0px 15px;
  color: #4182fa;
  cursor: pointer;
  margin-left: 23px;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  float: left;
  max-width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 50px;
}
.know_right li span:hover {
  text-shadow: 0 2px 14px rgba(65, 130, 250, 0.4);
}
.know_left li {
  position: relative;
  text-align: right;
}
.know_left li:after {
  content: "";
  padding-left: 30px;
  color: #ccc;
  border-bottom: 1px solid #d8d8d8;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 18px;
}
.know_right li:before {
  content: "";
  padding-left: 30px;
  color: #ccc;
  border-bottom: 1px solid #d8d8d8;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 18px;
}
.selectedBox {
  position: relative;
  display: table-cell;
  padding: 0;
  margin: 0;
  width: auto;
  vertical-align: middle;
}
.sameup {
  position: relative;
  display: block;
  color: #333;
  padding: 0px 15px;
  margin: 0 19px 0;
  font-size: 16px;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 50px;
}
/*.sameup:hover{
    background-color:#147ccf;
}*/
.sameup:before {
  content: "";
  color: #ccc;
  padding-right: 14px;
  border-bottom: 1px solid #d8d8d8;
  display: inline-block;
  position: absolute;
  left: -19px;
  top: 18px;
}
.sameup.no-left:before {
  display: none;
}
.sameup:after {
  content: "";
  color: #ccc;
  padding-left: 14px;
  border-bottom: 1px solid #d8d8d8;
  display: inline-block;
  position: absolute;
  right: -19px;
  top: 18px;
}
.sameup.no-right:after {
  display: none;
}
.left_ml .mark {
  bottom: -34px;
}
.mark {
  position: relative;
}
.mark span {
  padding-left: 30px;
  font-size: 14px;
  color: #818a92;
  opacity: 0;
}
.mark span.know_xianxiu {
  padding-left: 0;
}
.mark .know_xianxiu:before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: #fa4949;
  margin-right: 5px;
}
.mark .know_about:before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: #4182fa;
  margin-right: 5px;
}
.mark .know_related {
  padding-left: 0;
}
.mark .know_related:before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: #4182fa;
  margin-right: 5px;
}
/* 混合教学效果报告学生端入口 相关样式 */
.report-entrance {
  display: none;
  width: 280px;
  height: 130px;
  padding: 10px;
  position: fixed;
  bottom: 0;
  right: 0;
  box-shadow: -4px -2px 5px #888888;
}
.report-entrance a {
  text-decoration: none;
}
.report-entrance-close {
  text-align: right;
  cursor: pointer;
}
.report-entrance .teacher_name {
  display: block;
  text-align: right;
}
.report-entrance-content {
  font-size: 14px;
}

/*积极小木开始 */
.study-plan i {
  font-style: normal;
  margin-right: 3px;
}
.study-plan .plan-week,
.plan-day {
  margin-top: 5px;
}
.plan-choice {
  margin-left: 5px;
}
.plan-bottom {
  text-align: center;
  margin-top: 5px;
}
.submit-plan {
  display: inline-block;
  width: 45px;
  height: 22px;
  text-align: center;
  line-height: 22px;
  font-size: 12px;

  background-color: #469cff;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  color: #fff;
}
.recommend-content {
  margin-top: 10px;
}
.recommend-content span {
  display: block;
  color: #469cff;
  cursor: pointer;
}
/*小木改版样式 */
.testswitch {
  position: relative;
  float: left;
  width: 52px;
  height: 24px;
  margin: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  margin-left: 8px;
  margin-top: 18px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.testswitch-checkbox {
  display: none;
}

.testswitch-label {
  display: block;
  overflow: hidden;
  cursor: pointer;
  border-radius: 20px;
}

.testswitch-inner {
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s ease-in 0s;
}
.testswitch-inner::before,
.testswitch-inner::after {
  display: block;
  float: right;
  width: 50%;
  height: 24px;
  padding: 0;
  line-height: 24px;
  font-size: 10px;
  color: white;
  font-family: Trebuchet, Arial, sans-serif;
  box-sizing: border-box;
}

.testswitch-inner::after {
  content: attr(data-on);
  background-color: #2092ed;
  color: #ffffff;
  padding-left: 3px;
}

.testswitch-inner::before {
  content: attr(data-off);
  background-color: #9ab2c5;
  color: #f1f4f7;
  /* text-align: right;*/
  padding-left: 24px;
}
.testswitch-switch {
  position: absolute;
  display: block;
  width: 20px;
  height: 20px;
  margin: 2px;
  background: #ffffff;
  top: 0;
  bottom: 0;
  border-radius: 20px;
  transition: all 0.3s ease-in 0s;
}

.testswitch-checkbox:checked + .testswitch-label .testswitch-inner {
  margin-left: 0;
}

.testswitch-checkbox:checked + .testswitch-label .testswitch-switch {
  right: 0px;
}
.scholar {
  clear: both;
  height: 50px;
}
.scholar .title {
  float: left;
  font-size: 16px;
  color: #818a92;
  margin-left: 20px;
  margin-top: 19px;
}
.scholar .remind {
  display: inline-block;
  margin-left: 14px;
  margin-top: 22px;
  float: left;
}
.remind_text {
  position: absolute;
  left: 0;
  top: 240px;
}
.remind_text .reminds img {
  width: 16px;
  height: 16px;
}
.reminds {
  float: left;
  margin-left: 20px;
  margin-top: 20px;
}
.scholar .remind img {
  width: 16px;
  height: 16px;
}
.dwtext {
  font-size: 11px;
}
.entry {
  /* margin-top:16px;
    margin-left:10px;*/
  width: 203px;
  background: #f0f4f6;
  padding: 10px;
  float: left;
  /*设置圆角*/
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  color: #818a92;
  font-size: 11px;
  height: 80px;
  position: absolute;
  top: 16px;
  left: 180px;
  display: none;
  margin-left: 5px;
}
.entry-trangle {
  /* position:absolute; */
  margin-left: -13px;
  width: 0;
  height: 0;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-right: 3px solid #f0f4f6;
  z-index: -1;
}
.f11 {
  -webkit-transform-origin-x: 0;
  -webkit-transform: scale(0.917);
  transform: scale(0.917);
  width: 203px;
  margin-top: -15px;
}
.jrfox {
  margin-top: -11px !important;
  margin-left: -7px;
  width: 186px !important;
}
.scholar_change {
  float: right;
  background: #2195f3;
  height: 36px;
  line-height: 36px;
  color: #fff;
  font-size: 14px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 20px;
  margin-top: 18px;
  margin-right: 20px;
  cursor: pointer;
}
.scholar_change img {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-left: 2px;
  margin-top: -3px;
}
.scholar_info {
  width: 150px;
  height: 177px;
  float: left;
  margin-top: 20px;
  margin-left: 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  background: url("https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/burst.png")
    no-repeat top center;
}
.scholar_img {
  text-align: center;
  height: 83px;
}
.scholar_img img {
  width: 64px;
  height: 83px;
}
.scholar_name {
  font-size: 14px;
  text-align: center;
  color: #303132;
  height: 20px;
  margin-top: 10px;
}
.scholar_number {
  color: #818a92;
  font-size: 12px;
  margin-top: 13px;
}
.scholar_number span {
  color: #2195f3;
  margin-left: 5px;
}
.scholar_number img {
  width: 12px;
  height: 12px;
  margin-left: 16px;
  margin-right: 4px;
  vertical-align: middle;
}
.scholar_info .scholar_rank {
  margin-top: 3px;
}
.enjor img {
  width: 14px;
}
.point img {
  width: 5px;
  height: 5px;
  position: absolute;
  right: 8px;
  top: 15.5px;
  display: none;
}
.left_qp {
  display: none;
  position: absolute;
}
.entrys {
  /* margin-top:16px;
     margin-left:10px;*/
  width: 203px;
  background: #f0f4f6;
  padding: 10px;
  float: left;
  /*设置圆角*/
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  color: #818a92;
  font-size: 11px;
  height: 80px;
  position: absolute;
  top: 47px;
  left: 21px;
  display: none;
}
.dialog-border {
  width: 112px;
  height: 51px;
  background: #fef0f0;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  position: relative;
  border: 1px solid #f56c6c;
  /*此处的边框大小会影响第二个三角形到顶部的偏移量，一般是1.4倍*/
}
.dialog-border div {
  color: #f56c6c;
  font-size: 11px;
  margin-left: 10px;
}
.dialog-border .grage {
  margin-top: 8px;
  margin-bottom: 3px;
  font-weight: bold;
}
.dialog-border::before {
  content: "";
  position: absolute;
  top: 11px;
  left: 111px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #f56c6c;
}

.dialog-border::after {
  content: "";
  position: absolute;
  top: 11px;
  left: 110px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #fef0f0;
}
.right_qp {
  position: absolute;
  display: none;
}
.minus .dialog-border div {
  color: #23c03d;
}
.minus .dialog-border {
  border: 1px solid #23c03d;
  background: #e9f8eb;
}
.minus .dialog-border::before {
  left: -5px;
  border-right: 5px solid #23c03d;
  border-left: none;
}
.minus .dialog-border::after {
  left: -4px;
  border-right: 5px solid #e9f8eb;
  border-left: none;
}
.add .dialog-border::before {
  left: -5px;
  border-right: 5px solid #f56c6c;
  border-left: none;
}
.add .dialog-border::after {
  left: -4px;
  border-right: 5px solid #fef0f0;
  border-left: none;
}
.enjor {
  font-weight: bold;
}
.enjor i {
  font-style: normal;
}
.enjor img {
  vertical-align: sub;
  margin-right: 3px;
}
.left_y {
  width: 8px;
  height: 8px;
  display: inline-block;
  background: #f1f3f6;
  border: 1px solid #e4e7ed;
  position: absolute;
  top: 15px;
  left: -12px;
  border-radius: 100%;
}
.sameup .rights_ru {
  width: 8px;
  height: 8px;
  display: inline-block;
  right: -12px;
  top: 15px;
  background: #f1f3f6;
  border: 1px solid #e4e7ed;
  position: absolute;
  border-radius: 100%;
  z-index: 1;
}
.left_rudis {
  display: none;
}
.bgs {
  background: url("https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/Rectangle2.png")
    no-repeat top center;
  width: 100%;
  height: 100%;
}
.xj {
  background: url("https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/bg_1.png")
    no-repeat top center;
}
.first_animation {
  animation: moves 0.3s linear;
}
.sconde_animation {
  animation: topmoves 0.3s linear;
}
.kol {
  margin-top: 144px;
  margin-left: 6px;
}
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.bounceInDown {
  -webkit-animation-name: bounceInDown;
  animation-name: bounceInDown;
  -webkit-animation-play-state: running;
  animation-play-state: running;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
  display: block;
}
@-webkit-keyframes bounceInDown {
  0%,
  60%,
  75%,
  90%,
  100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -3000px, 0);
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate3d(0, 25px, 0);
    transform: translate3d(0, 25px, 0);
  }
  75% {
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }
  90% {
    -webkit-transform: translate3d(0, 3px, 0);
    transform: translate3d(0, 3px, 0);
  }
  100% {
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes bounceInDown {
  0%,
  60%,
  75%,
  90%,
  100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -3000px, 0);
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate3d(0, 25px, 0);
    transform: translate3d(0, 25px, 0);
  }
  75% {
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }
  90% {
    -webkit-transform: translate3d(0, 3px, 0);
    transform: translate3d(0, 3px, 0);
  }
  100% {
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes topmoves {
  /*动画名称自定义*/
  0% {
    transform: translate(0, -100px);
    opacity: 0;
  }
  20% {
    transform: translate(0, -50px);
    opacity: 0;
  }

  100% {
    /*时间点可以任意，10%表示当时间进行到10%是元素要达到的状态*/

    transform: translate(0, 0);
    opacity: 1;

    /*-ms-transform: translate(100px, 0);

        !*IE 9*!

        -moz-transform: translate(100px, 0);

        !* Firefox *!

        -webkit-transform: translate(100px, 0);

        !* Safari 和 Chrome *!

        -o-transform: translate(100px, 0);*/

    /* Opera */
  }
}
@keyframes moves {
  /*动画名称自定义*/
  0% {
    transform: translate(0, -100px);
    opacity: 0;
  }

  100% {
    /*时间点可以任意，10%表示当时间进行到10%是元素要达到的状态*/

    transform: translate(0, 0);
    opacity: 1;

    /*-ms-transform: translate(100px, 0);

        !*IE 9*!

        -moz-transform: translate(100px, 0);

        !* Firefox *!

        -webkit-transform: translate(100px, 0);

        !* Safari 和 Chrome *!

        -o-transform: translate(100px, 0);*/

    /* Opera */
  }
}
.wz {
  text-align: center;
  position: absolute;
  top: 0;
  left: 64px;
}
.bgs .texts {
  font-size: 14px;
  color: #fff;
  position: absolute;
  top: 160px;
  left: 90px;
}
#dialogBg {
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: 0.6;
  filter: alpha(opacity=60);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: none;
}
#dialog {
  width: 240px;
  height: 274px;
  margin: 0 auto;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -137px 0 0 -120px;
  z-index: 10000;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  background: #fff;
  display: none;
}
.submitBtn {
  width: 165px;
  height: 37px;
  line-height: 37px;
  font-size: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  margin-left: 37px;
  margin-top: 10px;
  display: inline-block;
  border-radius: 50px;
  -webkit-border-radius: 50px;
  text-align: center;
  background: -webkit-linear-gradient(left, #f87e28, #f9ab44);
  color: #fff;
}
.ys_anwer {
  margin-left: 53px;
  margin-top: 49px;
}
.answer {
  font-size: 14px;
  text-align: center;
  color: #696969;
}
#dialog .closes {
  background: #818a92;
  margin-top: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  /* box-shadow: 0 1px 3px rgba(0,0,0,0.5) inset,0 2px 4px rgba(0,0,0,0.5);*/
}
.animateds {
  width: 260px;
  height: 130px;
  margin: 0 auto;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -90px 0 0 -160px;
  z-index: 10000;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  background: #fff;
  padding: 30px 30px 20px 30px;
  display: none;
}
.ts_info {
  font-size: 18px;
  color: #303133;
}
.ts_answer {
  font-size: 14px;
  color: #606266;
  margin-top: 10px;
  margin-bottom: 6px;
}
.ts_choose {
  font-size: 14px;
  color: #000000;
  margin-bottom: 22px;
  background: url("https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/no_check.png")
    no-repeat left center;
  background-size: 16px 16px;
  padding-left: 24px;
  cursor: pointer;
}
.xjs {
  left: 92px;
}
.check {
  background: url("https://static-cdn.xuetangx.com/xtassets/xuetangx/qarobot/all_check.png")
    no-repeat left center;
}
.ts_jg span {
  display: inline-block;
  font-size: 12px;
  height: 28px;
  line-height: 28px;
  width: 72px;
  border: 1px solid #dcdfe6;
  border-radius: 50px;
  float: right;
  text-align: center;
  cursor: pointer;
}
.ts_jg .left {
  background: #2195f3;
  color: #fff;
  border: none;
  margin-left: 8px;
}

.circle-label-rotate {
  -webkit-animation-name: rotateThis;
  animation-name: rotateThis;
  -webkit-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
}
@-webkit-keyframes rotateThis {
  from {
    -webkit-transform: scale(1) rotate(0deg);
    transform: scale(1) rotate(0deg);
  }
  to {
    -webkit-transform: scale(1) rotate(360deg);
    transform: scale(1) rotate(360deg);
  }
}
@keyframes rotateThis {
  from {
    -webkit-transform: scale(1) rotate(0deg);
    transform: scale(1) rotate(0deg);
  }
  to {
    -webkit-transform: scale(1) rotate(360deg);
    transform: scale(1) rotate(360deg);
  }
}

@-webkit-keyframes shake {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}

@keyframes shake {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}

.shake {
  -webkit-animation-name: shake;
  animation-name: shake;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
}

.circle {
  border-radius: 50px;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  height: 100px;
  width: 100px;
  text-align: center !important;

  background: #dedede;
}
.sqare {
  height: 100px;
  width: 500px;
  border: dashed 1px #000;
  margin-top: 10px;
}
.innertext {
  position: relative;
  left: -9px;
}
</style>
