import React from 'react';
import { useCourse } from 'app/CourseContext';
import { NarrowStandardPageContainer } from 'components/layouts/pageContainers';

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
