<template>
    <div>

        <el-row :gutter="10">
            <el-col :span="2">
                <div style="font-size: 25px; font-weight: bold;">我的预约</div>
            </el-col>
            <el-col :span="22" style="text-align: end; margin-bottom: 20px;">
                <el-button type="primary">我要预约</el-button>
            </el-col>
        </el-row>

        <!-- 预约表格 -->
        <el-table :data="appointments" stripe style="width: 100%" :border="true" height="60vh">
            <el-table-column label="预约时间段" width="340" header-align="center" align="center">
                <template slot-scope="scope">
                    <span>
                        {{ dateTimeFormat(scope.row.appointmentStartTime) }} 至
                        {{ dateTimeFormat(scope.row.appointmentEndTime) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="adminName" label="咨询师" width="120" header-align="center" align="center"
                sortable></el-table-column>
            <el-table-column prop="fieldName" label="咨询领域" width="120" header-align="center" align="center"
                sortable></el-table-column>
            <el-table-column label="咨询问题" width="350" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.appointmentDetail !== undefined ? stringLengthLimit(scope.row.appointmentDetail,
                        20) : '(暂无)' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="完成状态" width="120" header-align="center" align="center" sortable>
                <template slot-scope="scope">
                    {{ appointmentStatusList.find(item => item.paramItemValue ===
                        scope.row.appointmentStatus).paramItemName }}
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="onComment(scope.row)"
                        v-if="scope.row.appointmentStatus === 3">评价</el-button>
                    <el-button type="text" @click="onCheck(scope.row)">查看详情</el-button>
                    <el-button type="text" @click="onCheckConsultant(scope.row)">查看咨询师</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 查看详情 -->
        <el-dialog title="预约详情" :visible.sync="detailDialogVisible" width="width"
            :before-close="detailDialogBeforeClose" v-if="this.currentAppointment !== null">
            <el-descriptions class="margin-top" :column="3" border>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        用户名
                    </template>
                    {{ this.currentAppointment.userName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        领域
                    </template>
                    {{ this.currentAppointment.fieldName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-time"></i>
                        预约时间
                    </template>
                    {{ dateTimeFormat(this.currentAppointment.appointmentStartTime) }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        预约状态
                    </template>
                    {{ appointmentStatusList.find(item => item.paramItemValue ===
                        this.currentAppointment.appointmentStatus).paramItemName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-shopping-cart-2"></i>
                        预约费用
                    </template>
                    {{ this.currentAppointment.appointmentPrice }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-s-custom"></i>
                        咨询师
                    </template>
                    {{ this.$store.state.userData.name }}
                </el-descriptions-item>
            </el-descriptions>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span id="item-title">问题描述</span>
                </div>
                <div class="text item">
                    {{ this.currentAppointment.appointmentDetail !== undefined ?
                        this.currentAppointment.appointmentDetail :
                        '(暂无)' }}
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span id="item-title">诊断答复</span>
                    <div style="float: right;">
                        答复时间: {{ this.currentAppointment.appointmentReplyTime !== undefined ?
                            dateTimeFormat(this.currentAppointment.appointmentReplyTime) : '(未答复)' }}
                    </div>
                </div>
                <div class="text item">
                    {{ this.currentAppointment.appointmentReply !== undefined ? this.currentAppointment.appointmentReply
                        :
                        '(未诊断)' }}
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span id="item-title">评价内容</span>
                </div>
                <div class="text item">
                    {{ this.currentAppointment.appointmentComment !== undefined ?
                        this.currentAppointment.appointmentComment :
                        '(未评价)' }}
                </div>
            </el-card>
        </el-dialog>

        <el-dialog title="咨询师评价" :visible.sync="commentDialogVisible" width="50vw"
            :before-close="commentDialogBeforeClose" v-if="this.currentAppointment !== null">
            <div>

                <el-row :gutter="10">
                    <el-col :span="3" :offset="1">
                        <img src="@/assets/face_images/default_face.jpg" alt="头像" id="face-img">
                    </el-col>
                    <el-col :span="18" :offset="1">
                        <el-row :gutter="10">
                            <el-col :span="24">
                                <el-descriptions class="margin-top" :column="2" border>
                                    <el-descriptions-item>
                                        <template slot="label">
                                            <i class="el-icon-user"></i>
                                            咨询师：
                                        </template>
                                        {{ this.currentAppointment.adminName }}
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="this.currentConsultant !== null">
                                        <template slot="label">
                                            <i class="el-icon-s-cooperation"></i>
                                            咨询师职称：
                                        </template>
                                        {{ this.currentConsultant.consultantTitle }}
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="this.currentConsultant !== null">
                                        <template slot="label">
                                            <i class="el-icon-s-order"></i>
                                            咨询师领域：
                                        </template>
                                        {{ this.currentConsultant.fieldName }}
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="this.currentConsultant !== null">
                                        <template slot="label">
                                            <i class="el-icon-location"></i>
                                            咨询师院校：
                                        </template>
                                        {{ this.currentConsultant.consultantCollege }}
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="this.currentConsultant !== null">
                                        <template slot="label">
                                            <i class="el-icon-s-data"></i>
                                            专业背景：
                                        </template>
                                        {{ this.currentConsultant.consultantBackground }}
                                    </el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span id="item-title">评价</span>
                            </div>
                            <div>
                                <el-input type="textarea" :autosize="{ minRows: 5 }" placeholder="请输入评价内容"
                                    v-model="updateForm.appointmentComment" resize="none" style="font-size: 15px;">
                                </el-input>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer">
                <el-button @click="commentDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="comment">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="咨询师档案" :visible.sync="consultantDialogVisible" width="50vw"
            :before-close="consultantDialogBeforeClose" v-if="this.currentConsultant !== null">
            <div>
                <el-row :gutter="10">
                    <el-col :span="3" :offset="1">
                        <img src="@/assets/face_images/default_face.jpg" alt="头像" id="face-img">
                    </el-col>
                    <el-col :span="18" :offset="1">
                        <el-row :gutter="10">
                            <el-col :span="24">
                                <el-descriptions class="margin-top" :column="2" border>
                                    <el-descriptions-item>
                                        <template slot="label">
                                            <i class="el-icon-user"></i>
                                            咨询师：
                                        </template>
                                        {{ this.currentAppointment.adminName }}
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="this.currentConsultant !== null">
                                        <template slot="label">
                                            <i class="el-icon-s-cooperation"></i>
                                            咨询师职称：
                                        </template>
                                        {{ this.currentConsultant.consultantTitle }}
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="this.currentConsultant !== null">
                                        <template slot="label">
                                            <i class="el-icon-s-order"></i>
                                            咨询师领域：
                                        </template>
                                        {{ this.currentConsultant.fieldName }}
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="this.currentConsultant !== null">
                                        <template slot="label">
                                            <i class="el-icon-location"></i>
                                            咨询师院校：
                                        </template>
                                        {{ this.currentConsultant.consultantCollege }}
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="this.currentConsultant !== null">
                                        <template slot="label">
                                            <i class="el-icon-s-data"></i>
                                            专业背景：
                                        </template>
                                        {{ this.currentConsultant.consultantBackground }}
                                    </el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span id="item-title">简介</span>
                            </div>
                            <div class="text item">
                                {{ this.currentConsultant.consultantBrief !== undefined ?
                                    this.currentConsultant.consultantBrief :
                                '(暂无)' }}
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer">
                <el-button @click="consultantDialogVisible = false">返 回</el-button>
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
import http from '@/utils/request'
export default {
    name: 'CreateAppointmentView',
    data() {
        return {
            appointments: [],
            appointmentStatusList: [],
            fields: [],
            pageInfo: {
                currentPage: 1,
                pageSize: 5,
                total: 0
            },
            updateForm: {
                appointmentComment: ''
            },
            consultantDialogVisible: false,
            currentConsultant: null,
            commentDialogVisible: false,
            detailDialogVisible: false,
            currentAppointment: null
        }
    },
    mounted() {
        this.getAppointmentStatusList();
        this.getAppointment();
    },
    methods: {
        getAppointment() {
            http.post("/appointment/get_appointment", {
                userId: this.$store.state.userData.userId,
                startPage: this.pageInfo.currentPage,
                pageSize: this.pageInfo.pageSize
            }).then(res => {
                if (res.code == 200) {
                    this.appointments = res.data.list;
                    this.pageInfo.total = res.data.total;
                }
            })
        },
        detailDialogBeforeClose(done) {
            done();
        },
        onCheck(row) {
            this.currentAppointment = row;
            this.detailDialogVisible = true;
        },
        dateTimeFormat(time) {
            var date = new Date(time);
            var y = 1900 + date.getYear();
            var m = "0" + (date.getMonth() + 1);
            var d = "0" + date.getDate();
            var h = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            return y + "年" + m.substring(m.length - 2, m.length) + "月" + d.substring(d.length - 2, d.length) + "日" + h.substring(h.length - 2, h.length) + ":" + minute.substring(minute.length - 2, minute.length);
        },
        stringLengthLimit(str, len) {
            if (str.length > len) {
                return str.substring(0, len) + "...";
            } else {
                return str;
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageInfo.pageSize = val;
            this.getAppointment();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pageInfo.currentPage = val;
            this.getAppointment();
        },
        getAppointmentStatusList() {
            http.post("/param/get_param_by_id", {
                paramId: 9
            }).then(res => {
                if (res.code == 200) {
                    this.appointmentStatusList = res.data.paramItems;
                }
            })
        },
        getFields() {
            http.post("/field/get_all").then(res => {
                if (res.code == 200) {
                    this.fields = res.data;
                }
            })
        },
        onCheckConsultant(row) {
            this.currentAppointment = row;
            this.getConsultant();
            this.consultantDialogVisible = true;
        },
        async getConsultant() {
            await http.post("/consultant/get_consultant_by_id", {
                consultantId: this.currentAppointment.consultantId
            }).then(res => {
                if (res.code == 200) {
                    this.currentConsultant = res.data;
                }
            })
        },
        async onComment(row) {
            this.currentAppointment = row;
            this.updateForm.appointmentComment = null;
            await this.getConsultant();
            this.commentDialogVisible = true;

        },
        comment() {
            http.post("/appointment/update_appointment_by_id", {
                appointmentId: this.currentAppointment.appointmentId,
                appointmentStatus: 4,
                appointmentComment: this.updateForm.appointmentComment,
            }).then(res => {
                if (res.code == 200) {
                    this.$message({
                        message: '评价成功',
                        type: 'success'
                    });
                    this.getAppointment();
                    this.commentDialogVisible = false;
                }
            })
        },
        commentDialogBeforeClose(done) {
            done();
        },
        consultantDialogBeforeClose(done) {
            done();
        }
    }
}
</script>

<style>
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

#item-title {
    font-size: 18px;
    font-weight: bold;
    float: left;
}

#page-btn {
    margin-top: 20px;
    text-align: center;
}

#face-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    float: left;
    margin-right: 20px;
}
</style>