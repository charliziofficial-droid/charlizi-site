import { onRequestOptions as __api_inquiry_ts_onRequestOptions } from "C:\\Users\\Administrator\\.openclaw\\workspace\\charlizi-new\\functions\\api\\inquiry.ts"
import { onRequestPost as __api_inquiry_ts_onRequestPost } from "C:\\Users\\Administrator\\.openclaw\\workspace\\charlizi-new\\functions\\api\\inquiry.ts"
import { onRequest as __admin_auth_ts_onRequest } from "C:\\Users\\Administrator\\.openclaw\\workspace\\charlizi-new\\functions\\admin\\auth.ts"

export const routes = [
    {
      routePath: "/api/inquiry",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_inquiry_ts_onRequestOptions],
    },
  {
      routePath: "/api/inquiry",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_inquiry_ts_onRequestPost],
    },
  {
      routePath: "/admin/auth",
      mountPath: "/admin",
      method: "",
      middlewares: [],
      modules: [__admin_auth_ts_onRequest],
    },
  ]