<template>
    <div class="app-container">
      <el-row>
        <el-col>
          <el-form ref="form" :model="form" inline>
            <el-form-item prop="search">
              <el-input v-model="form.search" clearable style="width:300px" prefix-icon="el-icon-search" placeholder="搜索" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" icon="el-icon-search" size="medium" @click="search(form)">搜索</el-button>
              <el-button type="warning" icon="el-icon-refresh-left" size="medium" @click="resetForm()">重置</el-button>
              <el-upload
                ref="uploadad"
                style="display:contents;"
                class="upload-demo"
                action="##"
                :http-request="submitExcelToSql"
                :on-change="handleChange"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button
                  slot="trigger"
                  style="margin-left: 10px"
                  size="medium"
                  type="primary"
                >EXCEL上传</el-button>
                <el-button
                  style="margin-left: 10px"
                  size="medium"
                  type="success"
                  @click="submitExcelToSql"
                >上传至数据库</el-button>
                <div slot="tip" style="display:contents;">
                  只能上传xls/xlsx文件，且不超过3Mb
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="time_stamp"
              label="时间戳（小时）"
            />
            <el-table-column
              prop="charge_capacity"
              label="充电容量"
            />
            
            <el-table-column
              fixed="right"
              align="center"
              prop="discharge_capacity"
              label="放电容量"
              width="220"
            >
              <!-- <template slot-scope="{row}">
                <el-button v-permission="['admin','monitor-users-lock']" type="primary" icon="el-icon-edit" size="mini" @click="lockUser(row)">锁定</el-button>
                <el-button v-permission="['admin','monitor-users-black-ip']" type="danger" icon="el-icon-delete" size="mini" @click="blackIP(row)">拉黑IP</el-button>
              </template> -->
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :current-page="form.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="form.size"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { getUsers, realtimecapacity_ExcelToSql, realtimecapacity_getUserData } from '@/api/monitor/realtimecapacity'
  import { updateUserActive } from '@/api/system/users'
  import { createIp } from '@/api/monitor/ip'
  export default {
    name: 'Users',
    data() {
      return {
        form: {
          page: 1,
          size: 10,
          search: ''
        },
        tableData: [],
        total: 0,
        dialogFormVisible: false,
        fileList: [], // 文件列表
        file: {},
        uploading: true // 默认置灰确定导入按钮
      }
    },
    mounted() {
      // this.search()
      this.getData()
    },
    methods: {
      // 获取用户列表/搜索功能
      search() {
        getUserData(this.form).then(res => {
          console.log(res)
          this.tableData = res.data
          this.total = res.total
        })
      },
      // 重置
      resetForm() {
        this.$refs.form.resetFields()
        this.search()
      },
      // 分页
      handleSizeChange(val) {
        this.form.size = val
        this.getData()
      },
      handleCurrentChange(val) {
        this.form.page = val
        this.getData()
      },
      // 移除文件
      handleRemove() {
        this.uploading = true
        this.file = {}
        this.fileList = []
      },
      handleChange(file) { // (file,fileList)参数
        this.uploading = false
        this.file = file
      },
      // 导入excel
      submitExcelToSql() {
        if (!this.file.size) {
          this.$message.warning('请选择上传的文件')
          return
        }
        this.uploading = true
        const formData = new FormData()
        console.log(this.file)
        formData.append('file', this.file.raw)
        console.log(formData)
        realtimecapacity_ExcelToSql(formData).then(res => { // 调用接口
          this.uploading = false
          if (res.code === 200) {
            this.$message.success('文件上传成功')
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getData() {
        realtimecapacity_getUserData(this.form).then(res => {
          console.log(res)
          this.tableData = res.data
          this.total = res.total
        }).catch(err => {
          this.$message.error(err)
        })
      }
  
    }
  
  }
  </script>