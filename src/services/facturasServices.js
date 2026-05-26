import axios from "axios";

const BASE_URL = 'http://localhost:3200/api';

export const obtenerFacturasService = async () => {
    const response = await axios.get(`${BASE_URL}/facturas`);
    return response.data;
};

export const obtenerFacturaByIdService = async (id) => {
    const response = await axios.get(`${BASE_URL}/facturas/${id}`);
    return response.data;
};

export const obtenerFacturaByReparacionService = async (reparacion_id) => {
    const response = await axios.get(`${BASE_URL}/facturas/reparacion/${reparacion_id}`);
    return response.data;
};

export const crearFacturaService = async (factura) => {
    const response = await axios.post(`${BASE_URL}/facturas`, factura);
    return response.data;
};

export const eliminarFacturaService = async (id) => {
    const response = await axios.delete(`${BASE_URL}/facturas/${id}`);
    return response.data;
};