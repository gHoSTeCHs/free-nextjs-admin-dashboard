import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";


interface StakeTransaction {
  id: number; 
  validator: string; 
  amount: string; 
  token: string; 
  apy: string; 
  duration: string; 
  status: "Active" | "Pending" | "Unstaking" | "Completed"; 
  logo: string; 
}


const stakingData: StakeTransaction[] = [
  {
    id: 1,
    validator: "Ethereum 2.0",
    amount: "32.00",
    token: "ETH",
    apy: "4.2%",
    duration: "Indefinite",
    status: "Active",
    logo: "/images/crypto/eth-logo.svg",
  },
  {
    id: 2,
    validator: "Polygon Validator",
    amount: "1,500.00",
    token: "MATIC",
    apy: "8.5%",
    duration: "30 days",
    status: "Active",
    logo: "/images/crypto/matic-logo.svg",
  },
  {
    id: 3,
    validator: "Solana Stake Pool",
    amount: "250.00",
    token: "SOL",
    apy: "6.8%",
    duration: "7 days",
    status: "Pending",
    logo: "/images/crypto/sol-logo.svg",
  },
  {
    id: 4,
    validator: "Cardano Pool",
    amount: "5,000.00",
    token: "ADA",
    apy: "5.1%",
    duration: "21 days",
    status: "Unstaking",
    logo: "/images/crypto/ada-logo.svg",
  },
  {
    id: 5,
    validator: "Cosmos Hub",
    amount: "120.00",
    token: "ATOM",
    apy: "12.3%",
    duration: "21 days",
    status: "Active",
    logo: "/images/crypto/atom-logo.svg",
  },
];

export default function RecentStakes() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Stakes
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Your latest staking transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 dark:hover:bg-brand-400">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4.16675V15.8334"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.16675 10H15.8334"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New Stake
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Validator
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                APY
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Duration
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {stakingData.map((stake) => (
              <TableRow key={stake.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[40px] w-[40px] overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Image
                        width={28}
                        height={28}
                        src={stake.logo}
                        className="h-[28px] w-[28px]"
                        alt={stake.token}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {stake.validator}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {stake.token}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-gray-800 dark:text-white/90">
                    <p className="font-medium text-theme-sm">
                      {stake.amount} {stake.token}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {stake.apy}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {stake.duration}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={
                      stake.status === "Active"
                        ? "success"
                        : stake.status === "Pending"
                        ? "warning"
                        : stake.status === "Unstaking"
                        ? "info"
                        : "default"
                    }
                  >
                    {stake.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}