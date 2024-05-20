'use client';

import { SessionProvider } from 'next-auth/react';
// import { RecoilRoot } from 'recoil';

const SessionWrapper = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};

export default SessionWrapper;