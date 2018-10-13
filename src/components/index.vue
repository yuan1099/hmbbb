<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="#/" class="router-link-active">首页</a> &gt;
                <a href="#/site/goodslist" class="router-link-exact-active router-link-active">购物商城</a>
            </div>
        </div>
        <!-- 列表、轮播图、热卖板块 -->
        <div class="section">
            <div class="wrapper">
                <div class="wrap-box">
                    <div class="left-220" style="margin: 0px;">
                        <div class="banner-nav">
                            <ul>
                                <li v-for="item in cateList" :key="item.id">
                                    <h3>
                                        <i class="iconfont icon-arrow-right"></i>
                                        <span>{{item.title}}</span>
                                        <p>
                                            <span v-for="it in item.subcates" :key="it.id">
                                                {{it.title}}&nbsp;
                                            </span>
                                            
                                        </p>
                                    </h3>
                                    <div class="item-box">
                                        <dl>
                                            <dt>
                                                <a href="/goods/40.html">{{item.title}}</a>
                                            </dt>
                                            <dd>
                                                <a href="/goods/43.html" v-for="it in item.subcates" :key="it.id">{{it.title}}</a>
                                            </dd>
                                        </dl>
                                    </div>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                    <!--幻灯片 轮播图-->
                    <div class="left-705">
                        <div class="banner-img">
                            <div id="focus-box" class="focus-box">
                                <!-- 使用element-UI的插件实现轮播 -->
                                <el-carousel height="341px">
                                    <el-carousel-item v-for="item in sliderList" :key="item.id">
                                     <a href="#">
                                         <img style="disply:block;height:100%" :src="item.img_url" alt="">
                                     </a>
                                    </el-carousel-item>
                                </el-carousel>
                            </div>

                        </div>
                    </div>
                    <!--/幻灯片 热卖-->
                    <div class="left-220">
                        <ul class="side-img-list">
                            <li v-for="item in topList" :key="item.id">
                                <div class="img-box">
                                    <label>{{item.is_hot}}</label>
                                    <img :src="item.img_url">
                                </div>
                                <div class="txt-box">
                                    <a href="/goods/show-98.html">{{item.title}}</a>
                                    <!-- 过滤器出来时间 -->
                                    <span>{{item.add_time | beautifyTime('YYYY年MM月DD日')}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- 渲染下面的商品列表 -->
        <div class="section" v-for="item in locaList" :key="item.catetitle">
            <div class="main-tit">
                <h2>{{item.catetitle}}</h2>
                <p>
                    <a href="/goods/43.html" v-for="it in item.level2catelist" :key="it.subcatetitle">{{it.subcatetitle}}</a>
                    <a href="/goods/40.html">更多
                        <i>+</i>
                    </a>
                </p>
            </div>
            <div class="wrapper clearfix">
                <div class="wrap-box">
                    <ul class="img-list">
                        <li v-for="it in item.datas" :key="it.artID">
                            <!-- <a href="#/site/goodsinfo/87" class=""> -->
                            <router-link :to="'/detail/'+it.artID">
                                <div class="img-box">
                                    <img v-lazy="it.img_url">
                                </div>
                                <div class="info">
                                    <h3>{{it.artTitle}}</h3>
                                    <p class="price">
                                <b>{{it.sell_price}}</b>元</p>
                                    <p>
                                        <strong>库存 {{it.stock_quantity}}</strong>
                                        <span>市场价：
                                            <s>{{it.market_price}}</s>
                                        </span>
                                    </p>
                                </div>
                                </router-link>
                            <!-- </a> -->
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// // 导入axios
// import axios from "axios";

// 暴露接口
export default {
  // 页面根节点的名字
  name: "index",
  //数据
  data: function() {
    return {
      // 分类列表
      cateList: [],
      // 轮播图区域
      sliderList: [],
      // 热卖区域
      topList: [],
      // 商品数据
      locaList: []
    };
  },
//   //  过滤器  提成全局过滤器
//   filters: {
//     beautifyTime(value) {
//       return moment(value).format("YYYY年MM月DD日");
//     }
//   },
  //发送请求
  created() {
    //   获取上半部分（列表 轮播图 热卖板块的数据）
    this.$axios
      .get("/site/goods/gettopdata/goods")
      .then(response => {
        //   console.log(response);
        (this.cateList = response.data.message.catelist),
          (this.sliderList = response.data.message.sliderlist),
          (this.topList = response.data.message.toplist);
      });
    //   获取下半部分商品列表的数据
    this.$axios
      .get("/site/goods/getgoodsgroup")
      .then(response => {
        // console.log(response);
        this.locaList = response.data.message;
      });
  }
};
</script>

<style>
</style>
