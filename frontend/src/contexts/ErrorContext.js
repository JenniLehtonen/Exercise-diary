import React from 'react';

const ErrorContext = React.createContext({
    appError: null,
    setAppError: () => {}
});

export default ErrorContext