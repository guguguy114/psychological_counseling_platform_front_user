<template>
    <div id="enroll-box">
        <div>
            <h1 id="title">用户注册</h1>
        </div>
        <el-form ref="enrollForm" :model="enrollForm" label-width="100px">
            <el-form-item label="账号：">
                <el-input v-model="enrollForm.account" placeholder="请输入账号" autocomplete="new-password"></el-input>
            </el-form-item>

            <el-form-item label="密码：">
                <el-input v-model="enrollForm.password" placeholder="请输入密码" type="password" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：">
                <el-input v-model="enrollForm.confirmPassword" placeholder="请再次输入密码" type="password"></el-input>
            </el-form-item>
            <el-row :gutter="10">
                <el-col :span="11">
                    <el-form-item label="性别：" style="text-align: left;">
                        <el-radio-group v-model="enrollForm.gender">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                    <el-form-item label="年龄：">
                        <el-input v-model="enrollForm.age" placeholder="请输入年龄" type="number"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="用户名：">
                <el-input v-model="enrollForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="电话号码：">
                <el-input v-model="enrollForm.phoneNum" placeholder="请输入电话号码" type="text"
                    oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="联络地址：">
                <el-input v-model="enrollForm.address" placeholder="请输入联络地址" type="text"></el-input>
            </el-form-item>
            <el-form-item label="验证码：">
                <el-col :span="7">
                    <el-input v-model="enrollForm.code" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="12">
                    <img :src="codeUrl" alt="code" @click="changeCode">
                </el-col>
                <el-col :span="5">
                    <el-button type="text" @click="changeCode">看不清，换一张</el-button>
                </el-col>
            </el-form-item>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-button type="primary" @click="onEnroll">注册</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" plain @click="onBack">返回登录</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import http from '@/utils/request';

export default {
    name: 'EnrollView',
    data() {
        return {
            codeUrl: '/api/code/get_code',
            enrollForm: {
                account: '',
                password: '',
                confirmPassword: '',
                gender: null,
                age: null,
                userName: '',
                phoneNum: '',
                address: '',
                code: ""
            }
        }
    },
    methods: {
        onEnroll() {
            this.$refs.enrollForm.validate((valid) => {
                if (valid) {
                    http.post('/user/enroll', {
                        account: this.enrollForm.account,
                        password: this.enrollForm.password,
                        sex: this.enrollForm.gender,
                        age: this.enrollForm.age,
                        userName: this.enrollForm.userName,
                        phone: this.enrollForm.phoneNum,
                        address: this.enrollForm.address,
                        code: this.enrollForm.code
                    }).then(res => {
                        if (res.code === 200) {
                            this.$message({
                                message: '注册成功，即将返回登录界面',
                                type: 'success',
                                onClose: () => {
                                    this.$router.push('/');
                                }
                            });
                        } else {
                            if (res.code === -1) {
                                this.$message({
                                    message: "验证码错误",
                                    type: 'error'
                                });
                            }
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        changeCode() {
            this.codeUrl = '/api/code/get_code?time=' + new Date().getTime();
        },
        onBack() {
            this.$router.push('/');
        }
    },
    created() {
        this.changeCode();
    }
}
</script>

<style>
#title {
    font-size: 30px;
    color: #383838;
    margin-bottom: 50px;
}

#enroll-box {
    width: 30vw;
    height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-top: 10vh;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 50px;
    text-align: center;
}


/* 以下代码为避免单选框报错 */
input[aria-hidden="true"] {
    display: none !important;
}
.el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
    box-shadow: none !important;
}
</style>