<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" label-position="right" style="width:90%;margin:10px 0px 0px 20px">
      <!-- 编辑和添加 -->
      <template>
        <el-form-item label="板块名称：" prop="className">
          <el-input v-model="ruleForm.className" placeholder="请输入板块名称" style="width:215px" />
        </el-form-item>
        <el-form-item label="板块介绍：" prop="introduction">
          <el-input v-model="ruleForm.introduction" type="textarea" :rows="2" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否鉴定人才能评论：" prop="introduction">
          <el-radio v-model="radio" label="0">否</el-radio>
          <el-radio v-model="radio" label="1">是</el-radio>
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
import { addPostsClass, editClassification, infoClassification } from '@/api/posts.js'
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
      radio: '0',
      submitLoding: false,
      departmentList: [],
      ruleForm: {
        className: '',
        introduction: ''
      },
      rules: {
        className: [{ required: true, message: '请输入', trigger: 'blur' }],
        introduction: [{ required: true, message: '请输入', trigger: 'blur' }]
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
        this.ruleForm.introduction = res.data.lists.introduction
        this.radio = res.data.lists.appraiser
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
          var date = new Date()
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var day = date.getDate()
          if (month < 10) {
            month = '0' + month
          }
          if (day < 10) {
            day = '0' + day
          }
          var nowDate = year + '年' + month + '月' + day + '日'
          if (propType === 'add') {
            const postData = this.qs.stringify({
              name: this.ruleForm.className,
              introduction: this.ruleForm.introduction,
              time: nowDate,
              appraiser: Number(this.radio)
            })
            addPostsClass(postData)
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
              name: this.ruleForm.className,
              introduction: this.ruleForm.introduction,
              time: nowDate,
              appraiser: this.radio
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
