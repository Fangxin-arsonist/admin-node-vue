<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按设备分类统计" name="machine">
          <el-form :inline="true">
            <el-row>
              <el-col :span="20" class="queryCon">
                <el-form-item label="设备编号:">
                  <el-input
                    v-model="listQuery.machineNo"
                    placeholder="设备编号"
                    class="filter-item"
                    style="width: 180px;"
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
                <el-form-item label="查询结束时间:">
                  <el-date-picker
                    v-model="listQuery.endDate"
                    type="datetime"
                    style="width: 200px;"
                    placeholder="查询结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="4"  style="text-align: right">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete"
                          style="margin-left: 10px"
                          @click="handleClear">清空
                </el-button>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询
                </el-button>
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
              <el-table-column fixed prop="machineNo" label="设备编号" align="center" width="150">
                <template slot-scope="{ row: { machineNoWrapper }}">
                  <span v-html="machineNoWrapper"></span>
                </template>
              </el-table-column>
              <el-table-column fixed prop="count" label="查询次数" align="center" width="200">
                <template slot-scope="{ row: { countWrapper }}">
                  <span v-html="countWrapper"></span>
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
        </el-tab-pane>
        <el-tab-pane label="按单位分类统计" name="company">
          按单位分类统计
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Pagination from "../../components/Pagination/index";
import waves from "../../directive/waves/waves"
import {getGroupList} from '../../api/queryRecord'
  export default {
    name: "statistics",
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        listLoading: false,
        activeName: 'machine',
        listQuery: {},
        queryRecordList: [],
        defaultSort: {},
        total: 0
      };
    },
    created() {
      this.paresQuery();
    },
    beforeRouteUpdate(to, from, next) {
      if (to.path === from.path) {
        const newQuery = Object.assign({}, to.query);
        const oldQuery = Object.assign({}, from.query);
        if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
          this.getGroupList()
        }
      }
      next();
    },
    mounted() {
      this.getGroupList();
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleClear(){
        this.listQuery = {
          machineNo: '',
          startDate:'',
          endDate:'',
          page: 1,
          pageSize: 10,
          sort: `-queryDate`
        };
        this.handleFilter();
      },
      refresh(){
        this.$router.push({
          path: '/queryRecord/statistics',
          query: this.listQuery
        })
      },
      sortChange(data) {
        const {prop, order} = data;
        this.sortBy(prop, order);
        this.handleFilter();
      },
      dblclick(row, column, event){
        this.handleDetail(row.id);
      },
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
      handleFilter() {
        this.listQuery.page = 1;
        this.refresh();
      },
      getGroupList() {
        this.listLoading = true;
        console.log(this.listQuery)
        getGroupList(this.listQuery).then(response => {
          const {list, count, page, pageSize} = response.data;
          console.log(list)
          console.log(count)
          console.log(page)
          console.log(pageSize)
          this.queryRecordList = list;
          this.total = count;
          this.listLoading = false;
          this.queryRecordList.forEach(record => {
            record.machineNoWrapper = this.wrapperKeyword('machineNo', record.MACHINENO);
            record.countWrapper = this.wrapperKeyword('count', record.COUNT);
          });
          console.log(this.queryRecordList)
        })
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
      }
    }
  };
</script>

<style scoped>
</style>
