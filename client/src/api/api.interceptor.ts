import axios from "axios";
import * as process from "process";

import {getContentType} from "./api.helper";
import {getAccessToken} from "@/services/auth/auth.helper";

const instance = axios.create({
    baseURL: process.env.SERVER_URL,
    headers: getContentType()
})

instance.interceptors.request.use(async config => {
    const accessToken = getAccessToken()

    if(config.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})

