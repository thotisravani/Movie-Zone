import React, { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import './style.css';

const Movie = () => {
  // Handling user search
  const [search, setSearch] = useState('');
  // Storing the movie data
  const [data, setData] = useState([]);
  // Handling loading state
  const [loading, setLoading] = useState(false);
  // Storing details of the selected movie
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetching latest movies using useEffect
  useEffect(() => {
    if (search) {
      fetchLatest();
    }
  }, [search]); // Runs every time `search` changes

  // Function to fetch movie data from OMDB API
  const fetchLatest = async () => {
    setLoading(true);
    try {
      const fetchMovie = await fetch(`http://www.omdbapi.com/?s=${search}&apikey=ff74939`);
      const fetchData = await fetchMovie.json();
      if (fetchData.Search) {
        setData(fetchData.Search); // Set data from search result
      } else {
        setData([]); // Clear data if no search results
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  // Function to fetch movie details when clicked
  const fetchMovieDetails = async (imdbID) => {
    setLoading(true);
    try {
      const fetchMovieDetails = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=ff74939`);
      const movieDetails = await fetchMovieDetails.json();
      setSelectedMovie(movieDetails); // Store the movie details
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  return (
    <>
      <div className="header">
        <div className="login">
          <h1>Movie ZONE</h1>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={fetchLatest}>
            <IoMdSearch />
          </button>
        </div>
      </div>

      <div className="movie">
        <h3>A Zone for Movie lovers</h3>
        <div className="container">
          {loading ? (
            <p>Loading...</p> // Show loading text while fetching
          ) : (
            data.length === 0 ? (
              <p>No movies found</p> // Handle empty search results
            ) : (
              data.map((curElm, index) => (
                <div key={index} className="box" onClick={() => fetchMovieDetails(curElm.imdbID)}>
                  <div className="imgbox">
                    <img
                      src={curElm.Poster !== "N/A" ? curElm.Poster : "fallback-image-url.jpg"}
                      alt={curElm.Title}
                    />
                  </div>
                  <div className="detail">
                    <h3>{curElm.Title}</h3>
                    <h4>Release Date: {curElm.Year}</h4>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Display movie details in a modal or separate section */}
      {selectedMovie && (
        <div className="movie-details">
          <button className="close-btn" onClick={() => setSelectedMovie(null)}>X</button>
          <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
          <div className="movie-details-content">
            <img
              src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "fallback-image-url.jpg"}
              alt={selectedMovie.Title}
            />
            <div className="details-text">
              <h3>Plot:</h3>
              <p>{selectedMovie.Plot}</p>
              <h4>Director: {selectedMovie.Director}</h4>
              <h4>Actors: {selectedMovie.Actors}</h4>
              <h4>Rating: {selectedMovie.imdbRating}</h4>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Movie;
