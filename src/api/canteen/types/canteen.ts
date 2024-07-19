export interface pageData {
  keyword: string | undefined
  currPage: number
  pageSize: number
}

export interface CreateOrUpdateVoteRequestData {
  voteId?: string
  title: string
  startTime: string
  endTime: string
  range: string[]
  qid: string[]
}

export interface CanteenVoteData {
  voteId: string
  title: string
  startTime: string
  endTime: string
  creator: string
  qid: string[]
  updateTime: string
  range: string[]
  available: number
}

export type canteenVoteListResponseData = ApiResponseData<{
  records: CanteenVoteData[]
  total: number
  size: number
  current: number
  pages: number
}>
