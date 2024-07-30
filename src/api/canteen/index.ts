import { request } from "@/utils/service"
import type * as Canteen from "./types/canteen"

/** 增加问卷 */
export function createVoteApi(data: Canteen.CreateOrUpdateVoteRequestData) {
  return request({
    url: "/canteen/canteenVote/addOrUpdateVote",
    method: "post",
    data
  })
}

/** 删除问卷 */
export function deleteVoteApi(voteId: string) {
  return request({
    url: "/canteen/canteenVote/deleteVote",
    method: "GET",
    params: { voteId: voteId }
  })
}

/** 修改问卷 */
export function updateVoteApi(data: Canteen.CreateOrUpdateVoteRequestData) {
  return request({
    url: "/canteen/canteenVote/addOrUpdateVote",
    method: "post",
    data
  })
}

/** 查询问卷列表 */
export function getVoteList(data: Canteen.pageData) {
  return request<Canteen.canteenVoteListResponseData>({
    url: "/canteen/canteenVote/getVoteList",
    method: "POST",
    data
  })
}

/** 获取最新可参与的问卷信息 */
export function getOneAvailableVote() {
  return request<ApiResponseData<Canteen.CanteenVoteData>>({
    url: "/canteen/canteenVote/getOneVote",
    method: "GET"
  })
}

/** 提交问卷 */
export function submitVote(data: Canteen.SubmitVoteRequestData) {
  return request<ApiResponseData<any>>({
    url: "/canteen/canteenVote/submitVote",
    method: "POST",
    data
  })
}

/** 获取评测结果数据 */
export function getVoteResultApi(voteId: string) {
  const data = {
    voteId: voteId
  }
  return request<ApiResponseData<Canteen.CanteenVoteResult>>({
    url: "/canteen/canteenVoteResult/getResult",
    method: "POST",
    data
  })
}

/** 获取评论数据 */
export function getVoteCommentsApi(data: Canteen.pageData) {
  return request<Canteen.CommentsResponseData>({
    url: "/canteen/canteenVoteResult/getComments",
    method: "POST",
    data
  })
}
