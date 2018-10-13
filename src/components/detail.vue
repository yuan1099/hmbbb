<template>
    <div>
        <!-- <input type="button" value="detail给数据" @click='detailAdd'> -->
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/goods.html">购物商城</a> &gt;
                <a href="/goods/42/1.html">商品详情</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper clearfix">
                <div class="wrap-box">
                    <div class="left-925">
                        <div class="goods-box clearfix">
                            <!-- 使用 vue zoom插件做放大镜 -->
                            <div class="pic-box" v-if="images.normal_size.length!=0">
                                <ProductZoomer :base-images="images" :base-zoomer-options="zoomerOptions" />
                            </div>
                            <div class="goods-spec">
                                <h1>{{goodsinfo.title}}</h1>
                                <p class="subtitle">{{goodsinfo.sub_title}}</p>
                                <div class="spec-box">
                                    <dl>
                                        <dt>货号</dt>
                                        <dd id="commodityGoodsNo">{{goodsinfo.goods_no}}</dd>
                                    </dl>
                                    <dl>
                                        <dt>市场价</dt>
                                        <dd>
                                            <s id="commodityMarketPrice">¥{{goodsinfo.market_price}}</s>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>销售价</dt>
                                        <dd>
                                            <em id="commoditySellPrice" class="price">¥{{goodsinfo.sell_price}}</em>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="spec-box">
                                    <dl>
                                        <dt>购买数量</dt>
                                        <dd>
                                            <div class="stock-box">
                                               <el-input-number v-model="buyNum" @change="numChange" :min="1" :max="goodsinfo.stock_quantity" label="描述文字"></el-input-number>
                                            </div>
                                            <span class="stock-txt">
                                                库存
                                                <em id="commodityStockNum">{{goodsinfo.stock_quantity}}</em>件
                                            </span>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd>
                                            <div id="buyButton" class="btn-buy">
                                                <button onclick="cartAdd(this,'/',1,'/shopping.html');" class="buy">立即购买</button>
                                                <!-- 点击事件 -->
                                                <button  @click="addCart"  class="add">加入购物车</button>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div id="goodsTabs" class="goods-tab bg-wrap">
                            <!-- 使用的是iview的图钉 -->
                            <Affix>
                            <div id="tabHead" class="tab-head" style="position: static; top: 517px; width: 925px;">
                                <ul>
                                    <li>
                                        <!-- 当selectindex为0时为显示状态，为1时为影藏状态 -->
                                        <a @click="selectIndex=0" href="javascript:;" :class="{selected:selectIndex==0}">商品介绍</a>
                                    </li>
                                    <li>
                                        <a @click="selectIndex=1" href="javascript:;" :class="{selected:selectIndex==1}">商品评论</a>
                                    </li>
                                </ul>
                            </div>
                            </Affix>
                            <!-- 控制商品介绍和商品评论的显示与隐藏，因结构简单所有直接用selectIndex来控制 -->
                            <div class="tab-content entry" v-show="selectIndex==0" v-html="goodsinfo.content">
                            </div>
                            <div class="tab-content" v-show="selectIndex==1">
                                <div class="comment-box">
                                    <div id="commentForm" name="commentForm" class="form-box">
                                        <div class="avatar-box">
                                            <i class="iconfont icon-user-full"></i>
                                        </div>
                                        <div class="conn-box">
                                            <div class="editor">
                                                <textarea v-model.trim="messages" id="txtContent" name="txtContent" sucmsg=" " datatype="*10-1000" nullmsg="请填写评论内容！"></textarea>
                                                <span class="Validform_checktip"></span>
                                            </div>
                                            <div class="subcon">
                                                <input @click="subComment" id="btnSubmit" name="submit" type="submit" value="提交评论" class="submit">
                                                <span class="Validform_checktip"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul id="commentList" class="list-box">
                                        <p v-show="comments==0" style="margin: 5px 0px 15px 69px; line-height: 42px; text-align: center; border: 1px solid rgb(247, 247, 247);">暂无评论，快来抢沙发吧！</p>
                                        <li v-show="comments!=0" v-for="item in comments" :key="item.id">
                                            <div class="avatar-box">
                                                <i class="iconfont icon-user-full"></i>
                                            </div>
                                            <div class="inner-box">
                                                <div class="info">
                                                    <span>{{item.user_name}}</span>
                                                    <span>{{item.reply_time | beautifyTime("YYYY/MM/DD HH:mm:ss")}}</span>
                                                </div>
                                                <p>{{item.content}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <!-- 评论的分页 -->
                                    <div v-show="comments!=0" class="page-box" style="margin: 5px 0px 0px 62px;">
                                        <!-- 分页使用的是iview插件 -->
                                        <Page @on-page-size-change="sizeCgange" @on-change="pageChange" :total="totalcount" :current='pageIndex' placement="top" :page-size-opts='[3,13,23,33]' :page-size=3 show-elevator show-sizer /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="left-220">
                        <div class="bg-wrap nobg">
                            <div class="sidebar-box">
                                <h4>推荐商品</h4>
                                <ul class="side-img-list">
                                    <li v-for="item in hotgoodslist" :key="item.id">
                                        <div class="img-box">
                                            <!-- <a href="#/site/goodsinfo/90" class=""> -->
                                            <router-link :to="'/detail/'+item.id">
                                                <img :src="item.img_url">
                                                </router-link>
                                            <!-- </a> -->
                                        </div>
                                        <div class="txt-box">
                                            <!-- <a href="#/site/goodsinfo/90" class=""> -->
                                            <router-link :to="'/detail/'+item.id">
                                            {{item.title}}
                                            <!-- </a> -->
                                            </router-link>
                                            <span>{{item.add_time | beautifyTime("YYYY年MM月DD日")}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Detail",
  data: function() {
    return {
      // 商品id
      goodId: "",
      // 商品详情
      goodsinfo: {},
      // 推荐品牌
      hotgoodslist: [],
      // 图片
      imglist: [],
      // 选择购买的数量
      buyNum: 1,
      // 标记tab栏显示哪一个
      selectIndex: 0,
      //   页码
      pageIndex: 1,
      // 没页容量
      pageSize: 3,
      // 总条数
      totalcount: 0,
      // 评论内容
      comments: [],
      // 写的评论
      messages: "",
      //放大镜功能的数据
      images: {
        normal_size: [
          {
            id: 1,
            url:
              "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539325515494&di=128f88983e9f6b6b792ae24f0a7b2d04&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F18%2F31%2F76%2F13h58PICYX8_1024.jpg"
          },
          {
            id: 2,
            url:
              "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539325515489&di=a8b36a6f82b0669b76d97bf1c9dff2d7&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F16%2F58%2F13%2F27Q58PICDYb_1024.jpg"
          }
        ]
      },
      zoomerOptions: {
        //   放大倍数
        zoomFactor: 2,
        // 放大样式
        pane: "container-round",
        // 放多少
        hoverDelay: 300,
        // 类前缀
        namespace: "inline-zoomer",
        // 点击移动
        move_by_click: true,
        // 滚动图片张数
        scroll_items: 5,
        // 选中图片的缩略图
        choosed_thumb_border_color: "#ff9f4c"
      }
    };
  },
  //  事件
  methods: {
    numChange() {
      console.log("改变了耶");
    },
    // 传入id货物当前id的详细内容
    getGoodInfo() {
      this.images.normal_size = [];
      this.$axios
        .get("/site/goods/getgoodsinfo/" + this.goodId)
        .then(response => {
          this.goodsinfo = response.data.message.goodsinfo;
          this.hotgoodslist = response.data.message.hotgoodslist;
          this.imglist = response.data.message.imglist;
          //   处理数据imglist
          // 一个空数组用来存放数据
          let temp_normal_size = [];
          this.imglist.forEach(v => {
            temp_normal_size.push({
              id: v.id,
              url: v.thumb_path
            });
          });
          // 赋值给 images.normal_size
          this.images.normal_size = temp_normal_size;
        });
    },
    // 调用获取评论的接口
    getComments() {
      this.$axios
        .get(
          `site/comment/getbypage/goods/${this.goodId}?pageIndex=${
            this.pageIndex
          }&pageSize=${this.pageSize}`
        )
        .then(response => {
          //   console.log(response);
          this.totalcount = response.data.totalcount;
          this.pageIndex = response.data.pageIndex;
          this.pageSize = response.data.pageSize;
          this.comments = response.data.message;
        });
    },
    // 页码改变时
    pageChange(pageNum) {
      // console.log('页码变了就打印我');
      // console.log(pageNum);
      this.pageIndex = pageNum;
      // 重新发送请求
      this.getComments();
    },
    // 页容量改变时
    sizeCgange(pagesize) {
      //   console.log(pagesize);
      // 重新定义每页的页容量
      this.pageSize = pagesize;
      // 重新发请求
      this.getComments();
    },
    // 有评论时显示评论，无评论时显示抢沙发
    subComment() {
      // 当评论为空时，就提示用户

      if (this.messages == "") {
        // console.log("触发了");
        this.$Message.warning("写点什么吧，你还什么都没留下呢！");
        return;
      }
      // 当评论有内容时，发请求
      this.$axios
        .post("site/validate/comment/post/goods/" + this.goodId, {
          commenttxt: this.messages
        })
        .then(response => {
          // console.log(response);
          // 评论成功跳回第一页
          this.pageIndex = 1;
          // 刷新评论区域
          this.getComments();
          // 将编写框变为空
          this.messages = "";
          // 提示用户评论成功了
          this.$Message.warning("评论成功了");
        });
    },

    // // 测试累计个数
    // detailAdd(){
    //     this.$store.commit("increment")
    // },
    // 改变购物车的数据
    addCart() {
    //  console.log(this);
      this.$store.commit("addCart",{
          id:this.goodId,
          buyCount:this.buyNum
      });
    }
  },
  // 创建前
  created() {
    this.goodId = this.$route.params.goodId;
    // 调用接口方法
    this.getGoodInfo();
    // 获取评论数据
    this.getComments();
  },
    // 当路由发生改变时做出响应
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      //   console.log(to);
      // 获取id
      this.goodId = to.params.goodId;
      // 调用接口
      this.getGoodInfo();
      // 获取评论数据
      this.getComments();
      // 设置购买数量为1
      this.buyNum = 1;
    }
  }
};
</script>

<style>
.tab-content img {
  /* 变块清除拼接img中间的缝隙 */
  display: block;
}
.pic-box {
  width: 395px;
}
.inline-zoomer-zoomer-box{
height: 300px;
width: 300px;
}
.preview-box img{
    height: 250px;
}
.control-box{
    height: 50px;
}
.control{
    margin: 0 auto;
}
.control-box >div{
    float: left;
    height: 50px;
}
.control-box .thumb-list img{
    width: 50px;
    height: 100%;
    float: left;
}
</style>

