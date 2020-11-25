import React, { useCallback } from 'react';
import { useCourse } from 'app/CourseContext';
import styled from 'styled-components';
import { NarrowStandardPageContainer } from 'components/layouts/pageContainers';
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';

export default () => {
  const [course] = useCourse();

  /*const [newPassword, setNewPassword] = useState('');
  const handleConfirmNewPassword = useCallback(() => {
    apiFetch(apiRoutes.setPassword(), { newPassword })
      .then(console.log);
  }, [newPassword]);
  */

  return <NarrowStandardPageContainer>
    <div>Course: {JSON.stringify(course)}</div>
  </NarrowStandardPageContainer>;
}
