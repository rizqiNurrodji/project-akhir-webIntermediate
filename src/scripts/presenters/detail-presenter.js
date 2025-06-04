import { getStoryDetail } from "../data/api.js";
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
  iconUrl: '/leaflet-images/marker-icon.png',
  shadowUrl: '/leaflet-images/marker-shadow.png',
});


export default class DetailPresenter {
    constructor(view) {
        this.view = view;
        this.map = null;
        this.marker = null;
    }

    async loadStoryDetail(id) {
        try {
            const response = await getStoryDetail(id);
            if (response.error) {
                throw new Error(response.message);
            }

            this.view.showStoryDetail(response.story);

            //cek apakah lat dan lon ada
            if (response.story.lat && response.story.lon) {
                this.initMap(response.story.lat, response.story.lon);
            }else {
                this.view.showNoMap();
            }
        } catch (error) {
            this.view.showError(error.message);
        }

    }

    initMap(lat, lon) {

        // Inisialisasi peta jika belum ada
        // Jika peta sudah ada, hanya perlu memperbarui posisi
        if (!this.map) {
            this.map = L.map('map').setView([lat, lon], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                minZoom: 1
            }).addTo(this.map);
            
        } else {
            this.map.setView([lat, lon], 13);
        }

        // Marker peta
        this.marker = L.marker([lat, lon]).addTo(this.map)
            .bindPopup('Story Location')
            .openPopup();
    }

}