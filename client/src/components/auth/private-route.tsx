import { Navigate, Route } from 'react-router-dom';
import React from 'react';

function PrivateRoute(props: any) {
  const token = localStorage.getItem('accessToken');
  return (
    <div>
      {token ? <Route {...props} /> : <Navigate to="/login" />}
    </div>
  );
}

export default PrivateRoute;
