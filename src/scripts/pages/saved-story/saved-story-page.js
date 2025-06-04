import SavedStoryPresenter from "../../presenters/saved-story-presenter";

export default class SavedStoryPage {
    constructor() {
        this.presenter = new SavedStoryPresenter(this);
        this._storiesList = [];
    }

    async render() {
        return `
      <section class="container saved-page" tabindex="-1">
        <div class="stories" id="saved-stories-section">
          <h2>Cerita Tersimpan</h2>
          <div class="story-list"></div>
        </div>
      </section>
    `;
    }

    async afterRender() {
        this.presenter.loadSavedStories();
    }

    renderSavedStories(stories) {
        const storyListElement = document.querySelector('.story-list');

        if (!stories || stories.length === 0) {
            storyListElement.innerHTML = '<p>Belum ada cerita yang disimpan.</p>';
            return;
        }

        const storiesHTML = stories.map(story => `
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
    }

    _truncateDescription(description, maxLength) {
        if (description.length <= maxLength) return description;
        return `${description.substring(0, maxLength)}...`;
    }
}