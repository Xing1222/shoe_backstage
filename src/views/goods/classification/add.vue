<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" label-position="right" style="width:90%;margin:10px 0px 0px 20px">
      <!-- 编辑和添加 -->
      <template>
        <el-form-item label="分类名称：" prop="className">
          <el-input v-model="ruleForm.className" placeholder="请输入分类名称" style="width:215px" />
        </el-form-item>
        <el-form-item class="only-child">
          <el-button v-if="propType === 'edit'" :loading="submitLoding" type="primary" @click="submitForm('ruleForm', 'edit')">
            编辑
          </el-button>
          <el-button v-else :loading="submitLoding" type="primary" @click="submitForm('ruleForm', 'add')">
            创建
          </el-button>
          <el-button @click="closeDrawer">
            取消
          </el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { addGoodsClass, editClassification, infoClassification } from '@/api/goods.js'
export default {
  props: {
    propData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    propType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      submitLoding: false,
      departmentList: [],
      ruleForm: {
        className: ''
      },
      rules: {
        className: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.propType !== 'view') {
      // console.log('1')
    }
    if (['edit', 'view'].indexOf(this.propType) !== -1) {
      infoClassification(this.qs.stringify({ id: this.propData.id })).then(res => {
        this.ruleForm.className = res.data.lists.name
      })
    }
  },
  methods: {
    // 取消按钮
    closeDrawer() {
      this.$emit('closedrawer')
    },
    submitForm(formName, propType) {
      this.submitLoding = true
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          if (propType === 'add') {
            const postData = this.qs.stringify({
              name: this.ruleForm.className
            })
            addGoodsClass(postData)
              .then(res => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  onClose: () => {
                    this.$emit('dataInit')
                    this.submitLoding = false
                  }
                })
              })
              .catch(rej => {
                this.submitLoding = false
              })
          } else {
            const postData = this.qs.stringify({
              id: this.propData.id,
              name: this.ruleForm.className
            })
            editClassification(postData).then(rps => {
              this.$message({
                message: '编辑成功',
                type: 'success',
                onClose: () => {
                  this.$emit('dataInit')
                  this.submitLoding = false
                }
              })
            })
          }
        } else {
          this.submitLoding = false
          return false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    }
  }
}
</script>
