const initialState = {
    cachedServiceTypes: {},
    cachedServiceTypesTimestamp: {},
};

const serviceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CACHED_SERVICE_TYPES':
            const existingServiceType = state.cachedServiceTypes[action.payload.id];
            const existingTimestamp = state.cachedServiceTypesTimestamp[action.payload.id];
            // if (!existingServiceType || action.payload.timestamp > existingTimestamp) {
            if (!existingServiceType) {
                return {
                    ...state,
                    cachedServiceTypes: {
                        ...state.cachedServiceTypes,
                        [action.payload.id]: action.payload.serviceTypes,
                    },
                    cachedServiceTypesTimestamp: {
                        ...state.cachedServiceTypesTimestamp,
                        [action.payload.id]: action.payload.timestamp,
                    },
                };
            }
            // If the ID exists and the timestamp is not older, return the current state
            return state;
        default:
            return state;
    }
};

export default serviceReducer;