<template>
    <div>
        <el-row :gutter="10" id="title-box">
            <el-col :span="24" style="text-align: center;">
                <h2>在线评估</h2>
            </el-col>
        </el-row>

        <el-row :gutter="10">
            <el-col :span="9" :offset="7">
                <el-form ref="form" label-width="100px">
                    <el-form-item label="选择领域：">
                        <el-select v-model="fieldSelected" placeholder="选择领域" :disabled="fieldSelectDisabled">
                            <el-option v-for="item in fields" :key="item.fieldId" :label="item.fieldName"
                                :value="item.fieldId">
                            </el-option>
                        </el-select>
                        <el-button type="primary" style="margin-left: 20px;" @click="onAssessment"
                            :loading="onAssessmentBtnLoading" :disabled="onAssessmentBtnDisabled">开始评估</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="24">
                评估费用： {{ price }} 元
            </el-col>
        </el-row>
        <el-divider />
        <el-form ref="form" label-width="20">
            <template v-for="(question, index) in questions">
                <div :key="question.questionId">
                    <el-row :gutter="10">
                        <el-col :span="16" :offset="6">
                            <el-form-item :label="(index + 1) + '、'" style="text-align: start;">
                                {{ question.questionTitle }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="16" :offset="8">
                            <el-form-item style="text-align: start;">
                                <el-radio-group v-model="answer[`${question.questionId}`]"
                                    style="justify-content: space-around; text-align: left;">
                                    <el-radio :label="item.questionItemId" v-for="(item) in question.questionItems"
                                        :key="item.questionItemId">
                                        {{ item.questionItemName }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" v-if="index === questions.length - 1 && questions.length !== 0">
                        <el-col :span="24">
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                        </el-col>
                    </el-row>
                </div>
            </template>
        </el-form>


    </div>
</template>

<script>
import http from '@/utils/request';

export default {
    name: 'AssessmentView',
    data() {
        return {
            fields: [],
            fieldSelected: '',
            questions: [],
            answer: {},
            score: 0,
            onAssessmentBtnLoading: false,
            onAssessmentBtnDisabled: false,
            fieldSelectDisabled: false,
            result: null,
            report: "",
            price: 0,
            userBalance: 0,
        }
    },
    mounted() {
        this.getUserBalance();
        this.getPrice();
        this.getFields();
    },
    methods: {
        getFields() {
            this.$axios.post('/field/get_all').then(res => {
                this.fields = res.data;
            })
        },
        onAssessment() {
            this.onAssessmentBtnLoading = true;
            this.score = 0;
            http.post('/question/get_question_by_field', {
                fieldId: this.fieldSelected
            }).then(res => {
                if (res.code == 200) {
                    this.questions = res.data;
                    this.$message.success({ message: "获取题目成功，请开始评估" });
                    this.onAssessmentBtnLoading = false;
                    this.onAssessmentBtnDisabled = true;
                    this.fieldSelectDisabled = true;
                }
            })
        },
        onSubmit() {
            if (this.userBalance < this.price) {
                this.$message.error({ message: "余额不足，无法进行线上测评" });
                return;
            }

            // 计算分数
            Object.keys(this.answer).forEach(key => {
                if (this.answer[key] != null) {
                    this.score += this.questions.find(item => item.questionId == key).questionItems.find(item => item.questionItemId == this.answer[key]).questionItemScore;
                }
            })
            // 评估
            this.assess();
            // 提交
            http.post('/assessment_record/submit', {
                userId: this.$store.state.userData.userId,
                fieldId: this.fieldSelected,
                assessmentScore: this.score,
                assessmentResult: this.result,
                assessmentReport: this.report,
                price: this.price
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success({ message: "提交成功，已完成扣费" });
                    this.answer = {};
                    this.score = 0;
                    this.result = null;
                    this.report = "";
                    this.onAssessmentBtnDisabled = false,
                    this.fieldSelectDisabled = false,
                    this.questions = [];
                }
            })

        },
        // 这里进行评估返回评估结果
        assess() {
            if (this.score <= 10) {
                this.result = 1;
                this.report = "您的健康状况非常不健康，建议尽快就医。";
            }
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
        getPrice() {
            http.post('/param/get_param_by_id', {
                paramId: 7
            }).then(res => {
                if (res.code == 200) {
                    this.price = res.data.paramItems[0].paramItemValue
                }
            })
        }
    }
}
</script>

<style>
#title-box {
    margin-top: 20px;
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