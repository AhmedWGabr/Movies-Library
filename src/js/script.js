const API_KEY = '88c00e80d532ec774c5bf022e4ad0620'; // Your API key
const BASE_URL = 'https://api.themoviedb.org/3'; // Base URL for the API
const IMG_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for movie posters

// Function to add event listener to search forms
function addSearchEventListener(formId, inputId) {
    document.getElementById(formId).addEventListener('submit', function (event) {
        event.preventDefault();
        const query = document.getElementById(inputId).value;
        searchMovies(query);
    });
}

// Add event listeners to both search forms
addSearchEventListener('search-form', 'query');
addSearchEventListener('search-form-sm', 'query-sm');

// Synchronize search input fields
function synchronizeSearchInputs(inputId1, inputId2) {
    const input1 = document.getElementById(inputId1);
    const input2 = document.getElementById(inputId2);

    input1.addEventListener('input', function () {
        input2.value = input1.value;
    });

    input2.addEventListener('input', function () {
        input1.value = input2.value;
    });
}

// Synchronize the search input fields
synchronizeSearchInputs('query', 'query-sm');

// This function fetches movies from the API based on the query string and displays them on the page.
function searchMovies(query) {
    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
        .then(response => response.json())
        .then(data => {
            displaySearchMovies(data.results);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// The displayMovies function takes an array of movie objects and displays them in a container element with the ID movies.
function displaySearchMovies(movies) {
    // This line retrieves the HTML element with the ID movies and stores it in the moviesContainer variable.
    const moviesContainer = document.getElementById('movies');
    // This line clears any existing content inside the moviesContainer.
    moviesContainer.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
}

// Toggle dropdown menu
document.getElementById('menu-button').addEventListener('click', function () {
    var menu = document.getElementById('dropdown-menu');
    menu.classList.toggle('hidden');
});

// Close dropdown menu when clicking outside
document.addEventListener('click', function (event) {
    var menu = document.getElementById('dropdown-menu');
    if (!event.target.closest('#menu-button') && !event.target.closest('#dropdown-menu')) {
        menu.classList.add('hidden');
    }
});

// Fetch and display featured movies on page load
document.addEventListener('DOMContentLoaded', () => {
    FeaturedMovies('box-office', '/movie/now_playing', 'box-office-list');
    FeaturedMovies('all-time', '/movie/top_rated', 'all-time-list');
    FeaturedMovies('popular', '/movie/popular', 'popular-list');
});

// Function to fetch featured movies from the API and display them on the page
function FeaturedMovies(section, endpoint, elementId) {
    fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const movies = data.results.slice(0, 10);
            const container = document.getElementById(elementId);
            container.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Function to create a movie card HTML element
function createMovieCard(movie) {
    return `
        <div class="bg-slate-300 rounded-lg shadow-md overflow-hidden">
            <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}" class="w-full h-64 object-cover">
            <div class="p-4">
                <h3 class="text-gray-600 text-lg font-semibold">${movie.title}</h3>
                <p class="text-gray-600">${movie.release_date}</p>
                <p class="text-gray-800">${movie.overview}</p>
            </div>
        </div>
    `;
}
