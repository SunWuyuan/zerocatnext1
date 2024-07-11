//个人中心：个人信息部分===============================
//更新密码
function updatePassword() {
  (oldPW = $("#old_password").val()), (newPW = $("#new_password").val());

  if (!userpasswordTest(oldPW)) {
    $("#old_password").focus();
    automsg({ buttonText: "关闭", message: "原密码格式错误1" });
    return;
  }
  if (!userpasswordTest(newPW)) {
    $("#new_password").focus();
    automsg({ buttonText: "关闭", message: "新密码格式错误2" });
    return;
  }

  if (oldPW == newPW) {
    automsg({ buttonText: "关闭", message: "新老密码相同，无需更改3" });
    return;
  }

  AjaxFn("/my/set/pw", { oldpw: oldPW, newpw: newPW,re:grecaptcha.getResponse() }, function (res) {
    if ("ok" == res["status"]) {
      layer.closeAll();
      automsg({ buttonText: "关闭", message: "密码修改成功！" });
    } else {
      automsg(res["message"]);
    }
  });
}
//修改头像
//var upload = layui.upload;
//upload.render({
//  elem: ".avatarUpload",
 // url: "/my/set/avatar",
  //accept: "file",
  //done: function (res, index, upload) {
   // if (res.status == "ok") {
   //   window.location.reload();
   // } else {
   //   automsg(res.status);
   // }
  //},
//});

function loadmyinfo() {
  console.log("userinfo");
  AjaxGet(
    "/api/getuserinfo?id=" + Cookies.get("local-userid"),
    {},
    function (data) {
      console.log(data.info);
      $("#my_display_name").attr(
        "value",
        DOMPurify.sanitize(data.info.display_name)
      );
      $("#my_aboutme").attr("value", DOMPurify.sanitize(data.info.motto));
      $("#sex-chick").attr("value", data.info.sex);
      $("#my_username").attr("value", data.info.username);

    }
  );
}

$(function () {
  loadmyinfo();
});
//判断参数并上传到服务器
function updateUsername() {
  var newusername = $("#my_username").val();

  if ("" == newusername || newusername.length > 16) {
    $("#my_username")["focus"]();
    layer["msg"]("用户名长度不正确");
    return;
  }

  var data = {
    username: newusername,
    re:grecaptcha.getResponse()
  };

  AjaxFn("/my/set/username", data, function (res) {
    automsg(res.status);
  });
}

//修改昵称等信息
function updataInfo() {
  var display_name = $("#my_display_name")["val"]();
  if ("" == display_name || display_name.length > 16) {
    $("#my_display_name")["focus"]();
    layer["msg"]("昵称长度不正确");
    return;
  }

  var data = {
    display_name: display_name,
    sex: $("#sex-chick").val(),
    year: $("#sel_year")["val"](),
    month: $("#sel_month")["val"](),
    day: $("#sel_day")["val"](),
    aboutme: $("#my_aboutme")["val"](),
    re:grecaptcha.getResponse()
  };

  AjaxFn("/my/set/userinfo", data, function (res) {
    automsg(res.status);
  });
}

async function updateinages() {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: "图片类型",
        accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
      },
    ],
  });
  const file = await fileHandle.getFile();
  console.log(fileHandle);
  console.log(file);
  //const file = e.target.files[0];

  if (!file) {
    return;
  }

  new Compressor(file, {
    mimeType: "image/webp", // 设置输出图片的 MIME 类型
    width: 2048,
    height: 2048,
    resize: "cover",

    // The compression process is asynchronous,
    // which means you have to access the `result` in the `success` hook function.
    success(result) {
      const formData = new FormData();

      // The third parameter is required for server
      formData.append("file", result, result.name);
      $.ajax({
        url: Ow_Server + "/my/set/avatar?re=" + grecaptcha.getResponse(),
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
      }).done(function (res) {
        console.log(res);
        automsg({ buttonText: "关闭", message: res.message });
      });
      // Send the compressed image file to server with XMLHttpRequest.
      console.log(result);
    },
    error(err) {
      automsg("错误，请查看控制台");
      console.log(err.message);
    },
  });
}



function onloadCallback() {
  grecaptcha.render("#captcha-div", {
      sitekey: rekey,
    });

  }function reloudcaptcha(){
    grecaptcha.reset();
  }