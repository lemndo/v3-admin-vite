<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { createVoteApi, deleteVoteApi, getVoteList, updateVoteApi } from "@/api/canteen"
import { CreateOrUpdateVoteRequestData, type CanteenVoteData } from "@/api/canteen/types/canteen"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateVoteRequestData = {
  voteId: undefined,
  title: "",
  startTime: "",
  endTime: "",
  range: [],
  qid: []
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateVoteRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateVoteRequestData> = {
  title: [{ required: true, trigger: "blur", message: "请输入标题" }],
  range: [{ required: true, trigger: "blur", message: "请选择用餐范围" }],
  qid: [{ required: true, trigger: "blur", message: "请选择评测选项" }],
  startTime: [{ required: true, trigger: "blur", message: "请选择开始时间" }],
  endTime: [{ required: true, trigger: "blur", message: "请选择结束时间" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.voteId === undefined ? createVoteApi : updateVoteApi
    api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getTableData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 删
const handleDelete = (row: CanteenVoteData) => {
  ElMessageBox.confirm(`正在删除问卷：${row.title}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    console.log(row.voteId)

    deleteVoteApi(row.voteId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: CreateOrUpdateVoteRequestData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const tableData = ref<CanteenVoteData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  title: ""
})
const getTableData = () => {
  loading.value = true
  getVoteList({
    currPage: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    keyword: searchData.title || undefined
  })
    .then(({ data }) => {
      paginationData.total = data.total
      tableData.value = data.records
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="title" label="标题">
          <el-input v-model="searchData.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增问卷</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="title" label="标题" align="center" />
          <!-- <el-table-column prop="roles" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" type="primary" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="startTime" label="开始时间" align="center" />
          <el-table-column prop="endTime" label="结束时间" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.available" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="updateTime" label="更新时间" align="center" /> -->
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small">查看</el-button>
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.voteId === undefined ? '新增问卷' : '修改问卷'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="title" label="标题">
          <el-input v-model="formData.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="range" label="用餐范围">
          <el-checkbox-group v-model="formData.range">
            <el-checkbox label="早餐" value="早餐" />
            <el-checkbox label="中餐" value="中餐" />
            <el-checkbox label="晚餐" value="晚餐" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="qid" label="评测选项">
          <el-checkbox-group v-model="formData.qid">
            <el-checkbox label="口味" value="1" />
            <el-checkbox label="卫生" value="2" />
            <el-checkbox label="服务" value="3" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="startTime" label="开始时间">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期和时间"
          />
        </el-form-item>
        <el-form-item prop="endTime" label="结束时间">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期和时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
