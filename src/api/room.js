
import { httpRequestGet } from '../utils/AxiosInstance'

const api = {
  getRoomList: ({ ...data }) => httpRequestGet('/api/room/room/getRoomList', { params: { ...data } })
}

export default api