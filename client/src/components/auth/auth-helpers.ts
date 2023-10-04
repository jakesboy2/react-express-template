import { User } from '../../shared/types';

const getUserFromAuth = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  return JSON.parse(user) as User;
};

export {
  getUserFromAuth,
};
