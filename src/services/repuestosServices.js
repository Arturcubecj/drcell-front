import axios from "axios";

const BASE_URL = 'http://localhost:3200/api';

export const obtenerRepuestosService = async () => {
    const response = await axios.get(`${BASE_URL}/repuestos`);
    return response.data;
};

export const obtenerRepuestoByIdService = async (id) => {
    const response = await axios.get(`${BASE_URL}/repuestos/${id}`);
    return response.data;
};

export const crearRepuestoService = async (repuesto) => {
    const response = await axios.post(`${BASE_URL}/repuestos`, repuesto);
    return response.data;
};

export const actualizarRepuestoService = async (id, repuesto) => {
    const response = await axios.put(`${BASE_URL}/repuestos/${id}`, repuesto);
    return response.data;
};

export const eliminarRepuestoService = async (id) => {
    const response = await axios.delete(`${BASE_URL}/repuestos/${id}`);
    return response.data;
};