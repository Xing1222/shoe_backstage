<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" label-position="right" style="width:90%;margin:10px 0px 0px 20px">
      <!-- 编辑和添加 -->
      <template>
        <el-form-item label="商品分类：" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择商品分类" filterable clearable style="width:215px">
            <el-option v-for="(item, index) in classLists" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片：" prop="imageUrl">
          <el-upload :action="uploadFile" list-type="picture-card" :file-list="imageUrlEdit" :on-preview="handlePictureCardPreview" :on-success="handleAvatarSuccess" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
            <!-- <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar"> -->
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt="">
            {{ dialogImageUrl }}
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入商品名称" style="width:215px" />
        </el-form-item>
        <el-form-item label="商品单价：" prop="price">
          <el-input-number v-model="ruleForm.price" :controls="false" :min="0" placeholder="请输入商品单价" style="width:215px" />
        </el-form-item>
        <el-form-item label="商品颜色：" prop="color">
          <el-input v-for="(item, index) in ruleForm.color" :key="index" v-model="item.color" style="width:80px;margin:5px" />
          <el-button type="success" @click="add('color')">增加</el-button>
          <el-button v-if="ruleForm.color.length > 1" type="danger" @click="del('color')">删除</el-button>
        </el-form-item>
        <el-form-item label="商品码数：" prop="size">
          <el-input-number v-for="(item, index) in ruleForm.size" :key="index" v-model="item.size" :controls="false" :min="1" style="width:80px;margin:5px" />
          <el-button type="success" @click="add('size')">增加</el-button>
          <el-button v-if="ruleForm.size.length > 1" type="danger" @click="del('size')">删除</el-button>
        </el-form-item>
        <el-form-item label="虚拟销量：" prop="num">
          <el-input-number v-model="ruleForm.num" placeholder="请输入虚拟销量" :min="0" :controls="false" style="width:215px" />
        </el-form-item>
        <el-form-item label="商品库存：" prop="stock">
          <el-input-number v-model="ruleForm.stock" placeholder="请输入商品库存" :min="0" :controls="false" style="width:215px" />
        </el-form-item>
        <el-form-item label="商品介绍：" prop="content">
          <tinymce-editor ref="editor" v-model="ruleForm.content" @onClick="onClick" />
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
import {
  classificationLists,
  addGoods,
  editGoods,
  infoGoods
} from '@/api/goods.js'
import TinymceEditor from '@/components/tinymceEditor'
import { uploadFile } from '@/api/commom.js'
export default {
  components: {
    TinymceEditor
  },
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
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 400,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: this.uploadFile,
        // UEditor 资源文件的存放路径，如果你使用的是 vue- cli 生成的项目，通常不需要设置该选项，vue- ueditor - wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/UEditor/',
        // UEDITOR_HOME_URL: '/UEditor/'
        convert_urls: false // 这个参数加上去就可以了
      },
      list: [],
      submitLoding: false,
      classLists: [],
      dialogImageUrl: '',
      dialogVisible: false,
      imageUrl: [],
      imageUrlEdit: [],
      imageColorUrl: [],
      uploadFile: uploadFile(),
      ruleForm: {
        type: '',
        imageUrl: [],
        name: '',
        content: '',
        price: 0,
        color: [{ color: '' }],
        size: [{ size: undefined }],
        stock: 0,
        num: 0
      },
      rules: {
        type: [{ required: true, message: '请输入', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请选择', trigger: 'change' }],
        imageColorUrl: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        content: [{ required: true, message: '请输入', trigger: 'blur' }],
        price: [{ required: true, message: '请输入', trigger: 'blur' }],
        color: [{ required: true, message: '请输入', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入', trigger: 'blur' }],
        num: [{ required: true, message: '请输入', trigger: 'blur' }],
        size: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  created() {
    classificationLists().then(res => {
      this.classLists = res.data.lists
    })
    if (this.propType !== 'view') {
      // console.log('1')
      // departmentList().then(res => {
      //   this.departmentList = res.data
      // })
    }
    console.log(['edit', 'view'].indexOf(this.propType) !== -1)
    if (['edit', 'view'].indexOf(this.propType) !== -1) {
      // console.log('2')
      infoGoods(this.qs.stringify({ id: this.propData.id })).then(res => {
        console.log(res)
        console.log(
          res.data.lists.imageurl.split(','),
          'res.data.lists.imageurl'
        )
        this.ruleForm.type = res.data.lists.type
        this.ruleForm.name = res.data.lists.name
        this.ruleForm.price = res.data.lists.price
        this.ruleForm.stock = res.data.lists.stock
        this.ruleForm.num = res.data.lists.num
        this.ruleForm.content = res.data.lists.content
        this.ruleForm.color = JSON.parse(res.data.lists.color)
        this.ruleForm.size = JSON.parse(res.data.lists.size)
        this.imageUrl = res.data.lists.imageurl.split(',')
        res.data.lists.imageurl.split(',').forEach(item => {
          this.imageUrlEdit.push({ url: item })
        })
        // console.log(this.imageUrlEdit, ' this.imageUrlEdit')
      })
    }
  },
  methods: {
    // 鼠标单击的事件
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
    },
    // 清空内容
    clear() {
      this.$refs.editor.clear()
    },
    ready(editorInstance) {
      console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
    },
    add(type) {
      if (type === 'size') {
        this.ruleForm.size.push({ size: undefined })
      } else {
        this.ruleForm.color.push({ color: '' })
      }
    },
    del(type) {
      if (type === 'size') {
        this.ruleForm.size.pop()
      } else {
        this.ruleForm.color.pop()
      }
    },
    // 取消按钮
    closeDrawer() {
      this.$emit('closedrawer')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList, '删除')
      this.imageUrl = fileList.map(item => {
        if (item.response) {
          return 'http://www.shoe.cn' + item.response.data[0].pics
        } else {
          return item.url
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.imageUrl = URL.createObjectURL(file.raw)
      this.dialogImageUrl = res.data[0].pics
      this.dialogImageUrl = 'http://www.shoe.cn' + this.dialogImageUrl
      this.imageUrl.push(this.dialogImageUrl)
      console.log(res, this.imageUrl, 'this.imageUrl')
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
      console.log(this.dialogImageUrl, file, 'this.dialogImageUrl')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submitForm(formName, propType) {
      this.submitLoding = true
      this.ruleForm.imageUrl = this.imageUrl
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          this.ruleForm.color.forEach(item => {
            if (item.color === '') {
              this.ruleForm.color.pop()
            }
          })
          this.ruleForm.size.forEach(item => {
            if (item.size === '') {
              this.ruleForm.size.pop()
            }
          })
          if (propType === 'add') {
            console.log(
              this.ruleForm.color,
              this.ruleForm.size,
              JSON.stringify(this.ruleForm.color)
            )
            const postData = this.qs.stringify({
              type: this.ruleForm.type,
              imageUrl: this.imageUrl.toString(),
              name: this.ruleForm.name,
              content: this.ruleForm.content,
              price: this.ruleForm.price,
              color: JSON.stringify(this.ruleForm.color),
              size: JSON.stringify(this.ruleForm.size),
              stock: this.ruleForm.stock,
              num: this.ruleForm.num
            })
            console.log(postData, JSON.stringify(this.imageUrl))
            addGoods(postData)
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
              type: this.ruleForm.type,
              imageUrl: this.imageUrl.toString(),
              name: this.ruleForm.name,
              content: this.ruleForm.content,
              price: this.ruleForm.price,
              color: JSON.stringify(this.ruleForm.color),
              size: JSON.stringify(this.ruleForm.size),
              stock: this.ruleForm.stock,
              num: this.ruleForm.num
            })
            editGoods(postData).then(rps => {
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
