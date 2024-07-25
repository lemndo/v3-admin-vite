import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "login/code",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "/common/login/login",
    method: "post",
    data
  })
}

/** token登录 */
export function loginByTokenApi(token: string) {
  const data = {
    TOKEN: token
  }
  return request<any>({
    url: "/common/login/loginByToken",
    method: "POST",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "/common/login/getInfo",
    method: "post"
  })
}
