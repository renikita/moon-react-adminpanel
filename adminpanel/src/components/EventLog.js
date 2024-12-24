import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./EventLog.css";

const GET_ALL_EVENTLOGS_URL = 'http://localhost:8080/eventlog/all';

export default function EventLog() {
  const [eventLogs, setEventLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(15);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(GET_ALL_EVENTLOGS_URL, { withCredentials: true })
      .then(response => {
        const logs = Array.isArray(response.data) ? response.data : [];
        setEventLogs(logs);
      })
      .catch(error => {
        console.error("There was an error fetching the event logs!", error);
      });
  }, []);

 
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = eventLogs.slice(indexOfFirstLog, indexOfLastLog);


  const paginate = pageNumber => setCurrentPage(pageNumber);

  
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatDetails = (details) => {
    try {
      const json = JSON.parse(details);
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return details;
    }
  };


  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

 
  const filteredLogs = eventLogs.filter(
    (log) =>
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase())
  );


  const currentFilteredLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);


  const getActionBadge = (action) => {
    switch (action) {
      case 'update user response':
        return <span className="badge bg-warning">{action}</span>;
      case 'delete user response':
        return <span className="badge bg-danger">{action}</span>;
      case 'send form':
        return <span className="badge bg-info">{action}</span>;
      case 'logged in':
        return <span className="badge bg-success">{action}</span>;
        case 'updated admin':
          return <span className="badge bg-warning">{action}</span>;
      case 'delete admin':
        return <span className="badge bg-danger">{action}</span>;
      case 'created admin':
        return <span className="badge bg-primary">{action}</span>;
        case 'created role':
          return <span className="badge bg-info">{action}</span>;
        case 'updated role':
          return <span className="badge bg-warning">{action}</span>;
      case 'deleted role':
        return <span className="badge bg-danger">{action}</span>;
        
      default:
        return <span className="badge bg-secondary">{action}</span>;
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Event Logs</h2>
      <input
        type="text"
        placeholder="Search by Name or Action..."
        value={search}
        onChange={handleSearch}
        className="form-control mb-3"
      />
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentFilteredLogs) && currentFilteredLogs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.userName}</td>
                <td>{getActionBadge(log.action)}</td>
                <td>{formatDateTime(log.timestamp)}</td>
                <td><pre>{formatDetails(log.details)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button className="page-link" aria-label="Previous" onClick={() => paginate(currentPage - 1)}>
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {[...Array(Math.ceil(filteredLogs.length / logsPerPage)).keys()].map(number => (
            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(number + 1)} className="page-link">
                {number + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button className="page-link" aria-label="Next" onClick={() => paginate(currentPage + 1)}>
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}