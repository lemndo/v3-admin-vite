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
