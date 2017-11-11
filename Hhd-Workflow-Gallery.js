/*
 * By:Hhdº
 */

$ui.render({
  views: [{
      type: "menu",
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
                  Name: {
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
        rowHeight: 80,
        template: [{
            type: "image",
            props: {
              id: "img",
              radius: 7
            },
            layout: function(make, view) {
              make.left.top.bottom.inset(10)
              make.width.equalTo(view.height)
            }
          },
          {
            type: "label",
            props: {
              id: "Name",
              font: $font("bold", 17),
              lines: 1
            },
            layout: function(make, view) {
              make.left.equalTo($("img").right).offset(10)
              make.top.inset(13)
            }
          },
          {
            type: "label",
            props: {
              font: $font("bold", 20),
              text: ">",
              textColor: $color("gray")
            },
            layout: function(make, view) {
              make.centerY.equalTo(view.super)
              make.right.inset(15)
            }
          },
          {
            type: "label",
            props: {
              id: "note",
              font: $font(13),
              lines: 1,
              textColor: $color("gray")
            },
            layout: function(make) {
              make.left.equalTo($("Name"))
              make.bottom.inset(10)
              make.top.inset(30)
              make.right.inset(40)
            }
          },
        ],
        footer: {
          type: "label",
          props: {
            id: "LoadingLabel",
            height: 20,
            text: "加载中……",
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(12)
          }
        }
      },
      layout: function(make) {
        make.top.equalTo($("menu").bottom)
        make.right.bottom.left.inset(0)
      },
      events: {
        didSelect: function(sender, indexPath, data) {
          detailsView(data)
        }
      }
    }
  ]
})

var ver = "1.6"

if (typeof($cache.get("originalIndex")) == "undefined") {
  var indexType = 0
} else if ($cache.get("originalIndex") > $("menu").length) {
  var indexType = 0
} else {
  var indexType = $cache.get("originalIndex")
}

var shareContent = "[Title]\nBy:Hhdº\nComment"

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
    if (UpdateInfo.TheNewestVersion == ver) {
      if (UpdateInfo.Board[0] == $cache.get("Board")) {} else if (UpdateInfo.Board[0] == 0) {} else {
        $ui.alert({
          title: "通知",
          message: UpdateInfo.Board[1]
        })
        $cache.set("Board", UpdateInfo.Board[0])
      }
    } else {
      $ui.alert({
        title: "发现新版本-V" + UpdateInfo.TheNewestVersion,
        message: UpdateInfo.UpdateComment,
        actions: [{
            title: "取消"
          },
          {
            title: "更新",
            handler: function() {
              $app.openBrowser({ url: UpdateInfo.JSURL })
            }
          }
        ]
      })
    }
  }
})

function detailsView(scriptInfo) {
  $ui.push({
    props: {
      title: scriptInfo.Name.text
    },
    views: [{
        type: "image",
        props: {
          id: "BigImage",
          src: scriptInfo.img.src,
          bgcolor: $color("white")
        },
        layout: function(make, view) {
          make.top.inset(20)
          make.centerX.equalTo(view.super)
          make.size.equalTo($size(110, 110))
        }
      },
      {
        type: "button",
        props: {
          title: "分享此作品",
          id: "Share",
          bgcolor: $color("gray")
        },
        layout: function(make) {
          make.bottom.inset(30)
          make.left.inset(30)
          make.size.equalTo($size(120, 40))
        },
        events: {
          tapped: function(sender) {
            var scriptURL = "https://workflow.is/" + scriptInfo.url
            var sc = shareContent.replace(/Title/g, scriptInfo.Name.text).replace(/Comment/g, scriptInfo.note.text)
            $share.sheet([sc, scriptURL])
          }
        }
      },
      {
        type: "button",
        props: {
          title: "安装至应用",
          id: "Install",
          bgcolor: $color("gray")
        },
        layout: function(make) {
          make.bottom.inset(30)
          make.right.inset(30)
          make.size.equalTo($size(120, 40))
        },
        events: {
          tapped: function(sender) {
            $app.openBrowser({ url: "workflow://" + scriptInfo.url })
          }
        }
      },
      {
        type: "text",
        props: {
          bgcolor: $color("#EDEDED"),
          text: scriptInfo.note.text,
          radius: 7,
          font: $font("AppleColorEmoji", 17)
        },
        layout: function(make) {
          make.top.equalTo($("BigImage").bottom).offset(20)
          make.left.right.inset(30)
          make.bottom.equalTo($("Share").top).offset(-20)
        }
      },
    ]
  })
}

function load() {
  var arr = []
  var data = $cache.get("data")[$("menu").index]
  var names = data.content
  for (var i in names) {
    arr.push({
      img: {
        src: data.image[i]
      },
      Name: {
        text: names[i]
      },
      note: {
        text: data.note[i]
      },
      url: data.url[i]
    })
  }
  $("list").data = arr
  $("list").footer.text = ""
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
              timeout: 20,
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
                } else if (resp.data == "") {
                  $ui.alert("请求超时，请稍后再试")
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
