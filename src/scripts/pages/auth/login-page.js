import LoginPresenter from '../../presenters/login-presenter.js';
import { showLoading, hideLoading } from "../../utils";

export default class LoginPage {
    constructor() {
        this.presenter = new LoginPresenter(this);
    }

    async render() {
        return `
      <div class="login-container">
        <h2>Login</h2>
        <form id="loginForm" class="login-form">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" required placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" required placeholder="Enter your password" minlength="8">
          </div>
          <button type="submit" id="login-button" class="btn btn-primary">Login</button>
          <p class="form-footer">Belum punya akun? <a href="#/register">daftar disini</a></p>
        </form>
        <div id="error-message" class="error-message" style="color: red; margin-top: 10px;"></div>
        <div class="loading-overlay hidden">
            <div class="loading-spinner"></div>
        </div>
         <div class="loading-overlay hidden">
            <div class="loading-spinner"></div>
        </div>
      </div>
    `;
    }

    async afterRender() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {

              showLoading();
                await this.presenter.login(email, password);
            } catch (error) {
                 alert(error.message);
            } finally {
                hideLoading();
                 window.location.hash = '#/home';
            }
        });
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
    }
}