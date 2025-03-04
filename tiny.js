document.addEventListener('DOMContentLoaded', function() {
    const resourceCards = document.querySelectorAll('.resource-card');
    const gridCells = document.querySelectorAll('.cell.selectable');

    let selectedResource = null;
    let matchedPatternCoords = null;  // Store the coordinates of the matched Cottage pattern


    // List of all possible resources
    const resources = [
        { name: "Wheat", color: "yellow" },
        { name: "Brick", color: "red" },
        { name: "Glass", color: "blue" },
        { name: "Wood", color: "brown" },
        { name: "Stone", color: "gray" }
    ];

    // ===========================
    // Resource selection logic
    // ===========================
    resourceCards.forEach(card => {
        card.addEventListener('click', function() {
            if (selectedResource && selectedResource !== card) {
                selectedResource.classList.remove('selected');
            }

            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                selectedResource = null;
            } else {
                card.classList.add('selected');
                selectedResource = card;
            }
        });
    });

    // ===========================
    // Place resource into grid cell
    // ===========================
    gridCells.forEach(cell => {
        cell.addEventListener('click', function() {
            if (selectedResource) {
                cell.innerHTML = '';

                const resourceSquare = document.createElement('div');
                resourceSquare.classList.add('square');

                const square = selectedResource.querySelector('.square');
                if (square) {
                    const colorClass = Array.from(square.classList).find(cls => 
                        ['red', 'brown', 'blue', 'yellow', 'white', 'gray'].includes(cls)
                    );
                    if (colorClass) {
                        resourceSquare.classList.add(colorClass);
                    }
                }

                cell.appendChild(resourceSquare);
                makeSquareSelectable(resourceSquare);

                // ✅ Refresh the market after placement
                refreshMarket();

                // Check for Cottage pattern after placing a resource
                const cottageFound = checkForCottagePattern();

                // Deselect market resource if no cottage was found
                if (selectedResource) {
                    selectedResource.classList.remove('selected');
                    selectedResource = null;
                }

                // If Cottage pattern found, enable Cottage placement process
                if (cottageFound) {
                    enableCottagePlacement();
                }
            }
        });
    });

    // ===========================
    // Make placed squares selectable/deselectable
    // ===========================
    function makeSquareSelectable(square) {
        square.addEventListener('click', function(event) {
            event.stopPropagation();
            square.classList.toggle('selected');
        });
    }

    function enableGridResourceSelection() {
        const allPlacedSquares = document.querySelectorAll('.board .cell .square');
        allPlacedSquares.forEach(makeSquareSelectable);
    }

    enableGridResourceSelection();  // Run on initial load in case squares exist

    // ===========================
    // Pattern detection logic
    // ===========================
    function checkForCottagePattern() {
        const grid = [];
        const gridCells = document.querySelectorAll('.board .cell');

        for (let i = 0; i < gridCells.length; i++) {
            const square = gridCells[i].querySelector('.square');
            if (square) {
                const colorClass = Array.from(square.classList).find(cls =>
                    ['red', 'brown', 'blue', 'yellow', 'white', 'gray'].includes(cls)
                );
                grid.push(colorClass || 'empty');
            } else {
                grid.push('empty');
            }
        }

        const cottagePatterns = [
            ['empty', 'yellow', 'red', 'blue'], // Original
            ['red', 'empty', 'blue', 'yellow'],  // Rotated -90
            ['blue', 'red', 'yellow', 'empty'],  // Rotated -180
            ['yellow', 'blue', 'empty', 'red'],  // Rotated -270
            ['yellow', 'empty', 'blue', 'red'],  // Horizontal flip
            ['red', 'blue', 'empty', 'yellow']   // Vertical flip
        ];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (checkCottageAt(row, col, grid, cottagePatterns)) {
                    selectCottageCard();
                    return true;
                }
            }
        }
        return false;
    }

    function checkCottageAt(row, col, grid, patterns) {
        const size = 4;
        const section = [
            grid[row * size + col],
            grid[row * size + col + 1],
            grid[(row + 1) * size + col],
            grid[(row + 1) * size + col + 1]
        ];

        const match = patterns.find(pattern => arraysMatch(section, pattern));

        if (match) {
            matchedPatternCoords = [
                [row, col],
                [row, col + 1],
                [row + 1, col],
                [row + 1, col + 1]
            ];
            return true;
        }

        return false;
    }

    function rebindGridCellListeners() {
        const allGridCells = document.querySelectorAll('.board .cell');
    
        allGridCells.forEach(cell => {
            // Only rebind if cell is truly empty (no squares or buildings)
            if (!cell.querySelector('.square') && !cell.querySelector('.cottage-grid-icon')) {
                cell.addEventListener('click', function() {
                    if (selectedResource) {
                        cell.innerHTML = '';
    
                        const resourceSquare = document.createElement('div');
                        resourceSquare.classList.add('square');
        
                        const square = selectedResource.querySelector('.square');
                        if (square) {
                            const colorClass = Array.from(square.classList).find(cls =>
                                ['red', 'brown', 'blue', 'yellow', 'white', 'gray'].includes(cls)
                            );
                            if (colorClass) {
                                resourceSquare.classList.add(colorClass);
                            }
                        }
        
                        cell.appendChild(resourceSquare);
                        makeSquareSelectable(resourceSquare);
        
                        // Refresh the market after placement
                        refreshMarket();
        
                        const cottageFound = checkForCottagePattern();
        
                        if (selectedResource) {
                            selectedResource.classList.remove('selected');
                            selectedResource = null;
                        }
        
                        if (cottageFound) {
                            enableCottagePlacement();
                        }
                    }
                }, { once: true });  // Once is optional — up to you
            }
        });
    }
    
    

    // ===========================
    // Allow player to select a square to place Cottage icon
    // ===========================
    function enableCottagePlacement() {
        if (!matchedPatternCoords) return;
    
        // Add a click listener to each of the 4 cells in the Cottage pattern
        matchedPatternCoords.forEach(([row, col]) => {
            const cell = getCellAt(row, col);
            cell.classList.add('cottage-placement');
    
            // This function is the click handler for placing the Cottage
            function handleCottageClick() {
                placeCottageIcon(cell);  // Place the Cottage icon in the clicked cell
    
                // Remove all other squares in the pattern (resources)
                matchedPatternCoords.forEach(([r, c]) => {
                    if (r !== row || c !== col) {
                        clearCell(r, c); // Remove the resource square
                    }
                });
    
                // Clean up all click listeners from all 4 cells
                matchedPatternCoords.forEach(([r, c]) => {
                    const otherCell = getCellAt(r, c);
                    otherCell.classList.remove('cottage-placement');
                    otherCell.replaceWith(otherCell.cloneNode(true));  // Remove all listeners on remaining cells
                });
    
                // Clear matched coordinates to avoid re-triggering
                matchedPatternCoords = null;

                // Deselect all building cards after placing the Cottage icon
                document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));

                // ✅ Rebind listeners to make cleared cells usable again
                rebindGridCellListeners();
            }
    
            // Add the click listener (only fires once for the first click)
            cell.addEventListener('click', handleCottageClick, { once: true });
        });
    }
    

    function placeCottageIcon(cell) {
        cell.innerHTML = '';  // Clear the cell
        const icon = document.createElement('img');
        icon.src = '/Users/joelgammah/Desktop/Tiny Towns/icons/cottage_ic.png';  // Adjust path
        icon.classList.add('cottage-grid-icon');
        cell.appendChild(icon);
    }

    function clearCell(row, col) {
        getCellAt(row, col).innerHTML = '';  // Empty the cell
    }

    function getCellAt(row, col) {
        const size = 4;
        const index = row * size + col;
        return document.querySelectorAll('.board .cell')[index];
    }

    // ===========================
    // Utility to compare arrays
    // ===========================
    function arraysMatch(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }

    // ===========================
    // Automatically select the Cottage card
    // ===========================
    function selectCottageCard() {
        const allCards = document.querySelectorAll('.card');

        let cottageCard = null;

        allCards.forEach(card => {
            const header = card.querySelector('.card-header');
            if (header && header.textContent.includes('Cottage')) {
                cottageCard = card;
            }
        });

        if (cottageCard) {
            allCards.forEach(card => card.classList.remove('selected'));
            cottageCard.classList.add('selected');
        }
    }

    // ===========================
    // Refresh market with 3 random resources
    // ===========================
    function refreshMarket() {
        const resourceCards = document.querySelectorAll('.resource-card');

        // Shuffle resources and select the first 3
        const shuffled = resources.sort(() => 0.5 - Math.random());
        const selectedResources = shuffled.slice(0, 3);

        resourceCards.forEach((card, index) => {
            const resource = selectedResources[index];

            // Update the card header (name)
            const header = card.querySelector('.resource-card-header');
            header.textContent = resource.name;

            // Update the square color
            const square = card.querySelector('.square');
            square.className = `square ${resource.color}`;  // Replace all classes with 'square' + new color
        });
    }
});
