
import { useNavigate } from 'react-router-dom';

/**
 * Hook for handling report viewing operations
 */
export function useReportView() {
  const navigate = useNavigate();

  const handleViewReport = (reportId: string) => {
    navigate(`/reports?reportId=${reportId}`);
  };

  return {
    handleViewReport
  };
}
