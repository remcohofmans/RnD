import React, { createContext, useEffect, useContext } from 'react';
import * as amplitude from '@amplitude/analytics-browser';

const analyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
    useEffect(() => {
        amplitude.init('ef269332812c643d6481b69a0224f36a', {"autocapture":true});
    }, []);
    return (
        <analyticsContext.Provider value={{track: amplitude.track}} >
            {children}
        </analyticsContext.Provider>
    );
}

export function useAnalytics() {
    return useContext(analyticsContext);
  }