export const setCachedServiceTypes = (id, serviceTypes) => {
    return {
      type: 'SET_CACHED_SERVICE_TYPES',
      payload: {
        id,
        serviceTypes,
        timestamp: new Date().getTime(),
      },
    };
  };