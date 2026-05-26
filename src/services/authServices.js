import axios from "axios";

const BASE_URL = 'http://localhost:3200/api';

export const loginService = async (correo, password, rol) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {correo, password, rol});
    return response.data;
};