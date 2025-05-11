
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { fetchContextData } from '@/utils/chatContextUtils';

export const useRouteContext = (isOpen: boolean) => {
  const [contextData, setContextData] = useState<any>(null);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (isOpen) {
      fetchContextForCurrentRoute();
    }
  }, [isOpen, location.pathname]);

  const fetchContextForCurrentRoute = async () => {
    const context = await fetchContextData(location.pathname, params);
    setContextData(context);
  };

  return {
    contextData,
    location,
    fetchContextForCurrentRoute
  };
};
