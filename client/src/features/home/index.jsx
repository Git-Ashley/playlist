import React, { useEffect } from 'react';
import styled from 'styled-components';
import { NarrowStandardPageContainer } from 'components/layouts/pageContainers';
import apiRoutes from 'app/apiRoutes';
import useFetchNow from 'hooks/useFetchNow';
import { useUser } from 'app/UserContext';
import LoadingPlaceholder from 'components/molecules/LoadingPlaceholder';
import { Link } from 'react-router-dom';

const COURSES = [
  {tags:["kodansha","test-tag","人名用","表外","N1"],_id:"1ebc9e10f8144bff47de9cc8",title:"Kanji 2500"},
  {tags:["kodansha","test-tag","人名用","表外","N1"],_id:"2ebc9e10f8144bff47de9cc8",title:"Vocab 2000"},
  {tags:["kodansha","test-tag","人名用","表外","N1"],_id:"3ebc9e10f8144bff47de9cc8",title:"Kanji 3000"},
  {tags:["kodansha","test-tag","人名用","表外","N1"],_id:"4ebc9e10f8144bff47de9cc8",title:"Vocab 4000"},
  {tags:["kodansha","test-tag","人名用","表外","N1"],_id:"5ebc9e10f8144bff47de9cc8",title:"Vocab 6000"},
  {tags:["kodansha","test-tag","人名用","表外","N1"],_id:"6ebc9e10f8144bff47de9cc8",title:"Vocab 8000"},
  {tags:["kodansha","test-tag","人名用","表外","N1"],_id:"7ebc9e10f8144bff47de9cc8",title:"Vocab 10000"},
]
const JOINED_COURSES = [
  '2ebc9e10f8144bff47de9cc8'
];

const CoursesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CourseCardWrapper = styled.div`
  padding: 60px;
  width: 25%;
  height: 300px;
`;

const CourseCardContainer = styled.div`
  background-color: white;
  box-shadow: 0 0 5px 1px rgb(180,180,180);
  &:focus, &:hover {
    box-shadow: 0 0 5px 1px ${props => props.theme.primary};
  }
  border-radius: 5px;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const CourseCard = ({ course, joined }) => <CourseCardWrapper>
  <CourseCardContainer>
    <div>{course.title}</div>
    {joined && <><div>Joined!</div><Link to={`/course/${course._id}`}>Go to</Link></>}
  </CourseCardContainer>
</CourseCardWrapper>;

export default () => {
  const [user] = useUser();
  const joinedCourses = Object.keys(user.courses);

  const [courses, isFetchingCourses] = useFetchNow(apiRoutes.courses());

  if (isFetchingCourses) {
    return <LoadingPlaceholder />;
  }

  return <NarrowStandardPageContainer>
    <CoursesContainer>
      {courses.map(course => <CourseCard
        joined={joinedCourses.includes(course._id)}
        course={course}
      />)}
    </CoursesContainer>
  </NarrowStandardPageContainer>;
}
