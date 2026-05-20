import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SimUobPage } from './pages/SimUobPage';
import { CfaPage } from './pages/CfaPage';
import { AccaPage } from './pages/AccaPage';
import { PlanPage } from './pages/PlanPage';
import { ResourcePage } from './pages/ResourcePage';
import { StudyModesPage } from './pages/StudyModesPage';
import {
  AiPlaceholder,
  UploadPlaceholder,
} from './pages/placeholders';
import { LifePage } from './pages/LifePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/study/sim-uob" element={<SimUobPage />} />
      <Route path="/study/cfa" element={<CfaPage />} />
      <Route path="/study/acca" element={<AccaPage />} />
      <Route path="/study/plan" element={<PlanPage />} />
      <Route path="/study/resource" element={<ResourcePage />} />
      <Route path="/study/upload" element={<UploadPlaceholder />} />
      <Route path="/study/modes" element={<StudyModesPage />} />
      <Route path="/study/ai" element={<AiPlaceholder />} />
      <Route path="/life" element={<LifePage />} />
    </Routes>
  );
}
