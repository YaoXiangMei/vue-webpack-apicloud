import axios from './http'

export const topics = params => axios.get('v1/topics', { params })
