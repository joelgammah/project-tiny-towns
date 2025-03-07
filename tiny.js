document.addEventListener('DOMContentLoaded', function() {
    const resourceCards = document.querySelectorAll('.resource-card');
    const gridCells = document.querySelectorAll('.cell.selectable');

    let selectedResource = null;
    let selectedSquares = [];
    let selectedBuilding = null;

    const colorToResource = {
        yellow: 'Wheat',
        red: 'Brick',
        blue: 'Glass',
        brown: 'Wood',
        gray: 'Stone'
    };
    

    // ===========================
    // Buildings Configuration (Patterns and Icons)
    // ===========================
    const buildings = {
        Cottage: {
            icon: 'cottage_ic.png',
            patterns: [
                ['yellow', 'red', 'blue'],
                ['red', 'blue', 'yellow'],
                ['blue', 'yellow', 'red'],
                ['yellow', 'blue', 'red'],
                ['yellow', 'red', 'blue'],
                ['blue', 'red', 'yellow']
            ]
        },
        Farm: { icon: 'farm_ic.png', patterns: [['yellow', 'yellow', 'brown', 'brown']] },
        Chapel: { icon: 'chapel_ic.png', patterns: [['blue', 'gray', 'blue', 'gray']] },
        Tavern: { icon: 'tavern_ic.png', patterns: [['red', 'red', 'blue']] },
        Well: { icon: 'well_ic.png', patterns: [['brown', 'gray']] },
        Theater: { icon: 'theater_ic.png', patterns: [['gray', 'brown', 'blue', 'brown']] },
        Factory: { icon: 'factory_ic.png', patterns: [['brown', 'red', 'gray', 'gray', 'red']] },
        Catedral: { icon: 'monu_ic.png', patterns: [['yellow', 'gray', 'blue']] }
    };

    // ===========================
    // Resource Selection Logic
    // ===========================
    resourceCards.forEach(card => {
        card.addEventListener('click', function() {
            resourceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedResource = card;
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
            checkManualPatternSelection();
        });
    });

    // ===========================
    // Place Resources in Grid Cells
    // ===========================
    gridCells.forEach(cell => {
        cell.addEventListener('click', function() {
            if (selectedResource && !cell.classList.contains('locked')) {
                cell.innerHTML = '';
                const resourceSquare = document.createElement('div');
                resourceSquare.classList.add('square');
                const colorClass = selectedResource.querySelector('.square').classList[1];
                resourceSquare.classList.add(colorClass);
                cell.appendChild(resourceSquare);
                makeSquareSelectable(resourceSquare);

                refreshMarket();

                selectedResource.classList.remove('selected');
                selectedResource = null;
            }
        });
    });

    // ===========================
    // Select/Deselect Squares for Pattern Matching
    // ===========================
    function makeSquareSelectable(square) {
        if (square.hasClickListener) return;

        square.addEventListener('click', function(event) {
            event.stopPropagation();
            if (square.classList.contains('selected')) {
                square.classList.remove('selected');
                selectedSquares = selectedSquares.filter(s => s !== square);
            } else if (selectedSquares.length < 5) {
                square.classList.add('selected');
                selectedSquares.push(square);
            }
        });

        square.hasClickListener = true;  // Prevents double-binding
    }

    // ===========================
    // Check Selected Squares Against Building Patterns
    // ===========================
    function checkManualPatternSelection() {
        if (!selectedBuilding || !buildings[selectedBuilding]) {
            alert("Please select a building card.");
            return;
        }

        const colors = selectedSquares.map(square => 
            Array.from(square.classList).find(cls => 
                ['red', 'brown', 'blue', 'yellow', 'gray'].includes(cls)
            )
        );

        const permutations = getPermutations(colors);
        const validPatterns = buildings[selectedBuilding].patterns;

        const isValid = permutations.some(perm => 
            validPatterns.some(pattern => arraysMatch(perm, pattern))
        );

        if (isValid) {
            alert(`Valid ${selectedBuilding} pattern found! Click a square to place it.`);
            enableBuildingPlacement(selectedSquares, selectedBuilding);
        } else {
            alert(`Invalid ${selectedBuilding} pattern.`);
            clearSelectedSquares();
        }
    }

    // ===========================
    // Place Building Icon and Lock Cell
    // ===========================
    function enableBuildingPlacement(squares, buildingName) {
        squares.forEach(square => {
            square.addEventListener('click', function placeBuilding() {
                const cell = square.closest('.cell');
                placeBuildingIcon(cell, buildingName);
                cell.classList.add('locked');

                squares.forEach(sq => {
                    if (sq !== square) {
                        clearCell(sq.closest('.cell'));
                    }
                });

                clearSelectedSquares();
                deselectAllCards();
                rebindGridCellListeners();
            }, { once: true });
        });
    }

    // ===========================
    // Place Building Icon in Cell
    // ===========================
    function placeBuildingIcon(cell, buildingName) {
        cell.innerHTML = '';
        const icon = document.createElement('img');
        icon.src = `/Users/joelgammah/Desktop/Tiny Towns/icons/${buildings[buildingName].icon}`;
        icon.classList.add(`${buildingName.toLowerCase()}-grid-icon`);
        cell.appendChild(icon);
    }

    // ===========================
    // Clear Cell (For Building Placement)
    // ===========================
    function clearCell(cell) {
        cell.innerHTML = '';
    }

    // ===========================
    // Clear Selected Squares (After Building Placement or Invalid Pattern)
    // ===========================
    function clearSelectedSquares() {
        selectedSquares.forEach(square => square.classList.remove('selected'));
        selectedSquares = [];
        selectedBuilding = null;
    }

    // ===========================
    // Deselect All Building Cards
    // ===========================
    function deselectAllCards() {
        document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
    }

    // ===========================
    // Compare Two Arrays
    // ===========================
    function arraysMatch(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }

    // ===========================
    // Generate All Permutations
    // ===========================
    function getPermutations(arr) {
        if (arr.length <= 1) return [arr];
        const result = [];
        arr.forEach((color, index) => {
            const rest = arr.slice(0, index).concat(arr.slice(index + 1));
            const restPerms = getPermutations(rest);
            restPerms.forEach(perm => result.push([color].concat(perm)));
        });
        return result;
    }

    // ===========================
    // Refresh Market (Replace All Resource Cards)
    // ===========================
    function refreshMarket() {
        const allColors = ['yellow', 'red', 'blue', 'brown', 'gray'];
    
        document.querySelectorAll('.resource-card').forEach(card => {
            const color = allColors[Math.floor(Math.random() * allColors.length)];
            const resourceName = colorToResource[color];  // Use mapping to get proper name
    
            const header = card.querySelector('.resource-card-header');
            header.textContent = resourceName;  // Show the actual resource name (like Wheat)
    
            const square = card.querySelector('.square');
            square.className = `square ${color}`;  // Still use color for the square
        });
    }
    

    // ===========================
    // Rebind Listeners for All Existing Squares
    // ===========================
    function rebindGridCellListeners() {
        document.querySelectorAll('.board .cell .square').forEach(makeSquareSelectable);
    }

    // ===========================
    // Initialize Listeners
    // ===========================
    rebindGridCellListeners();
});
