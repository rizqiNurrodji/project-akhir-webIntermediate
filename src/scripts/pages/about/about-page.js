export default class AboutPage {
  async render() {
    return `
      <section class="container about-page">
        <h2>Tentang Website Ini</h2>

        <div class="logo-container">
          <img src="images/logo.png" alt="logo" class="logo">
        </div>

        <div class="about-content">
        <p> Dicoding web stories adalah aplikasi sekaligus tempat berbagi cerita dan pengalaman
          antarkomunitas yang ada di Dicoding Indonesia.</p>

        <p> Aplikas ini dikembangan untuk memenuhi tugas submission #1 modul <i> Pengembangan Web Intermediate </i>
        <p> Di aplikasi ini Anda dapate untuk melakukan:</p>
        <ul class="about-content-list">
        <li> Register jika belum memiliki akun </li>
        <li> Login jika sudah memiliki akun </li>
        <li> Menambahkan cerita dengan memasukkan gambar dan lokasi dari cerita Anda</li>
        <li> Melihat cerita-cerita dari orang yang mengirimkan cerita mereka ke Aplikasi Ini</li>
        </ul>


      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
