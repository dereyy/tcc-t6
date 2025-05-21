// App.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import NotesList from "./components/NotesList";
import Login from "./components/Login";
import Register from "./components/Register";
import { API_BASE_URL, checkApiConnection, isTokenExpired, refreshToken } from "./Util/util";
import "./index.css";
import { MdExitToApp } from "react-icons/md";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isApiConnected, setIsApiConnected] = useState(true);

  // Fungsi untuk mendapatkan token yang valid
  const getValidToken = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    if (isTokenExpired(token)) {
      try {
        return await refreshToken();
      } catch (error) {
        console.error("Gagal refresh token:", error);
        return null;
      }
    }
    return token;
  };

  // Fungsi untuk membuat request dengan token yang valid
  const makeAuthenticatedRequest = async (requestFn) => {
    try {
      const token = await getValidToken();
      if (!token) throw new Error("Token tidak valid");

      return await requestFn(token);
    } catch (error) {
      if (error.message === "Token tidak valid") {
        showMessage("Sesi Anda telah berakhir. Silakan login ulang.", "error");
        handleLogout();
      }
      throw error;
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkApiConnection();
      setIsApiConnected(connected);
      if (!connected) {
        showMessage("Tidak dapat terhubung ke server. Pastikan server backend berjalan di localhost:5000", "error");
      }
    };
    checkConnection();
    checkLoginStatus();
  }, []);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const checkLoginStatus = async () => {
    const token = await getValidToken();
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/user/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.email) {
        setIsLoggedIn(true);
        try {
          await fetchNotes();
        } catch (fetchError) {
          showMessage(
            `Gagal memuat catatan setelah login: ${fetchError.message}`,
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error saat verifikasi login:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchNotes = async () => {
    try {
      await makeAuthenticatedRequest(async (token) => {
        const response = await axios.get(`${API_BASE_URL}/notes`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const notesData = Array.isArray(response.data) ? response.data : [];
        setNotes(notesData);
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  const addNote = async (noteData) => {
    try {
      await makeAuthenticatedRequest(async (token) => {
        await axios.post(
          `${API_BASE_URL}/notes`,
          {
            judul: noteData.judul,
            isi: noteData.isi,
            tanggal: new Date().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await fetchNotes();
        showMessage("Catatan berhasil ditambah.", "success");
      });
    } catch (error) {
      console.error("Gagal menambah note:", error);
      showMessage("Gagal menambah catatan!", "error");
    }
  };

  const deleteNote = async (id) => {
    try {
      await makeAuthenticatedRequest(async (token) => {
        await axios.delete(`${API_BASE_URL}/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        showMessage("Catatan berhasil dihapus.", "success");
      });
    } catch (error) {
      console.error("Gagal menghapus note:", error);
      showMessage("Gagal menghapus catatan!", "error");
    }
  };

  const editNote = async (id, judulBaru, isiBaru) => {
    try {
      await makeAuthenticatedRequest(async (token) => {
        await axios.put(
          `${API_BASE_URL}/notes/${id}`,
          {
            judul: judulBaru,
            isi: isiBaru,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await fetchNotes();
        showMessage("Catatan berhasil diedit.", "success");
      });
    } catch (error) {
      console.error("Gagal mengedit note:", error);
      showMessage("Gagal mengedit catatan!", "error");
    }
  };

  if (!isLoggedIn) {
    return isRegistering ? (
      <Register
        onRegisterSuccess={() => setIsRegistering(false)}
        navigateToLogin={() => setIsRegistering(false)}
      />
    ) : (
      <Login
        onLoginSuccess={checkLoginStatus}
        navigateToRegister={() => setIsRegistering(true)}
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setNotes([]);
  };

  if (!isApiConnected) {
    return (
      <div className="container">
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#ffebee", 
          borderRadius: "8px",
          margin: "20px 0",
          textAlign: "center"
        }}>
          <h2>Koneksi Error</h2>
          <p>Tidak dapat terhubung ke server backend.</p>
          <p>Pastikan:</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>Server backend berjalan di localhost:5000</li>
            <li>Tidak ada firewall yang memblokir koneksi</li>
            <li>Port 5000 tidak digunakan oleh aplikasi lain</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="notes-header">
        <h1>Notes</h1>
        <button className="logout-button" onClick={handleLogout}>
          <MdExitToApp size={20} />
          Logout
        </button>
      </div>

      {/* {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            color: messageType === "success" ? "green" : "red",
            border: `1px solid ${messageType === "success" ? "green" : "red"}`,
          }}
        >
          {message}
        </div>
      )} */}

      {notes.length > 0 ? (
        <NotesList
          notes={notes}
          handleAddNote={addNote}
          handleDeleteNote={deleteNote}
          handleEditNote={editNote}
        />
      ) : (
        <p>Tidak ada catatan.</p>
      )}
    </div>
  );
};

export default App;
