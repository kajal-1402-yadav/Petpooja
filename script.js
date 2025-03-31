// Chart.js for all our dashboard charts
document.addEventListener('DOMContentLoaded', function() {
    // Inventory Chart
    const inventoryCtx = document.getElementById('inventoryChart').getContext('2d');
    const inventoryChart = new Chart(inventoryCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Tomatoes',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.1
                },
                {
                    label: 'Chicken',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.1
                },
                {
                    label: 'Onions',
                    data: [45, 25, 60, 31, 56, 75, 30],
                    borderColor: '#FFCE56',
                    backgroundColor: 'rgba(255, 206, 86, 0.1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Menu Cost Chart
    const menuCostCtx = document.getElementById('menuCostChart').getContext('2d');
    const menuCostChart = new Chart(menuCostCtx, {
        type: 'bar',
        data: {
            labels: ['Pasta Dish', 'Chicken Dish', 'Salad', 'Dessert', 'Soup'],
            datasets: [
                {
                    label: 'Cost',
                    data: [3.2, 4.5, 2.8, 2.1, 3.0],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                },
                {
                    label: 'Price',
                    data: [12, 15, 10, 8, 11],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Waste Chart
    const wasteCtx = document.getElementById('wasteChart').getContext('2d');
    const wasteChart = new Chart(wasteCtx, {
        type: 'doughnut',
        data: {
            labels: ['Spoilage', 'Over-Portioning', 'Preparation Waste', 'Plate Waste'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Heatmap Chart
    const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');
    const heatmapChart = new Chart(heatmapCtx, {
        type: 'bar',
        data: {
            labels: ['Prep Station', 'Cooking Station', 'Plating Station', 'Storage'],
            datasets: [{
                label: 'Waste Amount',
                data: [12, 19, 8, 15],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Profit Chart
    const profitCtx = document.getElementById('profitChart').getContext('2d');
    const profitChart = new Chart(profitCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Food Waste Cost',
                    data: [1200, 1900, 1500, 1800, 1000, 800, 600],
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.1
                },
                {
                    label: 'Profit',
                    data: [8500, 9200, 8800, 9500, 9800, 10200, 11000],
                    borderColor: '#4BC0C0',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Camera functionality
    const inventoryCameraFeed = document.getElementById('inventoryCameraFeed');
    const inventoryCameraCanvas = document.getElementById('inventoryCameraCanvas');
    const spoilageCameraFeed = document.getElementById('spoilageCameraFeed');
    const spoilageCameraCanvas = document.getElementById('spoilageCameraCanvas');
    const modalCameraFeed = document.getElementById('modalCameraFeed');
    const modalCameraCanvas = document.getElementById('modalCameraCanvas');
    
    const startInventoryCameraBtn = document.getElementById('startInventoryCamera');
    const startSpoilageCameraBtn = document.getElementById('startSpoilageCamera');
    const startModalCameraBtn = document.getElementById('startModalCamera');
    
    const captureInventoryBtn = document.getElementById('captureInventoryBtn');
    const captureSpoilageBtn = document.getElementById('captureSpoilageBtn');
    const captureModalBtn = document.getElementById('captureModalBtn');
    
    const analyzeInventoryBtn = document.getElementById('analyzeInventoryBtn');
    const analyzeSpoilageBtn = document.getElementById('analyzeSpoilageBtn');
    const scanModalBtn = document.getElementById('scanModalBtn');
    
    const updateInventoryBtn = document.getElementById('updateInventoryBtn');
    const markSpoiledBtn = document.getElementById('markSpoiledBtn');
    
    let currentStream = null;
    
    // Function to start camera
    async function startCamera(videoElement, placeholder, startBtn, captureBtn, analyzeBtn) {
        try {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            currentStream = stream;
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            placeholder.style.display = 'none';
            startBtn.style.display = 'none';
            captureBtn.disabled = false;
            if (analyzeBtn) analyzeBtn.disabled = false;
            
            // For demo purposes, we'll simulate detection boxes after a delay
            if (videoElement === inventoryCameraFeed || videoElement === modalCameraFeed) {
                setTimeout(() => {
                    simulateDetectionBoxes(videoElement);
                }, 2000);
            }
        } catch (err) {
            console.error("Camera access error:", err);
            alert("Could not access the camera. Please ensure you've granted camera permissions.");
        }
    }
    
    // Function to simulate detection boxes (for demo)
    function simulateDetectionBoxes(videoElement) {
        const container = videoElement.parentElement;
        
        // Clear any existing boxes
        const existingBoxes = container.querySelectorAll('.detection-box');
        existingBoxes.forEach(box => box.remove());
        
        // Add some random boxes for demo
        const items = [
            { name: 'Tomatoes', count: 5, confidence: 0.92, color: '#FF6384' },
            { name: 'Onions', count: 3, confidence: 0.76, color: '#FFCE56' },
            { name: 'Chicken', count: 2, confidence: 0.88, color: '#36A2EB' }
        ];
        
        items.forEach(item => {
            const box = document.createElement('div');
            box.className = 'detection-box';
            box.style.borderColor = item.color;
            
            // Random position for demo
            const left = Math.random() * 70 + 10;
            const top = Math.random() * 70 + 10;
            const width = Math.random() * 20 + 10;
            const height = Math.random() * 20 + 10;
            
            box.style.left = `${left}%`;
            box.style.top = `${top}%`;
            box.style.width = `${width}%`;
            box.style.height = `${height}%`;
            
            const label = document.createElement('div');
            label.className = 'detection-label';
            label.textContent = `${item.name} (${item.count})`;
            label.style.backgroundColor = item.color.replace(')', ', 0.7)');
            box.appendChild(label);
            
            container.appendChild(box);
        });
    }
    
    // Function to capture image from camera
    function captureImage(videoElement, canvasElement, overlay) {
        const context = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        videoElement.style.display = 'none';
        canvasElement.style.display = 'block';
        
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 2000);
        }
    }
    
    // Function to simulate inventory analysis
    function analyzeInventory() {
        const detectedItemsContainer = document.getElementById('inventoryDetectedItems');
        detectedItemsContainer.innerHTML = '';
        
        const items = [
            { name: 'Tomatoes', count: 5, confidence: 0.92 },
            { name: 'Onions', count: 10, confidence: 0.76 },
            { name: 'Chicken', count: 3, confidence: 0.88 },
            { name: 'Milk', count: 2, confidence: 0.95 }
        ];
        
        items.forEach(item => {
            const tag = document.createElement('span');
            tag.className = `detected-tag ${item.confidence < 0.8 ? 'low-confidence' : ''}`;
            tag.innerHTML = `${item.name} (${item.count}) <span class="confidence-indicator"></span>`;
            
            tag.addEventListener('click', () => {
                openQuantityModal(item.name, item.count);
            });
            
            detectedItemsContainer.appendChild(tag);
        });
        
        updateInventoryBtn.disabled = false;
    }
    
    // Function to simulate spoilage detection
    function detectSpoilage() {
        const spoilageAlert = document.getElementById('spoilageAlert');
        spoilageAlert.querySelector('p').textContent = '2 tomatoes show signs of spoilage';
        spoilageAlert.style.display = 'flex';
        markSpoiledBtn.disabled = false;
    }
    
    // Function to open quantity adjustment modal
    function openQuantityModal(itemName, quantity) {
        const quantityModal = document.getElementById('quantityModal');
        document.getElementById('quantityItemName').textContent = itemName;
        document.getElementById('quantityInput').value = quantity;
        quantityModal.classList.add('active');
    }
    
    // Event listeners for inventory camera
    startInventoryCameraBtn.addEventListener('click', () => {
        startCamera(inventoryCameraFeed, startInventoryCameraBtn.parentElement, startInventoryCameraBtn, captureInventoryBtn, analyzeInventoryBtn);
    });
    
    captureInventoryBtn.addEventListener('click', () => {
        captureImage(inventoryCameraFeed, inventoryCameraCanvas, inventoryCameraFeed.parentElement.querySelector('.scanning-overlay'));
    });
    
    analyzeInventoryBtn.addEventListener('click', analyzeInventory);
    
    // Event listeners for spoilage camera
    startSpoilageCameraBtn.addEventListener('click', () => {
        startCamera(spoilageCameraFeed, startSpoilageCameraBtn.parentElement, startSpoilageCameraBtn, captureSpoilageBtn, analyzeSpoilageBtn);
    });
    
    captureSpoilageBtn.addEventListener('click', () => {
        captureImage(spoilageCameraFeed, spoilageCameraCanvas, spoilageCameraFeed.parentElement.querySelector('.scanning-overlay'));
    });
    
    analyzeSpoilageBtn.addEventListener('click', detectSpoilage);
    
    // Event listeners for modal camera
    startModalCameraBtn.addEventListener('click', () => {
        startCamera(modalCameraFeed, startModalCameraBtn.parentElement, startModalCameraBtn, captureModalBtn, scanModalBtn);
    });
    
    captureModalBtn.addEventListener('click', () => {
        captureImage(modalCameraFeed, modalCameraCanvas, modalCameraFeed.parentElement.querySelector('.scanning-overlay'));
    });
    
    scanModalBtn.addEventListener('click', () => {
        const overlay = modalCameraFeed.parentElement.querySelector('.scanning-overlay');
        overlay.style.display = 'flex';
        
        setTimeout(() => {
            overlay.style.display = 'none';
            const detectedItemsContainer = document.getElementById('modalDetectedItems');
            detectedItemsContainer.innerHTML = '';
            
            const items = [
                { name: 'Tomatoes', count: 5, confidence: 0.92 },
                { name: 'Onions', count: 10, confidence: 0.76 },
                { name: 'Chicken', count: 3, confidence: 0.88 }
            ];
            
            items.forEach(item => {
                const tag = document.createElement('span');
                tag.className = `detected-tag ${item.confidence < 0.8 ? 'low-confidence' : ''}`;
                tag.innerHTML = `${item.name} (${item.count}) <span class="confidence-indicator"></span>`;
                detectedItemsContainer.appendChild(tag);
            });
        }, 2000);
    });
    
    // Modal functionality
    const scanModal = document.getElementById('scanModal');
    const scanBtn = document.getElementById('scanInventoryBtn');
    const closeBtns = document.querySelectorAll('.modal-close');
    
    scanBtn.addEventListener('click', () => {
        scanModal.classList.add('active');
    });
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Quantity adjustment
    const decreaseQuantityBtn = document.getElementById('decreaseQuantity');
    const increaseQuantityBtn = document.getElementById('increaseQuantity');
    const quantityInput = document.getElementById('quantityInput');
    const saveQuantityBtn = document.getElementById('saveQuantityBtn');
    
    decreaseQuantityBtn.addEventListener('click', () => {
        quantityInput.value = Math.max(0, parseInt(quantityInput.value) - 1);
    });
    
    increaseQuantityBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    
    saveQuantityBtn.addEventListener('click', () => {
        document.getElementById('quantityModal').classList.remove('active');
        // In a real app, this would update the inventory
    });
    
    // Generate new menu suggestions
    const generateMenuBtn = document.getElementById('generateMenuBtn');
    generateMenuBtn.addEventListener('click', () => {
        alert('Generating new menu suggestions based on current inventory...');
        // In a real app, this would call an API to get new suggestions
    });
    
    // Update inventory
    updateInventoryBtn.addEventListener('click', () => {
        alert('Inventory updated successfully!');
        updateInventoryBtn.disabled = true;
    });
    
    // Mark items as spoiled
    markSpoiledBtn.addEventListener('click', () => {
        alert('Items marked as spoiled and removed from inventory');
        markSpoiledBtn.disabled = true;
        document.getElementById('spoilageAlert').style.display = 'none';
    });
});

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Utility functions for API calls
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication functions
async function login(email, password) {
    return await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

// Inventory functions
async function getInventory() {
    return await fetchAPI('/inventory');
}

async function updateInventoryItem(id, data) {
    return await fetchAPI(`/inventory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

// Menu functions
async function getMenuSuggestions() {
    return await fetchAPI('/menu/suggestions');
}

// Waste tracking functions
async function getWasteMetrics() {
    return await fetchAPI('/waste/metrics');
}

// Initialize dashboard
async function initializeDashboard() {
    try {
        // Load inventory data
        const inventory = await getInventory();
        updateInventoryDisplay(inventory);

        // Load menu suggestions
        const suggestions = await getMenuSuggestions();
        updateMenuSuggestions(suggestions);

        // Load waste metrics
        const wasteMetrics = await getWasteMetrics();
        updateWasteMetrics(wasteMetrics);
    } catch (error) {
        showError('Failed to load dashboard data');
    }
}

// UI update functions
function updateInventoryDisplay(inventory) {
    const inventoryList = document.querySelector('.inventory-list');
    if (!inventoryList) return;

    inventoryList.innerHTML = inventory.map(item => `
        <li class="inventory-item">
            <span class="item-name">${item.name}</span>
            <span class="item-status status-${getStatusClass(item.quantity)}">${item.quantity} ${item.unit}</span>
        </li>
    `).join('');
}

function updateMenuSuggestions(suggestions) {
    const menuContainer = document.querySelector('.menu-suggestions');
    if (!menuContainer) return;

    menuContainer.innerHTML = suggestions.map(item => `
        <div class="menu-card">
            <div class="menu-image" style="background-image: url(${item.image})"></div>
            <div class="card-header">
                <h3 class="card-title">${item.name}</h3>
            </div>
        </div>
    `).join('');
}

function updateWasteMetrics(metrics) {
    const wasteStats = document.querySelector('.waste-stats');
    if (!wasteStats) return;

    wasteStats.innerHTML = `
        <div class="stat-value">${metrics.totalWaste}kg</div>
        <div class="stat-label">Total Waste This Week</div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${metrics.reductionRate}%"></div>
        </div>
    `;
}

function getStatusClass(quantity) {
    if (quantity > 70) return 'good';
    if (quantity > 30) return 'warning';
    return 'danger';
}

function showError(message) {
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert alert-danger';
    alertContainer.innerHTML = `
        <span class="alert-icon">⚠️</span>
        <span>${message}</span>
    `;
    document.querySelector('.container').prepend(alertContainer);
    setTimeout(() => alertContainer.remove(), 5000);
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);