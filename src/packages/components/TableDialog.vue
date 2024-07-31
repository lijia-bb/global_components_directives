<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
      width="45%"
      @close="handleClose"
    >
      <div>
        <el-form :model="dataform" ref="popform" :inline="true" size="medium">
          <div class="dataform">
            <!-- 
                :label="item.name"//表单字段名
              :label-width="item.width"//表单宽度
              :prop="item.prop"//表单字段值
            -->
            <el-form-item
              v-for="(item, index) in PopupViewinput"
              :key="index"
              :label="item.name"
              :label-width="item.width"
              :prop="item.prop"
              style="text-align: center"
            >
              <!-- Input输入框 -->
              <el-input
                v-if="
                  item.type === 'number' ||
                    item.type === 'text' ||
                    item.type === 'textarea'
                "
                :type="item.type"
                clearable
                :placeholder="'请输入' + item.name"
                :disabled="item.disabled"
                v-model="dataform[item.prop]"
              ></el-input>
              <!-- Select选择器 -->
              <el-select
                v-if="item.type === 'select'"
                :placeholder="'请输入' + item.name"
                v-model="dataform[item.prop]"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <!-- Switch开关 -->
              <el-switch
                v-if="item.type === 'switch'"
                v-model="dataform[item.prop]"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="item.switch.text.right"
                :inactive-text="item.switch.text.left"
                :active-value="item.switch.value.right"
                :inactive-value="item.switch.value.left"
              >
              </el-switch>
              <!-- 日期选择器 -->
              <el-date-picker
                v-model="dataform[item.prop]"
                v-if="item.type === 'datetime'"
                type="datetime"
                placeholder="选择日期时间"
                value-format="timestamp"
              >
              </el-date-picker>

              <!-- 图片上传 -->
              <el-upload
                v-if="item.type === 'img'"
                ref="upload"
                action="#"
                :auto-upload="false"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP"
                :class="{ disabled: uploadDisabled }"
                :limit="1"
                list-type="picture-card"
                :on-change="handleChange"
                :on-remove="handleRemove"
              >
                <img
                  style="width: 148px; height: 148px"
                  v-if="dataform[item.prop]"
                  :src="dataform[item.prop]"
                  class="avatar"
                />
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                <i v-else class="el-icon-plus"></i>
              </el-upload>

              <!-- 多张图片上传 -->
              <el-upload
                v-if="item.type === 'imgList'"
                action="#"
                ref="uploadList"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="uploadImg"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 底部按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TableDialog',
  data() {
    return {
      uploadDisabled: false,
      val: Number,
      title: '',
      dialogVisible: true,
      dataform: {}
    }
  },
  props: {
    PopupViewinput: Array //表单内接收值
  },
  methods: {
    open(val, title, data) {
      if (val === 1) {
        if (data != null) {
          this.dataform = Object.assign({}, data) //浅拷贝防止表格跟随弹窗变化
        }
      }
      this.val = val
      this.title = title
      this.dialogVisible = true
    },
    //提交
    submit() {
      if (this.val === 0) {
        this.$emit('submitAdd', this.dataform)
      } else if (this.val === 1) {
        this.$emit('submitUpdate', this.dataform)
      }
      this.dialogVisible = false
    },
    handleClose() {
      this.dataform = this.$options.data().dataform
      if (this.$refs.upload) {
        this.$refs.upload[0].clearFiles()
      }
      if (this.$refs.uploadList) {
        this.$refs.uploadList[0].clearFiles()
      }
      this.uploadDisabled = false
    },
    handleChange(file, fileList) {
      console.log(fileList)
      this.$emit('img', file)
      this.uploadDisabled = true
    },
    handleRemove() {
      this.$refs.upload[0].clearFiles()
      this.uploadDisabled = false
    },
    uploadImg(file, fileList) {
      console.log(fileList)
      this.$emit('imgList', file)
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none !important;
}
.dataform {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
