<template>
    <div>
        <!-- 查询表单 -->
        <el-form ref="form" :model="queryForm" label-width="150px">
            <el-form-item label="查询咨询师："></el-form-item>
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="咨询师名称：">
                        <el-input v-model="queryForm.adminName" placeholder="请输入咨询师名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="咨询师职称：">
                        <el-input v-model="queryForm.consultantTitle" placeholder="请输入咨询师职称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="咨询师毕业院校：">
                        <el-input v-model="queryForm.consultantCollege" placeholder="请输入咨询师毕业院校"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary">查询</el-button>
                </el-col>
            </el-row>

        </el-form>

        <!-- 用户表格 -->
        <el-table :data="consultants" stripe style="width: 100%"
            :default-sort="{ prop: 'adminName', order: 'descending' }" :border="true" height="60vh">
            <el-table-column prop="adminName" label="咨询师名" width="200" sortable></el-table-column>
            <el-table-column prop="consultantTitle" label="职称" sortable></el-table-column>
            <el-table-column prop="consultantCollege" label="毕业院校" sortable></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'ConsultantLibView',
    data() {
        return {
            consultants: [],
            queryForm: {
                adminName: '',
                consultantTitle: '',
                consultantCollege: ''
            }
        }
    }
}
</script>

<style></style>