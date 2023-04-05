import axios from 'axios'
// import { ElLoading, LoadingOptions, ElNotification } from 'element-plus'
import router from '@/router/index'
import {t} from './stringUtil'

// declare global {
//     interface Window { requests: any; }
//     interface Window { tokenRefreshing: any; }
// }

window.requests = []
window.tokenRefreshing = false
const pendingMap = new Map()
const loadingInstance = {
    target: null,
    count: 0,
}



export const getUrl = () => {
    const value = process.env.VUE_APP_BASE_URL 
    // const value: string = import.meta.env.VITE_AXIOS_BASE_URL as string
    return value == 'getCurrentDomain' ? window.location.protocol + '//' + window.location.host : value
}


export const getUrlPort = () => {
    const url = getUrl()
    return new URL(url).port
}


function createAxios(axiosConfig, options = {}, loading = {}) {
    // const config = useConfig()
    // const adminInfo = useAdminInfo()
    // const userInfo = useUserInfo()

    const Axios = axios.create({
        baseURL: getUrl(),
        timeout: 1000 * 300,
        // headers: {
        //     // 'think-lang': config.lang.defaultLang,
        //     server: true,
        // },
        responseType: 'json',
    })

    options = Object.assign(
        {
            CancelDuplicateRequest: true, // 是否开启取消重复请求, 默认为 true
            loading: false, // 是否开启loading层效果, 默认为false
            reductDataFormat: true, // 是否开启简洁的数据结构响应, 默认为true
            showErrorMessage: true, // 是否开启接口错误信息展示,默认为true
            showCodeMessage: true, // 是否开启code不为1时的信息提示, 默认为true
            showSuccessMessage: false, // 是否开启code为1时的信息提示, 默认为false
            anotherToken: '', // 当前请求使用另外的用户token
        },
        options
    )


    Axios.interceptors.request.use(
        (config) => {
            removePending(config)
            options.CancelDuplicateRequest && addPending(config)
            if (options.loading) {
                loadingInstance.count++
                // if (loadingInstance.count === 1) {
                //     loadingInstance.target = ElLoading.service(loading)
                // }
            }


            // if (config.headers) {
            //     const token = adminInfo.getToken()
            //     if (token) (config.headers as anyObj).batoken = token
            //     const userToken = options.anotherToken || userInfo.getToken()
            //     if (userToken) (config.headers as anyObj)['ba-user-token'] = userToken
            // }
            config.headers['Content-Type'] = 'application/json;charset=UTF-8'
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // Axios.interceptors.response.use(
    //     (response) => {
    //         console.log(response)
    //         removePending(response.config)
    //         options.loading && closeLoading(options) // 关闭loading

    //         if (response.config.responseType == 'json') {
    //             if (response.data && response.data.code !== 1) {
    //                 if (response.data.code == 409) {
    //                     // if (!window.tokenRefreshing) {
    //                     //     window.tokenRefreshing = true
    //                     //     return refreshToken()
    //                     //         .then((res) => {
    //                     //             if (res.data.type == 'admin-refresh') {
    //                     //                 adminInfo.setToken(res.data.token, 'token')
    //                     //                 response.headers.batoken = `${res.data.token}`
    //                     //                 window.requests.forEach((cb) => cb(res.data.token, 'admin-refresh'))
    //                     //             } else if (res.data.type == 'user-refresh') {
    //                     //                 userInfo.setToken(res.data.token, 'token')
    //                     //                 response.headers['ba-user-token'] = `${res.data.token}`
    //                     //                 window.requests.forEach((cb) => cb(res.data.token, 'user-refresh'))
    //                     //             }
    //                     //             window.requests = []
    //                     //             return Axios(response.config)
    //                     //         })
    //                     //         .catch((err) => {
    //                     //             if (isAdminApp()) {
    //                     //                 adminInfo.removeToken()
    //                     //                 if (router.currentRoute.value.name != 'adminLogin') {
    //                     //                     router.push({ name: 'adminLogin' })
    //                     //                     return Promise.reject(err)
    //                     //                 } else {
    //                     //                     response.headers.batoken = ''
    //                     //                     window.requests.forEach((cb) => cb('', 'admin-refresh'))
    //                     //                     window.requests = []
    //                     //                     return Axios(response.config)
    //                     //                 }
    //                     //             } else {
    //                     //                 userInfo.removeToken()
    //                     //                 if (router.currentRoute.value.name != 'userLogin') {
    //                     //                     router.push({ name: 'userLogin' })
    //                     //                     return Promise.reject(err)
    //                     //                 } else {
    //                     //                     response.headers['ba-user-token'] = ''
    //                     //                     window.requests.forEach((cb) => cb('', 'user-refresh'))
    //                     //                     window.requests = []
    //                     //                     return Axios(response.config)
    //                     //                 }
    //                     //             }
    //                     //         })
    //                     //         .finally(() => {
    //                     //             window.tokenRefreshing = false
    //                     //         })
    //                     // } else {
    //                     //     return new Promise((resolve) => {
    //                     //         // 用函数形式将 resolve 存入，等待刷新后再执行
    //                     //         window.requests.push((token: string, type: string) => {
    //                     //             if (type == 'admin-refresh') {
    //                     //                 response.headers.batoken = `${token}`
    //                     //             } else {
    //                     //                 response.headers['ba-user-token'] = `${token}`
    //                     //             }
    //                     //             resolve(Axios(response.config))
    //                     //         })
    //                     //     })
    //                     // }
    //                 }
    //                 if (options.showCodeMessage) {
    //                     ElNotification({
    //                         type: 'error',
    //                         message: response.data.msg,
    //                     })
    //                 }
    //                 // 自动跳转到路由name或path，仅限server端返回302的情况
    //                 if (response.data.code == 302) {
    //                     // if (isAdminApp()) {
    //                     //     adminInfo.removeToken()
    //                     // } else {
    //                     //     userInfo.removeToken()
    //                     // }
    //                     if (response.data.data.routeName) {
    //                         router.push({ name: response.data.data.routeName })
    //                     } else if (response.data.data.routePath) {
    //                         router.push({ path: response.data.data.routePath })
    //                     }
    //                 }
    //                 // code不等于1, 页面then内的具体逻辑就不执行了
    //                 return Promise.reject(response.data)
    //             } else if (options.showSuccessMessage && response.data && response.data.code == 1) {
    //                 ElNotification({
    //                     message: response.data.msg ? response.data.msg : t('axios.Operation successful'),
    //                     type: 'success',
    //                 })
    //             }
    //         }

    //         return options.reductDataFormat ? response.data : response
    //     },
    //     (error) => {
    //         error.config && removePending(error.config)
    //         options.loading && closeLoading(options) // 关闭loading
    //         options.showErrorMessage && httpErrorStatusHandle(error) // 处理错误状态码
    //         return Promise.reject(error) // 错误继续返回给到具体页面
    //     }
    // )
    // return options.reductDataFormat ? (Axios(axiosConfig) as ApiPromise) : (Axios(axiosConfig) as AxiosPromise)
    return  Axios(axiosConfig)
}

export default createAxios



function httpErrorStatusHandle(error) {

    if (axios.isCancel(error)) return console.error(t('axios.Automatic cancellation due to duplicate request:') + error.message)
    let message = ''
    if (error && error.response) {
        switch (error.response.status) {
            case 302:
                message = t('axios.Interface redirected!')
                break
            case 400:
                message = t('axios.Incorrect parameter!')
                break
            case 401:
                message = t('axios.You do not have permission to operate!')
                break
            case 403:
                message = t('axios.You do not have permission to operate!')
                break
            case 404:
                message = t('axios.Error requesting address:') + error.response.config.url
                break
            case 408:
                message = t('axios.Request timed out!')
                break
            case 409:
                message = t('axios.The same data already exists in the system!')
                break
            case 500:
                message = t('axios.Server internal error!')
                break
            case 501:
                message = t('axios.Service not implemented!')
                break
            case 502:
                message = t('axios.Gateway error!')
                break
            case 503:
                message = t('axios.Service unavailable!')
                break
            case 504:
                message = t('axios.The service is temporarily unavailable Please try again later!')
                break
            case 505:
                message = t('axios.HTTP version is not supported!')
                break
            default:
                message = t('axios.Abnormal problem, please contact the website administrator!')
                break
        }
    }
    if (error.message.includes('timeout')) message = t('axios.Network request timeout!')
    if (error.message.includes('Network'))
        message = window.navigator.onLine ? t('axios.Server exception!') : t('axios.You are disconnected!')

    // ElNotification({
    //     type: 'error',
    //     message,
    // })
}


function closeLoading(options) {
    if (options.loading && loadingInstance.count > 0) loadingInstance.count--
    if (loadingInstance.count === 0) {
        loadingInstance.target.close()
        loadingInstance.target = null
    }
}


function addPending(config) {
    const pendingKey = getPendingKey(config)
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
            if (!pendingMap.has(pendingKey)) {
                pendingMap.set(pendingKey, cancel)
            }
        })
}


function removePending(config) {
    const pendingKey = getPendingKey(config)
    if (pendingMap.has(pendingKey)) {
        const cancelToken = pendingMap.get(pendingKey)
        cancelToken(pendingKey)
        pendingMap.delete(pendingKey)
    }
}


function getPendingKey(config) {
    let { data } = config
    const { url, method, params, headers } = config
    if (typeof data === 'string') data = JSON.parse(data) 
    return [
        url,
        method,
        headers && (headers ).batoken ? (headers ).batoken : '',
        headers && (headers )['ba-user-token'] ? (headers )['ba-user-token'] : '',
        JSON.stringify(params),
        JSON.stringify(data),
    ].join('&')
}


export function requestPayload(method, data) {
    if (method == 'GET') {
        return {
            params: data,
        }
    } else if (method == 'POST') {
        return {
            data: data,
        }
    }
}

// interface LoadingInstance {
//     target: any
//     count: number
// }
// interface Options {

//     CancelDuplicateRequest?: boolean
//     loading?: boolean
//     reductDataFormat?: boolean
//     showErrorMessage?: boolean
//     showCodeMessage?: boolean
//     showSuccessMessage?: boolean
//     anotherToken?: string
// }

