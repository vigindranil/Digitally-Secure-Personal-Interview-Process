'use client';

import React, { ReactNode, Suspense } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import Loading from './loading';

export default function AddPanelLayout({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary
            customMessage="Failed to load the Panel Management page. Please try again."
            showHomeButton={true}
            onError={(error, errorInfo) => {
                console.error('Panel Management Error:', error);
                console.error('Error Info:', errorInfo);
            }}
        >
            <Suspense fallback={<Loading />}>
                {children}
            </Suspense>
        </ErrorBoundary>
    );
}