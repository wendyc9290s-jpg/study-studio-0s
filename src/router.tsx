import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SimUobPage } from './pages/SimUobPage';
import {
  AiPlaceholder,
  AccaPlaceholder,
  BrainDumpPlaceholder,
  CfaPlaceholder,
  ModesPlaceholder,
  PlanPlaceholder,
  ResourcePlaceholder,
  TravelPlaceholder,
  UploadPlaceholder,
} from './pages/placeholders';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/study/sim-uob" element={<SimUobPage />} />
      <Route path="/study/cfa" element={<CfaPlaceholder />} />
      <Route path="/study/acca" element={<AccaPlaceholder />} />
      <Route path="/study/plan" element={<PlanPlaceholder />} />
      <Route path="/study/resource" element={<ResourcePlaceholder />} />
      <Route path="/study/upload" element={<UploadPlaceholder />} />
      <Route path="/study/modes" element={<ModesPlaceholder />} />
      <Route path="/study/ai" element={<AiPlaceholder />} />
      <Route path="/life/travel" element={<TravelPlaceholder />} />
      <Route path="/life/braindump" element={<BrainDumpPlaceholder />} />
    </Routes>
  );
}
