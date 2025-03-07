document.addEventListener('DOMContentLoaded', function() {
    const resourceCards = document.querySelectorAll('.resource-card');
    const gridCells = document.querySelectorAll('.cell.selectable');

    let selectedResource = null;
    let selectedSquares = [];  // Tracks the 3 manually selected squares for Cottage check
    let selectedBuilding = null;  // Tracks which building card (like Cottage) the player selected

    // ===========================
    // List of all possible resources
    // ===========================
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
    // Building card selection logic
    // Only allows one building to be selected at a time (like Cottage)
    // ===========================
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedBuilding = this.classList.contains('cottage-card') ? 'Cottage' : null;
        });
    });

    // ===========================
    // Place resource into grid cell (skip locked cells)
    // ===========================
    gridCells.forEach(cell => {
        cell.addEventListener('click', function() {
            if (selectedResource && !cell.classList.contains('locked')) {
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

                refreshMarket();

                selectedResource.classList.remove('selected');
                selectedResource = null;
            }
        });
    });

    // ===========================
    // Make placed squares selectable/deselectable
    // Enables manual 3-square selection for Cottage pattern
    // ===========================
    function makeSquareSelectable(square) {
        square.addEventListener('click', function(event) {
            event.stopPropagation();

            if (square.classList.contains('selected')) {
                square.classList.remove('selected');
                selectedSquares = selectedSquares.filter(sq => sq !== square);
            } else {
                if (selectedSquares.length < 3) {
                    square.classList.add('selected');
                    selectedSquares.push(square);

                    if (selectedSquares.length === 3) {
                        checkManualCottagePatternSelection();
                    }
                }
            }
        });
    }

    // ===========================
    // Check if manually selected squares match any valid Cottage pattern
    // Checks all rotations and flips (order-independent)
    // ===========================
    function checkManualCottagePatternSelection() {
        const colors = selectedSquares.map(square => {
            return Array.from(square.classList).find(cls =>
                ['red', 'brown', 'blue', 'yellow', 'white', 'gray'].includes(cls)
            );
        });

        const allPermutations = getPermutations(colors);

        const isValid = allPermutations.some(permutation =>
            cottagePatterns.some(pattern => arraysMatch(permutation, pattern))
        );

        if (isValid) {
            alert("You found a valid Cottage pattern! Now select the Cottage building card to place it.");
            enableCottagePlacement(selectedSquares);
        } else {
            alert("This is not a valid Cottage pattern!");
        }

        selectedSquares.forEach(square => square.classList.remove('selected'));
        selectedSquares = [];
    }

    // ===========================
    // Generate all permutations of 3 selected squares (order-independent matching)
    // ===========================
    function getPermutations(arr) {
        if (arr.length <= 1) return [arr];
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const rest = getPermutations(arr.slice(0, i).concat(arr.slice(i + 1)));
            for (const perm of rest) {
                result.push([arr[i]].concat(perm));
            }
        }
        return result;
    }

    // ===========================
    // Cottage pattern array (3 squares - no empty)
    // Supports all rotations and flips
    // ===========================
    const cottagePatterns = [
        ['yellow', 'red', 'blue'],
        ['red', 'blue', 'yellow'],
        ['blue', 'yellow', 'red'],
        ['yellow', 'blue', 'red'],
        ['yellow', 'red', 'blue'],
        ['blue', 'red', 'yellow']
    ];

    // ===========================
    // Place Cottage icon and lock the cell
    // Cleared cells are available for future resources
    // Cottage card is deselected after placement
    // ===========================
    function enableCottagePlacement(squares) {
        squares.forEach(square => {
            square.addEventListener('click', function handleClick() {
                if (selectedBuilding !== 'Cottage') {
                    alert("You must select the Cottage building card before placing the Cottage.");
                    return;
                }

                const cell = square.closest('.cell');
                placeCottageIcon(cell);

                cell.classList.add('locked');

                squares.forEach(sq => {
                    if (sq !== square) {
                        clearCell(sq.closest('.cell'));
                    }
                });

                squares.forEach(sq => {
                    const newCell = sq.closest('.cell').cloneNode(true);
                    sq.closest('.cell').replaceWith(newCell);
                });

                deselectAllCards();
                selectedSquares = [];
                selectedBuilding = null;

                rebindGridCellListeners();
            }, { once: true });
        });
    }

    // ===========================
    // Place Cottage icon into the cell
    // ===========================
    function placeCottageIcon(cell) {
        cell.innerHTML = '';
        const icon = document.createElement('img');
        icon.src = '/Users/joelgammah/Desktop/Tiny Towns/icons/cottage_ic.png';
        icon.classList.add('cottage-grid-icon');
        cell.appendChild(icon);
    }

    // ===========================
    // Clear the content of a cell
    // ===========================
    function clearCell(cell) {
        cell.innerHTML = '';
    }

    // ===========================
    // Compare two arrays for equality
    // ===========================
    function arraysMatch(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }

    // ===========================
    // Deselect all building cards
    // ===========================
    function deselectAllCards() {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
    }

    // ===========================
    // Rebind listeners to all placed squares (after Cottage placement)
    // ===========================
    function rebindGridCellListeners() {
        const allPlacedSquares = document.querySelectorAll('.board .cell .square');
        allPlacedSquares.forEach(makeSquareSelectable);
    }

    enableGridResourceSelection();

    // ===========================
    // Refresh the market with 3 random resources
    // ===========================
    function refreshMarket() {
        const resourceCards = document.querySelectorAll('.resource-card');
        const shuffled = resources.sort(() => 0.5 - Math.random());
        const selectedResources = shuffled.slice(0, 3);

        resourceCards.forEach((card, index) => {
            const resource = selectedResources[index];
            const header = card.querySelector('.resource-card-header');
            header.textContent = resource.name;

            const square = card.querySelector('.square');
            square.className = `square ${resource.color}`;
        });
    }
});
