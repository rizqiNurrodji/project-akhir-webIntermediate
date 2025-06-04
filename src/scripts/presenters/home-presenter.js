import { getAllStories } from "../data/api.js";

export default class HomePresenter {
    constructor(view) {
        this.view = view;
    }
    async loadStories() {
        try {
            const response = await getAllStories();
            this.view.renderStories(response);
        } catch (error) {
            console.error('Error loading stories:', error);
            // alert(error.message);
        }
    }
}