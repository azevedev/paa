# Algorithm Calculator

A simple, interactive web application to solve two classic algorithmic problems:

- **Matrix Chain Multiplication**: Find the minimum number of multiplications needed to multiply a chain of matrices.
- **Minimum Meeting Rooms (Interval Partitioning)**: Calculate the minimum number of rooms required to schedule all lectures without overlap.

## Features

- **Tabbed Interface**: Switch between Matrix Multiplication and Waiting Rooms calculators.
- **Dynamic Input**: Add or remove matrices/lectures as needed.
- **Instant Calculation**: Results are shown immediately after clicking "Calculate".
- **Modern UI**: Responsive and visually appealing design.

## Demo

Open `index.html` in your browser to use the app, or access the [demo link](https://azevedev.github.io/paa/)

## Usage

### Matrix Multiplication
1. Enter the dimensions (rows and columns) for each matrix in the chain.
2. Add more matrices as needed using "+ Add Matrix".
3. Click "Calculate" to see the minimum number of multiplications required.

### Waiting Rooms
1. Enter the start and end times for each lecture.
2. Add more lectures as needed using "+ Add Lecture".
3. Click "Calculate" to see the minimum number of rooms required.

## Project Structure

```
├── index.html      # Main HTML file
├── style.css       # Stylesheet for the app
├── script.js       # JavaScript logic for both calculators
└── README.md       # Project documentation
```

## How it Works

- **Matrix Chain Multiplication**: Uses dynamic programming to compute the minimum number of scalar multiplications needed to multiply a sequence of matrices.
- **Minimum Meeting Rooms**: Uses a greedy algorithm to determine the minimum number of rooms required for overlapping intervals.

## License

MIT License.

## Author

- [azevedev](https://github.com/azevedev)
