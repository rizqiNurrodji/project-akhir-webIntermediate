import RegisterPresenter from "../../presenters/register-presenter";
import { showLoading, hideLoading } from "../../utils";


export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter(this);
  }

  async render() {
    return `
       <div class="login-container">
        <h2>Register</h2>
        <form id="registerForm" class="login-form">
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
            <small class="form-hint">Password minimal 8 karakter</small>
          </div>
          <button type="submit" id="register-button" class="btn btn-primary">Register</button>
          <p class="form-footer">
            Sudah punya akun? <a href="#/login">Login di sini</a>
          </p>
        </form>
        <div class="loading-overlay hidden">
            <div class="loading-spinner"></div>
        </div>
      </div>
      `;
  }

  async afterRender() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = form.querySelector('#name').value;
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;

      try {
        showLoading();

        await this.presenter.register(name, email, password);
        alert('Pendaftaran berhasil! Silakan login.');
      } catch (error) {
        alert(error.message);
      }
      finally {
        hideLoading();
        window.location.hash = '#/login';
      }
    }
    );
  }
}