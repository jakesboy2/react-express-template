import React from 'react';
import ResetPasswordAccessTokenForm from './reset-password-access-code-form';
import ResetPasswordChangeForm from './reset-password-change-form';
import ResetPasswordRequest from './reset-password-request';
import { PageType } from './types';

const pages: {
  // eslint-disable-next-line no-unused-vars
  [index in PageType]:
    (
      handleSetVisiblePage: (value: PageType) => void,
      email?: string,
      accessCode?: string,
      handleSetEmail?: (value: string) => void,
      handleSetAccessCode?: (value: string) => void
    ) => React.ReactNode
} = {
  RequestPage: (
    handleSetVisiblePage: (value: PageType) => void,
    email?: string,
    accessCode?: string,
    handleSetEmail?: (value: string) => void,
    handleSetAccessCode?: (value: string) => void,
  ) => (
    <ResetPasswordRequest
      setVisiblePage={handleSetVisiblePage}
      setEmail={handleSetEmail}
    />
  ),
  AccessCodePage: (
    handleSetVisiblePage: (value: PageType) => void,
    email?: string,
    accessCode?: string,
    handleSetEmail?: (value: string) => void,
    handleSetAccessCode?: (value: string) => void,
  ) => (
    <ResetPasswordAccessTokenForm
      setVisiblePage={handleSetVisiblePage}
      email={email}
      setAccessCode={handleSetAccessCode}
    />
  ),
  ChangePasswordPage: (
    handleSetVisiblePage: (value: PageType) => void,
    email?: string,
    accessCode?: string,
    handleSetEmail?: (value: string) => void,
    handleSetAccessCode?: (value: string) => void,
  ) => (
    <ResetPasswordChangeForm
      setVisiblePage={handleSetVisiblePage}
      email={email}
      accessCode={accessCode}
    />
  ),
};

function ResetPasswordContainer() {
  const [email, setEmail] = React.useState<string>();
  const [accessCode, setAccessCode] = React.useState<string>();
  const [visiblePage, setVisiblePage] = React.useState<PageType>('RequestPage');

  const handleSetEmail = (value: string) => {
    setEmail(value);
  };

  const handleSetAccessCode = (value: string) => {
    setAccessCode(value);
  };

  const handleSetVisiblePage = (value: PageType) => {
    setVisiblePage(value);
  };

  // eslint-disable-next-line arrow-body-style
  const renderVisiblePage = (page: PageType): React.ReactNode => {
    return pages[page](
      handleSetVisiblePage,
      email,
      accessCode,
      handleSetEmail,
      handleSetAccessCode,
    );
  };

  return (
    <>
      { renderVisiblePage(visiblePage)}
    </>
  );
}

export default ResetPasswordContainer;
