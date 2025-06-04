import { addStory } from "../data/api.js";

export default class AddStoryPresenter {
    constructor(view) {
        this.view = view;
    }

    async submitStory({description, image, lat, lon}) {
        try {
            await addStory({
                description: description,
                photo: image,
                lat: lat,
                lon: lon
            });
        } catch (error) {
            console.error('Error submitting story:', error);
            throw new Error('Gagal mengirim cerita. Silakan coba lagi.');
        }
    }
}