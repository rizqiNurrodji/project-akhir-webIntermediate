  import HomePresenter from "../../presenters/home-presenter";

  export default class HomePage {
    constructor() {
      this._presenter = new HomePresenter(this);
      this._storiesList = [];
    }

    async render() {
    return `
        <section class="container home-page" tabindex="-1">
          <div class="hero">
            <h1>Selamat Datang!</h1>
            <p>Di sini Anda dapat menemukan berbagai cerita menarik yang telah kami sajikan untuk Anda.</p>
          
          </div>

          <div class="stories" id="stories-section" >
            <h2>Daftar Cerita</h2>
            <div class="story-list"></div>
            <p class="loading-text">Memuat cerita ...</p>
          </div>
        </section>
      `;
    }


  async afterRender() {
    this._presenter.loadStories();

    const skipLink = document.querySelector('.skip-link');
    const targetSection = document.querySelector('#stories-section');

    if (skipLink && targetSection) {
      skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });

        targetSection.classList.add('highlight');

        skipLink.classList.add('hidden');

        // Hapus highlight setelah 1.5 detik
        setTimeout(() => {
          targetSection.classList.remove('highlight');
        }, 1500);
      });
    }


  }

    renderStories(response) {
      const storyListElement = document.querySelector('.story-list');
      const loadingText = document.querySelector('.loading-text');

      console.log('Data listStory:', response.listStory);
      console.log('Apakah error?:', response.error);

      if (response.error || !response.listStory || response.listStory.length === 0) {
        storyListElement.innerHTML = '<p>Tidak ada cerita yang tersedia.</p>';
        if (loadingText) loadingText.remove();
        return;
      }

      this._storiesList = response.listStory;

      const storiesHTML = this._storiesList.map(story => `
        <article class="story-card">
          <div class="story-header">
            <h3>${story.name}</h3>
            <time datetime="${story.createdAt}">${new Date(story.createdAt).toLocaleDateString()}</time>
          </div>
          <img src="${story.photoUrl}" alt="Story by ${story.name}" class="story-image" loading="lazy">
          <div class="story-content">
            <p class="story-description">${this._truncateDescription(story.description, 100)}</p>
            <a href="#/detail/${story.id}" class="btn btn-primary">Lihat Detail</a>
          </div>
        </article>
      `).join('');

      storyListElement.innerHTML = storiesHTML;
      if (loadingText) loadingText.remove();
    }

    _truncateDescription(description, maxLength) {
      if (description.length <= maxLength) return description;
      return `${description.substring(0, maxLength)}...`;
    }
  }