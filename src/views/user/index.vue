<template>
  <div class="app-container">
    <div class="filter-container" >
      <el-form :inline="true">
        <el-row>
          <el-col :span="19" class="queryCon">
            <el-form-item label="登录账号:">
              <el-input
                v-model="listQuery.USER_ID"
                placeholder="登录账号"
                class="filter-item"
                style="width: 200px;"
                clearable
                @keyup.enter.native="handleFilter"
                @blur="handleFilter"
                @clear="handleFilter"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属单位:">
              <el-select
                v-model="listQuery.COMPANY_ID"
                class="filter-item"
                placeholder="所属单位"
                style="width: 200px;"
                clearable
                @change="handleFilter"
                @clear="handleFilter"
              >
                <el-option v-for="item in companyList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色:">
              <el-select
                v-model="listQuery.ROLES_ID"
                class="filter-item"
                placeholder="角色"
                style="width: 200px;"
                clearable
                @change="handleFilter"
                @clear="handleFilter"
              >
                <el-option v-for="item in roleList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete"
                       style="margin-left: 10px"
                       @click="handleClear">清空
            </el-button>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询
            </el-button>
            <el-button v-if="createBtnIsShow" v-waves class="filter-item" type="primary" icon="el-icon-circle-plus-outline"
                       style="margin-left: 10px"
                       @click="handleCreate">新增
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="min-height: 433px">
      <el-table border
                fit
                highlight-current-row
                style="width: 100%"
                :key="tableKey"
                v-loading="listLoading"
                :data="userList"
                :default-sort="defaultSort"
                @sort-change="sortChange"
                @row-dblclick="dblclick"
      >
        <el-table-column fixed prop="USER_ID" label="登录账号" sortable="custom" align="center" width="150">
          <template slot-scope="{ row: { USER_IDWrapper }}">
            <span v-html="USER_IDWrapper"></span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="USER_NAME" label="用户名称" sortable="custom" align="center"
                         width="150"></el-table-column>
        <el-table-column fixed prop="COMPANY_NAME" label="所属单位" sortable="custom" align="center"
                         width="250"></el-table-column>
        <el-table-column fixed prop="ROLE_NAME" label="角色" sortable="custom" align="center" width="110">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ROLE_NAME === '超级管理员'" type="success" disable-transitions>{{ scope.row.ROLE_NAME
              }}
            </el-tag>
            <el-tag v-if="scope.row.ROLE_NAME === '管理员'" disable-transitions>{{ scope.row.ROLE_NAME }}</el-tag>
            <el-tag v-if="scope.row.ROLE_NAME !== '管理员' && scope.row.ROLE_NAME !== '超级管理员'" type="info"
                    disable-transitions>{{ scope.row.ROLE_NAME }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="DISABLED" label="状态" sortable="custom" align="center" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.DISABLED === 0 ? 'success' : 'danger'" disable-transitions>{{ scope.row.DISABLED === 0 ? '启用':'禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="TEL1" label="联系电话1" align="center" width="150"></el-table-column>
        <el-table-column prop="TEL2" label="联系电话2" align="center" width="150"></el-table-column>
        <el-table-column prop="EMAIL" label="邮箱" align="center" width="150"></el-table-column>
        <el-table-column prop="ADDR" label="联系地址" align="center" width="150"></el-table-column>
        <el-table-column prop="CREATE_BY" label="创建人" sortable="custom" align="center" width="150"></el-table-column>
        <el-table-column prop="CREATE_ON" label="创建时间" sortable="custom" align="center" width="180"></el-table-column>
        <el-table-column prop="UPDATE_BY" label="修改人" sortable="custom" align="center" width="150"></el-table-column>
        <el-table-column prop="UPDATE_ON" label="修改时间" sortable="custom" align="center" width="180"></el-table-column>
        <el-table-column v-if="editBtnIsShow" fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="140">
          <template  slot-scope="scope" v-if="scope.row.ROLES_ID > 0">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              style="min-width: 50px"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="scope.row.id !== 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              style="min-width: 50px;margin-left: 0;color: red"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />
  </div>
</template>

<script>
  import Pagination from "../../components/Pagination/index";
  import waves from "../../directive/waves/waves"
  import {getList, deleted} from '../../api/user'
  import {getSelectList} from '../../api/company'
  import {getRoleSelectList} from '../../api/role'
  import store from '@/store'

  export default {
    name: "index",
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        listLoading: false,
        listQuery: {},
        companyList: [],
        roleList: [],
        userList: [],
        total: 0,
        defaultSort: {},
        createBtnIsShow: false,
        editBtnIsShow: false,
      }
    },
    created() {
      this.paresQuery();
    },
    mounted() {
      this.getCompanyList();
      this.getRoleList();
      this.getList();
      const roles = store.getters.roles;
      roles.forEach(role => {
        if(role.PERMISSION === '/user/create'){
          this.createBtnIsShow = true;
        }
        if(role.PERMISSION === '/user/edit'){
          this.editBtnIsShow = true;
        }
      });
    },
    beforeRouteUpdate(to, from, next) {
      if (to.path === from.path) {
        const newQuery = Object.assign({}, to.query);
        const oldQuery = Object.assign({}, from.query);
        if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
          this.getList()
        }
      }
      next();
    },
    methods: {
      /*双击行*/
      dblclick(row, column, event){
        if(row.ROLES_ID === 0){
          this.$message.error('超级管理员不可编辑！');
        }else {
          this.handleEdit(row);
        }
      },
      paresQuery() {
        const query = Object.assign({}, this.$route.query);
        let sort = '+USER_ID';
        let pageQuery = {
          page: 1,
          pageSize: 10,
          sort
        };
        if (query) {
          query.page && (query.page = +query.page);
          query.pageSize && (query.pageSize = +query.pageSize);
          query.sort && (sort = query.sort);
        }
        const sortSymbol = sort[0];
        const sortColumn = sort.slice(1, sort.length);
        this.defaultSort = {
          prop: sortColumn,
          order: sortSymbol === '+' ? 'ascending' : 'descending'
        };
        this.listQuery = {...pageQuery, ...query}
      },
      /*用户列表匹配查询条件进行高亮*/
      wrapperKeyword(k, v) {
        function highLight(value) {
          return `<span style="color:#1890ff">${value}</span>`
        }

        if (!this.listQuery[k]) {
          return v;
        } else {
          return v.replace(new RegExp(this.listQuery[k]), v => highLight(v));
        }
      },
      /** 获取用户列表 */
      getList() {
        this.listLoading = true;
        getList(this.listQuery).then(response => {
          console.log(response)
          const {list, count, page, pageSize} = response.data;
          this.userList = list;
          this.total = count;
          this.listLoading = false;
          this.userList.forEach(user => {
            user.USER_IDWrapper = this.wrapperKeyword('USER_ID', user.USER_ID);
          });
        })
      },
      /** 获取单位下拉列表 */
      getCompanyList() {
        getSelectList().then(response => {
          this.companyList = response.data;
        })
      },
      /** 获取角色下拉列表 */
      getRoleList() {
        getRoleSelectList().then(response => {
          this.roleList = response.data;
        })
      },
      /** 排序操作 */
      sortChange(data) {
        const {prop, order} = data;
        this.sortBy(prop, order);
        this.handleFilter();
      },
      sortBy(prop, order) {
        if (order === 'ascending') {
          this.listQuery.sort = `+${prop}`;
        } else {
          this.listQuery.sort = `-${prop}`;
        }
      },
      /** 查询按钮、查询条件变化查询 */
      refresh() {
        this.$router.push({
          path: '/user/index',
          query: this.listQuery
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.refresh();
      },
      /** 新增按钮操作 */
      handleCreate() {
        this.$router.push('/user/create');
      },
      /** 编辑按钮操作 */
      handleEdit(row) {
        this.$router.push(`/user/edit/${row.ID}`);
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const that = this;
        this.$confirm(
          '是否确认删除账号为"' + row.USER_ID + '"的数据项?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(function () {
          return deleted([row.ID])
        }).then(response => {
          if (response.code === 0) {
            const {msg} = response;
            this.$notify({
              title: '操作成功',
              message: msg,
              type: 'success',
              duration: 2000
            });
            this.getList()
          } else {
            this.$message.error(response.msg);
          }
        }).catch(function () {
        })
      },
      /*清空查询条件*/
      handleClear() {
        this.listQuery = {
          USER_ID: '',
          ROLES_ID: '',
          COMPANY_ID: '',
          page: 1,
          pageSize: 10,
          sort: '+USER_ID'
        };
        this.handleFilter();
      }
    }
  }
</script>

<style>
  .el-table--medium td {
    padding: 3px 0 !important;
  }
</style>
