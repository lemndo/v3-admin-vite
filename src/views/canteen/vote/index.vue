<script lang="ts" setup>
import { getOneAvailableVote, submitVote } from "@/api/canteen"
import { SubmitVoteRequestData } from "@/api/canteen/types/canteen"
import { ElMessage, FormInstance, FormRules } from "element-plus"
import { cloneDeep } from "lodash-es"
import { onMounted, ref } from "vue"

const rateText = ["非常差", "差", "一般", "满意", "非常满意"]
const DEFAULT_FORM_DATA: SubmitVoteRequestData = {
  voteId: "",
  score: [0, 0, 0],
  suggestion: ""
}
const title = ref<string>("标题")
const voteFormRef = ref<FormInstance | null>(null)

const formData = ref<SubmitVoteRequestData>(cloneDeep(DEFAULT_FORM_DATA))
// 定义评分验证规则
const validateScore = (rule: any, value: any, callback: any) => {
  if (value === undefined || value === null || value < 1 || value > 5) {
    callback(new Error("评分必须在1到5之间"))
  } else {
    callback()
  }
}
// 自定义建议字段验证规则
const validateSuggestion = (rule: any, value: any, callback: any) => {
  const lowScore = formData.value.score.some((s: number) => s <= 3)
  if (lowScore && (!value || value.trim() === "")) {
    callback(new Error("请填写建议"))
  } else {
    callback()
  }
}
const voteFormRules: FormRules = {
  "score[0]": [{ required: true, validator: validateScore, trigger: "blur" }],
  "score[1]": [{ required: true, validator: validateScore, trigger: "blur" }],
  "score[2]": [{ required: true, validator: validateScore, trigger: "blur" }],
  suggestion: [{ validator: validateSuggestion, trigger: "blur" }]
}
const handleSubmit = () => {
  voteFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      //
      console.log(formData)
      submitVote(formData.value)
        .then((response) => {
          if (response.code == 20000) {
            ElMessage.success("提交成功!")
            location.reload()
          }
        })
        .catch(() => {})
        .finally(() => {})
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

onMounted(async () => {
  getOneAvailableVote()
    .then((response) => {
      const data = response.data
      // DEFAULT_FORM_DATA.voteId = data.voteId
      formData.value.voteId = data.voteId
      title.value = data.title
    })
    .catch(() => {})
    .finally(() => {})
})
</script>

<template>
  <div class="vote-container">
    <div class="form-main">
      <div v-if="formData.voteId == ''">
        <div class="content">已经评测完成！</div>
      </div>
      <div v-else>
        <div class="title">{{ title }}</div>
        <div class="content">
          <el-form ref="voteFormRef" :model="formData" :rules="voteFormRules" @keyup.enter="handleSubmit">
            <el-form-item label="口味评价" prop="score[0]">
              <el-rate v-model="formData.score[0]" :texts="rateText" show-text />
            </el-form-item>
            <el-form-item label="服务评价" prop="score[1]">
              <el-rate v-model="formData.score[1]" :texts="rateText" show-text />
            </el-form-item>
            <el-form-item label="卫生评价" prop="score[2]">
              <el-rate v-model="formData.score[2]" :texts="rateText" show-text />
            </el-form-item>
            <el-form-item prop="suggestion">
              <el-input
                v-model="formData.suggestion"
                style="width: 260px"
                :rows="3"
                type="textarea"
                maxlength="50"
                show-word-limit
                placeholder="请输入建议"
              />
            </el-form-item>
            <div style="width: 250px">
              <el-button type="primary" round @click.prevent="handleSubmit">提交</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vote-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 90%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .form-main {
    width: 480px;
    max-width: 100%;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: var(--el-bg-color);
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      // :deep(.el-input-group__append) {
      //   padding: 0;
      //   overflow: hidden;
      //   .el-image {
      //     width: 100px;
      //     height: 40px;
      //     border-left: 0px;
      //     user-select: none;
      //     cursor: pointer;
      //     text-align: center;
      //   }
      // }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
