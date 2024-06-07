const initialState = {
    cachedServiceTypes: {},
    cachedServiceTypesTimestamp: {},
};

const serviceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CACHED_SERVICE_TYPES':
            const { id, serviceTypes, timestamp } = action.payload;
            return {
                ...state,
                cachedServiceTypes: {
                    ...state.cachedServiceTypes,
                    [id]: serviceTypes,
                },
                cachedServiceTypesTimestamp: {
                    ...state.cachedServiceTypesTimestamp,
                    [id]: timestamp,
                },
            };

        case 'REMOVE_SERVICE_TYPES':
            return {
                ...state,
                cachedServiceTypes: {},
                cachedServiceTypesTimestamp: {},
            };
        default:
            return state;
    }
};

export default serviceReducer;