<template>

<div>
  <div class="section">
        <div class="location">
            <span>当前位置：</span>
            <a href="/index.html">首页</a> &gt;
            <a href="/login.html">会员登录</a>
        </div>
  </div>
  <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <div class="nav-tit">
                        <a class="selected" href="javascript:;">账户登录</a>
                        <i>|</i>
                        <a href="/register.html">免费注册</a>
                    </div>

                    <div id="loginform" name="loginform" class="login-box">
                        <div class="input-box">
                            <input id="txtUserName" v-model="userName" name="txtUserName" type="text" placeholder="用户名/手机/邮箱" maxlength="50">
                        </div>
                        <div class="input-box">
                            <input id="txtPassword" v-model="password" name="txtPassword" type="password" placeholder="输入登录密码" maxlength="16">
                        </div>
                        <div class="btn-box">
                            <input id="btnSubmit" name="btnSubmit" @click="login" type="submit" value="立即登录">
                        </div>
                    </div>
                </div>
            </div>
  </div>
</div>
</template>
<script>
export default {
  name: "login",
  data: function() {
    return {
      userName: "",
      password: ""
    };
  },
  methods: {
    login() {
      this.$axios
        .post("site/account/login",{
            user_name:this.userName,
            password:this.password
        }).then(response => {
        //   console.log(response);
        // 判断是否成功还是失败 1是失败 0是成功
        if(response.data.status==1){
            // 根据返回的内容提示用户  element-ui中的提示框
            this.$Notice.warning({
                // 提示框的头
                title:"友情提示",
                // 提示框的内容
                desc:response.data.message
            })
        }else{
            // 根据返回的内容提示用户  element-ui中的提示框
            this.$Notice.success({
                // 提示框的头
                title:"欢迎你回来",
                // 提示框的内容
                desc:response.data.message
            });
            // 跳转到订单页   导航的链式编程
            this.$router.push("/chenckOrder");
            // 修改vuex中的数据，记录当前的状态
            this.$store.commit("changeLoginState",true);
            // 从哪里跳到登录页面就跳回那个页面
            this.$router.back();
        }
        
      });
    }
  }
};
</script>
<style>
</style>
