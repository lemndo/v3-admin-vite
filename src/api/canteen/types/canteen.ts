export interface pageData {
  keyword: string | undefined
  currPage: number
  pageSize: number
}

export interface pageResponseData<data> {
  records: data
  total: number
  size: number
  current: number
  pages: number
}

export interface CreateOrUpdateVoteRequestData {
  voteId?: string
  title: string
  startTime: string
  endTime: string
  range: string[]
  qid: string[]
}

export interface SubmitVoteRequestData {
  voteId: string
  score: Array<number>
  suggestion: string
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

export interface CanteenVoteResult {
  score: Array<number>
  countScore: number
}
export interface CommentsData {
  score: number[]
  countScore: number
  suggestion: string
  submitTime: string
}
export type CommentsResponseData = ApiResponseData<pageResponseData<CommentsData[]>>

// export type CommentsResponseData = ApiResponseData<{
//   records: CommentsData
//   total: number
//   size: number
//   current: number
//   pages: number
// }>

export type canteenVoteListResponseData = ApiResponseData<{
  records: CanteenVoteData[]
  total: number
  size: number
  current: number
  pages: number
}>
