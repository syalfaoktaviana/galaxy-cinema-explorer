const API_KEY = '59c0c373'; 

window.onload = () => {
    document.getElementById('searchInput').value = 'Avengers'; 
    searchMovies();
};

function handleKeyPress(event) {
    if (event.key === "Enter") {
        searchMovies();
    }
}

async function searchMovies() {
    const query = document.getElementById('searchInput').value;
    const type = document.getElementById('typeFilter').value;
    const container = document.getElementById('movieResults');
    if (!query) return;

    container.innerHTML = '<div class="text-center w-100"><div class="spinner-border text-primary"></div></div>';

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&type=${type}`);
        const data = await response.json();
        if (data.Response === "True") {
            displayResults(data.Search);
        } else {
            container.innerHTML = `<p class="text-center text-danger">${data.Error}</p>`;
        }
    } catch (error) {
        container.innerHTML = `<p class="text-center text-danger">Koneksi terputus.</p>`;
    }
}

function displayResults(movies) {
    const container = document.getElementById('movieResults');
    container.innerHTML = '';

    movies.forEach(movie => {
        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/350x500?text=No+Poster";
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="card h-100 text-white shadow">
                    <img src="${poster}" class="card-img-top poster-img" alt="${movie.Title}">
                    <div class="card-body d-flex flex-column text-center">
                        <h6 class="fw-bold mb-1 text-truncate">${movie.Title}</h6>
                        <p class="small text-secondary mb-3">${movie.Year}</p>
                        <button class="btn btn-sm btn-detail mt-auto" 
                                onclick="showDetail('${movie.imdbID}')" 
                                data-bs-toggle="modal" 
                                data-bs-target="#movieDetailModal">
                            Lihat Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

async function showDetail(id) {
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    modalBody.innerHTML = 'Memuat data...';

    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
    const movie = await response.json();

    modalTitle.innerText = movie.Title;
    // Ganti bagian modalBody.innerHTML di script.js kamu menjadi seperti ini:
    modalBody.innerHTML = `
    <div class="row align-items-center">
        <div class="col-md-5 mb-3 text-center">
            <img src="${movie.Poster}" class="img-fluid rounded-img shadow-lg">
        </div>
        <div class="col-md-7">
            <p class="mb-3"><span class="badge-galaxy">${movie.Genre}</span></p>
            <p class="text-warning fw-bold">⭐ ${movie.imdbRating} / 10</p>
            <p class="small"><strong>Aktor:</strong> ${movie.Actors}</p>
            <p class="small"><strong>Rilis:</strong> ${movie.Released}</p>
            <hr style="border-color: rgba(255,255,255,0.1)">
            <p style="font-size: 0.9rem; line-height: 1.6; color: #ccc;">${movie.Plot}</p>
        </div>
    </div>
    `;
}