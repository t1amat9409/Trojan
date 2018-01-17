
import $ from "jquery";
var url = (window.location.host.indexOf("192") > -1) ? "192.168.100.108" : "localhost";
var moment = window.moment;

class _FakeData {
  data = {}
  name = "Supotsu-App";
  data = { "yoo": { id: null } }
  shareContext = {};
  states = {};
  snacks = {};
  chats = [];
  URL = "";
  baseURL = "";
  $ = $;
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July ',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  constructor(url) {
    //this.URL = "http://" + url + ":8080/supotsu/public/server";
    //this.baseURL = "http://" + url + ":3000";
    if (process.env.NODE_ENV !== 'production') {
      this.URL = "http://" + url + ":8080/supotsu/public/server";
      this.baseURL = "http://" + url + ":3000";
      console.log("Running in DevMode");
    } else {
      this.URL = (window.location.host === "localhost:8080") ? window.location.origin + "supotsu/build/server" : window.location.origin + "/server";
      this.baseURL = (window.location.host === "localhost:8080") ? window.location.origin + "supotsu/build" : window.location.origin;
      console.log("Running in AppMode");
    }
    this.data = window.localStorage.getItem("fakeDat-beta0") ? JSON.parse(window.localStorage.getItem("fakeDat-beta0")) : { "yoo": { id: null } };
  }

  shortDigit = (num, suffix = "") => {
    const _num = this.numify(num);
    const _suffix = this.nullify(suffix).toLowerCase();
    const _text = parseInt(this.nFormatter(_num)) === 0 ? "" : this.nFormatter(_num) + " ";
    const _ext = parseInt(this.nFormatter(_num)) === 0 ? _suffix.capitalize() : parseInt(this.nFormatter(_num)) === 1 ? _suffix : _suffix === "" ? _suffix : _suffix.plural();
    const value = {
      text: this.nFormatter(_num, 1),
      isSingle: (_num / 6) > 1000000 ? false : ((_num / 3) > 1000) ? false : (_num === 1) ? true : (_num === 0) ? false : false,
      data: _text + "" + _ext
    }

    return value;
  }

  pluralize = (str) => {

  }

  getPath = (user, search = "?sInit=about") => {
    let path = { pathname : "/", search };
    switch (user.type) {
      case "F":
        path.pathname = "/profile/"+user.user;
        break;
      case "P":
        path.pathname = "/profile/"+user.user;
        break;
      case "T":
        path.pathname = "/team/"+user.id;
        break;
      case "C":
        path.pathname = "/club/"+user.user;
        break;
      case "I":
        path.pathname = "/institution/"+user.user;
        break;
      case "L":
        path.pathname = "/tournament/"+user.user;
        break;
      case "E":
        path.pathname = "/event/"+user.id;
        break;
      case "Q":
        path.pathname = "/group/"+user.user;
        break;
      case "G":
        path.pathname = "/game/"+user.id;
        path.search = "";
        break;
      default:
        path.pathname = "/";
        path.search = "";
        break;
    }

    return path;
  }

  nFormatter = (num, digits = 1) => {
    var si = [
      { value: 1E18, symbol: "E" },
      { value: 1E15, symbol: "P" },
      { value: 1E12, symbol: "T" },
      { value: 1E9, symbol: "G" },
      { value: 1E6, symbol: "M" },
      { value: 1E3, symbol: "k" }
    ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;

    for (i = 0; i < si.length; i++) {
      if (num >= si[i].value) {
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
      }
    }
    return num.toFixed(digits).replace(rx, "$1");
  }

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  loaderElement = () => {
    return document.querySelector(".async-loader");
  }

  toMyTimezone = (dateString) => {
    var myDate = new Date(dateString);
    var date = new Date();
    if (myDate.getTimezoneOffset() === date.getTimezoneOffset()) {
      //return myDate;
      myDate.setMinutes(myDate.getMinutes() + myDate.getTimezoneOffset());
      return myDate;
    }
    myDate.setMinutes(myDate.getMinutes() - myDate.getTimezoneOffset());
    return myDate;
  }

  today = () => {
    var date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return {
      fullDate: this.days[date.getDay()] + ", " + date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear(),
      context: {
        months: this.months,
        days: this.days,
        dateObj: date
      }
    };
  }

  getDummy = (_num) => {
    const list = [];
    for (var index = 0; index < _num; index++) {
      list.push({ text: index })
    }

    return list;
  }

  getRGB(b) {
    var a;
    if (b && b.constructor == Array && b.length == 3) {
      return b;
    }

    if (a = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b)) {
      return [parseInt(a[1]), parseInt(a[2]), parseInt(a[3])];
    }

    if (a = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b)) {
      return [parseFloat(a[1]) * 2.55, parseFloat(a[2]) * 2.55, parseFloat(a[3]) * 2.55];
    }

    if (a = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b)) {
      return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)];
    }

    if (a = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b)) {
      return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)];
    }

    return (typeof (a) != "undefined") ? a[window.jQuery.trim(b).toLowerCase()] : null
  };

  getLuminance(color) {
    var rgb = this.getRGB(color);
    if (!rgb) {
      return null;
    }
    const lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    const _color = (lum > 180) ? "#000000" : "#ffffff";
    return _color;
  }

  alert = (txt) => {
    var el = document.createElement("div");
    var id = FakeData.makeid(txt.length);
    el.className = "snack-bar " + id;
    var sbText = document.createElement("span");
    sbText.className = "sb-text";
    el.appendChild(sbText);

    var sbAction = document.createElement("span");
    sbAction.className = "sb-action";
    el.appendChild(sbAction);
    sbText.textContent = txt;
    sbAction.textContent = "OK";

    this.setSnack(id, el);
  }

  setData = (key, data) => {
    this.data[key] = data;
    window.localStorage.setItem("fakeDat-beta0", JSON.stringify(this.data))
  }

  getData = (key) => {
    return this.data[key];
  }

  mountState = (key, bool) => {
    this.states[key] = bool;
  }

  isMounted = (key) => {
    return this.states[key];
  }

  deleteData = (key) => {
    delete this.data[key];
    return this
  }

  listify = (list) => {
    if (Array.isArray(list)) {
      return list;
    } else {
      return [];
    }
  }

  inArray = (item, array) => {
    if (this.listify(array).indexOf(item) === -1) {
      return false;
    } else {
      return true;
    }
  }

  nullify = (string) => {
    return new String(string);
  }

  numify = (num) => {
    return parseInt(num);
  }

  makeDatePicker = (el, cb) => {
    if (el === null) {
      return
    }
    var val = window.$(el).val()

    window.$(el).datepicker();

    window.$(el).off("change").bind("change", function (e) {
      if (cb) {
        cb.call(this, e)
      }
    })
  }

  makeTimePicker = (el, cb) => {
    if (el === null) {
      return
    }

    window.$(el).timepicker();
    window.$(el).off("change").bind("change", function (e) {
      if (cb) {
        cb.call(this, e)
      }
    })
  }

  setSnack = (key, data) => {
    this.snacks[key] = data;
    document.body.appendChild(data);
    setTimeout(function () {
      document.body.removeChild(data);
    }, 2500);
  }

  shared = (key, context) => {
    var isContext = Boolean(context)
    if (!isContext) {
      return this.shareContext[key]
    } else {
      this.shareContext[key] = context
      return this
    }
  }

  makeid = (len) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  blob = (src, callbacks) => {
    fetch(src).then(function (response) {
      return response.blob()
    }).then(function (response) {
      var objectURL = URL.createObjectURL(response);
      callbacks.success(objectURL)
    }).catch(function (ex) {
      callbacks.error(ex)
    })
  }

  post = (path, data, callbacks, isSnack, sbTextTxt, sbActionFunc) => {
    const _that = this;
    var isSetSnack = Boolean(isSnack);
    var isSetSnackText = Boolean(sbTextTxt);
    var isSetSnackAction = Boolean(sbActionFunc);

    var url = (this.isWebsite(path)) ? path : _that.URL + path;
    if (isSetSnack) {
      var el = document.createElement("div");
      var id = _that.makeid(path.length);
      el.className = "snack-bar " + id;
      var sbText = document.createElement("span");
      sbText.className = "sb-text";
      el.appendChild(sbText);

      var sbAction = document.createElement("span");
      sbAction.className = "sb-action";
      el.appendChild(sbAction);

      _that.loaderElement().style.marginBottom = "2cm";
      this.$.ajax({
        xhr() {
          var xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
              var percentComplete = e.loaded / e.total;
              if (callbacks.progress) {
                const _finalProgress = percentComplete * 100;
                callbacks.progress(_finalProgress)
              }

              $('.async-progress').css({
                width: percentComplete * 100 + '%'
              });

              if (percentComplete === 1) {
                $('.async-progress').addClass('hide').css({width:0});
              }
            }
          }, false);

          xhr.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
              var percentComplete = e.loaded / e.total;
              if (callbacks.progress) {
                const _finalProgress = percentComplete * 100;
                callbacks.progress(_finalProgress)
              }

              $('.async-progress').css({
                width: percentComplete * 100 + '%'
              });

              if (percentComplete === 1) {
                $('.async-progress').addClass('hide').css({width:0});
              }
            }
          }, false)

          return xhr;
        },
        type: "POST",
        url: url,
        data: _that.stringify(data),
        beforeSend(request) {
          request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(result) {
          //var json = JSON.parse(result);
          sbAction.onclick = function (evt) {
            sbActionFunc.call(this, result)
          }
          sbText.textContent = sbTextTxt;
          sbAction.textContent = "OK";
          if (sbTextTxt !== "") {
            _that.setSnack(id, el)
          }
          if (callbacks.success) {
            callbacks.success(result)
          }
          _that.loaderElement().style.marginBottom = "-2cm";
          //console.log(result)
        },
        error(err) {
          if (callbacks.error) {
            callbacks.error(err)
          }
          sbAction.textContent = "TRY AGAIN";
          sbAction.onclick = function (evt) {
            _that.post(path, data, callbacks, isSnack, sbTextTxt, sbActionFunc)
          }


          sbText.textContent = "Network Error";

          _that.setSnack(id, el)
          _that.loaderElement().style.marginBottom = "-2cm";
        }
      })
    } else {
      this.$.ajax({
        type: "POST",
        url: url,
        data: _that.stringify(data),
        beforeSend(request) {
          request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(result) {
          if (callbacks.success) {
            callbacks.success(result)
          }
        },
        error(err) {
          if (callbacks.error) {
            callbacks.error(err)
          }
        }
      })
    }

  }

  postHttp = (path, data, callbacks, isSnack, sbTextTxt, sbActionFunc) => {
    const _that = this
    var isSetSnack = Boolean(isSnack);
    var isSetSnackText = Boolean(sbTextTxt);
    var isSetSnackAction = Boolean(sbActionFunc);

    if (isSetSnack) {
      var el = document.createElement("div");
      var id = _that.makeid(path.length);
      el.className = "snack-bar " + id;
      var sbText = document.createElement("span");
      sbText.className = "sb-text";
      el.appendChild(sbText);

      var sbAction = document.createElement("span");
      sbAction.className = "sb-action";
      el.appendChild(sbAction);

      _that.loaderElement().style.marginBottom = "2cm";

      fetch((this.isWebsite(path)) ? path : _that.URL + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: _that.stringify(data)
      }).then(function (response) {
        _that.loaderElement().style.marginBottom = "-2cm";
        return response.json()
      }).then(function (json) {
        sbAction.onclick = function (evt) {
          sbActionFunc.call(this, json)
        }
        sbText.textContent = sbTextTxt;
        sbAction.textContent = "OK";
        if (sbTextTxt !== "") {
          _that.setSnack(id, el)
        }

        callbacks.success(json)
      }).catch(function (ex) {
        callbacks.error(ex)
        console.log(ex)
        sbAction.textContent = "TRY AGAIN";
        sbAction.onclick = function (evt) {
          _that.post(path, data, callbacks, isSnack, sbTextTxt, sbActionFunc)
        }


        sbText.textContent = "Network Error";

        _that.setSnack(id, el)
      })
    } else {
      fetch((this.isWebsite(path)) ? path : _that.URL + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: _that.stringify(data)
      }).then(function (response) {
        //console.log(response);

        return response.json()
      }).then(function (json) {
        callbacks.success(json)
      }).catch(function (ex) {
        callbacks.error(ex)
      })
    }
  }

  getTMP = (path, callbacks) => {
    fetch(path, {
      method: 'GET'
    }).then(function (response) {
      console.log(response);
      return response.json()
    }).then(function (json) {
      callbacks.success(json)
    }).catch(function (ex) {
      callbacks.error(ex)
    })
  }

  setTitle = (chars) => {
    if (document.title === chars) {
      return;
    }

    document.title = chars
  }

  getQueries = (str) => {
    var obj = {};
    var array = str.slice(1).split("&");
    for (var x = 0; x < array.length; x++) {
      var strOf = array[x].split("=");
      obj[strOf[0]] = unescape(strOf[1]);
    }

    return obj;
  }

  isEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  isWebsite = (website) => {
    var WEB_REGEXP = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    return WEB_REGEXP.test(website);
  }

  isPhone = (phone) => {
    var PHONE_REGEXP = /\(?([0-9]{2,3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return PHONE_REGEXP.test(phone);
  }

  getProfileStyle = (bg, col, bdColor) => {
    const style = {
      ".top-sports > img:hover,.top-sports > img.active , img.with-hover:hover": {
        background: bg,
      },
      ".top-other-item": {
        color: col
      },
      ".top-other-item:hover,.top-other-item.active": {
        color: bg
      },
      ".top-other-item:hover > img,.top-other-item.active > img": {
        background: bg
      },
      ".sport-details > div:first-child": {
        color: col
      },
      ".sport-detail": {
        "border-color": col
      },
      ".sport-detail > span:first-child": {
        color: bg
      },
      ".sport-details > div:last-child": {
        color: col,
      },
      ".sport-detail-graph > span": {
        color: col,
      },
      ".sport-detail-graph > div": {
        color: bg,
      },
      ".sport-detail-graph.chart > div": {
        color: col,
      },
      ".sport-detail-graph.chart > div::after": {
        "border-color": bg,
        "border-top-color": col
      },
      ".other-details-add": {
        color: col,
      },
      ".other-details-add > a": {
        color: col,
      },
      ".profile-banner-main-picture > div.back-photo,.profile-banner-main-picture > div.front-photo": {
        color: col,
      },
      ".profile-banner-nav > div": {
        color: col,
      },
      ".profile-banner-nav > div.active,.profile-banner-nav > div:hover": {
        color: bg
      },
      ".teams-min-slider": {
        color: col,
      },
      ".view-with-tabs-head": {
        color: col,
      },
      ".view-with-tabs-head-item": {
        background: bg,
      },
      ".view-with-tabs-head-item:hover": {
        background: bdColor,
        color: bg
      },
      ".view-with-tabs-head-item.active": {
        background: col,
        color: bg
      },
      ".view-with-tabs-head-item.active": {
        background: col,
        color: bg
      },
      ".up-gm-item > span": this.genStyle("background", bg, col, true, 1.0),
      ".next_game_header": this.genStyle("background", bg, col, true, 1.0),
      ".league-split-view > .next-game-view > .next_game_counter > div": this.genStyle("background", bg, col, true, 0.5),
      ".upcoming-games-view-tabs.league > span": this.genStyle("background", bg, col, false, 0.0),
      ".upcoming-games-view-tabs.league > span.active": this.genStyle("background", col, bg, false, 0.0),
      ".upcoming-games-view-tabs.league > span:hover": this.genStyle("background", bg, col, false, 0.0),
      ".upcoming-games-view > .load-more.league": this.genStyle("background", bg, col, false, 0.0),
      ".upcoming-games-view > .load-more.league:hover": this.genStyle("background", bg, col, true, 0.6),
      ".upcoming-games-view-head.league > *:hover": this.genStyle("background", bg, col, false, 0.0),
      ".upcoming-games-view-head.league > .active": this.genStyle("background", bg, col, false, 0.0),
      ".event-list-view-tab": this.genStyle("background", bg, col, false, 0.0),
      ".event-list-view-tab.active": this.genStyle("background", col, bg, false, 0.0),
      ".event-list-view-tab:hover": this.genStyle("background", col, bg, false, 0.0),
      ".event-view-pane-tab.active": this.genStyle("background", bg, bg, false, 0.0),
      ".event-view-pane-tab.active": this.genStyle("border-color", bg, bg, false, 0.0),
      ".internal-notice-center-head": this.genStyle("background-color", bg, col, false, 0.0)
    }

    return style;
  }

  getRGB = (hex, a = 1) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + a + ')';
    } 
    throw new Error('Bad Hex');
  }

  genStyle = ($prop, $val, $col, $isAlpha, $alpha) => {
    if ($isAlpha) {
      const $array = {
        "color": $col + "!important"
      };

      $array[$prop] = this.getRGB($val, $alpha) + "!important";

      return $array;
    }

    const $array = {
      "color": $col + "!important"
    };

    $array[$prop] = $val + "!important";

    return $array;
  }

  setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  getCookie = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  stringify = (obj, replacer, spaces, cycleReplacer) => {
    return JSON.stringify(obj, this.serializer(replacer, cycleReplacer), spaces)
  }

  unbr = (str = "") => {
    return str.replace(/<br[^>]*>/g, "\n")
  }

  br = (str = "") => {
    return str.replace(/\r?\n/g, '<br/>');
  }

  serializer = (replacer, cycleReplacer) => {
    var stack = [], keys = []

    if (cycleReplacer == null) cycleReplacer = function (key, value) {
      if (stack[0] === value) return "[Circular ~]"
      return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
    }

    return function (key, value) {
      if (stack.length > 0) {
        var thisPos = stack.indexOf(this)
        ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
        ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
        if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
      }
      else stack.push(value)

      return replacer == null ? value : replacer.call(this, key, value)
    }
  }

  onKeyPress = (e) => {
    if ((e.keyCode === 13 || e.which === 13)) {
      e.preventDefault()
    }
  }
}

const FakeData = new _FakeData(url);

window.FakeData = FakeData;
export default FakeData;
