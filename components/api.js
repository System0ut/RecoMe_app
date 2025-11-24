import axios from 'axios';

const API_URL = "xxx";

export const saveItem = async (newData) => {
    try {
        const response = await axios.post(API_URL, newData);
        return response.data;
    } catch (error) {
        console.error("Error al guardar el ítem:", error);
    }
};

export const getItems = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los ítems:", error);
    }
};

export const updateItem = async (updatedData) => {
    try {
        const response = await axios.put(API_URL, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el ítem:", error);
    }
};

export const deleteItem = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}?id=${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el ítem:", error);
    }
};