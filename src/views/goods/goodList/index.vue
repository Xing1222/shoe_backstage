<template>
  <div class="app-container">
    <!-- 筛选栏 -->
    <div class="filter-form">
      <div class="filter-container">
        <el-form ref="filterForm" :inline="true" :model="filterForm">
          <btns @dataInit="init(1, 'pageNum')" @resetForm="resetForm('filterForm')">
            <template slot="top">
              <el-button size="samll" type="primary" @click.stop="showLayer({ component: 'add', title: '新增商品', type: 'add' })">
                新增商品
              </el-button>
            </template>
            <el-form-item label="商品分类：">
              <el-select v-model="filterForm.type" filterable placeholder="请选择" clearable style="width:215px" @change="init" @clear="init">
                <el-option v-for="(item, index) in classLists" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称：">
              <el-input v-model="filterForm.name" placeholder="请输入" class="filter-item" clearable @clear="init" />
            </el-form-item>
            <el-form-item label="商品价格：">
              <el-input v-model="filterForm.price" placeholder="请输入" class="filter-item" clearable @clear="init" />
            </el-form-item>
            <el-form-item label="商品库存：">
              <el-input v-model="filterForm.stock" placeholder="请输入" class="filter-item" clearable @clear="init" />
            </el-form-item>
          </btns>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <el-table ref="multipleTable" v-loading="listLoading" :data="tableList" border fit highlight-current-row tooltip-effect="dark" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="商品分类" align="center" prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type | filterslist(classLists) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" align="center" :width="tableList[0]?(tableList[0].hasOwnProperty('image') ? tableList[0].image.length * 120 : 150):120">
        <template slot-scope="scope">
          <div v-if="scope.row.image" style="display:flex;justify-content: space-evenly;">
            <el-image v-for="(item, index) in scope.row.image" :key="index" :src="item" fit="contain" :preview-src-list="scope.row.image" />
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="name" />
      <!-- <el-table-column label="商品介绍" align="center" prop="price" /> -->
      <el-table-column label="商品价格" align="center" prop="price" />
      <el-table-column label="商品颜色" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.color">{{ JSON.parse(scope.row.color).map(item =>item.color).toString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品码数" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.size">{{ JSON.parse(scope.row.size).map(item =>item.size).toString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="price" sortable />
      <el-table-column label="虚拟销量" align="center" prop="price" />
      <el-table-column label="操作" align="center" width="240" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showLayer({component: 'add',title: '服务编辑',type: 'edit',row: scope.row})">
            编辑
          </el-button>
          <el-button :loading="scope.row.delLoading" size="mini" type="danger" @click="deleteList(scope.row, scope.row.id, scope.$index)">
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
import { classificationLists, selectGoods, delGoods } from '@/api/goods.js'
import btns from '@/components/SharingButton'
import add from './add'
export default {
  name: 'Foster',
  filters: {
    filterslist(value, list) {
      let data = ''
      list.map(item => {
        if (value - 0 === item.id) {
          data = item.name
        }
      })
      return data
    }
  },
  components: {
    btns,
    add
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      submitLoding: false,
      listLoading: false,
      classLists: [],
      filterForm: {
        name: '',
        price: '',
        type: '',
        stock: '',
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
    classificationLists().then(res => {
      this.classLists = res.data.lists
    })
    this.init()
  },
  methods: {
    // 初始化
    async init(value, type) {
      this.filterForm.keyword = this.filterForm.canteenName
      this.listLoading = true
      this.drawer = false
      if (type) {
        this.filterForm[type] = value || 1
      }
      if (type !== 'pageNum') {
        this.filterForm.pageNum = 1
      }
      const postData = this.qs.stringify({
        name: this.filterForm.name,
        price: this.filterForm.price,
        type: this.filterForm.type,
        stock: this.filterForm.stock,
        pageNum: this.filterForm.pageNum,
        pageSize: this.filterForm.pageSize
      })
      selectGoods(postData)
        .then(res => {
          this.listLoading = false
          this.tableList = res.data.lists
          console.log(JSON.parse(this.tableList[0].color))
          this.tableList.forEach(item => {
            if (item.imageUrl) {
              this.$set(item, 'image', item.imageUrl.split(','))
            }
          })
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
          delGoods(postData)
            .then(rps => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.tableList.splice(index, 1)
              this.$emit('dataInit')
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
