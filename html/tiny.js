document.addEventListener('DOMContentLoaded', function() {
    const resourceCards = document.querySelectorAll('.resource-card');
    const gridCells = document.querySelectorAll('.cell.selectable');

    let selectedResource = null;
    let selectedSquares = [];    // Array of DOM elements (the squares)
    let selectedBuilding = null; // Which building the player chose (e.g. "Cottage")

    const colorToResource = {
        yellow: 'Wheat',
        red: 'Brick',
        blue: 'Glass',
        brown: 'Wood',
        gray: 'Stone'
    };

    // ===========================
    // Buildings Configuration
    // Each building has:
    //   - icon: the icon file
    //   - basePatterns: an array of base shapes (each is an array of {color, row, col})
    // ===========================
    const buildings = {
        Cottage: {
            icon: 'cottage_ic.png',
            // Example: 2x2 shape with top-left empty, top-right = yellow, bottom-left = red, bottom-right = blue
            basePatterns: [
                [
                    { color: 'yellow', row: 0, col: 1 },
                    { color: 'red',    row: 1, col: 0 },
                    { color: 'blue',   row: 1, col: 1 }
                ]
            ]
        },
        Farm: {
            icon: 'farm_ic.png',
            // 2x2 shape with top-left = yellow, top-right = yellow, bottom-left = brown, bottom-right = brown
            basePatterns: [
                [
                    { color: 'yellow', row: 0, col: 0 },
                    { color: 'yellow', row: 0, col: 1 },
                    { color: 'brown',  row: 1, col: 0 },
                    { color: 'brown',  row: 1, col: 1 }
                ]
            ]
        },
        Chapel: {
            icon: 'chapel_ic.png',
            // reverse L-shape or 2x3 shape with top-left empty, top-middle empty, 
            // top-right = blue, bottom-left = gray, bottom-middle = blue, bottom-right = gray
            basePatterns: [
                [
                    { color: 'blue', row: 0, col: 2 },
                    { color: 'gray', row: 1, col: 0 },
                    { color: 'blue',  row: 1, col: 1 },
                    { color: 'gray',  row: 1, col: 2 }
                ]
            ]
        },
        Tavern: {
            icon: 'tavern_ic.png',
            // straight line or 1x3 shape with left = red, middle = red, right = blue
            basePatterns: [
                [
                    { color: 'red', row: 0, col: 0 },
                    { color: 'red', row: 0, col: 1 },
                    { color: 'blue',  row: 0, col: 2 }
                ]
            ]
        },
        Well: {
            icon: 'well_ic.png',
            // 2 squares - side by side or 1x2 shape with left = brown, right = gray
            basePatterns: [
                [
                    { color: 'brown', row: 0, col: 0 },
                    { color: 'gray', row: 0, col: 1 }
                ]
            ]
        },
        Theater: {
            icon: 'theater_ic.png',
            // upside down T-shape or 2x3 shape with top-left empty, top-middle = gray, 
            // top-right empty, bottom-left = brown, bottom-middle = blue, bottom-right = brown
            basePatterns: [
                [
                    { color: 'gray', row: 0, col: 1 },
                    { color: 'brown', row: 1, col: 0 },
                    { color: 'blue',  row: 1, col: 1 },
                    { color: 'brown',  row: 1, col: 2 }
                ]
            ]
        },
        Factory: {
            icon: 'factory_ic.png',
            // L-shape or 2x4 shape with top-left = brown, 1st top-middle empty,
            // 2nd top-middle empty, top-right empty, bottom-left = red, 
            // 1st bottom-middle = gray, 2nd bottom-middle = gray, bottom-right = red
            basePatterns: [
                [
                    { color: 'brown', row: 0, col: 0 },
                    { color: 'red', row: 1, col: 0 },
                    { color: 'gray', row: 1, col: 1 },
                    { color: 'gray',  row: 1, col: 2 },
                    { color: 'red',  row: 1, col: 3 }
                ]
            ]
        },
        Catedral: {
            icon: 'monu_ic.png',
            // Example: 2x2 shape with top-left empty, top-right = yellow, bottom-left = gray, bottom-right = blue
            basePatterns: [
                [
                    { color: 'yellow', row: 0, col: 1 },
                    { color: 'gray',    row: 1, col: 0 },
                    { color: 'blue',   row: 1, col: 1 }
                ]
            ]
        }
        // TODO: define basePatterns for Chapel, Tavern, etc.
    };

    // ===========================
    // Resource Selection Logic
    // ===========================
    resourceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle the resource card selection
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                selectedResource = null;
            } else {
                resourceCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedResource = card;
            }
        });
    });

    // ===========================
    // Building Card Selection Logic
    // ===========================
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedBuilding = card.getAttribute('data-building');
            checkManualPatternSelection(); // We'll attempt to validate pattern once building is picked
        });
    });

    // ===========================
    // Place Resources in Grid Cells (Only If Cell Is Not Occupied)
    // ===========================
    gridCells.forEach(cell => {
        cell.addEventListener('click', function() {
            if (selectedResource && !cell.classList.contains('locked') && !cell.classList.contains('occupied')) {
                // Place the resource
                cell.innerHTML = '';
                const resourceSquare = document.createElement('div');
                resourceSquare.classList.add('square');
                const colorClass = selectedResource.querySelector('.square').classList[1];
                resourceSquare.classList.add(colorClass);
                cell.appendChild(resourceSquare);

                // Mark cell as occupied to prevent overwriting
                cell.classList.add('occupied');

                makeSquareSelectable(resourceSquare);
                refreshSingleCard(selectedResource);
                //refreshMarket();

                // Deselect the resource card
                selectedResource.classList.remove('selected');
                selectedResource = null;
            }
        });
    });

    // ===========================
    // Allows squares to be selected/deselected for pattern matching
    // ===========================
    function makeSquareSelectable(square) {
        if (square.hasClickListener) return;
        square.addEventListener('click', function(e) {
            e.stopPropagation();
            if (square.classList.contains('selected')) {
                square.classList.remove('selected');
                selectedSquares = selectedSquares.filter(s => s !== square);
            } else {
                // Arbitrary limit, adjust if needed
                if (selectedSquares.length < 5) {
                    square.classList.add('selected');
                    selectedSquares.push(square);
                }
            }
        });
        square.hasClickListener = true;
    }

    // ===========================
    // Attempt pattern matching after user picks squares & building
    // ===========================
    function checkManualPatternSelection() {
        // 1) Must have building chosen
        if (!selectedBuilding || !buildings[selectedBuilding]) {
            return; // no building chosen or invalid
        }
        // 2) If no squares are selected, do nothing
        if (selectedSquares.length === 0) {
            return;
        }

        // Build an array of { color, row, col } from selectedSquares
        const squaresInfo = selectedSquares.map(sq => {
            const color = Array.from(sq.classList).find(cls =>
                ['red','brown','blue','yellow','gray'].includes(cls)
            );
            const cell = sq.closest('.cell');
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            return { color, row, col };
        });

        // 3) Check connectivity
        if (!isConnected(squaresInfo)) {
            alert("Selected squares are not adjacent. Try again!");
            clearSelectedSquares();
            return;
        }

        // 4) We'll compare squaresInfo to building's base patterns (including rotations/flips if you want)
        const basePatterns = buildings[selectedBuilding].basePatterns; 
        const foundMatch = basePatterns.some(base => matchPlayerSelection(squaresInfo, base));

        if (foundMatch) {
        
            // Freeze the squares array
            const finalPatternSquares = [...selectedSquares];
        
            enableBuildingPlacement(finalPatternSquares, selectedBuilding);
        } else {
            alert(`Invalid ${selectedBuilding} pattern.`);
            clearSelectedSquares();
        }
    }

    // ===========================
    // BFS or DFS check for adjacency
    // ===========================
    function isConnected(squaresInfo) {
        if (squaresInfo.length === 0) return false;
        const visited = new Set();
        const queue = [ squaresInfo[0] ];
        visited.add(keyOf(squaresInfo[0]));

        while (queue.length) {
            const current = queue.pop();
            // 4-directional neighbors
            const neighbors = [
                { row: current.row+1, col: current.col },
                { row: current.row-1, col: current.col },
                { row: current.row, col: current.col+1 },
                { row: current.row, col: current.col-1 }
            ];
            for (const n of neighbors) {
                // If squaresInfo includes that neighbor, let's mark visited
                const match = squaresInfo.find(s => s.row === n.row && s.col === n.col);
                if (match) {
                    const k = keyOf(match);
                    if (!visited.has(k)) {
                        visited.add(k);
                        queue.push(match);
                    }
                }
            }
        }
        return visited.size === squaresInfo.length;
    }

    function keyOf(obj) {
        return `${obj.row},${obj.col}`;
    }

    // ===========================
    // Compare player selection to a base pattern
    // (with optional rotation/flip logic if you want)
    // ===========================
    function matchPlayerSelection(playerSquaresInfo, basePattern) {
        // same # squares?
        if (playerSquaresInfo.length !== basePattern.length) return false;

        // generate all transformations
        const transformations = generateAllTransformations(basePattern);

        // normalize player squares
        const normPlayer = normalizePattern(playerSquaresInfo);

        // if any transformation matches normPlayer, we have a match
        return transformations.some(tf => arraysMatchPositions(normPlayer, tf));
    }

    // ===========================
    // Generate all 8 transformations (original, rotate 90/180/270, flip, flip+rotate 90/180/270)
    // ===========================
    function generateAllTransformations(base) {
        const results = [];

        // Normalize the base first
        const original = normalizePattern(base);
        results.push(original);

        // Rotate up to 3 times
        let r1 = normalizePattern(rotate90(original));
        results.push(r1);

        let r2 = normalizePattern(rotate90(r1));
        results.push(r2);

        let r3 = normalizePattern(rotate90(r2));
        results.push(r3);

        // Flip horizontally
        let flipped = normalizePattern(flipHorizontal(original));
        results.push(flipped);

        // Rotate the flipped 3 times
        let fr1 = normalizePattern(rotate90(flipped));
        results.push(fr1);

        let fr2 = normalizePattern(rotate90(fr1));
        results.push(fr2);

        let fr3 = normalizePattern(rotate90(fr2));
        results.push(fr3);

        return results;
    }

    function rotate90(pattern) {
        // row => col, col => -row
        return pattern.map(({ color, row, col }) => ({
            color,
            row: col,
            col: -row
        }));
    }

    function flipHorizontal(pattern) {
        // row stays same, col => -col
        return pattern.map(({ color, row, col }) => ({
            color,
            row,
            col: -col
        }));
    }

    // ===========================
    // Normalize so top-left = (0,0)
    // ===========================
    function normalizePattern(pattern) {
        const minRow = Math.min(...pattern.map(p => p.row));
        const minCol = Math.min(...pattern.map(p => p.col));

        const shifted = pattern.map(p => ({
            color: p.color,
            row: p.row - minRow,
            col: p.col - minCol
        }));
        // sort for stable comparison
        shifted.sort((a,b) => (a.row === b.row ? a.col - b.col : a.row - b.row));
        return shifted;
    }

    // ===========================
    // Compare two normalized arrays of {color, row, col}
    // ===========================
    function arraysMatchPositions(a, b) {
        if (a.length !== b.length) return false;
        for (let i=0; i<a.length; i++) {
            if (a[i].color !== b[i].color) return false;
            if (a[i].row !== b[i].row) return false;
            if (a[i].col !== b[i].col) return false;
        }
        return true;
    }

    // ===========================
    // BFS or DFS if you want to generate rotations/flips
    // (Optional if you need rotated shapes)
    // ===========================
    // function rotate90(...) {}
    // function flipHorizontal(...) {}
    // etc.

    // ===========================
    // If valid pattern found, let user place building
    // ===========================
    function enableBuildingPlacement(patternSquares, buildingName) {
        patternSquares.forEach(square => {
            square.addEventListener('click', function placeBuilding() {
                const cell = square.closest('.cell');
                cell.dataset.building = buildingName;
                placeBuildingIcon(cell, buildingName);
                cell.classList.add('locked');
    
                // Clear all pattern squares except the chosen one
                patternSquares.forEach(sq => {
                    if (sq !== square) {
                        clearCell(sq.closest('.cell'));
                    }
                });
    
                clearSelectedSquares();   // Clear the global `selectedSquares`, ignoring any new random squares
                deselectAllCards();
                rebindGridCellListeners();
            }, { once: true });
        });
    }

    function placeBuildingIcon(cell, buildingName) {
        cell.innerHTML = '';
        const icon = document.createElement('img');
        icon.src = `images/${buildings[buildingName].icon}`;
        icon.classList.add(`${buildingName.toLowerCase()}-grid-icon`);
        cell.appendChild(icon);
    }

    // Clears cell content & frees it
    function clearCell(cell) {
        cell.innerHTML = '';
        cell.classList.remove('occupied');
    }

    function clearSelectedSquares() {
        selectedSquares.forEach(sq => sq.classList.remove('selected'));
        selectedSquares = [];
        selectedBuilding = null;
    }

    function deselectAllCards() {
        document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
    }

    // BFS or DFS rebind
    function rebindGridCellListeners() {
        document.querySelectorAll('.board .cell .square').forEach(makeSquareSelectable);
    }

    // Compare color arrays for your simpler patterns
    function arraysMatch(a, b) {
        return a.length === b.length && a.every((val, idx) => val === b[idx]);
    }

    function getPermutations(arr) {
        if (arr.length <= 1) return [arr];
        const result = [];
        arr.forEach((color, idx) => {
            const rest = [...arr.slice(0, idx), ...arr.slice(idx+1)];
            const perms = getPermutations(rest);
            perms.forEach(p => result.push([color, ...p]));
        });
        return result;
    }
    // Don't really use this anymore
    function refreshMarket() {
        const allColors = ['yellow', 'red', 'blue', 'brown', 'gray'];
        document.querySelectorAll('.resource-card').forEach(card => {
            const color = allColors[Math.floor(Math.random() * allColors.length)];
            const resourceName = colorToResource[color];
            const header = card.querySelector('.resource-card-header');
            header.textContent = resourceName;
            const square = card.querySelector('.square');
            square.className = `square ${color}`;
        });
    }
     // Refresh only the single resource card that was used
     function refreshSingleCard(card) {
        const allColors = ['yellow','red','blue','brown','gray'];
        const color = allColors[Math.floor(Math.random() * allColors.length)];
        const resourceName = colorToResource[color];

        const header = card.querySelector('.resource-card-header');
        header.textContent = resourceName;

        const square = card.querySelector('.square');
        square.className = `square ${color}`;
    }

    rebindGridCellListeners();


    document.getElementById("finishGame").addEventListener("click", function() {
        let boardArray = [];
        const colorMap = {
          "yellow": "Y",
          "red": "R",
          "blue": "B",
          "brown": "N",  // "N" for browN
          "gray": "G"    // "S" for Stone or Silver
        };
        const buildingMap = {
          "Cottage": "C",
          "Farm": "F",
          "Chapel": "H",
          "Tavern": "T",
          "Well": "W",
          "Theater": "E",
          "Factory": "X",
          "Catedral": "D"  // or "Cathedral" → "D"
        };
    
        document.querySelectorAll(".cell").forEach(cell => {
            // 1) Check if building is set in data attribute
            if (cell.dataset.building) {
                let bName = cell.dataset.building;
                boardArray.push(buildingMap[bName] || "?");
            } else {
                // 2) No building, maybe there's a resource square
                let resourceSquare = cell.querySelector(".square");
                if (resourceSquare) {
                    // read its color class
                    let colorClass = [...resourceSquare.classList].find(c => colorMap[c]);
                    if (colorClass) {
                        boardArray.push(colorMap[colorClass]);
                    } else {
                        boardArray.push("-");
                    }
                } else {
                    // 3) No resource either → empty
                    boardArray.push("-");
                }
            }
        });
    
        // Turn array of 16 characters into a single string
        let boardState = boardArray.join("");
    
        let score = calculateScore();
        fetch("finish_game.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ board: boardState, score: score })
        })
        .then(response => response.text())
        .then(data => {
            // If finish_game.php returned "FINISHED GAME":
            if (data === "FINISHED GAME") {
                // Redirect the browser to login.html
                //window.location.href = "login.html";
            } else {
                // Otherwise, show whatever error the server returned
                alert(data);
            }
        })
        .catch(err => alert("Error: " + err));
        
    });
    

    function calculateScore() {
        // Temporary scoring logic
        return Math.floor(Math.random() * 100);
    }
    
});


