import React, { useState, useEffect } from 'react';
import './CVEList.css';
import CVEDetails from './CVEDetails'; 

const CVEList = () => {
  const [cves, setCves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [selectedCVE, setSelectedCVE] = useState(null); 

  useEffect(() => {
    const fetchCVEs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/get-cves?page=${currentPage}&limit=${perPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        console.log('Fetched data:', jsonData);
        setCves(jsonData.docs || []);
        setTotalPages(jsonData.totalPages || 0);
        setTotalDocs(jsonData.totalDocs || 0); 
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError('Failed to fetch CVEs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCVEs();
  }, [currentPage, perPage]);
  
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePerPageChange = (event) => {
    setPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleRowClick = (cve) => {
    setSelectedCVE(cve);
  };

  return (
    <div className="App">
      <h1>CVE List</h1>
      <h5 className='totalrec'>Total Records: {totalDocs}</h5>
      <div className="tableContainer">
        <table className="cveTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Source Identifier</th>
              <th>Published Date</th>
              <th>Last Modified Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cves.map((cve) => (
              <tr key={cve.id} onClick={() => handleRowClick(cve)}>
                <td>{cve.id}</td>
                <td>{cve.sourceIdentifier}</td>
                <td>{cve.published}</td>
                <td>{cve.lastModified}</td>
                <td>{cve.vulnStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      
      <div className="tableFooter">
        <div className="perPageContainer">
          <label>Results per page:</label>
          <select value={perPage} onChange={handlePerPageChange}>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        {cves.length > 0 && (
          <div className="paginationContainer">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>

      {selectedCVE && <CVEDetails cve={selectedCVE} />} 
    </div>
  );
};

export default CVEList;

