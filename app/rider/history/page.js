import HistoryTable from '@/components/portal/HistoryTable'
export default function RiderHistory() {
  return <HistoryTable showFeeColumn={true} userRole="rider" />
}
