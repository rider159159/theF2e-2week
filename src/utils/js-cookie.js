import Cookies from 'js-cookie'

const tokenKey = 'accesstoken'

export const getToken = () => {
  return Cookies.get(tokenKey)
}

export const removeToken = () => {
  return Cookies.remove(tokenKey)
}

export const setToken = (tokenVal) => {
  return Cookies.set(tokenKey, tokenVal)
}