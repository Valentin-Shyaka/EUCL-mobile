import axios from 'axios';
import API_URL from '../../config/api-url';
import * as SecureStorage from 'expo-secure-store'

export const register = async (data) => {
    return axios.post(API_URL + '/users', data)
        .then((res) => {
            return { ...res?.data, success: true }
        })
        .catch((err) => {
            console.log(err);
            return err?.response?.data;
        }
        )

}

export const purchaseElectricity = async (data) => {
    return axios.post(API_URL + '/purchase', data, {
        headers: {
            'Authorization': 'Bearer ' + await _getToken()
        }
    })
        .then((res) => {
            return { ...res?.data, success: true }
        })
        .catch((err) => {
            return err?.response?.data;
        }
        )

}

export const login = async (data) => {
    return axios.post(API_URL + '/users/login', data)
        .then((res) => {
            return res?.data
        })
        .catch((err) => {
            return err?.response?.data;
        }
        )

}

export const getPurchasedTokens = async () => {
    return axios.get(API_URL + '/purchase/', {
        headers: {
            'Authorization': 'Bearer ' + await _getToken()
        }
    })
        .then((res) => {
            return res?.data
        }
        )
        .catch((err) => {
            return err?.response?.data;
        }
        )
}


const _getToken = async () => {
    return await SecureStorage.getItemAsync('token');
}

