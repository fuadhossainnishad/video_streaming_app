import axios, { AxiosError } from "axios";
import appConfig from "./app.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axiosClient = axios.create({
    baseURL: appConfig.base_url as string,
    timeout: 100000,

})

axiosClient.interceptors.request.use(

    async (config) => {
        // Add auth token if needed
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGNlNWZjODI3ZWQ0ZDgyZTQ4ZjU2NSIsImlhdCI6MTc3MTA2MTM4OCwiZXhwIjoxNzcxNjY2MTg4fQ.HD8bXkCiA1AGN90xviEK0FTvGAisxTumYAIIWMoxvmw'
        AsyncStorage.setItem('token', token)
        const token2 = await AsyncStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token2}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const formattedError = {
            status: 'error',
            message:
                (error.response?.data as any)?.message ||
                error.message ||
                'Something went wrong',
            data: error.response?.data,
            statusCode: error.response?.status,
        };

        return Promise.reject(formattedError);
    }
);

console.log("BASE URL:", appConfig.base_url!);
