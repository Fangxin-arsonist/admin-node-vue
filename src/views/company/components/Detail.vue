<template>
  <el-form ref="companyForm" :model="companyForm" :rules="rules">
    <sticky :class-name="'sub-navbar'">
      <el-button type="success" v-loading="loading" @click.native.prevent="submitForm">{{isEdit?'保存':'添加'}}
      </el-button>
      <el-button type="info" style="margin: 0 28px 0 10px" @click.native.prevent="back">返回</el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="COMPANY_CODE" label="单位编号:" :label-width="labelWidth">
            <el-input ref="COMPANY_CODE" v-model="companyForm.COMPANY_CODE" placeholder="单位编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="NAME" label="单位名称:" :label-width="labelWidth">
            <el-input ref="NAME" v-model="companyForm.NAME" placeholder="单位名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否启用:" :label-width="labelWidth">
            <el-select
              v-model="companyForm.DISABLED"
              class="filter-item"
              placeholder="是否启用"
              style="width: 408px;"
            >
              <el-option v-for="item in disabledList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="传真号码:" :label-width="labelWidth">
            <el-input v-model="companyForm.FAX" placeholder="传真号码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="联系电话1:" :label-width="labelWidth">
            <el-input v-model="companyForm.TEL1" placeholder="联系电话1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话2:" :label-width="labelWidth">
            <el-input v-model="companyForm.TEL2" placeholder="联系电话2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="联系地址:" :label-width="labelWidth">
            <el-input v-model="companyForm.ADDR_WORKING" placeholder="联系地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isEdit">
        <el-col :span="12">
          <el-form-item label="创建人:" :label-width="labelWidth">
            <el-input v-model="companyForm.CREATE_BY" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改人:" :label-width="labelWidth">
            <el-input v-model="companyForm.UPDATE_BY" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isEdit">
        <el-col :span="12">
          <el-form-item label="创建时间:" :label-width="labelWidth">
            <el-input v-model="companyForm.CREATE_ON" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改时间:" :label-width="labelWidth" disabled>
            <el-input v-model="companyForm.UPDATE_ON" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
  import Sticky from "../../../components/Sticky/index";
  import {getInfo, exist, add, update} from '../../../api/company'

  const fields = {
    COMPANY_CODE: '单位编号',
    NAME: '单位名称',
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
        if (value !== this.oldCompanyCode) {
          //后台方法
          exist(value).then(res => {
            if (res && res.data.isExists) {
              callback("单位编号已存在")
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
        loading: false,
        oldCompanyCode: '',
        companyForm: {
          COMPANY_CODE: '',
          NAME: '',
          TEL1: '',
          TEL2: '',
          FAX: '',
          ADDR_WORKING: '',
          DISABLED: 0
        },
        labelWidth: '120px',
        rules: {
          COMPANY_CODE: [{required: true, validator: validateRequire}, {validator: isExistValidate, trigger: 'blur'}],
          NAME: [{required: true, validator: validateRequire}]
        },
      }
    },
    mounted() {
      if (this.isEdit) {
        this.getInfo(this.$route.params.id);
      }
      if (this.companyForm.COMPANY_CODE === '') {
        this.$refs.COMPANY_CODE.focus()
      } else if (this.companyForm.NAME === '') {
        this.$refs.NAME.focus()
      }
    },
    methods: {
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
          this.$router.push('/company/index');
        };
        if (!this.loading) {
          this.loading = true;
          this.$refs.companyForm.validate((valid, fields) => {
            if (valid) {
              if (!this.isEdit) {
                add(this.companyForm).then((response) => {
                  onSuccess(response)
                }).catch(() => {
                  this.loading = false;
                });
              } else {
                update(this.companyForm).then((response) => {
                  onSuccess(response)
                }).catch(() => {
                  this.loading = false;
                });
              }
            } else {
              const message = fields[Object.keys(fields)[0]][0].message;
              this.$message({message, type: 'error'})
              this.loading = false;
            }
          })
        }
      },
      /** 获取用户信息 */
      getInfo(id) {
        if (id) {
          getInfo(id).then(response => {
            const {data} = response;
            this.oldCompanyCode = data.COMPANY_CODE;
            this.companyForm = data;
          }).catch(() => {
          });
        }
      },
      /*返回列表*/
      back() {
        this.$router.push('/company/index');
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
