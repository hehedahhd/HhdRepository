/*
轻量级酷狗音乐客户端
支持下载无损视频和音乐
By:Hhdº
*/

//注:如想收藏歌曲尽量在搜索页面收藏

mainView()

var text = "{\"reqName\":\"来自酷狗音乐的反馈\",\"reqEmail\":\"\",\"prop0\":\"zdy1\",\"reqContent\":\"zdy2\",\"memberId\":0}"

var allQuality = ["sq", "rq", "le"]

$file.mkdir("FavoriteSongs")

/* 搜索界面 */
function mainView() {
  $ui.render({
    props: {
      bgcolor: $color("black")
    },
    views: [{
        type: "menu",
        props: {
          id: "Menu",
          items: ["搜索", "收藏", "更多"]
        },
        layout: function(make) {
          make.left.bottom.right.equalTo(0)
          make.height.equalTo(44)
        },
        events: {
          changed: function(sender) {
            $delay(0.1, function() {
              if (sender.index == 1) {
                favorite()
              } else {
                more()
              }
            })
          }
        }
      },
      {
        type: "list",
        props: {
          id: "List",
          data: [{
            rows: [{
                type: "input",
                props: {
                  id: "Search",
                  type: $kbType.search,
                  darkKeyboard: true,
                  align: $align.center,
                  placeholder: "输入歌名/歌手"
                },
                layout: function(make, view) {
                  make.left.right.top.bottom.inset(5)
                },
                events: {
                  returned: function(sender) {
                    ReadyToSearch(sender.text)
                    sender.blur()
                  },
                  changed: function(sender) {
                    if (sender.text == "") {
                      $("list").data = $cache.get("Hot")
                    } else {
                      ssjy(sender.text)
                    }
                  }
                }
              },
              {
                type: "label",
                props: {
                  text: "Made by Hhdº"
                },
                layout: function(make, view) {
                  make.left.inset(10)
                  make.centerY.equalTo(view.super)
                }
              }
            ]
          }]
        },
        layout: function(make, view) {
          make.height.equalTo(45)
          make.right.left.top.inset(0)
        }
      },
      {
        type: "list",
        props: {
          id: "list",
          header: {
            type: "label",
            props: {
              height: 20,
              text: "加载中…",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          }
        },
        layout: function(make) {
          make.right.left.inset(0)
          make.top.equalTo($("List").bottom)
          make.bottom.equalTo($("Menu").top).offset(-1)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            ReadyToSearch(data)
            $("Search").blur()
          }
        }
      }
    ]
  })

  $http.get({
    url: "http://ioscdn.kugou.com/api/v3/search/hot?plat=2&count=50",
    handler: function(resp) {
      var data = resp.data.data.info
      var arr = new Array()
      for (var i = 0; i < data.length; i++) {
        if (data[i].jumpurl.indexOf("html") == -1) {
          arr.push(data[i].keyword)
        }
      }
      $("list").data = arr
      $("list").header.align = $align.left
      $("list").header.bgcolor = $color("#EDEDED")
      $("list").header.text = "   热搜歌曲:"
      $cache.set("Hot", arr)
    }
  })

  var cache = $cache.get("Hot")

  if (cache) $("list").data = cache
}

/* 设置界面 */
function Setting() {
  $ui.push({
    props: {
      title: "设置"
    },
    views: [{
      type: "list",
      props: {
        id: "setlist",
        bgcolor: $color("white"),
        data: [{
          title: "其他",
          rows: [{
              Title: {
                text:"更新说明"
              }
            },
            {
              Title: {
                text: "反馈问题"
              }
            }
          ]
        }],
        template: [{
            type: "label",
            props: {
              id: "Title",
              font: $font(16)
            },
            layout: function(make, view) {
              make.left.inset(10)
              make.centerY.equalTo(view.super)
            }
          },
          {
            type: "label",
            props: {
              font: $font("bold", 18),
              text: ">",
              textColor: $color("#AAAAAA"),
            },
            layout: function(make, view) {
              make.right.inset(10)
              make.centerY.equalTo(view.super)
            }
          }
        ],
        footer: {
          type: "label",
          props: {
            height: 60,
            text: "Made by Hhdº\n\nVersion 1.2",
            textColor: $color("#AAAAAA"),
            align: $align.center,
            lines: 0,
            font: $font(12)
          }
        }
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath, data) {
          switch (data.Title.text) {
            case "反馈问题":
              Fankui()
              break
              case "更新说明":
              $ui.alert({
                title:"V1.1 - V1.2",
                message:"1.支持收藏和历史记录界面长按排序\n2.”更多”界面更改\n3.新增“设置界面”\n4.细节优化\n5.修复一个小bug\n\n注:左滑歌曲可以收藏,没有搜到想听的歌可以试试歌词搜索"
              })
              break
          }
        }
      }
    }]
  })
}

/* 排行榜 */
function Top() {
  $ui.push({
    props: {
      title: "排行榜"
    },
    views: [{
      type: "list",
      props: {
        id: "TopList",
        rowHeight: 80.0,
        template: [{
            type: "image",
            props: {
              id: "Topimage"
            },
            layout: function(make, view) {
              make.left.top.bottom.inset(5)
              make.width.equalTo(view.height)
            }
          },
          {
            type: "label",
            props: {
              id: "Rankname",
              font: $font("bold", 17),
              lines: 0
            },
            layout: function(make, view) {
              make.left.equalTo($("Topimage").right).offset(10)
              make.centerY.equalTo(view.super)
              make.right.inset(10)
            }
          },
          {
            type: "label",
            props: {
              font: $font("bold", 18),
              text: ">",
              textColor: $color("#AAAAAA"),
            },
            layout: function(make, view) {
              make.right.inset(10)
              make.centerY.equalTo(view.super)
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath, data) {
          $cache.set("SingerPage", 1)
          TopView(data.id, data.Rankname.text, data.Topimage.src, data.intro)
        }
      }
    }]
  })
  $http.get({
    url: "http://mobilecdngz.kugou.com/api/v3/rank/list?plat=2&withsong=1&showtype=2&parentid=0&apiver=4&version=8865&area_code=1",
    handler: function(resp) {
      var stories = resp.data.data.info
      for (var idx in stories) {
        var story = stories[idx]
        $("TopList").insert({
          indexPath: $indexPath(0, $("TopList").data.length),
          value: {
            id: story.rankid,
            intro: story.intro,
            Topimage: {
              src: story.imgurl.replace("/{size}", "")
            },
            Rankname: {
              text: story.rankname
            }
          }
        })
      }
    }
  })
}

/* 排行榜歌曲显示界面 */
function TopView(id, title, imgurl, intro) {
  $ui.push({
    props: {
      title: title
    },
    views: [{
        type: "image",
        props: {
          id: "Picture",
          src: imgurl
        },
        layout: function(make) {
          make.top.left.right.inset(0)
          make.height.equalTo(250)
        }
      },
      {
        type: "button",
        props: {
          id: "SingerInfoButton",
          type: 3
        },
        layout: function(make) {
          make.right.inset(5)
          make.bottom.equalTo($("Picture").bottom).offset(-5)
          make.size.equalTo($size(30, 30))
        },
        events: {
          tapped: function(sender) {
            $ui.alert({
              title: title,
              message: intro,
              actions: [{
                  title: "查看大图",
                  handler: function() {
                    $quicklook.open({
                      url: imgurl
                    })
                  }
                },
                {
                  title: "下载图片",
                  handler: function() {
                    GetSong(imgurl)
                  }
                },
                {
                  title: "取消"
                }
              ]
            })
          }
        }
      },
      {
        type: "list",
        props: {
          id: "SingerGallery",
          rowHeight: 64,
          template: [{
              type: "button",
              props: {
                id: "x-button",
                icon: $icon("049", $color("#00B2EE"), $size(25, 25)),
                bgcolor: $color("white")
              },
              layout: function(make, view) {
                make.centerY.equalTo(view.super)
                make.right.inset(10)
              },
              events: {
                tapped(sender) {
                  $http.get({
                    url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + sender.info[0],
                    handler: function(resp) {
                      $audio.play({
                        url: resp.data.data.play_url
                      })
                      $ui.toast("开始播放：" + resp.data.data.song_name)
                    }
                  })
                }
              }
            },
            {
              type: "label",
              props: {
                id: "title",
                font: $font("bold", 16),
              },
              layout: function(make, view) {
                make.left.inset(10)
                make.centerY.equalTo(view.super)
                make.right.inset(70)
                make.height.equalTo(20)
              }
            }
          ],
          header: {
            type: "label",
            props: {
              height: 20,
              text: "加载中…",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          footer: {
            type: "label",
            props: {
              height: 30,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          actions: [{
            title: "收藏",
            handler: function(sender, indexPath) {
              var newItem = sender.data[indexPath.row]
              var buttonInfo = newItem["x-button"].info
              $file.write({
                data: $data({ string: [buttonInfo[0] + "&&&" + newItem.name.text + "&&&" + buttonInfo[1] + "&&&" + buttonInfo[2]] + "&&&" + newItem.albumID }),
                path: "FavoriteSongs/" + newItem.title.text + ".txt"
              })
              $ui.toast("已收藏")
            }
          }]
        },
        layout: function(make) {
          make.bottom.left.right.inset(0)
          make.top.equalTo($("Picture").bottom)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            $http.get({
              url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + data["x-button"].info[0],
              handler: function(resp) {
                detailsView(resp.data.data, data["x-button"].info[1], data["x-button"].info[2], data.albumID)
              }
            })
          },
          didReachBottom: function(sender) {
            sender.endFetchingMore()
            if (sender.footer.text !== "加载完毕") {
              sender.footer.text = sender.data.length + "/" + sender.header.text.match(/\d+(?=\))/)
              var page = $cache.get("SingerPage") + 1
              $cache.set("SingerPage", page)
              $http.get({
                url: "http://mobilecdngz.kugou.com/api/v3/rank/song?rankid=" + id + "&ranktype=2&page=" + page + "&pagesize=30&volid=&plat=2&version=8865&area_code=1",
                handler: function(resp) {
                  var data = resp.data.data.info
                  if (typeof(data[0]) == "undefined") {
                    sender.footer.text = "加载完毕"
                  }
                  for (var i = 0; i < data.length; i++) {
                    var story = data[i]
                    var album = (story.album_name !== "") ? story.album_name : "未知专辑"
                    sender.insert({
                      indexPath: $indexPath(0, sender.data.length),
                      value: {
                        title: {
                          text: story.filename
                        },
                        "x-button": {
                          info: [story.hash, story.mvhash, story.sqhash]
                        },
                        albumID: story.album_id
                      }
                    })
                  }
                }
              })
            }
          }
        }
      }
    ]
  })
  $http.get({
    url: "http://mobilecdngz.kugou.com/api/v3/rank/song?rankid=" + id + "&ranktype=2&page=1&pagesize=30&volid=&plat=2&version=8865&area_code=1",
    handler: function(resp) {
      var data = resp.data.data.info
      for (var i = 0; i < data.length; i++) {
        var story = data[i]
        var album = (story.album_name !== "") ? story.album_name : "未知专辑"
        $("SingerGallery").insert({
          indexPath: $indexPath(0, $("SingerGallery").data.length),
          value: {
            title: {
              text: story.filename
            },
            "x-button": {
              info: [story.hash, story.mvhash, story.sqhash]
            },
            albumID: story.album_id
          }
        })
      }
      $("SingerGallery").header.align = $align.left
      $("SingerGallery").header.bgcolor = $color("#EDEDED")
      $("SingerGallery").header.text = "   单曲" + "(" + resp.data.data.total + ")"
    }
  })
}

/* 歌曲收藏界面 */
function favorite() {
  $ui.render({
    props: {
      bgcolor: $color("black")
    },
    views: [{
        type: "menu",
        props: {
          id: "SetMenu",
          items: ["搜索", "收藏", "更多"],
          index: 1
        },
        layout: function(make) {
          make.left.bottom.right.equalTo(0)
          make.height.equalTo(44)
        },
        events: {
          changed: function(sender) {
            $delay(0.1, function() {
              if (sender.index == 0) {
                mainView()
              } else {
                more()
              }
            })
          }
        }
      },
      {
        type: "list",
        props: {
          id: "FavoriteGallery",
          rowHeight: 64,
          reorder: true,
          template: [{
              type: "button",
              props: {
                id: "x-button",
                icon: $icon("049", $color("#00B2EE"), $size(25, 25)),
                bgcolor: $color("white")
              },
              layout: function(make, view) {
                make.centerY.equalTo(view.super)
                make.right.inset(10)
              },
              events: {
                tapped(sender) {
                  $http.get({
                    url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + sender.info[0],
                    handler: function(resp) {
                      $audio.play({
                        url: resp.data.data.play_url
                      })
                      $ui.toast("开始播放：" + resp.data.data.song_name)
                    }
                  })

                }
              }
            },
            {
              type: "label",
              props: {
                id: "title",
                font: $font("bold", 16),
              },
              layout: function(make, view) {
                make.left.inset(10)
                make.top.equalTo(10)
                make.right.inset(70)
                make.height.equalTo(20)
              }
            },
            {
              type: "label",
              props: {
                id: "name",
                font: $font("bold", 12),
                textColor: $color("#777777"),
              },
              layout: function(make) {
                make.left.equalTo($("title"))
                make.top.equalTo($("title").bottom).offset(5)
                make.bottom.equalTo(-10)
              }
            }
          ],
          header: {
            type: "label",
            props: {
              height: 20,
              bgcolor: $color("#EDEDED"),
              align: $align.left,
              textColor: $color("#AAAAAA"),
              font: $font(12),
              text: "   收藏歌曲:"
            }
          },
          actions: [{
            title: "取消收藏",
            handler: function(sender, indexPath) {
              $file.delete("FavoriteSongs/" + sender.data[indexPath.row].title.text + ".txt")
              $("FavoriteGallery").delete(indexPath)
              $cache.set("FavoriteList", sender.data.map(function(i) { return i.title.text }))
            }
          }]
        },
        layout: function(make) {
          make.left.right.top.inset(0)
          make.bottom.equalTo($("SetMenu").top).offset(-1)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            $http.get({
              url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + data["x-button"].info[0],
              handler: function(resp) {
                detailsView(resp.data.data, data["x-button"].info[1], data["x-button"].info[2], data.albumID)
              }
            })
          },
          reorderFinished: function(data) {
            $cache.set("FavoriteList", data.map(function(i) { return i.title.text }))
          }
        }
      }
    ]
  })

  var songs = $cache.get("FavoriteList")
  for (var i in songs) {
    var content = $file.read("FavoriteSongs/" + songs[i] + ".txt").string.split("&&&")
    $("FavoriteGallery").insert({
      indexPath: $indexPath(0, $("FavoriteGallery").data.length),
      value: {
        title: {
          text: songs[i]
        },
        name: {
          text: content[1]
        },
        "x-button": {
          info: [content[0], content[2], content[3]]
        },
        albumID: content[4]
      }
    })
  }
}

/* 更多界面 */
function more() {
  $ui.render({
    props: {
      bgcolor: $color("black")
    },
    views: [{
        type: "menu",
        props: {
          id: "moreMenu",
          items: ["搜索", "收藏", "更多"],
          index: 2
        },
        layout: function(make) {
          make.left.bottom.right.equalTo(0)
          make.height.equalTo(44)
        },
        events: {
          changed: function(sender) {
            $delay(0.1, function() {
              if (sender.index == 1) {
                favorite()
              } else {
                mainView()
              }
            })
          }
        }
      },
      {
        type: "view",
        props: {
          bgcolor: $color("white")
        },
        layout: function(make) {
          make.left.right.top.inset(0)
          make.bottom.equalTo($("moreMenu").top).offset(-1)
        },
        views: [{
            type: "image",
            props: {
              id: "ico",
              src: "http://m.kugou.com/static/images/share2014/ico_logo.png",
              bgcolor: $color("white")
            },
            layout: function(make, view) {
              make.top.inset(20)
              make.size.equalTo(110, 110)
              make.centerX.equalTo(view.super)
            }
          },
          {
            type: "button",
            props: {
              id: "b1",
              title: "  歌曲排行",
              icon: $icon("028", $color("white"), $size(25, 25)),
              font: $font("bold", 18),
              bgcolor: $color("#00B2EE")
            },
            layout: function(make, view) {
              make.right.left.inset(10)
              make.top.equalTo($("ico").bottom).offset(20)
              make.height.equalTo(40)
            },
            events: {
              tapped: function(sender) {
                Top()
              }
            }
          },
          {
            type: "button",
            props: {
              id: "b2",
              title: "  历史记录",
              icon: $icon("099", $color("white"), $size(25, 25)),
              font: $font("bold", 18),
              bgcolor: $color("#00B2EE")
            },
            layout: function(make, view) {
              make.right.left.inset(10)
              make.top.equalTo($("b1").bottom).offset(10)
              make.height.equalTo(40)
            },
            events: {
              tapped: function(sender) {
                History()
              }
            }
          },
          {
            type: "button",
            props: {
              id: "b3",
              title: "  脚本设置",
              icon: $icon("002", $color("white"), $size(25, 25)),
              font: $font("bold", 18),
              bgcolor: $color("#00B2EE")
            },
            layout: function(make, view) {
              make.right.left.inset(10)
              make.top.equalTo($("b2").bottom).offset(10)
              make.height.equalTo(40)
            },
            events: {
              tapped: function(sender) {
                Setting()
              }
            }
          }
        ]
      }
    ]
  })
}

/* 歌手详情界面 */
function singerDetailsView(scriptInfo, imgurl, number) {
  $ui.push({
    props: {
      title: (number == 0) ? scriptInfo.singername : scriptInfo.albumname
    },
    views: [{
        type: "image",
        props: {
          id: "Picture",
          src: imgurl
        },
        layout: function(make) {
          make.top.left.right.inset(0)
          make.height.equalTo(250)
        }
      },
      {
        type: "button",
        props: {
          id: "SingerInfoButton",
          type: 3
        },
        layout: function(make) {
          make.right.inset(5)
          make.bottom.equalTo($("Picture").bottom).offset(-5)
          make.size.equalTo($size(30, 30))
        },
        events: {
          tapped: function(sender) {
            $ui.alert({
              title: (number == 0) ? scriptInfo.singername : scriptInfo.albumname,
              message: scriptInfo.intro,
              actions: [{
                  title: "查看大图",
                  handler: function() {
                    $quicklook.open({
                      url: imgurl
                    })
                  }
                },
                {
                  title: "下载图片",
                  handler: function() {
                    GetSong(imgurl)
                  }
                },
                {
                  title: "取消"
                }
              ]
            })
          }
        }
      },
      {
        type: "list",
        props: {
          id: "SingerGallery",
          rowHeight: 64,
          template: [{
              type: "button",
              props: {
                id: "x-button",
                icon: $icon("049", $color("#00B2EE"), $size(25, 25)),
                bgcolor: $color("white")
              },
              layout: function(make, view) {
                make.centerY.equalTo(view.super)
                make.right.inset(10)
              },
              events: {
                tapped(sender) {
                  $http.get({
                    url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + sender.info[0],
                    handler: function(resp) {
                      $audio.play({
                        url: resp.data.data.play_url
                      })
                      $ui.toast("开始播放：" + resp.data.data.song_name)
                    }
                  })
                }
              }
            },
            {
              type: "label",
              props: {
                id: "title",
                font: $font("bold", 16),
              },
              layout: function(make, view) {
                make.left.inset(10)
                make.centerY.equalTo(view.super)
                make.right.inset(70)
                make.height.equalTo(20)
              }
            }
          ],
          header: {
            type: "label",
            props: {
              height: 20,
              text: "加载中…",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          footer: {
            type: "label",
            props: {
              height: 30,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          actions: [{
            title: "收藏",
            handler: function(sender, indexPath) {
              var newItem = sender.data[indexPath.row]
              var buttonInfo = newItem["x-button"].info
              $file.write({
                data: $data({ string: [buttonInfo[0] + "&&&" + "" + "&&&" + buttonInfo[1] + "&&&" + buttonInfo[2]] + "&&&" + newItem.albumID }),
                path: "FavoriteSongs/" + newItem.title.text + ".txt"
              })
              $ui.toast("已收藏")
            }
          }]
        },
        layout: function(make) {
          make.bottom.left.right.inset(0)
          make.top.equalTo($("Picture").bottom)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            $http.get({
              url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + data["x-button"].info[0],
              handler: function(resp) {
                detailsView(resp.data.data, data["x-button"].info[1], data["x-button"].info[2], data.albumID)
              }
            })
          },
          didReachBottom: function(sender) {
            sender.endFetchingMore()
            if (sender.footer.text !== "加载完毕") {
              sender.footer.text = sender.data.length + "/" + sender.header.text.match(/\d+(?=\))/)
              var page = $cache.get("SingerPage") + 1
              $cache.set("SingerPage", page)
              $http.get({
                url: (number == 0) ? "http://ioscdn.kugou.com/api/v3/singer/song?singerid=" + scriptInfo.singerid + "&page=" + page + "&pagesize=30" : "http://ioscdn.kugou.com/api/v3/album/song?albumid=" + scriptInfo.albumid + "&page=" + page + "&pagesize=-1&plat=2",
                handler: function(resp) {
                  var data = resp.data.data.info
                  if (typeof(data[0]) == "undefined") {
                    sender.footer.text = "加载完毕"
                  }
                  for (var i = 0; i < data.length; i++) {
                    var story = data[i]
                    var album = (story.album_name !== "") ? story.album_name : "未知专辑"
                    sender.insert({
                      indexPath: $indexPath(0, sender.data.length),
                      value: {
                        title: {
                          text: story.filename
                        },
                        name: {
                          text: album
                        },
                        "x-button": {
                          info: [story.hash, story.mvhash, story.sqhash]
                        },
                        albumID: story.album_id
                      }
                    })
                  }
                }
              })
            }
          }
        }
      }
    ]
  })
  $http.get({
    url: (number == 0) ? "http://ioscdn.kugou.com/api/v3/singer/song?singerid=" + scriptInfo.singerid + "&page=1&pagesize=30" : "http://ioscdn.kugou.com/api/v3/album/song?albumid=" + scriptInfo.albumid + "&page=1&pagesize=-1&plat=2",
    handler: function(resp) {
      var data = resp.data.data.info
      for (var i = 0; i < data.length; i++) {
        var story = data[i]
        $("SingerGallery").insert({
          indexPath: $indexPath(0, $("SingerGallery").data.length),
          value: {
            title: {
              text: story.filename
            },
            "x-button": {
              info: [story.hash, story.mvhash, story.sqhash]
            },
            albumID: story.album_id
          }
        })
      }
      $("SingerGallery").header.align = $align.left
      $("SingerGallery").header.bgcolor = $color("#EDEDED")
      $("SingerGallery").header.text = "   单曲" + "(" + resp.data.data.total + ")"
    }
  })
}

/* 搜索记录界面 */
function History() {
  var histroy = $cache.get("Histroy")
  $ui.push({
    views: [{
        type: "button",
        props: {
          id: "DeleteHistroy",
          title: "删除所有历史记录",
          bgcolor: $color("#00B2EE")
        },
        layout: function(make) {
          make.right.left.bottom.inset(5)
        },
        events: {
          tapped(sender) {
            $ui.menu({
              items: ["删除所有历史记录"],
              handler: function() {
                $cache.remove("Histroy")
                $ui.toast("已清除")
                $ui.pop()
              }
            })
          }
        }
      },
      {
        type: "list",
        props: {
          id: "historyList",
          reorder: true,
          data: histroy,
          header: {
            type: "label",
            props: {
              height: 20,
              bgcolor: $color("#EDEDED"),
              align: $align.left,
              textColor: $color("#AAAAAA"),
              font: $font(12)
            }
          },
          actions: [{
            title: "delete",
            handler: function() {
              $cache.set("Histroy", $("historyList").data)
              $("historyList").header.text = "   搜索记录(" + $("historyList").data.length + ")"
            }
          }]
        },
        layout: function(make) {
          make.bottom.equalTo($("DeleteHistroy").top).offset(-5)
          make.right.left.top.inset(0)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            ReadyToSearch(data)
          },
          reorderFinished: function(data) {
            $cache.set("Histroy", data)
          }
        }
      },
    ]
  })
  $("historyList").header.text = "   搜索记录(" + $("historyList").data.length + ")"
}

/* 歌曲搜索界面 */
function search(input) {
  $ui.push({
    views: [{
        type: "tab",
        props: {
          items: ["歌曲", "歌词"],
          tintColor: $color("#00B2EE")
        },
        layout: function(make) {
          make.top.right.left.inset(5)
        },
        events: {
          changed: function(sender) {
            $("Gallery").data = [""]
            $cache.set("Page", 1)
            $("Gallery").footer.text = "加载中…"
            if (sender.index == 1) {
              $http.get({
                url: "http://mobilecdngz.kugou.com/api/v3/lyric/search?keyword=" + encodeURI(input) + "&page=1&pagesize=30&plat=2&version=8865&highlight=1&area_code=1",
                handler: function(resp) {
                  var data = resp.data.data.info
                  for (var i = 0; i < data.length; i++) {
                    var story = data[i]
                    if (i == 0) {
                      $("Gallery").data = [{
                        title: {
                          text: story.filename
                        },
                        name: {
                          text: story.lyric.replace(/<em>/g, "").replace(/<\/em>/g, "")
                        },
                        "x-button": {
                          info: [story.hash, story.mvhash, story.sqhash]
                        },
                        albumID: story.album_id
                      }]
                    } else {
                      $("Gallery").insert({
                        indexPath: $indexPath(0, $("Gallery").data.length),
                        value: {
                          title: {
                            text: story.filename
                          },
                          name: {
                            text: story.lyric.replace(/<em>/g, "").replace(/<\/em>/g, "")
                          },
                          "x-button": {
                            info: [story.hash, story.mvhash, story.sqhash]
                          },
                          albumID: story.album_id
                        }
                      })
                    }

                  }
                  $("Gallery").header.text = "   包含\"" + input + "\"的歌" + "(" + resp.data.data.total + ")"
                }
              })
            } else {
              $http.get({
                url: "http://ioscdn.kugou.com/api/v3/search/song?keyword=" + encodeURI(input) + "&page=1&pagesize=30&showtype=10&plat=2",
                handler: function(resp) {
                  var data = resp.data.data.info
                  for (var i = 0; i < data.length; i++) {
                    var story = data[i]
                    var album = (story.album_name !== "") ? story.album_name : "未知专辑"
                    if (i == 0) {
                      $("Gallery").data = [{
                        title: {
                          text: story.filename
                        },
                        name: {
                          text: album
                        },
                        "x-button": {
                          info: [story.hash, story.mvhash, story.sqhash]
                        },
                        albumID: story.album_id
                      }]
                    } else {
                      $("Gallery").insert({
                        indexPath: $indexPath(0, $("Gallery").data.length),
                        value: {
                          title: {
                            text: story.filename
                          },
                          name: {
                            text: album
                          },
                          "x-button": {
                            info: [story.hash, story.mvhash, story.sqhash]
                          },
                          albumID: story.album_id
                        }
                      })
                    }
                  }
                  $("Gallery").header.text = "   \"" + input + "\"的搜索结果" + "(" + resp.data.data.total + ")"
                }
              })
            }
            $("Gallery").footer.text = ""
          }
        }
      },
      {
        type: "list",
        props: {
          id: "Gallery",
          rowHeight: 64,
          template: [{
              type: "button",
              props: {
                id: "x-button",
                icon: $icon("049", $color("#00B2EE"), $size(25, 25)),
                bgcolor: $color("white")
              },
              layout: function(make, view) {
                make.centerY.equalTo(view.super)
                make.right.inset(10)
              },
              events: {
                tapped(sender) {
                  $http.get({
                    url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + sender.info[0],
                    handler: function(resp) {
                      $audio.play({
                        url: resp.data.data.play_url
                      })
                      $ui.toast("开始播放：" + resp.data.data.song_name)
                    }
                  })
                }
              }
            },
            {
              type: "label",
              props: {
                id: "title",
                font: $font("bold", 16),
              },
              layout: function(make, view) {
                make.left.inset(10)
                make.top.equalTo(10)
                make.right.inset(70)
                make.height.equalTo(20)
              }
            },
            {
              type: "label",
              props: {
                id: "name",
                font: $font("bold", 12),
                textColor: $color("#777777"),
              },
              layout: function(make) {
                make.left.equalTo($("title"))
                make.top.equalTo($("title").bottom).offset(5)
                make.bottom.equalTo(-10)
              }
            }
          ],
          header: {
            type: "label",
            props: {
              height: 20,
              text: "加载中…",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          footer: {
            type: "label",
            props: {
              height: 30,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          actions: [{
            title: "收藏",
            handler: function(sender, indexPath) {
              var newItem = sender.data[indexPath.row]
              var buttonInfo = newItem["x-button"].info
              $file.write({
                data: $data({ string: [buttonInfo[0] + "&&&" + newItem.name.text + "&&&" + buttonInfo[1] + "&&&" + buttonInfo[2]] + "&&&" + newItem.albumID }),
                path: "FavoriteSongs/" + newItem.title.text + ".txt"
              })
              var fItems = $cache.get("FavoriteList")
              if (fItems) {
                fItems.unshift(newItem.title.text)
              } else {
                var fItems = new Array(newItem.title.text)
              }
              $cache.set("FavoriteList", fItems)
              $ui.toast("已收藏")
            }
          }]
        },
        layout: function(make) {
          make.bottom.left.right.inset(0)
          make.top.equalTo($("tab").bottom).offset(5)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            $http.get({
              url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + data["x-button"].info[0],
              handler: function(resp) {
                detailsView(resp.data.data, data["x-button"].info[1], data["x-button"].info[2], data.albumID)
              }
            })
          },
          didReachBottom: function(sender) {
            sender.endFetchingMore()
            if (sender.footer.text !== "加载完毕") {
              sender.footer.text = sender.data.length + "/" + sender.header.text.match(/\d+(?=\))/)
              var page = $cache.get("Page") + 1
              $cache.set("Page", page)
              $http.get({
                url: ($("tab").index == 0) ? "http://ioscdn.kugou.com/api/v3/search/song?keyword=" + encodeURI(input) + "&page=" + page + "&pagesize=30&showtype=10&plat=2" : "http://mobilecdngz.kugou.com/api/v3/lyric/search?keyword=" + encodeURI(input) + "&page=" + page + "&pagesize=30&plat=2&version=8865&highlight=1&area_code=1",
                handler: function(resp) {
                  var data = resp.data.data.info
                  if (typeof(data[0]) == "undefined") {
                    sender.footer.text = "加载完毕"
                  }
                  for (var i = 0; i < data.length; i++) {
                    var story = data[i]
                    var album = (story.album_name !== "") ? story.album_name : "未知专辑"
                    sender.insert({
                      indexPath: $indexPath(0, sender.data.length),
                      value: {
                        title: {
                          text: story.filename
                        },
                        name: {
                          text: ($("tab").index == 0) ? album : story.lyric.replace(/<em>/g, "").replace(/<\/em>/g, "")
                        },
                        "x-button": {
                          info: [story.hash, story.mvhash, story.sqhash]
                        },
                        albumID: story.album_id
                      }
                    })
                  }
                }
              })
            }
          }
        }
      }
    ]
  })
  $http.get({
    url: "http://ioscdn.kugou.com/api/v3/search/song?keyword=" + encodeURI(input) + "&page=1&pagesize=30&showtype=10&plat=2",
    handler: function(resp) {
      var data = resp.data.data.info
      for (var i = 0; i < data.length; i++) {
        var story = data[i]
        var album = (story.album_name !== "") ? story.album_name : "未知专辑"
        $("Gallery").insert({
          indexPath: $indexPath(0, $("Gallery").data.length),
          value: {
            title: {
              text: story.filename
            },
            name: {
              text: album
            },
            "x-button": {
              info: [story.hash, story.mvhash, story.sqhash]
            },
            albumID: story.album_id
          }
        })
      }
      $("Gallery").header.align = $align.left
      $("Gallery").header.bgcolor = $color("#EDEDED")
      $("Gallery").header.text = "   \"" + input + "\"的搜索结果" + "(" + resp.data.data.total + ")"
    }
  })
}

/* 歌曲详情界面 */
function detailsView(scriptInfo, mvHash, sqHash, album_id) {
  $ui.push({
    views: [{
        type: "image",
        props: {
          id: "BigImage",
          src: scriptInfo.img,
          bgcolor: $color("white")
        },
        layout: function(make, view) {
          make.top.inset(20)
          make.centerX.equalTo(view.super)
          make.size.equalTo($size(100, 100))
        }
      },
      {
        type: "label",
        props: {
          id: "SongName",
          text: scriptInfo.song_name,
          font: $font(17)
        },
        layout: function(make, view) {
          make.centerX.equalTo(view.super)
          make.top.equalTo($("BigImage").bottom).offset(20)
        }
      },
      {
        type: "label",
        props: {
          id: "OtherInfo",
          text: "歌手:" + scriptInfo.author_name + "     专辑:" + scriptInfo.album_name
        },
        layout: function(make, view) {
          make.centerX.equalTo(view.super)
          make.top.equalTo($("SongName").bottom).offset(10)
        }
      },
      {
        type: "view",
        props: {
          id: "rqView",
        },
        views: [{
            type: "button",
            props: {
              title: " MV",
              id: "MV",
              icon: $icon("036", $color("white"), $size(23, 23)),
              type: 1,
              bgcolor: $color((scriptInfo.have_mv == 1) ? "#00B2EE" : "gray")
            },
            layout: function(make, view) {
              make.bottom.left.inset(0)
              make.height.equalTo(view.super)
              make.width.equalTo(view.super).dividedBy(4)
            },
            events: {
              tapped(sender) {
                if (scriptInfo.have_mv == 1) {
                  $http.get({
                    url: "http://m.kugou.com/app/i/mv.php?cmd=100&hash=" + mvHash + "&ismp3=1&ext=mp4",
                    handler: function(resp) {
                      var mvData = resp.data.mvdata
                      var quality = new Array()
                      for (var i = 0; i < 3; i++) {
                        if (typeof(mvData[allQuality[i]].downurl) !== "undefined") {
                          quality.unshift({
                            item: allQuality[i].toUpperCase(),
                            downURL: mvData[allQuality[i]].downurl
                          })
                        }
                      }
                      MVdetailsView(quality)
                    }
                  })
                }
              }
            }
          },
          {
            type: "button",
            props: {
              title: " 歌手",
              id: "Singer",
              type: 1,
              icon: $icon("109", $color("white"), $size(23, 23)),
              bgcolor: $color("#00B2EE")
            },
            layout: function(make, view) {
              make.bottom.inset(0)
              make.left.equalTo($("MV").right)
              make.height.equalTo(view.super)
              make.width.equalTo(view.super).dividedBy(4)
            },
            events: {
              tapped(sender) {
                $http.get({
                  url: "http://ioscdn.kugou.com/api/v3/singer/info?singerid=0&singername=" + encodeURI(scriptInfo.author_name),
                  handler: function(resp) {
                    $cache.set("SingerPage", 1)
                    singerDetailsView(resp.data.data, scriptInfo.img, 0)
                  }
                })
              }
            }
          },
          {
            type: "button",
            props: {
              title: " 专辑",
              id: "Album",
              type: 1,
              icon: $icon("048", $color("white"), $size(23, 23)),
              bgcolor: $color("#00B2EE")
            },
            layout: function(make, view) {
              make.bottom.inset(0)
              make.left.equalTo($("Singer").right)
              make.height.equalTo(view.super)
              make.width.equalTo(view.super).dividedBy(4)
            },
            events: {
              tapped(sender) {
                $http.get({
                  url: "http://ioscdn.kugou.com/api/v3/album/info?albumid=" + album_id,
                  handler: function(resp) {
                    $cache.set("SingerPage", 1)
                    singerDetailsView(resp.data.data, resp.data.data.imgurl.replace("/{size}", ""), 1)
                  }
                })
              }
            }
          },
          {
            type: "button",
            props: {
              title: " 下载",
              id: "DownloadSong",
              type: 1,
              icon: $icon("165", $color("white"), $size(23, 23)),
              bgcolor: $color("#00B2EE")
            },
            layout: function(make, view) {
              make.bottom.inset(0)
              make.left.equalTo($("Album").right)
              make.height.equalTo(view.super)
              make.width.equalTo(view.super).dividedBy(4)
            },
            events: {
              tapped(sender) {
                $ui.menu({
                  items: (sqHash == "") ? ["标准音质"] : ["SQ无损音质", "标准音质"],
                  handler: function(title) {
                    if (title == "标准音质") {
                      GetSong(scriptInfo.play_url)
                    } else {
                      $http.get({
                        url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + sqHash,
                        handler: function(resp) {
                          GetSong(resp.data.data.play_url)
                        }
                      })
                    }
                  }
                })
              }
            }
          }
        ],
        layout: function(make) {
          make.bottom.left.right.inset(30)
          make.height.equalTo(40)
        }
      },
      {
        type: "text",
        props: {
          bgcolor: $color("#EDEDED"),
          id: "Context",
          editable: false,
          radius: 7,
          text: scriptInfo.lyrics.replace(/\[\d\d:\d\d\.\d\d\]/g, ""),
          font: $font("Avenir-Light", 16)
        },
        layout: function(make) {
          make.top.equalTo($("OtherInfo").bottom).offset(20)
          make.left.right.inset(30)
          make.bottom.equalTo($("rqView").top).offset(-20)
        }
      },
      {
        type: "button",
        props: {
          id: "translateButton",
          title: "翻译歌词",
          font: $font("bold", 14),
          titleColor: $color("#00B2EE"),
          type: 1
        },
        layout: function(make, view) {
          make.right.inset(20)
          make.bottom.inset(90)
          make.size.equalTo($size(120, 40))
        },
        events: {
          tapped: function(sender) {
            if (sender.title == "翻译歌词") {
              sender.title = "翻译中…"
              $http.get({
                url: "http://fanyi.youdao.com/translate?doctype=json&i=" + encodeURI($("Context").text) + "&type=AUTO&xmlVersion=1.4",
                handler: function(resp) {
                  var data = resp.data.translateResult.map(function(i) { return i[0].tgt })
                  $cache.set("original", $("Context").text)
                  $("Context").text = data.join("\n")
                  sender.title = "显示原文"
                }
              })
            } else if (sender.title == "显示原文") {
              $("Context").text = $cache.get("original")
              sender.title = "翻译歌词"
            }
          }
        }
      }
    ]
  })
}

/* MV详情界面 */
function MVdetailsView(Info) {
  $ui.push({
    views: [{
        type: "web",
        props: {
          id: "VideoPlayer",
          url: Info[0].downURL,
        },
        layout: function(make, view) {
          make.left.right.top.equalTo(0)
          make.height.equalTo(300)
        }
      },
      {
        type: "tab",
        props: {
          id: "pzMENU",
          items: Info.map(function(i) { return i.item }),
          tintColor: $color("#00B2EE")
        },
        layout: function(make) {
          make.top.equalTo($("VideoPlayer").bottom).offset(10)
          make.right.left.inset(5)
        },
        events: {
          changed: function(sender) {
            switch (sender.items[sender.index]) {
              case "SQ":
                Info.map(function(i) { if (i.item == "SQ") $("VideoPlayer").url = i.downURL })
                break
              case "LE":
                Info.map(function(i) { if (i.item == "LE") $("VideoPlayer").url = i.downURL })
                break
              case "RQ":
                Info.map(function(i) { if (i.item == "RQ") $("VideoPlayer").url = i.downURL })
                break
            }
          }
        }
      },
      {
        type: "button",
        props: {
          title: "下载",
          bgcolor: $color("#00B2EE")
        },
        layout: function(make) {
          make.top.equalTo($("pzMENU").bottom).offset(10)
          make.left.right.inset(5)
        },
        events: {
          tapped(sender) {
            switch ($("pzMENU").items[$("pzMENU").index]) {
              case "SQ":
                Info.map(function(i) { if (i.item == "SQ") GetSong(i.downURL) })
                break
              case "LE":
                Info.map(function(i) { if (i.item == "LE") GetSong(i.downURL) })
                break
              case "RQ":
                Info.map(function(i) { if (i.item == "RQ") GetSong(i.downURL) })
                break
            }
          }
        }
      }
    ]
  })
}

/* 下载歌曲 */
function GetSong(url) {
  $ui.loading(true)
  $ui.toast("下载中，请稍等……")
  var date = new Date()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  $http.download({
    url: url,
    handler: function(resp) {
      var date = new Date()
      var minute1 = date.getMinutes()
      var second1 = date.getSeconds()
      if (minute1 == minute) {
        var needTime = second1 - second
      } else {
        var difference = minute1 - minute
        var firstTime = 60 - second + second1
        var secondTime = difference - 1
        var needTime = secondTime * 60 + firstTime
      }
      $ui.loading(false)
      if (url.indexOf("mp4") || url.indexOf("mp3") == 0) {
        $share.sheet(resp.data)
      } else {
        $photo.save({
          data: resp.data,
          handler: function(success) {
            if (success == true) {
              $ui.toast("已保存至相册")
            } else {
              $ui.toast("保存失败")
            }
          }
        })
      }
      $ui.toast("下载约耗时" + needTime + "秒")
    }
  })
}

/* 载入搜索 */
function ReadyToSearch(keyword) {
  $cache.set("Page", 1)
  var historyItems = $cache.get("Histroy")
  if (historyItems) {
    var str = historyItems.join("");
    if (str.indexOf(keyword) == -1) {
      historyItems.unshift(keyword)
    }
  } else {
    var historyItems = new Array(keyword)
  }
  $cache.set("Histroy", historyItems)
  search(keyword)
}

/* 载入搜索建议 */
function ssjy(text) {
  $http.get({
    url: "http://ioscdn.kugou.com/new/app/i/search.php?cmd=302&keyword=" + encodeURI(text),
    handler: function(resp) {
      $("list").data = resp.data.data.map(function(item) { return item.keyword })
      $("list").header.text = "   搜索建议:"
    }
  })
}

/* 反馈界面 */
function Fankui() {
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
          make.height.equalTo(200)
          make.top.equalTo($("Way1"))
        }
      },
      {
        type: "button",
        props: {
          title: "发送反馈",
          bgcolor: $color("#00B2EE")
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