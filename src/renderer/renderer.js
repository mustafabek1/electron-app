const { ipcRenderer } = require("electron");

async function fetchData() {
    console.log("Renderer: API isteği gönderiliyor...");
    const data = await ipcRenderer.invoke('fetch-data');
    console.log("Renderer: API'den dönen veri:", data);
    document.getElementById("dataInput").value = data.storedData.join(", ");
}

async function sendData() {
    const text = document.getElementById("textInput").value;
    if (!text) {
        alert("Lütfen bir metin girin!");
        return;
    }

    console.log("Renderer: API'ye veri gönderiliyor...");
    const response = await ipcRenderer.invoke("send-data", text);
    console.log("Renderer: API yanıtı:", response);
    
    alert("Veri başarıyla gönderildi!");
}

const openKeyboardBtn = document.getElementById("openKeyboard");
const textInput = document.getElementById("textInput");
const saveButton = document.getElementById("saveButton");

openKeyboardBtn.addEventListener("click", () => {
    ipcRenderer.send("open-keyboard");
    openKeyboardBtn.style.display = 'none';
    textInput.style.display = 'block';
    saveButton.style.display = 'block';
    textInput.focus();
    
    // Klavye açıldığında localStorage'dan veriyi al ve göster
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
        textInput.value = savedText;
    }
});

// Sadece Kayıt Et butonuna tıklandığında localStorage'a kaydet
saveButton.addEventListener('click', () => {
    localStorage.setItem('savedText', textInput.value);
    alert('Metin başarıyla kaydedildi!');
});

// input event listener'ı kaldırıldı çünkü artık otomatik kaydetmeyeceğiz

// Volume slider için gerekli değişkenler
const volumeSlider = document.getElementById('volume-slider');
const volumeContainer = document.getElementById('volume-container');
let isDragging = false;
let currentX;
let initialX;
let xOffset = 0;

// Başlangıçta mevcut ses seviyesini al ve slider'ı konumlandır
async function initializeVolumeSlider() {
    const currentVolume = await ipcRenderer.invoke('get-volume');
    const containerWidth = volumeContainer.offsetWidth - volumeSlider.offsetWidth;
    xOffset = (currentVolume / 100) * containerWidth;
    volumeSlider.style.left = `${xOffset}px`;
}
initializeVolumeSlider();

// Mouse events için event listener'lar
volumeSlider.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    if (e.target === volumeSlider) {
        isDragging = true;
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        
        // Sınırları kontrol et (0-100 arası)
        const containerWidth = volumeContainer.offsetWidth - volumeSlider.offsetWidth;
        if (currentX < 0) currentX = 0;
        if (currentX > containerWidth) currentX = containerWidth;
        
        xOffset = currentX;
        volumeSlider.style.left = `${currentX}px`;
        
        // Ses seviyesini hesapla ve ayarla (0-100 arası)
        const volumeLevel = Math.round((currentX / containerWidth) * 100);
        ipcRenderer.invoke('set-volume', volumeLevel);
    }
}

function dragEnd() {
    isDragging = false;
}