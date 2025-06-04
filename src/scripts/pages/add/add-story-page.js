import AddStoryPresenter from "../../presenters/add-story-presenter";
import { showLoading, hideLoading } from "../../utils";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class AddStoryPage {
    constructor() {
        this.presenter = new AddStoryPresenter(this);
        this.lat = null;
        this.lon = null;
        this.marker = null;
    }

    async render() {
        return `
        <section class="add-story-container">
        <h1>Tambah Cerita Saya</h1>
        
        <div class="add-story-form">
        <div class="form-group">
            <label for="description">Deskripsi</label>
        <textarea id="description" rows="4" required></textarea>
        </div>
        
        <div class="form-group">
            <div class="camera-section">
                <div class="camera-preview-container">
                    <div class="canvas-placeholder-text">Camera preview will appear here</div>
                    <video class="camera-preview" autoplay playsinline></video>
                    <canvas id="image-placeholder" class="camera-placeholder" style="display: none;"></canvas>
                </div>

                <div class="camera-controls">
                    <button class="btn capture-btn" id="open-camera">
                    <span class="material-symbols-outlined">photo_camera</span> Open Camera</button>
                    <button class="btn capture-btn" id="take-photo">Take Photo</button>
                    <input type="file" id="file-input" class="file-input" accept="image/*"/>
                </div>
                <div class="photo-preview-container hidden">
                    <img class="photo-preview" id="photo-preview" />
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <div class="map-section">
                <h3>Add Location</h3>
                <div id="map" class="map-container"></div>
                <div class="location-display">No location selected</div>
            </div>
        
        <button class="btn btn-primary" id="submit-story">Submit Story</button>
        
            <div class="loading-overlay hidden">
                <div class="loading-spinner"></div>
            </div>
                </div>
            </div>
        </section>
        `;
    }

    async afterRender() {
        this.initCamera();
        this.initFileInput();
        this.initMap();
        this.initSubmit();
    }

    initCamera() {
        const video = document.querySelector('.camera-preview');
        const openCameraBtn = document.getElementById('open-camera');
        const takePhotoBtn = document.getElementById('take-photo');
        const canvas = document.getElementById('image-placeholder');
        const ctx = canvas.getContext('2d');
        const photoPreview = document.getElementById('photo-preview');
        const previewContainer = document.querySelector('.photo-preview-container');
        const placeholderText = document.querySelector('.canvas-placeholder-text');

        let stream = null;
        let stopTimeout = null;

        openCameraBtn.addEventListener('click', async () => {
            try {
                // Stop stream sebelumnya
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                photoPreview.src = '';
                previewContainer.classList.add('hidden');
                this.imageBlob = null;

                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;

                video.style.display = 'block';
                placeholderText.style.display = 'none'; // HILANGKAN TEKS SAAT KAMERA AKTIF

                video.play();

                stopTimeout = setTimeout(() => {
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                        video.srcObject = null;
                        placeholderText.style.display = 'block'; // TAMPILKAN KEMBALI JIKA STREAM BERHENTI
                        video.style.display = 'none';
                    }
                }, 30000);
            } catch (err) {
                alert("Tidak bisa mengakses kamera. Pastikan izin sudah diberikan.");
                console.error(err);
            }
        });

        takePhotoBtn.addEventListener('click', () => {
            if (!stream) {
                alert('Buka kamera terlebih dahulu.');
                return;
            }

            // Ambil gambar dari video ke canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                this.imageBlob = blob;
            }, 'image/jpeg');

            const imageDataUrl = canvas.toDataURL('image/jpeg');
            photoPreview.src = imageDataUrl;
            previewContainer.classList.remove('hidden');

            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            video.style.display = 'none';
            placeholderText.style.display = 'block';
            stream = null; // Bersihkan variabel stream
            clearTimeout(stopTimeout); // Hentikan timeout jika masih aktif
        });

    }


    initFileInput() {
        const fileInput = document.getElementById('file-input');
        const photoPreview = document.getElementById('photo-preview');
        const previewContainer = document.querySelector('.photo-preview-container');
        const video = document.querySelector('.camera-preview');
        const placeholderText = document.querySelector('.canvas-placeholder-text');

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Matikan kamera jika menyala
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
                video.srcObject = null;
            }
            placeholderText.classList.remove('hidden');

            this.imageBlob = file;

            const reader = new FileReader();
            reader.onload = () => {
                photoPreview.src = reader.result;
                previewContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        });
    }


    initMap() {
        const defaultCoords = [-7.952933, 112.614119];
        const map = L.map('map').setView(defaultCoords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; OpenStreetMap contributors',
        }).addTo(map);

        // Coba ambil lokasi pengguna
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLatLng = [position.coords.latitude, position.coords.longitude];
                map.setView(userLatLng, 15);

                this.marker = L.marker(userLatLng).addTo(map);
                this.lat = userLatLng[0];
                this.lon = userLatLng[1];

                document.querySelector('.location-display').textContent =
                    `Lokasi Anda: ${this.lat.toFixed(4)}, ${this.lon.toFixed(4)}`;
            });
        }

        map.on('click', (e) => {
            this.lat = e.latlng.lat;
            this.lon = e.latlng.lng;

            document.querySelector('.location-display').textContent =
                `Lokasi: ${this.lat.toFixed(4)}, ${this.lon.toFixed(4)}`;

            if (this.marker) {
                this.marker.setLatLng(e.latlng);
            } else {
                this.marker = L.marker(e.latlng).addTo(map);
            }
        });
    }

    initSubmit() {
        const submitBtn = document.getElementById('submit-story');
        submitBtn.addEventListener('click', async () => {
            const description = document.getElementById('description').value.trim();

            if (!description || !this.imageBlob) {
                alert('Deskripsi dan gambar wajib diisi.');
                return;
            }

            try {
                showLoading();

                await this.presenter.submitStory({
                    description: description,
                    image: this.imageBlob,
                    lat: this.lat,
                    lon: this.lon
                });

                alert('Cerita berhasil dikirim!');
                window.location.href = '#/home';

            } catch (error) {
                console.error(error);
                alert('Terjadi kesalahan saat mengirim cerita.');
            } finally {
                hideLoading();
            }
        });
    }
}

