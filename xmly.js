const cookieName = '喜马拉雅'
const cookieKey = 'chavy_cookie_ximalaya'
const chavy = init()
const cookieVal = '1&_device=android&b301ec9c-1f8a-3f3f-b617-d099fdacb97b&6.6.45;1&_token=216399212&7D458E871E082626E4FF2F7E2EA8ED74cDvFEEFF754352C04F2F11361A75A43CED68B1A892125D644CCBD554C59370CBD69;channel=and-f5;impl=com.ximalaya.ting.android;osversion=26;device_model=ATU-TL10;XUM=tM0nznxO;XIM=315a9d10b8a57;c-oper=%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8;net-mode=WIFI;freeFlowType=0;res=720%2C1440;NSUP=;AID=UJ4zrGHRsFw=;manufacturer=HUAWEI;XD=/z1F6Iv6u9G+fuQghBfnnJmXyEwtfAuVWstynx3JqMAu7bqoJBlEz8VE4NsfELHPEN4PbRoGMZqjFb/rNJTEZ3wOxD7XZTB8P/UtOiWj+gZCOsvS8mSBLE6uMuTtZf+uosgXLxQLP66J8RkoCMSyXnkbxn6Tpoe/QMq1uU7AnpI=;umid=dc8a4b53625481d13bde40eec3e7fd91;xm_grade=0;minorProtectionStatus=0;oaid=fbbfdfff-afcd-c9de-46f5-777eef29ad8f;x_xmly_resource=xm_source%3Ahomepage%26xm_medium%3Ahomepage;x_xmly_tid=2976919204524326065;x_xmly_ts=1582779050378;domain=.ximalaya.com;path=/;'

sign()

function sign() {
  getinfo((signinfo) => {
    if (signinfo.isTickedToday == false) {
      let url = { url: `https://m.ximalaya.com/starwar/lottery/check-in/check/action`, headers: { Cookie: cookieVal } }
      url.headers['Accept'] = `application/json, text/plain, */*`
      url.headers['Accept-Encoding'] = `gzip, deflate, br`
      url.headers['Accept-Language'] = `zh-cn`
      url.headers['Connection'] = `keep-alive`
      url.headers['Host'] = `m.ximalaya.com`
      url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 iting/6.6.45 kdtunion_iting/1.0 iting(main)/6.6.45/ios_1'
      chavy.post(url, (error, response, data) => {
        const title = `${cookieName}`
        let subTitle = ``
        let detail = ``
        if (data == 'true') {
          getacc((accinfo) => {
            subTitle = `签到结果: 成功`
            detail = `共签: ${signinfo.totalCheckedCounts + 1}天, 积分: ${accinfo.data.score}(+${signinfo.awardAmount})`
            chavy.msg(title, subTitle, detail)
            chavy.log(`${cookieName}, sign: ${data}`)
          })
        } else {
          subTitle = `签到结果: 失败`
          detail = `说明: ${data}`
          chavy.msg(title, subTitle, detail)
          chavy.log(`${cookieName}, sign: ${data}`)
        }
      })
      chavy.done()
    }
  })
}

function getinfo(cb) {
  let url = { url: `https://m.ximalaya.com/starwar/lottery/check-in/record`, headers: { Cookie: cookieVal } }
  url.headers['Accept'] = `application/json, text/plain, */*`
  url.headers['Accept-Encoding'] = `gzip, deflate, br`
  url.headers['Accept-Language'] = `zh-cn`
  url.headers['Connection'] = `keep-alive`
  url.headers['Content-Type'] = `application/json;charset=utf-8`
  url.headers['Host'] = `m.ximalaya.com`
  url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 iting/6.6.45 kdtunion_iting/1.0 iting(main)/6.6.45/ios_1'
  chavy.get(url, (error, response, data) => {
    chavy.log(`${cookieName}, signinfo: ${data}`)
    if (data) {
      const signinfo = JSON.parse(data)
      if (signinfo.isTickedToday == true) {
        getacc((accinfo) => {
          const title = `${cookieName}`
          let subTitle = `签到结果: 成功 (重复签到)`
          let detail = `共签: ${signinfo.totalCheckedCounts}天, 积分: ${accinfo.data.score}(+${signinfo.awardAmount})`
          chavy.msg(title, subTitle, detail)
          chavy.log(`${cookieName}, data: ${data}`)
        })
      } else {
        cb(signinfo)
      }
    } else {
      const title = `${cookieName}`
      let subTitle = `签到结果: 失败`
      let detail = `说明: 请选登录`
      chavy.msg(title, subTitle, detail)
    }
  })
}

function getacc(cb) {
  let url = { url: `https://m.ximalaya.com/starwar/task/listen/account`, headers: { Cookie: cookieVal } }
  url.headers['Accept'] = `application/json, text/plain, */*`
  url.headers['Accept-Encoding'] = `gzip, deflate, br`
  url.headers['Accept-Language'] = `zh-cn`
  url.headers['Connection'] = `keep-alive`
  url.headers['Content-Type'] = `application/json;charset=utf-8`
  url.headers['Host'] = `m.ximalaya.com`
  url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 iting/6.6.45 kdtunion_iting/1.0 iting(main)/6.6.45/ios_1'
  chavy.get(url, (error, response, data) => {
    cb(JSON.parse(data))
    chavy.log(`${cookieName}, acc: ${data}`)
  })
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}