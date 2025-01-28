import axios from 'axios';
import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export async function getExpedientesProtegidos() {
    const user = auth.currentUser;
    if(!user) {
        throw new Error('No hay usuario autenticado');
    }
    
    //obtener el token de firebase
    const token = await user.getIdToken();

    //hacer la peticion al backend
    const response = await axios.get(`${API_URL}/expedientes-protegidos`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}