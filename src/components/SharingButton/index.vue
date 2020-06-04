<template>
  <div class="indexBtn">
    <div class="topbtn">
      <slot name="top" />
    </div>
    <div ref="content" class="content">
      <div ref="divheight" :class="[!flag ? 'animated hidebtn' : 'animated showbtn']" :style="{ height: divHeight }">
        <!-- <div v-show=" flag"> -->
        <div class="getHeight">
          <slot />
        </div>
      </div>
      <!-- </div> -->
      <div class="rightbtn">
        <el-button size="small" class="filter-item" type="success" @click="init">
          查询
        </el-button>
        <el-button size="small" @click="resetForm">
          重置
        </el-button>
        <el-button class="textbtn" type="text" @click="show">
          {{ text }}<i :class="[!flag ? 'el-icon-arrow-down' : 'el-icon-arrow-up', 'el-icon--right']" />
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: false,
      animationFlag: false,
      text: '展开',
      divHeight: '60px'
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        that.divHeight = document.querySelector('.getHeight').offsetHeight + 'px'
        if (this.flag === false) {
          document.styleSheets[0].deleteRule(1)
          document.styleSheets[0].insertRule('@keyframes fadeInDown{from{height: ' + this.divHeight + '; } to{ height:60px;}', 1)
        } else {
          document.styleSheets[0].deleteRule(1)
          document.styleSheets[0].insertRule('@keyframes fadeInUp{from{height: 60px; } to{ height: ' + this.divHeight + ';}', 1)
        }
      })()
    }
  },
  methods: {
    init() {
      this.$emit('dataInit')
    },
    show() {
      var timer
      clearTimeout(timer)
      if (this.animationFlag) {
        return
      }
      this.animationFlag = true
      this.flag = !this.flag
      this.text = this.flag === false ? '展开' : '收起'
      this.divHeight = document.querySelector('.getHeight').offsetHeight + 'px'
      if (this.flag === false) {
        console.log(document.styleSheets[0])
        document.styleSheets[0].deleteRule(1)
        document.styleSheets[0].insertRule('@keyframes fadeInDown{from{height: ' + this.divHeight + '; } to{ height:60px;}', 1)
      } else {
        console.log(document.styleSheets[0])
        document.styleSheets[0].deleteRule(1)
        document.styleSheets[0].insertRule('@keyframes fadeInUp{from{height: 60px; } to{ height: ' + this.divHeight + ';}', 1)
      }
      timer = setTimeout(() => {
        this.animationFlag = false
      }, 500)
      console.log(document.styleSheets[0])
    },
    resetForm() {
      this.$emit('resetForm')
    }
  }
}
</script>
<style scoped>
.indexBtn {
  width: 100%;
}
.topbtn {
  width: 100%;
  display: flex;
  margin: 0px 0px 20px 0px;
}
.content {
  width: 100%;
  display: flex;
  /* justify-content: space-around; */
}
.rightbtn .el-button {
  height: 35px;
}
.animated {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.animated.showbtn {
  width: 85%;
  overflow: hidden;
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
}
.animated.hidebtn {
  width: 85%;
  overflow: hidden;
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
}
.fadeInUp {
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
}
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
}
.rightbtn {
  width: 15%;
  display: flex;
  justify-content: flex-end;
}
.textbtn {
  color: #67c23a;
}
</style>
