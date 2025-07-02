document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade de troca de abas
    const matrixTabBtn = document.getElementById('matrix-tab-btn');
    const roomsTabBtn = document.getElementById('rooms-tab-btn');
    const matrixTab = document.getElementById('matrix-tab');
    const roomsTab = document.getElementById('rooms-tab');

    // Aba de Multiplicação de Matrizes
    const matrixInputs = document.getElementById('matrix-inputs');
    const addMatrixBtn = document.getElementById('add-matrix-btn');
    const calculateMatrixBtn = document.getElementById('calculate-matrix-btn');
    const matrixResult = document.getElementById('matrix-result');

    matrixTabBtn.addEventListener('click', () => {
        matrixTabBtn.classList.add('active');
        roomsTabBtn.classList.remove('active');
        matrixTab.classList.add('active');
        roomsTab.classList.remove('active');
        matrixResult.textContent = '';
        matrixResult.style.color = 'black';
        matrixResult.style.padding = '0px';
        roomsResult.textContent = '';
        roomsResult.style.color = 'black';
        roomsResult.style.padding = '0px';
    });

    roomsTabBtn.addEventListener('click', () => {
        roomsTabBtn.classList.add('active');
        matrixTabBtn.classList.remove('active');
        roomsTab.classList.add('active');
        matrixTab.classList.remove('active');
    });

    // Adiciona input de matriz inicial
    addMatrixInput();

    addMatrixBtn.addEventListener('click', addMatrixInput);

    function addMatrixInput() {
        const count = matrixInputs.children.length + 1;
        const div = document.createElement('div');
        div.className = 'matrix-input';
        div.innerHTML = `
            <label>Matriz ${count} Dimensões:</label>
            <input type="number" class="rows" placeholder="Linhas" min="1">
            <span>x</span>
            <input type="number" class="cols" placeholder="Colunas" min="1">
            <button class="remove-btn">×</button>
        `;
        matrixInputs.appendChild(div);
        
        // Adiciona funcionalidade de remover
        const removeBtn = div.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            div.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                div.remove();
                updateMatrixLabels();
            }, 300);
        });
    }

    function updateMatrixLabels() {
        const inputs = matrixInputs.querySelectorAll('.matrix-input');
        inputs.forEach((input, index) => {
            input.querySelector('label').textContent = `Matriz ${index + 1} Dimensões:`;
        });
    }

    calculateMatrixBtn.addEventListener('click', () => {
        const dimensions = [];
        const inputs = matrixInputs.querySelectorAll('.matrix-input');
        
        if (inputs.length < 2) {
            matrixResult.textContent = 'Adicione pelo menos 2 matrizes';
            matrixResult.style.color = 'red';
            matrixResult.style.padding = '20px';
            return;
        }
        
        let isValid = true;
        inputs.forEach((input, index) => {
            const rows = parseInt(input.querySelector('.rows').value);
            const cols = parseInt(input.querySelector('.cols').value);

            console.log(rows, cols);
            
            if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
                isValid = false;
                matrixResult.textContent = 'Insira dimensões válidas para todas as matrizes';
                matrixResult.style.color = 'red';
                matrixResult.style.padding = '20px';
                return;
            }
            
            if (index > 0 && dimensions[index-1][1] !== rows) {
                isValid = false;
                matrixResult.textContent = `Colunas da Matriz ${index} (${dimensions[index-1][1]}) devem ser iguais às linhas da Matriz ${index+1} (${rows})`;
                matrixResult.style.color = 'red';
                matrixResult.style.padding = '20px';
                return;
            }
            
            dimensions.push([rows, cols]);
        });
        
        if (!isValid && matrixResult.textContent === '') {
            matrixResult.textContent = 'Insira dimensões válidas para todas as matrizes';
            matrixResult.style.color = 'red';
            matrixResult.style.padding = '20px';
            return;
        }
        
        if (isValid) {
            const minMultiplications = matrixChainOrder(dimensions);
            matrixResult.textContent = `Mínimo de multiplicações necessárias: ${minMultiplications}`;
            matrixResult.style.color = 'black';
            matrixResult.style.padding = '20px';
        }
    });

    // Aba de Salas de Espera
    const lectureInputs = document.getElementById('lecture-inputs');
    const addLectureBtn = document.getElementById('add-lecture-btn');
    const calculateRoomsBtn = document.getElementById('calculate-rooms-btn');
    const roomsResult = document.getElementById('rooms-result');

    // Adiciona input de aula inicial
    addLectureInput();

    addLectureBtn.addEventListener('click', addLectureInput);

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
        
        // Adiciona funcionalidade de remover
        const removeBtn = div.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            div.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                div.remove();
                updateLectureLabels();
            }, 300);
        });
    }

    function updateLectureLabels() {
        const inputs = lectureInputs.querySelectorAll('.lecture-input');
        inputs.forEach((input, index) => {
            input.querySelector('label').textContent = `Aula ${index + 1}:`;
        });
    }

    calculateRoomsBtn.addEventListener('click', () => {
        const lectures = [];
        const inputs = lectureInputs.querySelectorAll('.lecture-input');
        
        if (inputs.length === 0) {
            roomsResult.textContent = 'Adicione pelo menos uma aula';
            roomsResult.style.color = 'red';
            roomsResult.style.padding = '20px';
            return;
        }
        
        let isValid = true;
        inputs.forEach(input => {
            const startTime = input.querySelector('.start-time').value;
            const endTime = input.querySelector('.end-time').value;
            
            if (!startTime || !endTime) {
                isValid = false;
                return;
            }
            
            const start = convertTimeToMinutes(startTime);
            const end = convertTimeToMinutes(endTime);
            
            if (start >= end) {
                isValid = false;
                roomsResult.textContent = 'O horário de término deve ser após o horário de início para todas as aulas';
                roomsResult.style.color = 'red';
                roomsResult.style.padding = '20px';
                return;
            }
            
            lectures.push({ start, end });
        });
        
        if (!isValid && roomsResult.textContent === '') {
            roomsResult.textContent = 'Insira horários válidos para todas as aulas';
            roomsResult.style.color = 'red';
            roomsResult.style.padding = '20px';
            return;
        }
        
        if (isValid) {
            const minRooms = minMeetingRooms(lectures);
            roomsResult.textContent = `Mínimo de salas necessárias: ${minRooms}`;
            roomsResult.style.color = 'black';
            roomsResult.style.padding = '20px';
        }
    });

    // Converte HH:MM para minutos desde meia-noite
    function convertTimeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Algoritmo de Cadeia de Multiplicação de Matrizes
    function matrixChainOrder(dims) {
        const n = dims.length;
        const dp = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let len = 2; len <= n; len++) {
            for (let i = 0; i < n - len + 1; i++) {
                const j = i + len - 1;
                dp[i][j] = Infinity;
                
                for (let k = i; k < j; k++) {
                    const cost = dp[i][k] + dp[k+1][j] + dims[i][0] * dims[k][1] * dims[j][1];
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                    }
                }
            }
        }
        console.table(dp);
        return dp[0][n-1];
    }

    // Algoritmo de Mínimo de Salas de Reunião
    function minMeetingRooms(intervals) {
        if (intervals.length === 0) return 0;
        
        const starts = intervals.map(i => i.start).sort((a, b) => a - b);
        const ends = intervals.map(i => i.end).sort((a, b) => a - b);
        
        let rooms = 0;
        let endIdx = 0;
        
        for (let i = 0; i < starts.length; i++) {
            if (starts[i] < ends[endIdx]) {
                rooms++;
            } else {
                endIdx++;
            }
        }
        
        return rooms;
    }
});