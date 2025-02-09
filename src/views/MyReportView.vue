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

            <el-descriptions :column="2" border class="margin-top">
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        评测结果
                    </template>
                    {{ currentRow !== null ? results.find(item => item.paramItemValue ===
                        currentRow.assessmentResult).paramItemName : '' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-time"></i>
                        评测时间
                    </template>
                    {{ currentRow !== null ? currentRow.assessmentTime : '' }}
                </el-descriptions-item>
            </el-descriptions>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span id="item-title">报告内容</span>
                </div>
                <div class="text item">
                    {{ currentRow !== null ? currentRow.assessmentReport : '' }}
                </div>
            </el-card>

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

.text {
    text-indent: 2em;
    text-align: start;
    font-size: 15px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    margin-top: 20px;
    width: 100%;
}
</style>