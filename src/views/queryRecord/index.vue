<template>
  <div class="app-container" style="padding-bottom: 0">
    <div class="filter-container" style="padding-bottom: 0">
      <el-form :inline="true">
        <el-row>
          <el-col :span="19" class="queryCon">
            <el-form-item label="设备编号:">
              <el-input
                v-model="listQuery.machineNo"
                placeholder="设备编号"
                class="filter-item"
                style="width: 200px;"
                clearable
                @keyup.enter.native="handleFilter"
                @blur="handleFilter"
                @clear="handleFilter"
              ></el-input>
            </el-form-item>
            <el-form-item label="查询起始时间:">
              <el-date-picker
                v-model="listQuery.startDate"
                type="datetime"
                style="width: 200px;"
                placeholder="查询起始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="姓名:">
              <el-input
                v-model="listQuery.XM"
                placeholder="姓名"
                class="filter-item"
                style="width: 200px;"
                clearable
                @keyup.enter.native="handleFilter"
                @blur="handleFilter"
                @clear="handleFilter"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5"  style="text-align: right">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete"
                       style="margin-left: 10px"
                       @click="handleClear">清空
            </el-button>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="19" class="queryCon">
            <el-form-item label="身份证号:">
              <el-input
                v-model="listQuery.SFZH"
                placeholder="身份证号码"
                class="filter-item"
                style="width: 200px;"
                clearable
                @keyup.enter.native="handleFilter"
                @blur="handleFilter"
                @clear="handleFilter"
              ></el-input>
            </el-form-item>
            <el-form-item label="查询结束时间:">
              <el-date-picker
                v-model="listQuery.endDate"
                type="datetime"
                style="width: 200px;"
                placeholder="查询结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="min-height: 416px">
        <el-table border
                  fit
                  highlight-current-row
                  style="width: 100%"
                  :key="tableKey"
                  v-loading="listLoading"
                  :data="queryRecordList"
                  :default-sort="defaultSort"
                  @sort-change="sortChange"
                  @row-dblclick="dblclick"
        >
          <el-table-column fixed prop="machineNo" label="设备编号" sortable="custom" align="center" width="150">
            <template slot-scope="{ row: { machineNoWrapper }}">
              <span v-html="machineNoWrapper"></span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="XM" label="姓名" sortable="custom" align="center" width="200">
            <template slot-scope="{ row: { XMWrapper }}">
              <span v-html="XMWrapper"></span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="SFZH" label="身份证号" sortable="custom" align="center" width="250">
            <template slot-scope="{ row: { SFZHWrapper }}">
              <span v-html="SFZHWrapper"></span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="XB" label="性别" sortable="custom" align="center" width="80">
            <template  slot-scope="scope">
              <el-tag disable-transitions>{{ scope.row.XB === 0 ? '女':'男' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed prop="AGE" label="年龄" align="center" width="80"></el-table-column>
          <el-table-column fixed prop="QUERYDATE" label="查询时间" sortable="custom" align="center" width="220"></el-table-column>
          <el-table-column fixed label="操作" align="center" class-name="small-padding fixed-width" width="135">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                style="min-width: 50px"
                @click="handleDetail(scope.row.ID)"
              >详情
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
  </div>
</template>

<script>
  import Pagination from "../../components/Pagination/index";
  import waves from "../../directive/waves/waves"
  import {getList} from '../../api/queryRecord'

  export default {
    name: "index",
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        listLoading: false,
        listQuery: {},
        machineList: [],
        queryRecordList: [],
        total: 0,
        defaultSort: {}
      }
    },
    created() {
      this.paresQuery();
    },
    mounted() {
      this.getList();
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
        console.log(row)
        this.handleDetail(row.ID);
      },
      paresQuery() {
        const query = Object.assign({}, this.$route.query);
        let sort = `-queryDate`;
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
          this.queryRecordList = list;
          this.total = count;
          this.listLoading = false;
          this.queryRecordList.forEach(record => {
            record.machineNoWrapper = this.wrapperKeyword('machineNo', record.MACHINENO);
            record.XMWrapper = this.wrapperKeyword('XM', record.XM);
            record.SFZHWrapper = this.wrapperKeyword('SFZH', record.SFZH)
          });
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
          path: '/queryRecord/index',
          query: this.listQuery
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.refresh();
      },
      /** 编辑按钮操作 */
      handleDetail(id) {
        console.log(id);
        this.$router.push(`/queryRecord/detail/${id}`);
      },
      /*清空查询条件*/
      handleClear() {
        this.listQuery = {
          machineNo: '',
          XM: '',
          SFZH: '',
          XB:'',
          startDate:'',
          endDate:'',
          page: 1,
          pageSize: 10,
          sort: `-queryDate`
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
