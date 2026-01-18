import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface DealCardProps {
  id: string;
  dealName: string;
  clientCompanyName: string;
  dealValue: number;
  grossProfit: number;
  stage: string;
  updatedAt: Date;
  isClientView?: boolean;
}

const stageColors: Record<string, string> = {
  COURTING: "bg-purple-100 text-purple-800",
  REGISTERED: "bg-blue-100 text-blue-800",
  QUOTED: "bg-yellow-100 text-yellow-800",
  WON: "bg-green-100 text-green-800",
  CLOSED_LOST: "bg-red-100 text-red-800",
};

const stageLabels: Record<string, string> = {
  COURTING: "Courting",
  REGISTERED: "Registered",
  QUOTED: "Quoted",
  WON: "Won",
  CLOSED_LOST: "Closed/Lost",
};

function CardContent({
  dealName,
  clientCompanyName,
  dealValue,
  grossProfit,
  stage,
  updatedAt,
}: Omit<DealCardProps, "id" | "isClientView">) {
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 truncate flex-1">
          {dealName}
        </h3>
        <span
          className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${stageColors[stage]}`}
        >
          {stageLabels[stage]}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{clientCompanyName}</p>
      <div className="flex justify-between text-sm">
        <div>
          <span className="text-gray-500">Value: </span>
          <span className="font-medium text-gray-900">
            {formatCurrency(dealValue)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">GP: </span>
          <span className="font-medium text-gray-900">
            {formatCurrency(grossProfit)}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Updated {new Date(updatedAt).toLocaleDateString()}
      </p>
    </>
  );
}

export default function DealCard({
  id,
  dealName,
  clientCompanyName,
  dealValue,
  grossProfit,
  stage,
  updatedAt,
  isClientView = false,
}: DealCardProps) {
  const cardClassName = `block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 ${
    !isClientView ? "cursor-pointer" : ""
  }`;

  if (isClientView) {
    return (
      <div className={cardClassName}>
        <CardContent
          dealName={dealName}
          clientCompanyName={clientCompanyName}
          dealValue={dealValue}
          grossProfit={grossProfit}
          stage={stage}
          updatedAt={updatedAt}
        />
      </div>
    );
  }

  return (
    <Link href={`/deals/${id}`} className={cardClassName}>
      <CardContent
        dealName={dealName}
        clientCompanyName={clientCompanyName}
        dealValue={dealValue}
        grossProfit={grossProfit}
        stage={stage}
        updatedAt={updatedAt}
      />
    </Link>
  );
}
