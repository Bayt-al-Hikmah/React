import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [shows, setShows] = useState([]);
  const searchInput = useRef(null); 

  const searchShows = async () => {
    const query = searchInput.current.value;
    if(!query) return;

    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const data = await response.json();
    setShows(data);
  };

  return (
    <div className="container">
      <h1>TV Show Search</h1>
      <div className="search-bar">
        <input ref={searchInput} type="text" placeholder="e.g. Breaking Bad" />
        <button onClick={searchShows}>Search</button>
      </div>

      <div className="grid">
        {shows.map((item) => (
          <div key={item.show.id} className="card">
            <img src={item.show.image?.medium} alt={item.show.name} />
            <h3>{item.show.name}</h3>
            <Link to={`/show/${item.show.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;