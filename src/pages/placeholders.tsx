import { PlaceholderPage } from '../components/PlaceholderPage';

export function UploadPlaceholder() {
  return (
    <PlaceholderPage
      title="Upload & Extract"
      description="Upload PDF/PPT/docs and use Claude API to extract summaries, key terms, checklists, flashcards, and quiz questions."
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
