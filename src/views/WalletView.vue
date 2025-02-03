<template>
    <div>
        <el-row :gutter="20" id="title-box">
            <el-col :span="3">
                <h3>当前余额：</h3>
            </el-col>
            <el-col :span="2">
                <h3>{{ userBalance + " 元" }}</h3>
            </el-col>
            <el-col :span="2" :offset="17">
                <el-button type="primary" @click="onCharge">充值</el-button>
            </el-col>
        </el-row>

        <el-row :gutter="10" id="flow-title-box">
            <el-col :span="12" :offset="6">
                <h2>账户流水</h2>
            </el-col>
        </el-row>


        <el-row id="table-box">
            <!-- 流水表格 -->
            <el-table :data="flows" stripe style="width: 100%" :border="true" height="60vh">
                <el-table-column prop="fundFlowTime" label="流水时间" width="250"></el-table-column>
                <el-table-column label="账户变动事项" width="300" sortable>
                    <template slot-scope="scope">
                        {{ events.find(item => item.paramItemValue === scope.row.fundFlowEvent).paramItemName }}
                    </template>
                </el-table-column>
                <el-table-column label="关系人" width="200" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.consultantId === undefined ? scope.row.userName + " (自己)" : scope.row.adminName +
                            " (咨询师)" }}
                    </template>
                </el-table-column>
                <el-table-column label="收入/支出" width="250" sortable>
                    <template slot-scope="scope">
                        {{ inOrOut.find(item => item.paramItemValue === scope.row.fundFlowType).paramItemName }}
                    </template>
                </el-table-column>
                <el-table-column prop="fundFlow" label="金额（元）" sortable></el-table-column>
            </el-table>
        </el-row>


        <!-- 充值弹出框 -->
        <el-dialog title="充值" :visible.sync="chargeDialogVisible" width="40vw" :before-close="chargeDialogBeforeClose">
            <el-form ref="form" label-width="140px">
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item label="充值金额：" style="text-align: start;">
                            <el-radio-group v-model="chargeMoneySelect" :disabled="!chargeRadioEnable">
                                <el-radio :label="10" border>10￥</el-radio>
                                <el-radio :label="20" border>20￥</el-radio>
                                <el-radio :label="30" border>30￥</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item label="自定义充值金额：">
                            <el-input v-model="chargeMoney" clearable placeholder="输入金额"
                                oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>

            <div slot="footer">
                <el-button @click="chargeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="charge" :loading="chargeDialogConfirmBtnLoading">确 定</el-button>
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
    name: 'WalletView',
    data() {
        return {
            flows: [],
            inOrOut: [],
            events: [],
            userBalance: 0,
            chargeMoneySelect: 0,
            chargeMoney: null,
            pageInfo: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            chargeDialogVisible: false,
            chargeDialogConfirmBtnLoading: false,
            chargeRadioEnable: true
        }
    },
    watch: {
        chargeMoney(val) {
            if (val !== null && val !== "") {
                this.chargeRadioEnable = false;
            } else {
                this.chargeRadioEnable = true;
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageInfo.pageSize = val;
            this.getFlows();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageInfo.currentPage = val;
            this.getFlows();
        },
        getFlows() {
            this.$axios.post('/fund_flow/get_flow_by_user_id', {
                userId: this.$store.state.userData.userId,
                startPage: this.pageInfo.currentPage,
                pageSize: this.pageInfo.pageSize
            }).then(res => {
                if (res.code === 200) {
                    this.flows = res.data.list;
                    this.pageInfo.total = res.data.total;
                }
            })
        },
        getInOrOut() {
            this.$axios.post('/param/get_param_by_id', { paramId: 6 }).then(res => {
                if (res.code === 200) {
                    this.inOrOut = res.data.paramItems;
                }
            })
        },
        getEvents() {
            this.$axios.post('/param/get_param_by_id', { paramId: 5 }).then(res => {
                if (res.code === 200) {
                    this.events = res.data.paramItems;
                }
            })
        },
        getUserBalance() {
            this.$axios.post('/user/get_user_balance', {
                userId: this.$store.state.userData.userId
            }).then(res => {
                if (res.code === 200) {
                    this.userBalance = res.data;
                }
            })
        },
        onCharge() {
            this.chargeMoney = null;
            this.chargeMoneySelect = 0;
            this.chargeDialogVisible = true;
        },
        chargeDialogBeforeClose(done) {
            done();
        },
        charge() {
            this.chargeDialogConfirmBtnLoading = true;
            this.$axios.post('/user/charge', {
                userId: this.$store.state.userData.userId,
                chargeMoney: this.chargeMoney === null ? this.chargeMoneySelect : this.chargeMoney
            }).then(res => {
                if (res.code === 200) {
                    this.$message({
                        message: '充值成功',
                        type: 'success'
                    });
                    this.chargeDialogVisible = false;
                    this.chargeDialogConfirmBtnLoading = false;
                    this.getUserBalance();
                    this.getFlows();
                }
            })
        }
    },
    created() {
        this.getInOrOut();
        this.getEvents();
        this.getUserBalance();
        this.getFlows();
    }
}
</script>

<style>
#table-box {
    text-align: center;
}

#title-box {
    margin-bottom: 20px;
    text-align: start;
}

#flow-title-box {
    margin-bottom: 20px;
}

/* 以下代码为避免单选框报错 */
input[aria-hidden="true"] {
    display: none !important;
}

.el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
    box-shadow: none !important;
}
</style>