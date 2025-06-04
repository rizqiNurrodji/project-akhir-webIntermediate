import IdbStory from "../utils/database";

export default class SavedStoryPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadSavedStories() {
    try {
      const stories = await IdbStory.getAllStories();
      this.view.renderSavedStories(stories);
    } catch (error) {
      console.error("Gagal memuat cerita tersimpan:", error);
    }
  }
}
