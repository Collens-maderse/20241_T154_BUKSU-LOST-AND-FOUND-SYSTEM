import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUsers,
  faTrash,
  faEdit,
  faEnvelope,
  faMagnifyingGlass,
  faBoxOpen,
  faBell,
  faRightFromBracket,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("addUser");
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    userType: "student",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLostItems: 0,
    totalFoundItems: 0,
    totalNotifications: 0,
    totalItems: 0, // Add totalItems
  });
 
  useEffect(() => {
    if (currentView === "registeredUsers") fetchUsers();
    if (currentView === "lostItems" || currentView === "foundItems") fetchItems();
    if (currentView === "inbox") fetchNotifications();
    if (currentView === "reports" && reports.length === 0) fetchReports();
    if (currentView === "dashboard" && stats.totalUsers === 0) fetchStats();

  }, [currentView, categoryFilter]);

 // Fetch Lost and Found Reports
 /*const fetchReports = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:5000/api/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetched Reports:", response.data); // Debugging: log the API response
    setReports(response.data);
    setFilteredReports(response.data);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
  }
};


// Handle Status Update
const handleStatusUpdate = async (id, newStatus) => {
  try {
    const token = localStorage.getItem("authToken");
    await axios.put(
      `http://localhost:5000/api/reports/${id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Status updated successfully!");
    fetchReports();
  } catch (error) {
    alert("Failed to update status.");
    console.error(error);
  }
};

// Search and Filter Logic
const handleSearchAndFilter = () => {
  let filtered = reports;

  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (report) =>
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.date.includes(searchTerm)
    );
  }

  // Status filter
  if (statusFilter !== "All") {
    filtered = filtered.filter((report) => report.status === statusFilter);
  }

  // Date range filter
  if (dateRange.from && dateRange.to) {
    filtered = filtered.filter(
      (report) =>
        new Date(report.date) >= new Date(dateRange.from) &&
        new Date(report.date) <= new Date(dateRange.to)
    );
  }

  setFilteredReports(filtered);
};
*/

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [usersRes, lostItemsRes, foundItemsRes, notificationsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/items?postType=Lost", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/items?postType=Found", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/contact/inbox", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      setStats({
        totalUsers: usersRes.data.length || 0,
        totalLostItems: lostItemsRes.data.length || 0,
        totalFoundItems: foundItemsRes.data.length || 0,
        totalNotifications: notificationsRes.data.length || 0,
        totalItems: (lostItemsRes.data.length || 0) + (foundItemsRes.data.length || 0), // Calculate total items
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };
  


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/api/users/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      alert("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredItems = response.data.filter(
        (item) =>
          (currentView === "lostItems" ? item.postType === "Lost" : item.postType === "Found") &&
          (categoryFilter === "All" || item.category === categoryFilter)
      );

      setItems(filteredItems);
    } catch (err) {
      alert("Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };
 // Fetch Notifications
 const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:5000/api/contact/inbox", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(response.data);
  } catch (err) {
    alert("Failed to fetch inbox messages.");
  }
};





  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post("http://localhost:5000/api/auth/register", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User added successfully!");
      setNewUser({ firstname: "", lastname: "", email: "", password: "", userType: "student" });
      fetchUsers();
    } catch (err) {
      alert("Failed to add user.");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const renderView = () => {
    switch (currentView) { 
      
      case "dashboard":
      return (
        <div className="dashboard-overview">
        <h2>Admin Dashboard Overview</h2>
        <div className="stats-container">
          {[
            { icon: faUsers, label: "Total Registered Users", value: stats.totalUsers },
            { icon: faMagnifyingGlass, label: "Total Lost Items", value: stats.totalLostItems },
            { icon: faBoxOpen, label: "Total Found Items", value: stats.totalFoundItems },
            { icon: faChartPie, label: "Total Items", value: stats.totalItems },
            { icon: faBell, label: "Pending Notifications", value: stats.totalNotifications },
          ].map((stat, index) => (
            <div key={index} className="stat-card">
              <FontAwesomeIcon icon={stat.icon} className="icon" />
              <div>
                <p>{stat.label}</p>
                <h3>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      );

      case "addUser":
        return (
          <div className="add-user-form">
            <h2>Add New User</h2>
            <input
              type="text"
              placeholder="First Name"
              value={newUser.firstname}
              onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.lastname}
              onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <button onClick={handleAddUser}>Add User</button>
          </div>
        );
  
      case "registeredUsers":
        return (
          <div className="registered-users">
            <h2>Registered Users</h2>
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td className="action-buttons">
                      <button onClick={() => setEditingUser(user)}>
                        <FontAwesomeIcon icon={faEdit} title="Edit" />
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        <FontAwesomeIcon icon={faTrash} title="Delete" />
                      </button>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FontAwesomeIcon icon={faEnvelope} title="Message" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
  
        case "inbox":
          return (
            <div className="inbox-container">
              <h2>Inbox</h2>
              {notifications.length === 0 ? (
                <p>No messages available.</p>
              ) : (
                notifications.map((message, index) => (
                  <div key={index} className="message-card">
                    <p>
                      <strong>Name:</strong> {message.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {message.email}
                    </p>
                    <p>
                      <strong>Message:</strong> {message.message}
                    </p>
                    <p className="date">
                      <strong>Received At:</strong>{" "}
                      {message.date
                        ? new Date(message.date).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </p>
                  </div>
                ))
              )}
            </div>
          );
        
          /*case "reports":
            return (
              <div className="reports-container">
      <h2>Manage Lost and Found Reports</h2>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by name, description, or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Found">Found</option>
          <option value="Resolved">Resolved</option>
        </select>
        <input
          type="date"
          placeholder="From"
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        />
        <input
          type="date"
          placeholder="To"
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        />
        <button onClick={handleSearchAndFilter}>
          <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
        </button>
      </div>

      <table className="reports-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Description</th>
            <th>Reporter</th>
            <th>Date</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
  {filteredReports && filteredReports.length > 0 ? (
    filteredReports.map((report) => (
      <tr key={report._id}>
        <td>{report.itemName || "N/A"}</td>
        <td>{report.description || "N/A"}</td>
        <td>
          {report.reporterName || "Unknown"} ({report.contact || "No Contact"})
        </td>
        <td>{report.date ? new Date(report.date).toLocaleDateString() : "N/A"}</td>
        <td>{report.status || "Pending"}</td>
        <td>
          <select
            value={report.status || "Pending"}
            onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Found">Found</option>
            <option value="Resolved">Resolved</option>
          </select>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" style={{ textAlign: "center" }}>
        No reports available or matching your filter.
      </td>
    </tr>
  )}
</tbody>
      </table>
    </div>
  );
*/


        
  
      case "lostItems":
      case "foundItems":
        return (
          <div>
            <h2>{currentView === "lostItems" ? "Lost Items" : "Found Items"}</h2>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Personal-item">Personal Items</option>
              <option value="ID">ID</option>
              <option value="Other">Other</option>
            </select>
            <div className="items-display">
              {items.map((item) => (
                <div key={item._id} className="item-card">
                  {item.image && <img src={`http://localhost:5000/uploads/${item.image}`} alt="" />}
                  <p>{item.description}</p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p>
                    <strong>Posted By:</strong> {item.postedBy?.firstname || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
  
      default:
        return <p>Select an option from the menu.</p>;
    }
  };
  

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="left-sidebar">
        <h2>Admin Menu</h2>
        <ul> 
          <li onClick={() => setCurrentView("dashboard")}>
            <FontAwesomeIcon icon={faChartPie} /> Dashboard
          </li>
          <li onClick={() => setCurrentView("addUser")}>
            <FontAwesomeIcon icon={faUserPlus} /> Add User
          </li>
          <li onClick={() => setCurrentView("registeredUsers")}>
            <FontAwesomeIcon icon={faUsers} /> Registered Users
          </li>
          <li onClick={() => setCurrentView("lostItems")}>
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Lost Items
          </li>
          <li onClick={() => setCurrentView("foundItems")}>
            <FontAwesomeIcon icon={faBoxOpen} /> Found Items
          </li>
          <li onClick={() => setCurrentView("inbox")}>
            <FontAwesomeIcon icon={faBell} /> Inbox
          </li>
          <li onClick={handleLogout} style={{ color: "red", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">{renderView()}</div>
    </div>
  );
};

export default AdminDashboard;
