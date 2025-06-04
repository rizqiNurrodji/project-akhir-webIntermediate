export default class LandingPage {
  async render() {
    return `
      <section class="container landing-page">
        <h1>Selamat Datang!</h1>
        <p>Di sini Anda dapat menemukan berbagai cerita menarik yang telah kami sajikan untuk Anda.</p>

        <div class="button-group">
        <a href="#/login" class="btn btn-primary">Login</a>
        <a href="#/register" class="btn btn-outline-primary">Register</a>
        </div>
      </section>
    `;
  }


  async afterRender() {
  }
}
