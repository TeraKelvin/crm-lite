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
  probability?: number;
  expectedCloseDate?: Date | null;
  forecastCategory?: string;
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

const forecastCategoryColors: Record<string, string> = {
  COMMIT: "bg-green-100 text-green-700",
  BEST_CASE: "bg-blue-100 text-blue-700",
  PIPELINE: "bg-gray-100 text-gray-700",
  OMIT: "bg-red-100 text-red-700",
};

function CardContent({
  dealName,
  clientCompanyName,
  dealValue,
  grossProfit,
  stage,
  updatedAt,
  probability,
  expectedCloseDate,
  forecastCategory,
}: Omit<DealCardProps, "id" | "isClientView">) {
  const weightedValue = probability ? (dealValue * probability) / 100 : dealValue;

  const getDaysUntilClose = () => {
    if (!expectedCloseDate) return null;
    const closeDate = new Date(expectedCloseDate);
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilClose = getDaysUntilClose();

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
          <span className="text-gray-600 font-medium">Value: </span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(dealValue)}
          </span>
        </div>
        <div>
          <span className="text-gray-600 font-medium">GP: </span>
          <span className="font-semibold text-green-600">
            {formatCurrency(grossProfit)}
          </span>
        </div>
      </div>
      {/* Forecasting info */}
      {probability !== undefined && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {probability}% → {formatCurrency(weightedValue)}
            </span>
            {forecastCategory && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${forecastCategoryColors[forecastCategory] || forecastCategoryColors.PIPELINE}`}>
                {forecastCategory.replace("_", " ")}
              </span>
            )}
          </div>
          {daysUntilClose !== null && (
            <span className={`text-xs ${
              daysUntilClose < 0 ? "text-red-600 font-medium" :
              daysUntilClose <= 7 ? "text-orange-600" :
              daysUntilClose <= 30 ? "text-yellow-600" : "text-gray-500"
            }`}>
              {daysUntilClose < 0
                ? `${Math.abs(daysUntilClose)}d overdue`
                : `${daysUntilClose}d`}
            </span>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">
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
  probability,
  expectedCloseDate,
  forecastCategory,
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
          probability={probability}
          expectedCloseDate={expectedCloseDate}
          forecastCategory={forecastCategory}
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
        probability={probability}
        expectedCloseDate={expectedCloseDate}
        forecastCategory={forecastCategory}
      />
    </Link>
  );
}
