var token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvY2h2cTBCdE1penctX0EycXkwVnI1WFkyRnhvIiwiYXVkaWVuY2UiOiJtb2JpbGUiLCJjcmVhdGVkIjoxNTgyODYyNjYzMjI2LCJhcHBJZCI6Ind4ODU1YzVkNzcxOGYyMThjOSIsImN1cnJlbnRPcGVuSWQiOiJvY2h2cTBCdE1penctX0EycXkwVnI1WFkyRnhvIiwib3JpZ2luT3BlbklkIjoib2NodnEwQnRNaXp3LV9BMnF5MFZyNVhZMkZ4byIsImV4cCI6MTU4Mjk0OTA2M30.dQn314npzdV8DHZU6JsK9JfSdfndZzq3SqltLdFomy0";
var habitID = 4553273;
var noteText = "测试";

/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
    您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
  var errorInfo = {
    error: ""
  };
  $httpClient = {
    get: (url, cb) => {
      var urlObj;
      if (typeof url == "string") {
        urlObj = {
          url: url
        };
      } else {
        urlObj = url;
      }
      $task.fetch(urlObj).then(
        response => {
          cb(undefined, response, response.body);
        },
        reason => {
          errorInfo.error = reason.error;
          cb(errorInfo, response, "");
        }
      );
    },
    post: (url, cb) => {
      var urlObj;
      if (typeof url == "string") {
        urlObj = {
          url: url
        };
      } else {
        urlObj = url;
      }
      url.method = "POST";
      $task.fetch(urlObj).then(
        response => {
          cb(undefined, response, response.body);
        },
        reason => {
          errorInfo.error = reason.error;
          cb(errorInfo, response, "");
        }
      );
    }
  };
}
if (isSurge) {
  $task = {
    fetch: url => {
      //为了兼容qx中fetch的写法,所以永不reject
      return new Promise((resolve, reject) => {
        if (url.method == "POST") {
          $httpClient.post(url, (error, response, data) => {
            if (response) {
              response.body = data;
              resolve(response, {
                error: error
              });
            } else {
              resolve(null, {
                error: error
              });
            }
          });
        } else {
          $httpClient.get(url, (error, response, data) => {
            if (response) {
              response.body = data;
              resolve(response, {
                error: error
              });
            } else {
              resolve(null, {
                error: error
              });
            }
          });
        }
      });
    }
  };
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
  $persistentStore = {
    read: key => {
      return $prefs.valueForKey(key);
    },
    write: (val, key) => {
      return $prefs.setValueForKey(val, key);
    }
  };
}
if (isSurge) {
  $prefs = {
    valueForKey: key => {
      return $persistentStore.read(key);
    },
    setValueForKey: (val, key) => {
      return $persistentStore.write(val, key);
    }
  };
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
  $notification = {
    post: (title, subTitle, detail) => {
      $notify(title, subTitle, detail);
    }
  };
}
if (isSurge) {
  $notify = function(title, subTitle, detail) {
    $notification.post(title, subTitle, detail);
  };
}
// #endregion

$httpClient.get(
  {
    url:
      "https://mars.sharedaka.com/api/v2/habit/detail?habitID=" +
      habitID +
      "&habitFrom=index&byUserID=",
    headers: {
      Token: token
    }
  },
  function(error, response, data) {
    var openID = data.data.habitBaseData.habitCreateUser;
    $httpClient.get(
      {
        url:
          "https://im.sharedaka.com/api/v1/msg/person/sid?targetOpenId=" +
          openID,
        headers: {
          Token: token
        }
      },
      function(error, response, data) {
        var sessionID = data.data;
        $httpClient.post(
          {
            url: "https://mars.sharedaka.com/api/v1/habit/note/create",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Token: token
            },
            body: `habitID=${habitID}&notePhotoProperties=&tagIds=&openId=${openID}&topicID=0&curDate=&logID=716821357&noteText=${encodeURI(
              noteText
            )}&notePhoto=&noteLat=&noteLng=&noteLocation=&noteLocationDesc=&noteVisible=1&habitForceNoteState=1&noteAudioKey=&noteAudioType=1&noteAudioTime=0&noteVideoKey=&noteVideoDuration=&noteVideoHeight=&noteVideoWidth=&noteVideoSize=&qrCode=&fromOpenId=&inviteType=&sessionId=${sessionID}`
          },
          function(error, response, data) {
            if (error) {
              console.log(error);
              $done();
            } else {
              var obj = JSON.parse(data);
              console.log(obj);
              $notification.post(obj.msg);
            }
          }
        );
      }
    );
  }
);
