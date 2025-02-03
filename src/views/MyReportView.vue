<template>
    <div>
        <!-- 报告表格 -->
        <el-table :data="reports" stripe style="width: 100%" :default-sort="{ prop: 'adminName', order: 'descending' }"
            :border="true" height="65vh">
            <el-table-column prop="assessmentRecordId" label="报告ID" width="100" header-align="center"
                align="center"></el-table-column>
            <el-table-column prop="assessmentTime" label="评估时间" width="500"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="onReport(scope.row)">查看报告</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 详情弹出框 -->
        <el-dialog title="报告详情" :visible.sync="detailDialogVisible" width="40vw"
            :before-close="detailDialogBeforeClose">

            <el-form ref="form" label-width="100px">
                <el-form-item label="评测结果：" style="text-align: start;">
                    {{ currentRow !== null ? results.find(item => item.paramItemValue === currentRow.assessmentResult).paramItemName : '' }}
                </el-form-item>
                <el-form-item label="评测时间：" style="text-align: start;">
                    {{ currentRow !== null ? currentRow.assessmentTime : '' }}
                </el-form-item>
                <el-form-item label="报告内容：" style="text-align: start;">
                    {{ currentRow !== null ? currentRow.assessmentReport : '' }}
                </el-form-item>
            </el-form>

            <div slot="footer">
                <el-button @click="detailDialogVisible = false">返 回</el-button>
            </div>
        </el-dialog>

        <!-- 分页 -->
        <div class="block" id="page-btn">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageInfo.currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
            </el-pagination>
        </div>

    </div>
</template>

<script>

export default {
    name: 'MyReportView',
    data() {
        return {
            reports: [],
            results: [],
            pageInfo: {
                currentPage: 1,
                pageSize: 5,
                total: 0
            },
            detailDialogVisible: false,
            currentRow: null
        }
    },
    created() {
        this.getReports();
        this.getResults();
    },
    methods: {
        onReport(row) {
            this.currentRow = row;
            this.detailDialogVisible = true;
        },
        getReports() {
            this.$axios.post('/assessment_record/get_assessment_record_by_user', {
                userId: this.$store.state.userData.userId,
                startPage: this.pageInfo.currentPage,
                pageSize: this.pageInfo.pageSize
            }).then(res => {
                if (res.code === 200) {
                    this.reports = res.data.list;
                    this.pageInfo.total = res.data.total;
                }
            })
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageInfo.pageSize = val;
            this.getReports();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageInfo.currentPage = val;
            this.getReports();
        },
        detailDialogBeforeClose(done) {
            done();
        },
        getResults() {
            this.$axios.post('/param/get_param_by_id', {
                paramId: 8
            }).then(res => {
                if (res.code === 200) {
                    this.results = res.data.paramItems;
                }
            })
        }
    }
}
</script>

<style>
#page-btn {
    margin-top: 20px;
    text-align: center;
}
</style>