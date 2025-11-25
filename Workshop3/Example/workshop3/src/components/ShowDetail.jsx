import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ShowDetail() {
  const { id } = useParams(); // Get the ID from URL (e.g., /show/123)
  const [show, setShow] = useState(null);

  useEffect(() => {
    fetch(`https://api.tvmaze.com/shows/${id}`)
      .then(res => res.json())
      .then(data => setShow(data));
  }, [id]);

  if (!show) return <h2>Loading...</h2>;

  return (
    <div className="container detail-page">
      <Link to="/" className="back-btn">← Back</Link>
      <div className="detail-content">
        <img src={show.image?.original} alt={show.name} />
        <div>
          <h1>{show.name}</h1>
          <p dangerouslySetInnerHTML={{ __html: show.summary }}></p>
          <p><strong>Rating:</strong> {show.rating?.average}</p>
        </div>
      </div>
    </div>
  );
}
export default ShowDetail;