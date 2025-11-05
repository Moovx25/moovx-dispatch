import { useState } from 'react';

const useUserRole = () => {
  const [role, setRole] = useState(null);
  return { role, setRole };
};

export default useUserRole; 