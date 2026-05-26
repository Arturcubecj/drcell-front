import axios from "axios";

const BASE_URL = 'http://localhost:3200/api';

export const obtenerReparacionesService = async () => {
    const response = await axios.get(`${BASE_URL}/reparaciones`);
    return response.data;
};

export const obtenerReparacionByIdService = async (id) => {
    const response = await axios.get(`${BASE_URL}/reparaciones/${id}`);
    return response.data;
};

export const obtenerReparacionByCodigoService = async (codigo) => {
    const codigoEncoded = encodeURIComponent(codigo);
    const response = await axios.get(`${BASE_URL}/reparaciones/codigo/${codigoEncoded}`);
    return response.data;
};

export const crearReparacionService = async (reparacion) => {
    const response = await axios.post(`${BASE_URL}/reparaciones`, reparacion);
    return response.data;
};

export const actualizarReparacionService = async (id, reparacion) => {
    const response = await axios.put(`${BASE_URL}/reparaciones/${id}`, reparacion);
    return response.data;
};

export const actualizarEstadoService = async (id, estado) => {
    const response = await axios.patch(`${BASE_URL}/reparaciones/${id}/estado`, { estado });
    return response.data;
};

export const eliminarReparacionService = async (id) => {
    const response = await axios.delete(`${BASE_URL}/reparaciones/${id}`);
    return response.data;
};