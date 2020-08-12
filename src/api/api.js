import axios from './http'

export const topics = params => axios.get('v1/topics', { params }) // 列表
export const topic = id => axios.get(`v1/topic/${id}`) // 详情
