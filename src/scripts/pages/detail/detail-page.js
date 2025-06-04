import DetailPresenter from "../../presenters/detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import IdbStory from '../../utils/database';

export default class DetailPage {
    constructor() {
        this.presenter = new DetailPresenter(this);
    }

    async render() {
        return `
            <section class="detail-page container">
                <a href="#/home" class="back-button">
                <span class="material-symbols-outlined">arrow_back</span>
                </a>
                <div id="story-detail" class="story-detail"></div>
                <div id="map" class="story-map"></div>
            </section>
        `;
    }

    async afterRender() {
        const { id } = parseActivePathname();
        await this.presenter.loadStoryDetail(id);

    }

async showStoryDetail(story) {
    const detailElement = document.getElementById('story-detail');
    
    const isSaved = await IdbStory.getStory(story.id);

    const buttonLabel = isSaved 
        ? `<span class="material-symbols-outlined">delete</span> Hapus dari Tersimpan` 
        : `<span class="material-symbols-outlined">bookmark</span> Simpan Cerita`;

    const buttonClass = isSaved ? 'btn-danger' : 'btn-primary';

    detailElement.innerHTML = `
        <div class="story-header">
            <h2>${story.name}'s Story</h2>
            <p class="story-date">${new Date(story.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="story-content">
            <img src="${story.photoUrl}" alt="${story.name}'s story" class="story-image">
            <p class="story-description">${story.description}</p>
        </div>
        <button id="save-story-btn" class="btn ${buttonClass}">
            ${buttonLabel}
        </button>
    `;

    this._attachSaveButtonLogic(story, isSaved);
}

_attachSaveButtonLogic(story, isSaved) {
    const button = document.getElementById('save-story-btn');

    if (!button) return;

    button.addEventListener('click', async () => {
        if (isSaved) {
            await IdbStory.deleteStory(story.id);
            button.innerHTML = `<span class="material-symbols-outlined">bookmark</span> Simpan Cerita`;
            button.classList.remove('btn-danger');
            button.classList.add('btn-primary');
        } else {
            await IdbStory.putStory(story);
            button.innerHTML = `<span class="material-symbols-outlined">delete</span> Hapus dari Tersimpan`;
            button.classList.remove('btn-primary');
            button.classList.add('btn-danger');
        }

        isSaved = !isSaved;
    });
}
    showNoMap() {
        const mapElement = document.getElementById('map');
        mapElement.innerHTML = `
            <div class="no-map-message">
                <span class="material-symbols-outlined">location_off</span>
                <p>Story ini tidak memiliki data lokasi peta</p>
            </div>
        `;
    }

    showError(message) {
        const detailElement = document.getElementById('story-detail');
        detailElement.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button onclick="window.location.hash = '#/home'">Back to Home</button>
            </div>
        `;
    }
}