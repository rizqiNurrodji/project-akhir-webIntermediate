import { loginUser } from '../data/api.js';
import { handleLoginSuccess } from '../data/auth.js';

export default class LoginPresenter {
    constructor(view) {
        this.view = view;
    }

    async login(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Semua harus diisi');
            }

            const response = await loginUser(email, password);
            handleLoginSuccess(response);

            return response;
        } catch (error) {
            console.error('Error logging in user:', error);
            throw error;
        }
    }
}