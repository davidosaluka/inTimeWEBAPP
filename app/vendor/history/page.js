import HistoryTable from '@/components/portal/HistoryTable'
export default function VendorHistory() {
  return <HistoryTable showFeeColumn={true} userRole="vendor" />
}
