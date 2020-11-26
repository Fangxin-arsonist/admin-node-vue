<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/txt+zip"
      class="image-upload"
    >
      <i class="el-icon-upload"></i>
      <div v-if="fileList.length === 0" class="el-upload__text" >
        请将文件拖入或<em>点击上传</em>
      </div>
      <div class="el-upload__text" v-else>
        图书已上传
      </div>
    </el-upload>
  </div>
</template>

<script>
  import {getToken} from "../../utils/auth";

  export default {
    props: {
      fileList: {
        type: Array,
        default() {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        action: `${process.env.VUE_APP_BASE_API}/book/upload`
      }
    },
    computed: {
      headers() {
        return {
          Authorization: `Bearer ${getToken()}`
        }
      }
    },
    methods: {
      //上传前方法
      beforeUpload(file) {
        console.log(file);
        this.$emit('beforeUpload', file)
      },
      //上传文件成功回调方法
      onSuccess(response, file) {
        const {code, msg} = response;
        if (code === 0) {
          this.$message({
            message: msg,
            type: 'success'
          });
          this.$emit('onSuccess', file);
        } else {
          this.$message({
            message: (msg && `上传失败，失败原因：${msg}`) || '上传失败',
            type: 'error'
          });
          this.$emit('onError', file);
        }
      },
      //移除文件回调方法
      onRemove() {
        this.$message({
          message: '文件删除成功',
          type: 'success'
        });
        this.$emit('onRemove');
      },
      //上传文件异常回调方法
      onError(err) {
        console.log({err});
        const erorMsg = err.message && JSON.parse(err.message);
        this.$message({
          message: (erorMsg && erorMsg.msg && `上传失败，失败原因：${erorMsg.msg}`) || '上传失败',
          type: 'error'
        });
        this.$emit('onError', err);
      },
      //单个文件上传回调方法
      onExceed() {
        this.$message({
          message: '每次只能上传一个文件',
          type: 'warning'
        });
      },
    }
  }
</script>

<style scoped>

</style>
