/*
 *By:Hhdº
 */

$ui.render({
  views: [{
      type: "menu",
      items: ["加载中……"],
      layout: function(make) {
        make.left.top.right.equalTo(0)
        make.height.equalTo(44)
      },
      events: {
        changed: function(sender) {
          var name = sender.items[sender.index]
          if (name == "反馈") {
            if ($cache.get("Qb") == 0) {
              sender.index = $cache.get("originalIndex")
            } else {
              sender.index = $cache.get("Qb")
            }
            fk()
          } else if (name == "全部") {
            var arr = []
            for (var idx in $cache.get("data")) {
              var data = $cache.get("data")[idx]
              var names = data.content
              for (var i in names) {
                arr.push({
                  img: {
                    src: data.image[i]
                  },
                  label: {
                    text: names[i]
                  },
                  note: {
                    text: data.note[i]
                  },
                  url: data.url[i]
                })
              }
            }
            $("list").data = arr
            $cache.set("Qb", sender.index)
          } else {
            load()
            $cache.set("originalIndex", sender.index)
            $cache.set("Qb", 0)
          }
        }
      }
    },
    {
      type: "list",
      props: {
        rowHeight: 64.0,
        separatorInset: $insets(0, 5, 0, 0),
        data: [{
          label: {
            text: "加载中，请稍后……"
          },
          img: {
            src: "https://i.loli.net/2017/11/11/5a063c1585414.jpg"
          }
        }],
        template: [{
            type: "image",
            props: {
              id: "img",
              radius: 7
            },
            layout: function(make, view) {
              make.left.top.bottom.inset(5)
              make.width.equalTo(view.height)
            }
          },
          {
            type: "label",
            props: {
              id: "label",
              font: $font("bold", 16),
              lines: 1
            },
            layout: function(make, view) {
              make.left.equalTo($("img").right).offset(10)
              make.top.equalTo(10)
              make.right.inset(10)
              make.height.equalTo(20)
            }
          },
          {
            type: "label",
            props: {
              id: "note",
              font: $font(12),
              lines: 1,
              radius: 2,
              textColor: $color("gray")
            },
            layout: function(make) {
              make.left.equalTo($("label"))
              make.top.equalTo($("label").bottom).offset(5)
              make.bottom.equalTo(-10)
            }
          },
        ],
        actions: [{
          title: "分享此规则",
          handler: function(sender, indexPath) {
            $share.sheet("https://workflow.is/" + sender.data[indexPath.row].url)
          }
        }]
      },
      layout: function(make) {
        make.top.equalTo($("menu").bottom)
        make.right.bottom.left.inset(0)
      },
      events: {
        didSelect: function(sender, indexPath, data) {
          $app.openURL("workflow://" + data.url)
        }
      }
    }
  ]
})

var ver = "1.1"

if (typeof($cache.get("originalIndex")) == "undefined") {
  var indexType = 0
} else if ($cache.get("originalIndex") > $("menu").length) {
  var indexType = 0
} else {
  var indexType = $cache.get("originalIndex")
}

var text = "{\"reqName\":\"反馈\",\"reqEmail\":\"\",\"prop0\":\"zdy1\",\"reqContent\":\"zdy2\",\"memberId\":0}"

$ui.loading(true)
$http.get({
  url: "https://coding.net/u/Hhhd/p/Hhhd1507206502721.Coding.me/git/raw/master/Hhd%25E6%259B%25B4%25E6%2596%25B0%25E5%2599%25A8",
  handler: function(resp) {
    $ui.loading(false)
    var titles = resp.data.map(function(i) { return i.title })
    titles.push("全部", "反馈")
    $("menu").items = titles
    $("menu").index = indexType
    $cache.set("data", resp.data)
    load()
    var UpdateInfo = resp.data[0]
    if (resp.data[0].TheNewestVersion == ver) {} else {
      $ui.alert({
        title: "发现新版本-V" + UpdateInfo.TheNewestVersion,
        message: "更新说明:\n" + UpdateInfo.UpdateComment,
        actions: [{
            title: "取消"
          },
          {
            title: "更新",
            handler: function() {
              $app.openURL("pin://install?url=" + UpdateInfo.JSURL)
            }
          }
        ]
      })
    }
  }
})

function load() {
  var arr = []
  var data = $cache.get("data")[$("menu").index]
  var names = data.content
  for (var i in names) {
    arr.push({
      img: {
        src: data.image[i]
      },
      label: {
        text: names[i]
      },
      note: {
        text: data.note[i]
      },
      url: data.url[i]
    })
  }
  $("list").data = arr
}

function fk() {
  $ui.push({
    props: {
      title: "反馈"
    },
    views: [{
        type: "label",
        props: {
          id: "Way",
          text: "联系方式:"
        },
        layout: function(make) {
          make.top.left.inset(10)
          make.width.equalTo(70)
          make.height.equalTo(30)
        }
      },
      {
        type: "input",
        props: {
          id: "Lxfs",
          placeholder: "邮箱/QQ/微信/TG",
        },
        layout: function(make) {
          make.top.right.inset(10)
          make.left.equalTo($("Way").right).offset(10)
          make.height.equalTo($("Way"))
        }
      },
      {
        type: "label",
        props: {
          id: "Way1",
          text: "反馈内容:"
        },
        layout: function(make) {
          make.left.inset(10)
          make.width.equalTo(70)
          make.top.equalTo($("Way").bottom).offset(20)
        }
      },
      {
        type: "text",
        props: {
          id: "FKtext",
          bgcolor: $color("#EDEDED"),
          radius: 7,
        },
        layout: function(make) {
          make.right.inset(10)
          make.left.equalTo($("Way1").right).offset(10)
          make.height.equalTo(150)
          make.top.equalTo($("Way1"))
        }
      },
      {
        type: "button",
        props: {
          title: "发送反馈",
          bgcolor: $color("gray")
        },
        layout: function(make) {
          make.top.equalTo($("FKtext").bottom).offset(20)
          make.right.left.inset(10)
        },
        events: {
          tapped: function(sender) {
            $ui.loading(true)
            $http.request({
              method: "POST",
              url: "http://m.zy13815040.icoc.me/ajax/msgBoard_h.jsp",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: {
                moduleId: 7,
                validateCode: null,
                cmd: "add",
                _TOKEN: undefined,
                msgBdData: text.replace("zdy1", $("Lxfs").text).replace("zdy2", $("FKtext").text)
              },
              handler: function(resp) {
                $ui.loading(false)
                if (resp.data.success == true) {
                  $ui.alert("反馈成功，请等待回复")
                  $ui.pop()
                } else {
                  $ui.alert("反馈失败，请稍后再试")
                }
              }
            })
          }
        }
      }
    ]
  })
}