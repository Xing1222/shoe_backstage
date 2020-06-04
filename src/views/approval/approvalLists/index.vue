<template>
  <div class="app-container">
    <!-- 筛选栏 -->
    <div class="filter-form">
      <div class="filter-container">
        <el-form ref="filterForm" :inline="true" :model="filterForm">
          <btns @dataInit="init(1, 'pageNum')" @resetForm="resetForm('filterForm')">
            <el-form-item label="申请账号：" prop="username">
              <el-input v-model="filterForm.username" placeholder="请输入" class="filter-item" clearable @clear="init" />
            </el-form-item>
          </btns>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <el-table ref="multipleTable" v-loading="listLoading" :data="tableList" border fit highlight-current-row tooltip-effect="dark" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="scope">
          <el-image v-if="scope.row.imageUrl" fit="contain" :src="scope.row.imageUrl" :preview-src-list="scope.row.previewLists" />
          <el-image v-else fit="cover">
            <div slot="error" class="image-slot" style="font-size: 32px;">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center" prop="username" />
      <el-table-column label="申请时间" align="center" prop="time" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | filterslist(statusList) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="pass(scope.row, scope.row.id, scope.$index)">
            通过
          </el-button>
          <el-button size="mini" type="warning" @click="rej(scope.row, scope.row.id, scope.$index)">
            拒绝
          </el-button>
          <el-button size="mini" type="danger" @click="deleteList(scope.row, scope.row.id, scope.$index)">
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
import { selectApprovalLists, approvalPass, approvalRej, delApproval } from '@/api/user.js'
import btns from '@/components/SharingButton'
export default {
  name: 'Foster',
  components: {
    btns
  },
  filters: {
    filterslist(value, list) {
      console.log(value, list, 'sadasd')
      let data = ''
      list.map(item => {
        if (value - 0 === item.id) {
          data = item.label
        }
      })
      return data
    }
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      submitLoding: false,
      listLoading: false,
      classLists: [],
      statusList: [
        { id: -1, label: '审核拒绝' },
        { id: 0, label: '等待审核' },
        { id: 1, label: '通过审核' }
      ],
      filterForm: {
        username: '',
        pageSize: 10,
        pageNum: 1
      }, // 筛选信息
      pager: {
        totalPage: 1,
        pageSize: 10,
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
    this.init()
  },
  methods: {
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
        username: this.filterForm.username,
        pageNum: this.filterForm.pageNum,
        pageSize: this.filterForm.pageSize
      })
      selectApprovalLists(postData)
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
    pass(row, id, index) {
      this.$confirm('是否通过审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const postData = this.qs.stringify({
            id: id
          })
          approvalPass(postData)
            .then(rps => {
              this.$message({
                type: 'success',
                message: '审核通过!'
              })
              this.init()
            }).catch(() => {
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    // 拒绝按钮
    rej(row, id, index) {
      this.$confirm('是否拒绝申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const postData = this.qs.stringify({
            id: id
          })
          approvalRej(postData)
            .then(rps => {
              this.$message({
                type: 'success',
                message: '审批拒绝!'
              })
              this.init()
            }).catch(() => {
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    deleteList(row, id, index) {
      this.$confirm('是否删除此数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const postData = this.qs.stringify({
            id: id
          })
          delApproval(postData)
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
            message: '已取消操作'
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
