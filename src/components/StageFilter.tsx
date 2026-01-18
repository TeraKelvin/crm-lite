"use client";

interface StageFilterProps {
  selectedStage: string;
  onStageChange: (stage: string) => void;
  stages?: { value: string; label: string }[];
}

const defaultStages = [
  { value: "", label: "All Stages" },
  { value: "COURTING", label: "Courting" },
  { value: "REGISTERED", label: "Registered" },
  { value: "QUOTED", label: "Quoted" },
  { value: "WON", label: "Won" },
  { value: "CLOSED_LOST", label: "Closed/Lost" },
];

export default function StageFilter({
  selectedStage,
  onStageChange,
  stages = defaultStages,
}: StageFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((stage) => (
        <button
          key={stage.value}
          onClick={() => onStageChange(stage.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedStage === stage.value
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {stage.label}
        </button>
      ))}
    </div>
  );
}
