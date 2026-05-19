import { PlaceholderPage } from '../components/PlaceholderPage';

export function CfaPlaceholder() {
  return (
    <PlaceholderPage
      title="CFA"
      description="Roadmap for CFA Level I/II/III with topic checklists and overlap mapping to UoB modules."
      versionTag="v0.2"
    />
  );
}

export function AccaPlaceholder() {
  return (
    <PlaceholderPage
      title="ACCA"
      description="Roadmap for current and future ACCA qualification structures."
      versionTag="v0.2"
    />
  );
}

export function PlanPlaceholder() {
  return (
    <PlaceholderPage
      title="4-Month Plan"
      description="Phase-based study plan for the pre-university holiday: Accounting Foundation, Finance Foundation, UoB Preview, Audit/Tax Preview, CFA/ACCA orientation, reset week."
      versionTag="v0.2"
    />
  );
}

export function ResourcePlaceholder() {
  return (
    <PlaceholderPage
      title="Resource Library"
      description="Cross-module library of YouTube/Bilibili/PDF/web resources with filtering and progress tracking."
      versionTag="v0.2"
    />
  );
}

export function UploadPlaceholder() {
  return (
    <PlaceholderPage
      title="Upload & Extract"
      description="Upload PDF/PPT/docs and use Claude API to extract summaries, key terms, checklists, flashcards, and quiz questions."
      versionTag="v0.3"
    />
  );
}

export function ModesPlaceholder() {
  return (
    <PlaceholderPage
      title="Study Modes"
      description="Browse, Checklist, Flashcard, Quiz, and Explain modes for active recall."
      versionTag="v0.3"
    />
  );
}

export function AiPlaceholder() {
  return (
    <PlaceholderPage
      title="AI Agent"
      description="Conversational planner that suggests minimum-effort study plans based on energy level, progress, and upcoming travel."
      versionTag="v0.4"
    />
  );
}

export function TravelPlaceholder() {
  return (
    <PlaceholderPage
      title="Travel & Rest"
      description="Travel destinations, dates, and budget. Will integrate with the 4-Month Plan to auto-adjust workload."
      versionTag="v0.2"
    />
  );
}

export function BrainDumpPlaceholder() {
  return (
    <PlaceholderPage
      title="Brain Dump"
      description="Quick capture for stray thoughts, todos, and life admin."
      versionTag="v0.2"
    />
  );
}
