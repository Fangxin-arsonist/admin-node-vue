<template>
  <el-form ref="roleForm" :model="roleForm" :rules="rules">
    <sticky :class-name="'sub-navbar'">
      <el-button type="success" v-loading="loading" @click.native.prevent="submitForm">{{isEdit?'保存':'添加'}}
      </el-button>
      <el-button type="info" style="margin: 0 28px 0 10px" @click.native.prevent="back">返回</el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="SORT_CODE" label="角色编号:" :label-width="labelWidth">
            <el-input ref="SORT_CODE" v-model.number="roleForm.SORT_CODE" placeholder="角色编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="ROLE_NAME" label="角色名称:" :label-width="labelWidth">
            <el-input ref="ROLE_NAME" v-model="roleForm.ROLE_NAME" placeholder="角色名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色描述:" :label-width="labelWidth">
            <el-input v-model="roleForm.ROLE_DESCRIPT" placeholder="角色描述"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用:" :label-width="labelWidth">
            <el-select
              v-model="roleForm.DISABLED"
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
          <el-form-item label="角色菜单:" :label-width="labelWidth">
            <el-tree
              ref="menu"
              style="padding-top: 6px"
              :data="menuData"
              show-checkbox
              node-key="id"
              :default-checked-keys="menuCheck"
              :props="defaultProps">
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isEdit">
        <el-col :span="12">
          <el-form-item label="创建人:" :label-width="labelWidth">
            <el-input v-model="roleForm.CREATE_BY" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改人:" :label-width="labelWidth">
            <el-input v-model="roleForm.UPDATE_BY" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isEdit">
        <el-col :span="12">
          <el-form-item label="创建时间:" :label-width="labelWidth">
            <el-input v-model="roleForm.CREATE_ON" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改时间:" :label-width="labelWidth" disabled>
            <el-input v-model="roleForm.UPDATE_ON" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </div>
  </el-form>
</template>

<script>
  import Sticky from "../../../components/Sticky/index";
  import {getMenuTree, roleSelectMenu} from '../../../api/menu'
  import {getInfo, exist, add, update} from '../../../api/role'
  import store from '@/store'

  const fields = {
    SORT_CODE: '角色编号',
    ROLE_NAME: '角色名称'
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
        if (value !== this.oldSortCode) {
          //后台方法
          exist(value).then(res => {
            if (res && res.data.isExists) {
              callback("角色编号已存在")
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
      const minSortCodeValidate = (rule, value, callback) => {
        if (value <= this.minSortCode) {
          callback(new Error(`角色编号不能小于或等于当前账号角色编号:${this.minSortCode}`))
        } else {
          callback()
        }
      };
      return {
        disabledList: [
          {
            label: '启用',
            value: 0
          },
          {
            label: '禁用',
            value: 1
          }
        ],
        loading: false,
        roleForm: {
          SORT_CODE: null,
          ROLE_NAME: '',
          ROLE_DESCRIPT: '',
          DISABLED: 0
        },
        labelWidth: '120px',
        rules: {
          SORT_CODE: [
            {required: true, validator: validateRequire},
            {type: 'number', message: '只能输入数字', trigger: 'change'},
            {validator: isExistValidate, trigger: 'blur'},
            {validator: minSortCodeValidate, trigger: 'blur'}
          ],
          ROLE_NAME: [{required: true, validator: validateRequire}]
        },
        //菜单树
        menuData: [],
        //角色已选菜单
        menuCheck: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        oldSortCode: 0,
        minSortCode: store.getters.ROLES_ID,
      }
    },
    mounted() {
      if (this.roleForm.SORT_CODE === '') {
        this.$refs.SORT_CODE.focus()
      } else if (this.roleForm.ROLE_NAME === '') {
        this.$refs.ROLE_NAME.focus()
      }
      this.getMenuTreeSelect();
      if (this.isEdit) {
        this.getInfo(this.$route.params.id);
        this.getRoleMenuTreeSelect();
      }
    },
    methods: {
      /** 查询菜单树结构 */
      getMenuTreeSelect() {
        getMenuTree().then(response => {
          this.menuData = response.data;
        })
      },
      /** 查询角色已选菜单 */
      getRoleMenuTreeSelect(roleId) {
        roleSelectMenu(this.$route.params.id).then(response => {
          //console.log(response.data);
          this.menuCheck = response.data;
          if (response.data.length > 0) {
            this.$refs.menu.setCheckedKeys(response.data)
          }
        })
      },

      // 半选中的菜单节点
      getMenuHalfCheckedKeys() {
        return this.$refs.menu.getHalfCheckedKeys();
      },
      // 目前被选中的菜单节点
      getMenuAllCheckedKeys() {
        return this.$refs.menu.getCheckedKeys();
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
          this.$router.push('/role/index');
        };
        if (!this.loading) {
          const AllCheckedKeys = this.getMenuAllCheckedKeys();
          const HalfCheckedKeys = this.getMenuHalfCheckedKeys();
          const menu = HalfCheckedKeys.concat(AllCheckedKeys);
          this.loading = true;
          this.$refs.roleForm.validate((valid, fields) => {
            if (valid) {
              let saveDate = {
                roleForm: this.roleForm,
                menu: menu
              };
              if (!this.isEdit) {
                console.log(saveDate)
                add(saveDate).then((response) => {
                  onSuccess(response)
                }).catch(() => {
                  this.loading = false;
                });
              } else {
                update(saveDate).then((response) => {
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
            const {data} = response;
            this.oldSortCode = data.SORT_CODE;
            this.roleForm = data;
          }).catch(() => {
          });
        }
      },
      /*返回列表*/
      back() {
        this.$router.push('/role/index');
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
