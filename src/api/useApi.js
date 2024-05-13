import { useState } from 'react';

const useApi = (apiFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (...args) => {
    setIsLoading(true);
    try {
      const response = await apiFunction(...args);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useApi;
