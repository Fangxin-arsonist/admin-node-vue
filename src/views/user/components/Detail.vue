<template>
  <el-form ref="userForm" :model="userForm" :rules="userRules">
    <sticky :class-name="'sub-navbar'">
      <el-button type="success" v-loading="loading" @click.native.prevent="submitForm">{{isEdit?'保存':'添加'}}
      </el-button>
      <el-button type="info" style="margin: 0 28px 0 10px" @click.native.prevent="back">返回</el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="USER_ID" label="登录账号:" :label-width="labelWidth">
            <el-input ref="USER_ID" v-model="userForm.USER_ID" placeholder="登录账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="USER_PASSWD" label="密码:" :label-width="labelWidth">
            <el-input :key="passwordType" ref="USER_PASSWD" v-model="userForm.USER_PASSWD" :type="passwordType"
                      placeholder="密码"></el-input>
            <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名称:" :label-width="labelWidth">
            <el-input v-model="userForm.USER_NAME" placeholder="用户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属单位:" :label-width="labelWidth">
            <el-select
              v-model="userForm.COMPANY_ID"
              class="filter-item"
              placeholder="所属单位"
              style="width: 408px"
              clearable
            >
              <el-option v-for="item in companyList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色:" :label-width="labelWidth">
            <el-select
              v-model="userForm.ROLES_ID"
              class="filter-item"
              placeholder="角色"
              style="width: 408px"
              clearable
            >
              <el-option v-for="item in roleList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱:" :label-width="labelWidth">
            <el-input v-model="userForm.EMAIL" placeholder="邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系电话1:" :label-width="labelWidth">
            <el-input v-model="userForm.TEL1" placeholder="联系电话1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话2:" :label-width="labelWidth">
            <el-input v-model="userForm.TEL2" placeholder="联系电话2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="联系地址:" :label-width="labelWidth">
            <el-input v-model="userForm.ADDR" placeholder="联系地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否启用:" :label-width="labelWidth">
            <el-select
              v-model="userForm.DISABLED"
              class="filter-item"
              placeholder="是否启用"
              style="width: 408px;"
            >
              <el-option v-for="item in disabledList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isEdit">
        <el-col :span="12">
          <el-form-item label="创建人:" :label-width="labelWidth">
            <el-input v-model="userForm.CREATE_BY" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改人:" :label-width="labelWidth">
            <el-input v-model="userForm.UPDATE_BY" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isEdit">
        <el-col :span="12">
          <el-form-item label="创建时间:" :label-width="labelWidth">
            <el-input v-model="userForm.CREATE_ON" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改时间:" :label-width="labelWidth" disabled>
            <el-input v-model="userForm.UPDATE_ON" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
  import Sticky from "../../../components/Sticky/index";
  import {getUserInfo, add, update, exist} from '../../../api/user'
  import {getSelectList} from '../../../api/company'
  import {getRoleSelectList} from '../../../api/role'
  import crypto from 'crypto'

  const fields = {
    USER_ID: '账号',
    USER_PASSWD: '密码',
  };
  export default {
    name: "Detail",
    components: {Sticky},
    props: {
      isEdit: Boolean
    },
    data() {
      let isExistValidate = (rule, value, callback) => {
        //判断值是否与获取值相同
        if (value !== this.oldUserId) {
          //后台方法
          exist(value).then(res => {
            console.log(res);
            if (res && res.data.isExists) {
              callback("账号已存在")
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      };
      const validateRequire = (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error(fields[rule.field] + '必须填写'))
        } else {
          callback()
        }
      };
      return {
        disabledList: [
          {
            label: '启用',
            value: 0
          }, {
            label: '禁用',
            value: 1
          }
        ],
        passwordType: '',
        companyList: [],
        roleList: [],
        oldUserId: '',
        loading: false,
        userForm: {
          USER_ID: '',
          USER_PASSWD: '',
          USER_NAME: '',
          ROLES_ID: '',
          COMPANY_ID: '',
          TEL1: '',
          TEL2: '',
          EMAIL: '',
          ADDR: '',
          DISABLED: 0
        },
        labelWidth: '120px',
        userRules: {
          USER_ID: [{required: true, validator: validateRequire}, {validator: isExistValidate, trigger: 'blur'}],
          USER_PASSWD: [{required: true, validator: validateRequire}]
        },
      }
    },
    mounted() {
      this.getCompanyList();
      this.getRoleList();
      if (this.isEdit) {
        this.getUserInfo(this.$route.params.id);
      }
      if (this.userForm.USER_ID === '') {
        this.$refs.USER_ID.focus()
      } else if (this.userForm.USER_PASSWD === '') {
        this.$refs.USER_PASSWD.focus()
      }
    },
    methods: {
      /** 获取单位下拉列表 */
      getCompanyList() {
        getSelectList(this.listQuery).then(response => {
          this.companyList = response.data;
        })
      },
      /** 获取角色下拉列表 */
      getRoleList() {
        getRoleSelectList().then(response => {
          this.roleList = response.data;
        })
      },
      /** 表单提交 */
      submitForm() {
        const onSuccess = (response) => {
          const {msg} = response;
          this.$notify({
            title: '操作成功',
            message: msg,
            type: 'success',
            duration: 2000
          });
          this.loading = false;
          this.$router.push('/user/index');
        };
        if (!this.loading) {
          this.loading = true;
          this.$refs.userForm.validate((valid, fields) => {
            if (valid) {
              if (!this.isEdit) {
                add(this.userForm).then((response) => {
                  onSuccess(response)
                }).catch(() => {
                  this.loading = false;
                });
              } else {
                update(this.userForm).then((response) => {
                  onSuccess(response)
                }).catch(() => {
                  this.loading = false;
                });
              }
            } else {
              const message = fields[Object.keys(fields)[0]][0].message;
              this.$message({message, type: 'error'});
              this.loading = false;
            }
          })
        }
      },

      /*解密*/
      aesDecrypt(password, key) {
        const decipher = crypto.createDecipher('aes192', key);
        let decrypted = decipher.update(password, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      },
      /** 获取用户信息 */
      getUserInfo(id) {
        if (id) {
          getUserInfo(id).then(response => {
            //console.log('UserInfo',response);
            const {data} = response;
            this.oldUserId = data.USER_ID;
            data.USER_PASSWD = this.aesDecrypt(data.USER_PASSWD, 'Password');
            this.userForm = data;
          }).catch(() => {
          });
        }
      },
      /*密码显示隐藏切换*/
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      /*返回列表*/
      back() {
        this.$router.push('/user/index');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .detail-container {
    padding: 40px 50px 20px;

    .preview-img {
      width: 200px;
      height: 270px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
</style>
