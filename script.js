// Main DOM ready handler - kicks everything off when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing app');
    
    // Tab switching functionality
    // Cache these elements since we use them often
    const matrixTabBtn = document.getElementById('matrix-tab-btn');
    const roomsTabBtn = document.getElementById('rooms-tab-btn');
    const matrixTab = document.getElementById('matrix-tab');
    const roomsTab = document.getElementById('rooms-tab');

    // Quick helper to reset result displays
    function clearResults() {
        const results = document.querySelectorAll('.result');
        results.forEach(res => {
            res.textContent = '';
            res.style.color = 'black';
            res.style.padding = '0';
        });
    }

    // Tab event handlers
    matrixTabBtn.addEventListener('click', () => {
        console.log('Switching to matrix tab');
        matrixTabBtn.classList.add('active');
        roomsTabBtn.classList.remove('active');
        matrixTab.classList.add('active');
        roomsTab.classList.remove('active');
        clearResults();
    });

    roomsTabBtn.addEventListener('click', () => {
        console.log('Switching to rooms tab');
        roomsTabBtn.classList.add('active');
        matrixTabBtn.classList.remove('active');
        roomsTab.classList.add('active');
        matrixTab.classList.remove('active');
        clearResults();
    });

    /* ----------------- Matrix Multiplication Tab ----------------- */
    const matrixInputs = document.getElementById('matrix-inputs');
    const addMatrixBtn = document.getElementById('add-matrix-btn');
    const calculateMatrixBtn = document.getElementById('calculate-matrix-btn');
    const matrixResult = document.getElementById('matrix-result');

    // Initialize with one matrix input by default
    addMatrixInput();

    // Add matrix input button handler
    addMatrixBtn.addEventListener('click', () => {
        console.log('Adding new matrix input');
        addMatrixInput();
    });

    // Adds a new matrix input row
    function addMatrixInput() {
        const count = matrixInputs.children.length + 1;
        const div = document.createElement('div');
        div.className = 'matrix-input';
        div.innerHTML = `
            <label>Dimensões da Matriz ${count}:</label>
            <input type="number" class="rows" placeholder="Linhas" min="1">
            <span>x</span>
            <input type="number" class="cols" placeholder="Colunas" min="1">
            <button class="remove-btn">×</button>
        `;
        matrixInputs.appendChild(div);
        
        // Add remove functionality
        div.querySelector('.remove-btn').addEventListener('click', function() {
            console.log('Removing matrix input');
            div.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                div.remove();
                updateMatrixLabels();
            }, 300);
        });
    }

    // Updates matrix labels to maintain sequential numbering
    function updateMatrixLabels() {
        document.querySelectorAll('.matrix-input').forEach((input, idx) => {
            input.querySelector('label').textContent = `Dimensões da Matriz ${idx + 1}:`;
        });
    }

    // Main calculation handler for matrix chain multiplication
    calculateMatrixBtn.addEventListener('click', function() {
        console.log('Calculating matrix chain order...');
        
        const inputs = matrixInputs.querySelectorAll('.matrix-input');
        const dimensions = [];
        
        // Validate we have enough matrices
        if (inputs.length < 2) {
            showError(matrixResult, 'Adicione pelo menos 2 matrizes');
            return;
        }
        
        // Collect and validate dimensions
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const rows = parseInt(input.querySelector('.rows').value);
            const cols = parseInt(input.querySelector('.cols').value);

            // Basic validation
            if (!rows || !cols || rows < 1 || cols < 1) {
                showError(matrixResult, 'Insira dimensões válidas para todas as matrizes');
                return;
            }
            
            // Check chain compatibility
            if (i > 0 && dimensions[i-1][1] !== rows) {
                showError(matrixResult, 
                    `Colunas da Matriz ${i} (${dimensions[i-1][1]}) devem ser iguais às linhas da Matriz ${i+1} (${rows})`);
                return;
            }
            
            dimensions.push([rows, cols]);
        }
        
        // If we got here, all is valid - do the calculation
        const minMultiplications = matrixChainOrder(dimensions);
        matrixResult.textContent = `Mínimo de multiplicações necessárias: ${minMultiplications}`;
        matrixResult.style.color = 'black';
        matrixResult.style.padding = '20px';
        
        console.log('Calculation complete', {dimensions, minMultiplications});
    });

    // Helper to show errors
    function showError(element, message) {
        element.textContent = message;
        element.style.color = 'red';
        element.style.padding = '20px';
    }

    /* ----------------- Meeting Rooms Tab ----------------- */
    const lectureInputs = document.getElementById('lecture-inputs');
    const addLectureBtn = document.getElementById('add-lecture-btn');
    const calculateRoomsBtn = document.getElementById('calculate-rooms-btn');
    const roomsResult = document.getElementById('rooms-result');

    // Start with one lecture input
    addLectureInput();

    // Add lecture button handler
    addLectureBtn.addEventListener('click', () => {
        console.log('Adding new lecture input');
        addLectureInput();
    });

    // Adds a new lecture time input
    function addLectureInput() {
        const count = lectureInputs.children.length + 1;
        const div = document.createElement('div');
        div.className = 'lecture-input';
        div.innerHTML = `
            <label>Aula ${count}:</label>
            <input type="time" class="start-time" value="09:00">
            <span>-</span>
            <input type="time" class="end-time" value="10:00">
            <button class="remove-btn">×</button>
        `;
        lectureInputs.appendChild(div);
        
        // Add remove functionality
        div.querySelector('.remove-btn').addEventListener('click', function() {
            console.log('Removing lecture input');
            div.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                div.remove();
                updateLectureLabels();
            }, 300);
        });
    }

    // Updates lecture labels to maintain order
    function updateLectureLabels() {
        document.querySelectorAll('.lecture-input').forEach((input, idx) => {
            input.querySelector('label').textContent = `Aula ${idx + 1}:`;
        });
    }

    // Main calculation handler for meeting rooms
    calculateRoomsBtn.addEventListener('click', function() {
        console.log('Calculating minimum rooms needed...');
        
        const inputs = lectureInputs.querySelectorAll('.lecture-input');
        const lectures = [];
        
        // Check we have at least one lecture
        if (inputs.length === 0) {
            showError(roomsResult, 'Adicione pelo menos uma aula');
            return;
        }
        
        // Process each lecture time
        for (const input of inputs) {
            const startTime = input.querySelector('.start-time').value;
            const endTime = input.querySelector('.end-time').value;
            
            const start = convertTimeToMinutes(startTime);
            const end = convertTimeToMinutes(endTime);
            
            // Validate time range
            if (start >= end) {
                showError(roomsResult, 'O horário de término deve ser após o horário de início para todas as aulas');
                return;
            }
            
            lectures.push({ start, end });
        }
        
        // If valid, calculate rooms needed
        const minRooms = minMeetingRooms(lectures);
        roomsResult.textContent = `Mínimo de salas necessárias: ${minRooms}`;
        roomsResult.style.color = 'black';
        roomsResult.style.padding = '20px';
        
        console.log('Room calculation complete', {lectures, minRooms});
    });

    /* ----------------- Utility Functions ----------------- */
    
    // Converts HH:MM to minutes since midnight
    function convertTimeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Matrix chain multiplication DP algorithm
    function matrixChainOrder(dims) {
        const n = dims.length;
        const dp = Array(n).fill().map(() => Array(n).fill(0));
        
        // Build up the solution for chains of increasing length
        for (let len = 2; len <= n; len++) {
            for (let i = 0; i < n - len + 1; i++) {
                const j = i + len - 1;
                dp[i][j] = Infinity;
                
                // Try all possible split points
                for (let k = i; k < j; k++) {
                    const cost = dp[i][k] + dp[k+1][j] + dims[i][0] * dims[k][1] * dims[j][1];
                    dp[i][j] = Math.min(dp[i][j], cost);
                }
            }
        }
        console.log("finished dp:");
        console.table(dp);
        return dp[0][n-1];
    }

    // Minimum meeting rooms algorithm using chronological ordering
    function minMeetingRooms(intervals) {
        if (!intervals.length) return 0;
        
        // Sort start and end times separately
        const starts = intervals.map(i => i.start).sort((a, b) => a - b);
        const ends = intervals.map(i => i.end).sort((a, b) => a - b);

        console.log("starts:");
        console.table(starts);
        console.log("ends:");
        console.table(ends);
        
        let rooms = 0;
        let endIdx = 0;
        
        // Process all start times
        for (const start of starts) {
            if (start < ends[endIdx]) {
                rooms++; // Need another room
            } else {
                endIdx++; // Reuse a room
            }
        }
        
        return rooms;
    }
});