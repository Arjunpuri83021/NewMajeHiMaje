import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import Footer from "./Footer";
const apiUrl = process.env.REACT_APP_API_URL;

function Home() {
  const [postdata, setPostData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    fetch(`${apiUrl}/getpostdata`, {
      mode: 'cors',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        // Reverse the order of the posts
        const reversedData = data.reverse();
        setPostData(reversedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0); // Scroll to top when page changes
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0); // Scroll to top when page changes
    }
  };

  const filteredPosts = postdata.filter((item) => {
    const videoNoMatch = item.videoNo.toString().includes(searchTerm);
    const titelMatch = item.titel && item.titel.toLowerCase().includes(searchTerm.toLowerCase());
    return videoNoMatch || titelMatch;
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  const renderPageNumbers = () => {
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`page-button ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      } else if (i === 2 && currentPage > 3) {
        pageNumbers.push(<span key="ellipsis1">...</span>);
      } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
        pageNumbers.push(<span key="ellipsis2">...</span>);
      }
    }
    return pageNumbers;
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className="all-cards">
        <div className="row row-cols-2 row-cols-md-5 g-4">
          {currentPosts.map((items) => (
            <Link to={items.link} key={items._id}>
              <div className="col">
                <div className="card">
                  <img src={items.imageUrl} className="card-img-top" alt="..." />
                  <p className="p-0 m-0 text-light">{items.titel}</p>
                  <div className="card-body">
                    <h5 className="card-title">Video No: {items.videoNo}</h5>
                    <span><i className="bi bi-eye-fill"></i> {items.views}k</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={handlePreviousPage} className="nav-button">Previous</button>
        )}
        {renderPageNumbers()}
        {currentPage < totalPages && (
          <button onClick={handleNextPage} className="nav-button">Next</button>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Home;
