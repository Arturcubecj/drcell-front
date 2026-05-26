import axios from "axios";

const BASE_URL = 'http://localhost:3200/api';

export const obtenerClientesService = async () => {
    const response = await axios.get(`${BASE_URL}/clientes`);
    return response.data;
};

export const obternerClienteByIdService = async (id) => {
    const response = await axios.get(`${BASE_URL}/clientes/${id}`);
    return response.data;
};

export const crearClienteService = async (cliente) => {
    const response = await axios.post(`${BASE_URL}/clientes`, cliente);
    return response.data;
};

export const actualizarClienteService = async (id, cliente) => {
    const response = await axios.put(`${BASE_URL}/clientes/${id}`, cliente);
    return response.data;
};

export const eliminarClienteService = async (id) => {
    const response = await axios.delete(`${BASE_URL}/clientes/${id}`);
    return response.data;
};