<template>
  <div class="app-container">
    <!-- 筛选栏 -->
    <div class="filter-form">
      <div class="filter-container">
        <el-form ref="filterForm" :inline="true" :model="filterForm">
          <btns @dataInit="init(1, 'pageNum')" @resetForm="resetForm('filterForm')">
            <el-form-item label="板块名称：" prop="name">
              <el-select v-model="filterForm.name" filterable placeholder="请输入" clearable style="width:215px" @change="init" @clear="init">
                <el-option v-for="(item, index) in classLists" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </btns>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <el-table ref="multipleTable" v-loading="listLoading" :data="tableList" border fit highlight-current-row tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column label="封面" align="center" width="120">
        <template slot-scope="scope">
          <el-image v-if="scope.row.imageUrl" fit="contain" :src="scope.row.imageUrl" :preview-src-list="scope.row.previewLists" />
          <el-image v-else fit="cover">
            <div slot="error" class="image-slot" style="font-size: 32px;">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <span style="color:red">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="话题" prop="conversation" align="center" />
      <el-table-column label="作者" prop="author" align="center" />
      <el-table-column label="回复" prop="replyNum" sortable align="center" />
      <el-table-column label="创建时间" prop="time" sortable align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteList(scope.row, scope.row.id, scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="filterForm.pageNum" :page-sizes="[2, 5, 10, 20, 50]" :page-size="pager.pageSize" :total="pager.pageCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="init($event, 'pageSize')" @current-change="init($event, 'pageNum')" />
    </div>

    <div class="demo-block">
      <el-drawer :title="layerData.title" :visible.sync="drawer" :direction="direction" size="80%">
        <div v-if="drawer" class="body-content">
          <component :is="layerData.component" ref="layerDataComponent" :prop-data="layerData.data" :prop-type="layerData.type" @closedrawer="closeDrawer" @dataInit="init()" />
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { getPostsClass, classificationLists, selectPosts, delPosts } from '@/api/posts.js'
import btns from '@/components/SharingButton'
export default {
  name: 'Foster',
  components: {
    btns
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      submitLoding: false,
      listLoading: false,
      classLists: [],
      filterForm: {
        conversation: '',
        title: '',
        pageNum: 1,
        pageSize: 20
      }, // 筛选信息
      pager: {
        totalPage: 1,
        pageSize: 20,
        pageCount: 100
      }, // 分页信息
      tableList: [{}],
      layerComponent: 'add',
      layerData: {
        component: '',
        type: '',
        title: 'personnelCreation',
        data: {}
      }
    }
  },
  created() {
    this.initClass()
    this.init()
  },
  methods: {
    initClass() {
      const postData = this.qs.stringify({
        id: this.filterForm.name,
        pageNum: this.filterForm.pageNum,
        pageSize: this.filterForm.pageSize
      })
      getPostsClass(postData)
        .then(res => {
          this.tableList = res.data.lists
          this.pager.pageCount = res.data.pageCount || 0
          this.pager.totalPage = res.data.totalPage || 0
          this.pager.pageSize = res.data.pageSize || this.pager.pageSize
          classificationLists().then(res => {
            this.classLists = res.data.lists
          })
        })
    },
    // 初始化
    async init(value, type) {
      this.listLoading = true
      this.drawer = false
      if (type) {
        this.filterForm[type] = value || 1
      }
      if (type !== 'pageNum') {
        this.filterForm.pageNum = 1
      }
      const postData = this.qs.stringify({
        title: this.filterForm.title,
        conversation: this.filterForm.conversation,
        pageNum: this.filterForm.pageNum,
        pageSize: this.filterForm.pageSize
      })
      selectPosts(postData)
        .then(res => {
          this.listLoading = false
          this.tableList = res.data.lists
          this.pager.pageCount = res.data.pageCount || 0
          this.pager.totalPage = res.data.totalPage || 0
          this.pager.pageSize = res.data.pageSize || this.pager.pageSize
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 删除按钮
    deleteList(row, id, index) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const postData = this.qs.stringify({
            id: id
          })
          delPosts(postData)
            .then(rps => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.tableList.splice(index, 1)
              this.init()
            }).catch(() => {
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 表格勾选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 切换勾选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.init(1, 'pageNum')
      })
    },
    // 移除  已选值===设置值
    async trySelector(type) {
      this.multipleSelection.map(item => {
        if (item.is_enabled === type) {
          this.$message({
            message: `${item.name}的状态已是所选状态，将不提交人员`
          })
          this.toggleSelection([item])
        }
      })
      await new Promise(resolve => {
        setTimeout(resolve, 1000)
      })
    },
    // 抽屉显示
    showLayer(options) {
      this.layerData.component = options.component
      this.layerData.title = options.title
      this.layerData.data = options.row || {}
      this.layerData.type = options.type || ''
      this.drawer = true
      console.log(options)
    },
    // 抽屉关闭
    closeDrawer() {
      if (['log', 'view'].indexOf(this.layerData.type) !== -1) {
        this.drawer = false
        this.layerData.component = ''
      } else {
        this.$nextTick(() => {
          this.$refs.layerDataComponent.resetForm()
          this.drawer = false
          this.layerData.component = ''
        })
      }
    }
  }
}
</script>
