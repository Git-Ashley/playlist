import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { NarrowStandardPageContainer } from 'components/layouts/pageContainers';
import apiRoutes from 'app/apiRoutes';
import useFetchNow from 'hooks/useFetchNow';
import apiFetch from 'util/apiFetch';
import { useUser } from 'app/UserContext';
import LoadingPlaceholder from 'components/molecules/LoadingPlaceholder';
import { Link, useHistory } from 'react-router-dom';
import Button from 'components/atoms/buttons/Button';
import { BiCog } from "react-icons/bi";
import { BsPlus } from 'react-icons/bs';
import TextInputModal from 'components/molecules/Modal/TextInputModal';

const CoursesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CourseCardWrapper = styled.div`
  margin: 40px 40px 0;
  width: 140px;
  height: 180px;
`;

const CardContainer = styled(Link)`
  border-radius: 5px;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primaryText};
`;

const CourseCardContainer = styled(CardContainer)`
  background-color: white;
  box-shadow: 0 0 5px 1px rgb(180,180,180);
  text-align: center;
  word-break: break-word;
  padding: 15px;
  &:focus, &:hover {
    box-shadow: 0 0 5px 1px ${props => props.theme.primary};
  }
  & > :first-child {
    margin-bottom: 10px;
  }
`;

const CourseCreateContainer = styled(CardContainer)`
  box-shadow: inset 0 0 5px 1px rgb(150,150,150);
  &:focus, &:hover {
    box-shadow: inset 0 0 5px 1px #5c9dc7;
  }
`;

const AddCourseBtnContainer = styled(CardContainer)`
  height: 100%;
  width: 100%;
  color: rgb(150,150,150);
  &:focus, &:hover {
    color: #5c9dc7;
  }
`;

const CourseCard = ({ course, joined, admin = false }) => <CourseCardWrapper to={`/course/${course._id}`}>
  <CourseCardContainer to={`/course/${course._id}`}>
    <div>{course.title}</div>
    {joined && <div style={{color:'green', fontWeight: 600}}>Joined</div>}
    {admin && <Button onClick={console.log}><BiCog /></Button>}
  </CourseCardContainer>
</CourseCardWrapper>;

const CourseCreateBtn = ({ theme, onClick }) => <CourseCardWrapper>
  <CourseCreateContainer>
    <AddCourseBtnContainer onClick={onClick}>
      <BsPlus size={100} />
    </AddCourseBtnContainer>
  </CourseCreateContainer>
</CourseCardWrapper>;

export default () => {
  const [showCourseNameModal, setShowCourseNameModal] = useState(false);
  const [user] = useUser();
  const [newCourseInputErr, setNewCourseInputErr] = useState('');
  const joinedCourses = Object.keys(user.courses);
  const history = useHistory();

  const [courses, isFetchingCourses] = useFetchNow(apiRoutes.courses());

  const handleCreateCourse = useCallback(title => {
    if (title && title.length > 30) {
      return setNewCourseInputErr('Title must be under 30 characters!');
    }
    apiFetch(apiRoutes.createCourse(), { title }).then(course => {
      history.push(`/course/${course._id}`);
    });
  }, [history]);

  if (isFetchingCourses) {
    return <LoadingPlaceholder />;
  }

  return <NarrowStandardPageContainer>
    <CoursesContainer>
      {courses.map(course => <CourseCard
        joined={joinedCourses.includes(course._id)}
        course={course}
      />)}
      <CourseCreateBtn onClick={() => setShowCourseNameModal(true)} />
    </CoursesContainer>
    <TextInputModal
      error={newCourseInputErr}
      header='Enter a course name'
      show={showCourseNameModal}
      onConfirm={handleCreateCourse}
      onDecline={() => setShowCourseNameModal(false)}
    />
  </NarrowStandardPageContainer>;
}
