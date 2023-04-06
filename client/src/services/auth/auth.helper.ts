import Cookie from "js-cookie";
import {IAuthResponse, ITokens} from "@/store/user/user.interface";

export const getAccessToken = async () => {
    const accessToken = Cookie.get('accessToken')
    return accessToken || null
}

export const getUserFromStorage = async () => {
    return JSON.parse(localStorage.getItem('user') || '{} ')
}

export const saveTokenStorage = (data: ITokens) => {
    Cookie.set('accessToken', data.accessToken)
    Cookie.set('refreshToken', data.refreshToken)
}
export const removeTokensStorage = () => {
    Cookie.remove('accessToken')
    Cookie.remove('refreshToken')
}

export const saveToStorage = (data: IAuthResponse) => {
    saveTokenStorage(data)
    localStorage.setItem('user', JSON.stringify(data.user))
}