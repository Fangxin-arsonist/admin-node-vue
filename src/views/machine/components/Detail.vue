<template>
  <el-form ref="machineForm" :model="machineForm" :rules="rules">
    <sticky :class-name="'sub-navbar'">
      <el-button type="success" v-loading="loading" @click.native.prevent="submitForm">{{isEdit?'保存':'添加'}}
      </el-button>
      <el-button type="info" style="margin: 0 28px 0 10px" @click.native.prevent="back">返回</el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="MACHINENO" label="设备编号:" :label-width="labelWidth">
            <el-input ref="MACHINENO" v-model="machineForm.MACHINENO" placeholder="设备编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备负责人:" :label-width="labelWidth">
            <el-select
              v-model="machineForm.SBFZR"
              class="filter-item"
              placeholder="设备负责人"
              style="width: 408px"
              clearable
            >
              <el-option v-for="item in userList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="SSDW" label="所属单位:" :label-width="labelWidth">
            <el-select
              ref="SSDW"
              v-model="machineForm.SSDW"
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
        <el-col :span="12">
          <el-form-item label="是否启用:" :label-width="labelWidth">
            <el-select
              v-model="machineForm.DISABLED"
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
      <el-row>
        <el-col :span="24">
          <el-form-item label="可制作单位:" :label-width="labelWidth">
            <el-select
              v-model="machineForm.MAKECARD_ID"
              class="filter-item"
              placeholder="可制作单位"
              style="width: 100%"
              clearable
              multiple
            >
              <el-option v-for="item in companyList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isEdit">
        <el-col :span="12">
          <el-form-item label="创建人:" :label-width="labelWidth">
            <el-input v-model="machineForm.CREATE_BY" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改人:" :label-width="labelWidth">
            <el-input v-model="machineForm.UPDATE_BY" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isEdit">
        <el-col :span="12">
          <el-form-item label="创建时间:" :label-width="labelWidth">
            <el-input v-model="machineForm.CREATE_ON" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改时间:" :label-width="labelWidth" disabled>
            <el-input v-model="machineForm.UPDATE_ON" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
  import Sticky from "../../../components/Sticky/index";
  import {getInfo, exist, add, update} from '../../../api/machine'
  import {getSelectList} from '../../../api/company'
  import {getSelectList as getUserSelect} from '../../../api/user'

  const fields = {
    MACHINENO: '设备编号',
    SSDW: '所属单位'
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
        if (value !== this.oldMachineNo) {
          //后台方法
          exist(value).then(res => {
            if (res && res.data.isExists) {
              callback("设备编号已存在")
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
        oldMachineNo: '',
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
        userList: [],
        companyList: [],
        machineForm: {
          MACHINENO: '',
          SBFZR: '',
          SSDW: '',
          MAKECARD_ID: '',
          MakeCard_Com_Name: '',
          DISABLED: 0
        },
        labelWidth: '120px',
        rules: {
          MACHINENO: [{required: true, validator: validateRequire}, {validator: isExistValidate, trigger: 'blur'}],
          SSDW: [{required: true, validator: validateRequire}],
        },
      }
    },
    mounted() {
      this.getCompanyList();
      this.getUserList();
      if (this.isEdit) {
        console.log('params',this.$route.params)
        this.getInfo(this.$route.params.id);
      }
      if (this.machineForm.MACHINENO === '') {
        this.$refs.MACHINENO.focus()
      }
    },
    methods: {
      /** 获取单位下拉列表 */
      getCompanyList() {
        getSelectList().then(response => {
          console.log(response.data);
          this.companyList = response.data;
        })
      },
      /** 获取负责人下拉列表 */
      getUserList() {
        getUserSelect().then(response => {
          this.userList = response.data;
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
          this.$router.push('/machine/index');
        };
        if (!this.loading) {
          this.loading = true;
          this.$refs.machineForm.validate((valid, fields) => {
            if (valid) {
              let MakeCard_Com_Name2 = [];
              this.companyList.forEach(com => {
                this.machineForm.MAKECARD_ID.forEach(id => {
                  if (com.value === id) {
                    MakeCard_Com_Name2.push(com.label);
                  }
                })
              });
              this.machineForm.MAKECARD_ID = this.machineForm.MAKECARD_ID.join(',');
              this.machineForm.MakeCard_Com_Name = MakeCard_Com_Name2.join(',');
              if (!this.isEdit) {
                add(this.machineForm).then((response) => {
                  console.log('response',response)
                  onSuccess(response)
                }).catch(() => {
                  this.loading = false;
                });
              } else {
                update(this.machineForm).then((response) => {
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
      /** 获取用户信息 */
      getInfo(id) {
        if (id) {
          getInfo(id).then(response => {
            console.log("xiugai",response)
            const {data} = response;
            this.oldMachineNo = data.MACHINENO;
            this.machineForm = data;
          }).catch(() => {
          });
        }
      },
      /*返回列表*/
      back() {
        this.$router.push('/machine/index');
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
