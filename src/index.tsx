import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { PatientsPage } from "./pages/PatientsPage";
import { PatientDetailPage } from "./pages/PatientDetailPage";
import { StudentsPage } from "./pages/StudentsPage";
import { StudentDetailPage } from "./pages/StudentDetailPage";
import { UsersPage } from "./pages/UsersPage";
import { UploadMahasiswaPage } from "./pages/UploadMahasiswaPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { PatientRegistrationPage } from "./pages/PatientRegistrationPage";
import { PatientExaminationPage } from "./pages/PatientExaminationPage";
import { MedicalRecordsList } from "./screens/MedicalRecordsList";
import { ToastProvider } from "./components/ui/toast";
import { APMPage } from "./pages/APMPage";
import { APMNewPatientPage } from "./pages/APMNewPatientPage";
import { APMExistingPatientPage } from "./pages/APMExistingPatientPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ToastProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/apm" replace />} />
        <Route path="/apm" element={<APMPage />} />
        <Route path="/apm/new-patient" element={<APMNewPatientPage />} />
        <Route path="/apm/existing-patient" element={<APMExistingPatientPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-registration" element={<PatientRegistrationPage />} />
        <Route path="/patient-examination" element={<PatientExaminationPage />} />
        <Route path="/medical-records" element={<MedicalRecordsList />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/upload-mahasiswa" element={<UploadMahasiswaPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
);
