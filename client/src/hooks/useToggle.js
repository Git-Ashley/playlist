import { useState } from 'react';

export default (defValue = false) => {
  const [isTrue, setIsTrue] = useState(defValue);

  const toggle = () => {
    setIsTrue(!isTrue);
  };

  return [
    isTrue,
    toggle,
  ];
};