import axios from "axios";
const BASE_URL = 'http://localhost:3200/api';

export const obtenerTecnicosService = async() => {
    const response = await axios.get(`${BASE_URL}/tecnicos`);
    return response.data;
};

export const obtenerTecnicoByIdService = async (id) => {
    const response = await axios.get(`${BASE_URL}/tecnicos/${id}`);
    return response.data;
};

export const crearTecnicoService = async (tecnico) => {
    const response = await axios.post(`${BASE_URL}/tecnicos`, tecnico);
    return response.data;
};

export const actualizarTecnicoService = async (id, tecnico) => {
    const response = await axios.put(`${BASE_URL}/tecnicos/${id}`, tecnico);
    return response.data;
};

export const eliminarTecnicoService = async (id) => {
    const response = await axios.delete(`${BASE_URL}/tecnicos/${id}`);
    return response.data;
};