<template>
  <!-- //引入子组件TableContainer主界面传输和接收值 -->
  <div>
    <TableContainer
      v-bind="da"
      @selCX="load"
      @reset="reset"
      @getlist="load"
      @simTopAdd="addClick"
      @simTopRemove="deleteClick"
      @simEdit="editClick"
      @simRemove="deleteOneClick"
    />
    <!--  //引入子组件TableDialog弹窗传输和接收值 -->
    <TableDialog
      ref="dia"
      v-bind="da1"
      @img="addimg"
      @submitAdd="submitAdd"
      @submitUpdate="submitUpdate"
    />
  </div>
</template>

<script>
import TableContainer from '@/components/globalComponents/TableContainer.vue'
import TableDialog from '@/components/globalComponents/TableDialog.vue'
// import { selectUser, addUser, updateUser, deleteUser } from '@/api/user.js'
// import { upload } from '@/api/upload.js'

export default {
  name: 'UserCon',
  components: {
    TableContainer,
    TableDialog
  },
  data() {
    return {
      //传给主界面TableContainer的值
      da: {
        page: {
          //页数
          current: 1,
          pageSize: 10
        },
        TopBtu: [
          //顶部按钮
          {
            type: 'primary',
            label: '新建',
            icon: 'el-icon-circle-plus',
            incident: 'Add'
          },
          {
            type: 'danger',
            label: '删除',
            icon: 'el-icon-delete-solid',
            incident: 'Remove'
          }
        ],
        searchK: [
          //顶部搜索框部分
          { type: 'text', label: '账号', prop: 'account' },
          { type: 'text', label: '邮箱', prop: 'email' },
          { type: 'text', label: '手机号', prop: 'mobilePhoneNumber' },
          { type: 'text', label: '昵称', prop: 'nickname' }
        ],
        tableProp: [
          //表格部分
          { prop: 'avatar', name: '用户头像', width: '150' },
          { prop: 'id', name: '用户id', width: '200' },
          { prop: 'account', name: '账户', width: '100' },
          { prop: 'age', name: '年龄', width: '100' },
          { prop: 'area', name: '地区', width: '150' },
          {
            prop: 'admin',
            name: '管理员',
            width: '100',
            formatter: this.formatter //格式化
          },
          {
            prop: 'v',
            name: 'V认证',
            width: '100',
            formatter: this.formatter
          },
          {
            prop: 'createDate',
            name: '注册时间',
            width: '200',
            formatter: this.formatter
          },
          {
            prop: 'deleted',
            name: '可删除',
            width: '100',
            formatter: this.formatter
          },
          { prop: 'nickname', name: '昵称', width: '100' },
          { prop: 'email', name: '邮箱', width: '200' },
          { prop: 'hobby', name: '兴趣爱好', width: '150' },
          {
            prop: 'lastLogin',
            name: '最后登录时间',
            width: '200',
            formatter: this.formatter
          },
          { prop: 'mobilePhoneNumber', name: '电话号码', width: '200' },
          { prop: 'design', name: '个性签名', width: '250' },
          { prop: 'password', name: '密码', width: '200' },
          {
            prop: 'sex',
            name: '性别',
            width: '100',
            formatter: this.formatter
          },
          {
            prop: 'status',
            name: '状态',
            width: '100',
            formatter: this.formatter
          },
          { prop: 'work', name: '职业', width: '150' }
        ],
        tableData: [], //表格数据
        tabletotal: 0, //数据数量
        tableConfig: {
          //表格配置
          pagin: true,
          selection: true, // 选择框
          index: true, // 序号
          border: true, // 边框
          handle: true, // 是否显示操作列
          buttonAffairs: [
            //操作列按钮
            {
              name: '编辑',
              icon: 'el-icon-plus',
              type: 'primary',
              affairs: 'Edit'
            },
            {
              name: '删除',
              icon: 'el-icon-delete',
              type: 'danger',
              affairs: 'Remove'
            }
          ]
        }
      },
      //传给弹窗页TableDialog的值
      da1: {
        PopupViewinput: [
          //表单部分
          {
            prop: 'avatar',
            name: '头像',
            width: '100px',
            type: 'img'
          },
          {
            prop: 'id',
            name: '用户id',
            width: '80px',
            type: 'text',
            disabled: true
          },
          { prop: 'account', name: '账户', width: '80px', type: 'text' },
          { prop: 'age', name: '年龄', width: '80px', type: 'text' },
          {
            prop: 'createDate',
            name: '注册时间',
            width: '80px',
            type: 'datetime'
          },
          {
            prop: 'admin',
            name: '管理员',
            type: 'switch',
            switch: {
              text: { left: '否', right: '是' },
              value: { left: 0, right: 1 }
            }
          },
          {
            prop: 'lastLogin',
            name: '最后登录时间',
            width: '100px',
            type: 'datetime'
          },
          {
            prop: 'deleted',
            name: '可删除',
            type: 'switch',
            switch: {
              text: { left: '否', right: '是' },
              value: { left: 0, right: 1 }
            }
          },
          { prop: 'design', name: '个性签名', width: '80px', type: 'text' },
          {
            prop: 'v',
            name: 'v认证',
            type: 'switch',
            switch: {
              text: { left: '未完成', right: '已完成' },
              value: { left: 1, right: 3 }
            }
          },
          { prop: 'email', name: '邮箱', width: '80px', type: 'text' },
          {
            prop: 'sex',
            name: '性别',
            width: '80px',
            type: 'switch',
            switch: {
              text: { left: '女', right: '男' },
              value: { left: 0, right: 1 }
            }
          },
          { prop: 'hobby', name: '兴趣爱好', width: '80px', type: 'text' },
          { prop: 'area', name: '地区', width: '80px', type: 'text' },
          {
            prop: 'mobilePhoneNumber',
            name: '电话号码',
            width: '80px',
            type: 'text'
          },
          { prop: 'nickname', name: '昵称', width: '80px', type: 'text' },
          { prop: 'password', name: '密码', width: '80px', type: 'text' },

          {
            prop: 'status',
            name: '状态',
            width: '80px',
            type: 'switch',
            switch: {
              text: { left: '离线', right: '在线' },
              value: { left: 0, right: 1 }
            }
          },
          { prop: 'work', name: '职业', width: '80px', type: 'text' }
        ]
      }
    }
  },
  mounted() {
    this.load({})
  },
  methods: {
    // eslint-disable-next-line no-undef
    formatter(row, column, cellValue, index) {
      console.log(row, column, cellValue, index)
      //格式化
      if (column.property == 'admin') {
        return cellValue === 1 ? '是' : '否'
      }
      if (column.property == 'deleted') {
        return cellValue === 1 ? '是' : '否'
      }
      if (column.property == 'v') {
        switch (cellValue) {
          case 1:
            return '未认证'
          case 2:
            return '进行中'
          case 3:
            return '已认证'
        }
      }
      if (column.property == 'sex') {
        return cellValue === 1 ? '男' : '女'
      }
      if (column.property == 'status') {
        return cellValue === 1 ? '在线' : '离线'
      }
      //   if (column.property == 'createDate' || 'lastLogin') {
      //     let date = new Date(cellValue)
      //     let y = date.getFullYear()
      //     let MM = date.getMonth() + 1
      //     MM = MM < 10 ? '0' + MM : MM
      //     let d = date.getDate()
      //     d = d < 10 ? '0' + d : d
      //     let h = date.getHours()
      //     h = h < 10 ? '0' + h : h
      //     let m = date.getMinutes()
      //     m = m < 10 ? '0' + m : m
      //     let s = date.getSeconds()
      //     s = s < 10 ? '0' + s : s
      //     return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      //   }
    },
    load(searchform) {
      console.log(searchform)
      //加载
      //   selectUser(searchform)
      //     .then((res) => {
      //       console.log(res)
      //       this.da.tableData = res.data.records
      //       this.da.tabletotal = res.data.total
      //       this.da.page.current = res.data.current
      //       this.da.page.pageSize = res.data.size
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //     })
    },
    reset() {
      //重置
      this.load({})
    },
    addClick() {
      //新增
      this.$refs.dia.open(0, '新增用户', {})
    },
    editClick(row) {
      //编辑
      this.$refs.dia.open(1, '编辑用户', row)
    },
    submitAdd(data) {
      console.log(data)
      //提交
      //   addUser(data)
      //     .then((res) => {
      //       if (res.success) {
      //         this.$message({
      //           showClose: true,
      //           message: '添加用户成功',
      //           type: 'success'
      //         })
      //         this.load({})
      //       } else {
      //         this.$message({
      //           showClose: true,
      //           message: '添加用户失败',
      //           type: 'error'
      //         })
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //     })
    },
    submitUpdate(data) {
      console.log(data)
      //更新
      //   updateUser(data)
      //     .then((res) => {
      //       if (res.success) {
      //         this.$message({
      //           showClose: true,
      //           message: '更新用户成功',
      //           type: 'success'
      //         })
      //         this.load({})
      //       } else {
      //         this.$message({
      //           showClose: true,
      //           message: '更新用户失败',
      //           type: 'error'
      //         })
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //     })
    },
    deleteClick(data) {
      //顶部按钮删除多个
      if (data.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择要删除的用户',
          type: 'error'
        })
      } else {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // eslint-disable-next-line no-undef
            data.forEach((element) => {
              console.log(element)
              //   deleteUser(element.id)
              //     .then((res) => {})
              //     .catch((err) => {
              //       console.log(err)
              //     })
            })
            this.load({})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    // eslint-disable-next-line no-undef
    deleteOneClick(data) {
      console.log(data)
      //操作列按钮删除单个
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //   deleteUser(data.id)
          //     .then((res) => {
          //       if (res.success) {
          //         this.$message({
          //           showClose: true,
          //           message: '删除用户成功',
          //           type: 'success'
          //         })
          //       } else {
          //         this.$message({
          //           showClose: true,
          //           message: '删除用户失败',
          //           type: 'error'
          //         })
          //       }
          //     })
          //     .catch((err) => {
          //       console.log(err)
          //     })
          this.load({})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addimg(data) {
      //图片上传
      //上传头像前接收的数据
      const isIMAGE =
        data.raw.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = data.raw.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message({
          showClose: true,
          message: '请上传正确的图片格式',
          type: 'error'
        })
      } else if (!isLt2M) {
        this.$message({
          showClose: true,
          message: '上传文件大小不能超过 2MB!',
          type: 'error'
        })
      } else {
        let formdata = new FormData()
        formdata.append('image', data.raw)
        // upload(formdata)
        //   .then((res) => {
        //     console.log(res)
        //     this.$refs.dia.dataform.avatar = res.data
        //     console.log(this.da1)
        //     this.$message({
        //       showClose: true,
        //       message: '头像上传成功',
        //       type: 'success'
        //     })
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
      }
    }
  }
}
</script>

<style></style>
