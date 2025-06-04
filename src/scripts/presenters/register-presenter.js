import { registerUser } from '../data/api.js';

export default class RegisterPresenter {
    constructor(view) {
        this.view = view;
    }

    async register(name, email, password) {
        try {

            if (!name || !email || !password) {
                throw new Error('Semua harus diisi');
            }
            if (password.length < 8) {
                throw new Error('Password minimal 8 karakter');
            }

            const response = await registerUser(name, email, password);

            return response;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }
}