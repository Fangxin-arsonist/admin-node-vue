<template>
  <el-form :model="queryRecordForm">
    <sticky :class-name="'sub-navbar'">
      <el-button type="info" style="margin: 0 28px 0 10px" @click.native.prevent="back">返回</el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号:" :label-width="labelWidth">
            <el-input v-model="queryRecordForm.MachineNo" placeholder="设备编号" disabled></el-input>
          </el-form-item>
          <el-form-item label="查询时间:" :label-width="labelWidth">
            <el-input v-model="queryRecordForm.queryDate" placeholder="查询时间" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名:" :label-width="labelWidth">
            <el-input v-model="queryRecordForm.XM" placeholder="姓名" disabled></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" :label-width="labelWidth">
            <el-input v-model="queryRecordForm.SFZH" placeholder="身份证号" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="现场照:" :label-width="labelWidth">
            <img id="xcz" class="imgStyle" src=""/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="年龄:" :label-width="labelWidth">
            <el-input v-model="queryRecordForm.Age" placeholder="年龄" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别:" :label-width="labelWidth">
            <el-input v-model="queryRecordForm.XB" placeholder="性别" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="出入境记录:" :label-width="labelWidth">
            <el-table border
                      fit
                      highlight-current-row
                      style="width: 100%"
                      :key="tableKey"
                      :data="CRJRecordData"
                      :default-sort="defaultSort"
            >
              <el-table-column fixed prop="CRJJLID" label="序号" align="center" width="50"></el-table-column>
              <el-table-column fixed prop="CRJBS" label="出/入境" align="center" width="70"></el-table-column>
              <el-table-column fixed prop="ZJMC" label="证件名称" align="center" width="260"></el-table-column>
              <el-table-column fixed prop="ZJHM" label="证件号码" align="center" width="110"></el-table-column>
              <el-table-column fixed prop="CRJSJ" label="出/入境时间" align="center" width="170"></el-table-column>
              <el-table-column fixed prop="CRJKA" label="前往地/出发地" align="center" width="258"></el-table-column>
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.pageSize"
              @pagination="getCRJJL"></pagination>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
  import $ from 'jquery'
  import Pagination from "../../../components/Pagination/index";
  import Sticky from "../../../components/Sticky/index";
  import {getInfo, getCRJJLList} from '../../../api/queryRecord'

  export default {
    name: "Detail",
    components: {Sticky, Pagination},
    data() {
      return {
        tableKey: 0,
        total: 0,
        queryRecordForm: {},
        CRJRecordData: [],
        labelWidth: '120px',
        defaultSort: {},
        listQuery: {},
      }
    },
    created() {
      this.paresQuery();
    },
    mounted() {
      console.log(this.queryRecordForm)
      this.getInfo(this.$route.params.id);
    },
    methods: {
      /** 获取记录信息 */
      getInfo(id) {
        if (id) {
          const params = {
            id: id,
            listQuery: this.listQuery
          };
          getInfo(params).then(response => {
            console.log("response",response)
            const {info, CRJRecordData} = response.data;
            const {list, count} = CRJRecordData;
            this.queryRecordForm = info;
            this.queryRecordForm.XB = +this.queryRecordForm.XB === 1 ? '男' : '女';

            $("#xcz").attr("src", this.queryRecordForm.XCZP);
            this.CRJRecordData = list;
            this.total = count;
          }).catch(() => {
          });
        }
      },

      /*获取出入境记录*/
      getCRJJL() {
        const params = {
          id: this.queryRecordForm.id,
          listQuery: this.listQuery
        };
        getCRJJLList(params).then(response => {
          console.log(response)
          const {list, count} = response.data;
          this.CRJRecordData = list;
          this.total = count;
        }).catch(() => {
        });
      },
      paresQuery() {
        const query = Object.assign({}, this.$route.query);

        let sort = '+id';
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
      /*返回列表*/
      back() {
        this.$router.push('/queryRecord/index');
      }
    }
  }
</script>

<style lang="scss">
  .imgStyle {
    width: 180px;
    height: 200px;
  }
  .detail-container {
    padding: 40px 50px 20px;

    .preview-img {
      width: 200px;
      height: 270px;
    }
  }

  .detail-container .el-table--medium th {
    padding: 3px 0 !important;
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
