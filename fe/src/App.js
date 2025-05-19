// App.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import NotesList from "./components/NotesList";
import Login from "./components/Login";
import Register from "./components/Register";
import { API_BASE_URL } from "./Util/util";
import "./index.css";
import { MdExitToApp } from "react-icons/md";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
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
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId"); // Ambil userId dari localStorage
    console.log("[checkLoginStatus] Token:", token);
    console.log("[checkLoginStatus] userId:", userId);

    // 🆕 Decode dan tampilkan isi payload JWT (untuk debug)
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("[checkLoginStatus] Decoded Payload:", payload);
        console.log("[checkLoginStatus] userId from token:", payload.id);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }

    if (!token || !userId || isNaN(userId)) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/user/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[checkLoginStatus] Response /users/:id:", response.data);

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
      } else {
        setIsLoggedIn(false);
        showMessage("Token tidak valid, silakan login ulang.", "error");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.error(
        "[checkLoginStatus] Error saat verifikasi login:",
        error.response?.data || error.message
      );
      setIsLoggedIn(false);
      showMessage("Gagal verifikasi login. Silakan login ulang.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      console.log("[fetchNotes] Access token:", token);

      if (!token) throw new Error("Token tidak ditemukan, silakan login.");

      const response = await axios.get(`${API_BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("[fetchNotes] Response data:", response.data);

      // Validasi bahwa data adalah array
      if (!Array.isArray(response.data)) {
        throw new Error("Data catatan tidak valid atau bukan array.");
      }

      setNotes(response.data);
    } catch (error) {
      if (error.response) {
        console.error(
          "[fetchNotes] Server error:",
          error.response.status,
          error.response.data
        );
        showMessage(
          `Gagal memuat catatan: ${error.response.status} - ${
            error.response.data.message || error.response.statusText
          }`,
          "error"
        );
      } else if (error.request) {
        console.error(
          "[fetchNotes] Tidak ada respon dari server:",
          error.request
        );
        showMessage(
          "Tidak ada respon dari server. Cek koneksi atau server backend.",
          "error"
        );
      } else {
        console.error("[fetchNotes] Error:", error.message);
        showMessage("Terjadi kesalahan: " + error.message, "error");
      }

      throw error; // tetap dilempar ulang untuk penanganan lebih lanjut
    }
  };

  const addNote = async (noteData) => {
    try {
      await axios.post(
        `${API_BASE_URL}/notes`,
        {
          judul: noteData.judul,
          isi: noteData.isi,
          tanggal: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      await fetchNotes(); // agar notes terupdate
      showMessage("Catatan berhasil ditambah.", "success");
    } catch (error) {
      console.error("❌ Gagal menambah note:", error);
      showMessage("Gagal menambah catatan!", "error");
      alert("Gagal menambah catatan!");
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      showMessage("Catatan berhasil dihapus.", "success");
    } catch (error) {
      console.error("❌ Gagal menghapus note:", error);
      showMessage("Gagal menghapus catatan!", "error");
      alert("Gagal menghapus catatan!");
    }
  };

  const editNote = async (id, judulBaru, isiBaru) => {
    try {
      await axios.put(
        `${API_BASE_URL}/notes/${id}`,
        {
          judul: judulBaru,
          isi: isiBaru,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      await fetchNotes();
      showMessage("Catatan berhasil diedit.", "success");
    } catch (error) {
      console.error("❌ Gagal mengedit note:", error);
      showMessage("Gagal mengedit catatan!", "error");
      alert("Gagal mengedit catatan!");
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
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setNotes([]); // kosongkan notes
  };

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
