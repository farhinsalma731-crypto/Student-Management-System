import React, { useEffect, useState, useCallback } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import { getStudents, createStudent, updateStudent, deleteStudent } from "./api";
import "./App.css";

export default function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState("");
  const [serverErrors, setServerErrors] = useState({});
  const [toast, setToast] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setErrorBanner("");
    try {
      const params = {};
      if (search) params.search = search;
      if (courseFilter) params.course = courseFilter;
      const data = await getStudents(params);
      setStudents(data.results ?? data);
    } catch (err) {
      setErrorBanner("Could not reach the backend. Is the Django server running on port 8000?");
    } finally {
      setLoading(false);
    }
  }, [search, courseFilter]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleSave(payload) {
    setServerErrors({});
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, payload);
        showToast("Student updated successfully.");
      } else {
        await createStudent(payload);
        showToast("Student added successfully.");
      }
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      if (err.status === 400 && err.data) {
        setServerErrors(err.data);
      } else {
        setErrorBanner("Something went wrong while saving. Please try again.");
      }
    }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    try {
      await deleteStudent(student.id);
      showToast("Student deleted.");
      loadStudents();
    } catch (err) {
      setErrorBanner("Could not delete this student.");
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 Student Management System</h1>
        <p>Full CRUD demo — React frontend + Django REST Framework backend</p>
      </header>

      {errorBanner && <div className="banner error-banner">{errorBanner}</div>}
      {toast && <div className="banner toast">{toast}</div>}

      <main className="app-main">
        <section className="panel">
          <StudentForm
            editingStudent={editingStudent}
            onSave={handleSave}
            onCancel={() => { setEditingStudent(null); setServerErrors({}); }}
            serverErrors={serverErrors}
          />
        </section>

        <section className="panel list-panel">
          <div className="toolbar">
            <input
              className="search-input"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="">All courses</option>
              <option value="CS">Computer Science</option>
              <option value="EE">Electrical Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="BA">Business Administration</option>
            </select>
          </div>

          {loading ? (
            <p>Loading students...</p>
          ) : (
            <StudentList
              students={students}
              onEdit={(s) => { setEditingStudent(s); setServerErrors({}); }}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}
