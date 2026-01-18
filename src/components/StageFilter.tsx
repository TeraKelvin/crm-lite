import Link from "next/link";

interface StageFilterProps {
  selectedStage: string;
  basePath?: string;
}

const stages = [
  { value: "", label: "All Stages" },
  { value: "COURTING", label: "Courting" },
  { value: "REGISTERED", label: "Registered" },
  { value: "QUOTED", label: "Quoted" },
  { value: "WON", label: "Won" },
  { value: "CLOSED_LOST", label: "Closed/Lost" },
];

export default function StageFilter({
  selectedStage,
  basePath = "/deals",
}: StageFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((stage) => (
        <Link
          key={stage.value}
          href={stage.value ? `${basePath}?stage=${stage.value}` : basePath}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedStage === stage.value
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {stage.label}
        </Link>
      ))}
    </div>
  );
}
