  const ClearIcon = "data:image/png;base64,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"

  $ui.render({
    props: {
      title: "登录界面"
    },
    views: [{
        type: "text",
        props: {
          id: "Account",
          font: $font(17),
          textColor: $color("#FF3980"),
          darkKeyboard: true,
        },
        layout: function(make, view) {
          make.top.inset(45)
          make.left.right.inset(18)
          make.height.equalTo(27)
        },
        events: {
          didBeginEditing: function(sender) {
            if ($cache.get("PD1") !== 1) {
              AL.animator.moveY(-18).animate(0.1)
              $delay(0.1, function() {
                AL.updateLayout(function(make) {
                  make.top.inset(22)
                  make.left.right.inset(27)
                })
              })
            }
            ALine.animator.makeHeight(2).animate(0.1)
            AL.textColor = $color("#1E90FF")
            ALine.bgcolor = $color("#1E90FF")
            $ui.animate({
              duration: 0.4,
              animation: function() {
                $("Account-Clear").alpha = 100
                AL.font = $font(12)
              }
            })
          },
          didEndEditing: function(sender) {
            if (sender.text == "") {
              AL.animator.moveY(18).animate(0.1)
              $delay(0.1, function() {
                AL.updateLayout(function(make) {
                  make.top.inset(40)
                  make.left.right.inset(27)
                })
              })
              AL.font = $font(15)
              $cache.set("PD1", 0)
            } else {
              $cache.set("PD1", 1)
            }
            ALine.animator.makeHeight(1).animate(0.1)
            AL.textColor = $color("#ABABAB")
            ALine.bgcolor = $color("#E5E5E5")
            $ui.animate({
              duration: 0.4,
              animation: function() {
                $("Account-Clear").alpha = 0
              }
            })
          }
        }
      },
      {
        type: "label",
        props: {
          id: "Account-label",
          text: "在此输入账号",
          font: $font(15),
          textColor: $color("#ABABAB")
        },
        layout: function(make) {
          make.top.inset(40)
          make.left.right.inset(27)
        }
      },
      {
        type: "view",
        props: {
          id: "Account-line",
          bgcolor: $color("#E5E5E5")
        },
        layout: function(make) {
          var AL = $("Account-label")
          make.left.equalTo(AL)
          make.top.inset(70)
          make.height.equalTo(1)
          make.width.equalTo(AL)
        }
      },
      {
        type: "button",
        props: {
          id: "Account-Clear",
          src: ClearIcon,
          alpha: 0
        },
        layout: function(make) {
          make.top.inset(49)
          make.right.inset(30)
          make.size.equalTo($size(15, 15))
        },
        events: {
          tapped(sender) {
            $("Account").text = ""
          }
        }
      },
      {
        type: "text",
        props: {
          id: "Password",
          font: $font(17),
          textColor: $color("#FF3980"),
          darkKeyboard: true,
        },
        layout: function(make, view) {
          make.top.inset(125)
          make.left.right.inset(18)
          make.height.equalTo(27)
        },
        events: {
          didBeginEditing: function(sender) {
            PL.font = $font(12)
            if ($cache.get("PD2") !== 1) {
              PL.animator.moveY(-18).animate(0.1)
              $delay(0.1, function() {
                PL.updateLayout(function(make) {
                  make.top.inset(102)
                  make.left.right.inset(27)
                })
              })
            }
            PLine.animator.makeHeight(2).animate(0.1)
            PL.textColor = $color("#1E90FF")
            PLine.bgcolor = $color("#1E90FF")
            $ui.animate({
              duration: 0.4,
              animation: function() {
                $("Password-Clear").alpha = 100
              }
            })
          },
          didEndEditing: function(sender) {
            if (sender.text == "") {
              PL.animator.moveY(18).animate(0.1)
              $delay(0.1, function() {
                PL.updateLayout(function(make) {
                  make.top.inset(120)
                  make.left.right.inset(27)
                })
              })
              PL.font = $font(15)
              $cache.set("PD2", 0)
            } else {
              $cache.set("PD2", 1)
            }
            PLine.animator.makeHeight(1).animate(0.1)
            PL.textColor = $color("#ABABAB")
            PLine.bgcolor = $color("#E5E5E5")
            $ui.animate({
              duration: 0.4,
              animation: function() {
                $("Password-Clear").alpha = 0
              }
            })
          }
        }
      },
      {
        type: "label",
        props: {
          id: "Password-label",
          text: "在此输入密码",
          font: $font(15),
          textColor: $color("#ABABAB")
        },
        layout: function(make, view) {
          make.top.inset(120)
          make.left.right.inset(27)
        }
      },
      {
        type: "view",
        props: {
          id: "Password-line",
          bgcolor: $color("#E5E5E5")
        },
        layout: function(make) {
          var PL = $("Password-label")
          make.left.equalTo(PL)
          make.top.equalTo(150)
          make.height.equalTo(1)
          make.width.equalTo(PL)
        }
      },
      {
        type: "button",
        props: {
          id: "Password-Clear",
          src: ClearIcon,
          alpha: 0
        },
        layout: function(make) {
          make.top.inset(129)
          make.right.inset(30)
          make.size.equalTo($size(15, 15))
        },
        events: {
          tapped(sender) {
            $("Password").text = ""
            $cache.remove("PD4")
          }
        }
      },
      {
        type: "button",
        props: {
          id: "Login-botton",
          title: "登录",
          radius: 30,
          bgcolor: $color("#FF3980")
        },
        layout: function(make, view) {
          make.top.equalTo($("Password-line").bottom).offset(100)
          make.centerX.equalTo(view.super)
          make.size.equalTo(60, 60)
        },
        events: {
          tapped(sender) {
            sender.animator.moveY($device.info.screen.height / 2 - 320).thenAfter(0.5).makeScale(2.0).animate(0.3)
            $ui.animate({
              duration: 0.8,
              animation: function() {
                PL.alpha = 0
                AL.alpha = 0
                PLine.alpha = 0
                ALine.alpha = 0
                $("Account").alpha = 0
                $("Password").alpha = 0
              }
            })
            sender.title = "登录中"
            $delay(0.5, function() {
              $("spinner").start()
              $ui.animate({
                duration: 0.3,
                animation: function() {
                  sender.radius = 60
                  sender.bgcolor = $color("#2296F3")
                  $delay(3, function() {
                    $("spinner").stop()
                    if ($("Account").text !== "123456" || $("Password").text !== "456789") {
                      sender.radius = 30
                      sender.bgcolor = $color("#FF3980")
                      sender.animator.moveY($device.info.screen.height / -2 + 500).animate(0.8)
                      sender.title = "登录"
                      $ui.animate({
                        duration: 0.8,
                        animation: function() {
                          PL.alpha = 100
                          AL.alpha = 100
                          PLine.alpha = 100
                          ALine.alpha = 100
                          $("Account").alpha = 100
                          $("Password").alpha = 100
                        }
                      })
                      $ui.toast("账号或密码错误")
                    } else {
                      sender.animator.moveY(-150).animate(0.5)
                      $ui.animate({
                        duration: 0.3,
                        animation: function() {
                          sender.alpha = 0
                        },
                        completion: function() {
                          sender.remove()
                          PL.remove()
                          AL.remove()
                          PLine.remove()
                          ALine.remove()
                          $("Account").remove()
                          $("Password").remove()
                          $("spinner").remove()
                          $ui.toast("欢迎回来 :-)")
                        }
                      })
                    }
                  })
                }
              })
            })
          }
        }
      },
      {
        type: "spinner",
        props: {
          on: true
        },
        layout: function(make, view) {
          make.centerX.equalTo(view.super)
          make.centerY.equalTo(view.super).offset(100)
        }
      }
    ]
  })

  const AL = $("Account-label"),
    ALine = $("Account-line"),
    PL = $("Password-label"),
    PLine = $("Password-line")

  $cache.clear()