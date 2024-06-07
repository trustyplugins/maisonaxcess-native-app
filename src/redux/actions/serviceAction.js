export const setCachedServiceTypes = (id, serviceTypes) => {
  return {
    type: 'SET_CACHED_SERVICE_TYPES',
    payload: {
      id,
      serviceTypes,
      timestamp: new Date(),
    },
  };
};

export const removeCache = () => {
  return {
    type: 'REMOVE_SERVICE_TYPES',
  }
};