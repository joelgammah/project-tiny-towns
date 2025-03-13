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


These are correct patterns and flattened versions.

2. Farm (4 squares - 2 x 2 square)
[
    ['yellow', 'yellow'],
    ['brown', 'brown']
]
Flattened: ['yellow', 'yellow', 'brown', 'brown']

3. Chapel (4 squares - reverse L shape)
[
    ['empty', 'empty', 'blue'],
    ['gray', 'blue', 'gray']
]

Flattened: ['blue', 'gray', 'blue', 'gray']

4. Tavern (3 squares - line shape)

['red', 'red', 'blue']

5. Well (2 squares - side by side)

['brown', 'gray']


6. Theater (4 squares - upside down T shape)
[
    ['empty', 'gray', 'empty'],
    ['brown', 'blue', 'brown']
]
Flattened: ['gray','brown', 'blue', 'brown']

7. Factory (5 squares - L shape)
[
    ['brown','empty', 'empty', 'empty'],
    ['red','gray', 'gray', 'red']
]

Flattened: ['brown', 'red',' gray', 'gray', 'red']

8. Catedral (3 squares - reverse L shape)
[
    ['empty', 'yellow'],
    ['gray', 'blue']
]

Flattened: ['yellow', 'gray', 'blue']

