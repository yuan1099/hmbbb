<template>
    <div>
        <!-- 面包屑部分 -->
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/cart.html">购物车</a>
            </div>
        </div>
        <!-- 内容部分 -->
        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <!--购物车头部-->
                    <div class="cart-head clearfix">
                        <h2>
                            <i class="iconfont icon-cart"></i>我的购物车</h2>
                        <div class="cart-setp">
                            <ul>
                                <li class="first active">
                                    <div class="progress">
                                        <span>1</span>
                                        放进购物车
                                    </div>
                                </li>
                                <li>
                                    <div class="progress">
                                        <span>2</span>
                                        填写订单信息
                                    </div>
                                </li>
                                <li class="last">
                                    <div class="progress">
                                        <span>3</span>
                                        支付/确认订单
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--购物车头部-->
                    <!--商品列表-->
                    <div class="cart-box">
                        <input id="jsondata" name="jsondata" type="hidden">
                        <table width="100%" align="center" class="cart-table" border="0" cellspacing="0" cellpadding="8">
                            <tbody>
                                <tr>
                                    <th width="48" align="center">
                                        <a>选择</a>
                                    </th>
                                    <th align="left" colspan="2">商品信息</th>
                                    <th width="84" align="left">单价</th>
                                    <th width="104" align="center">数量</th>
                                    <th width="104" align="left">金额(元)</th>
                                    <th width="54" align="center">操作</th>
                                </tr>
                                <tr v-if="goodList.leght==0">
                                    <td colspan="10">
                                        <div class="msg-tips">
                                            <div class="icon warning">
                                                <i class="iconfont icon-tip"></i>
                                            </div>
                                            <div class="info">
                                                <strong>购物车没有商品！</strong>
                                                <p>您的购物车为空，
                                                    <a href="/index.html">马上去购物</a>吧！</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="goodList.leght!=0" v-for="item in goodList" :key="item.id">
                                    <td>
                                        <div role="switch" aria-checked="true" class="el-switch is-checked">
                                            <!-- <input type="checkbox" name="" true-value="true" class="el-switch__input">
                                            <span class="el-switch__core" style="width: 40px; border-color: black; background-color: black;">
                                            </span> -->
                                            <!-- 使用elenment ui中的开关插件 -->
                                            <el-switch v-model="item.selected" active-color="#13ce66" inactive-color="#ff4949">
                                            </el-switch>
                                        </div>
                                    </td>
                                    <td>
                                        <img :src="item.img_url" alt="" style="width: 65px;">
                                    </td>
                                    <td>
                                        {{item.title}}
                                    </td>
                                    <td>{{item.sell_price}}</td>
                                    <td>
                                    <div class="el-input-number el-input-number--mini">
                                        <!-- <span role="button" class="el-input-number__decrease">
                                            <i class="el-icon-minus"></i>
                                        </span>
                                        <span role="button" class="el-input-number__increase">
                                            <i class="el-icon-plus"></i>
                                        </span>
                                        <div class="el-input el-input--mini">
                                            <input type="text" autocomplete="off" max="Infinity" min="0" role="spinbutton" aria-valuemax="Infinity" aria-valuemin="0" aria-valuenow="7" aria-disabled="undefined" class="el-input__inner">
                                        </div> -->
                                        <!-- 使用element UI中的计数器插件 -->
                                        <el-input-number v-model="item.buyCount" @change="countChange(item.id,$event)" :min="1" :max="10" label="描述文字"></el-input-number>
                                    </div>
                                    </td>
                                    <td>{{item.buyCount*item.sell_price}}</td>
                                    <td>
                                        <button type="button" @click="delOne(item.id)" class="el-button el-button--danger is-circle">
                                            <i class="el-icon-delete"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="right" colspan="8">
                                        已选择商品
                                        <b class="red" id="totalQuantity">{{selectNum}}</b> 件 &nbsp;&nbsp;&nbsp; 商品总金额（不含运费）：
                                        <span class="red">￥</span>
                                        <b class="red" id="totalAmount">{{selectpirce}}</b>元
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--/商品列表-->
                    <!--购物车底部-->
                    <div class="cart-foot clearfix">
                        <div class="right-box">
                            <router-link to="/index">
                            <button class="button">继续购物</button>
                            </router-link>
                            <router-link to="/chenckOrder">
                            <button class="submit">立即结算</button>
                            </router-link>
                        </div>
                    </div>
                    <!--购物车底部-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  // 页面名字
  name: "shopcart",
  data: function() {
    return {
      goodList: []
    };
  },
  //
  created() {
    // 先获取到vuex中的数据id
    let ids = "";
    for (const key in this.$store.state.shopCartData) {
      ids += key;
      ids += ",";
    }
    // 因为最后还有一个“ ， ”所有截取字符串
    ids = ids.slice(0, -1); //数据为89,88,92,93， 截取后为89,88,92,93

    // 发送ajax请求
    // 获取加入购物车商品的详情
    this.$axios.get("site/comment/getshopcargoods/" + ids).then(response => {
      // 商品的数量保存在vuex中的数据库中，需要取出来
      response.data.message.forEach(v => {
        // 取出对应id的数量
        v.buyCount = this.$store.state.shopCartData[v.id];
        // 增加一个selected控制选中或是未选中的状态
        v.selected = true;
      });
      //获取的对象赋值给goodList
      this.goodList = response.data.message;
      //   console.log(this.goodList);
    });
  },
  //   事件
  methods: {
    //   加减数量时的值改变事件
    countChange(id, newCount) {
      this.$store.commit("updataCart", {
        // 快速赋值
        id,
        newCount
      });
    },
    // 删除事件
    delOne(id) {
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除vuex中的数据
          this.$store.commit("deledata", id);

          // 删除页面上的数据
          this.goodList.forEach((v, index) => {
            if (v.id == id) {
              this.goodList.splice(index, 1);
            }
          });
          //   提示用户
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  //   计算属性
  computed: {
    //   数量
    selectNum() {
      let totNum = 0;
      this.goodList.forEach(v => {
        if (v.selected == true) {
          totNum += v.buyCount;
        }
      });
      return totNum;
    },
    // 总金额
    selectpirce() {
      let toPirce = 0;
      this.goodList.forEach(v => {
        if (v.selected == true) {
          toPirce += v.buyCount * v.sell_price;
        }
      });
      return toPirce;
    }
  }
};
</script>


<style>
.el-input-number {
  width: 120px;
}
</style>
