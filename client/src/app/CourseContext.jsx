import React, { createContext, useContext, useEffect } from 'react';
import { useParams } from "react-router";
import apiRoutes from 'app/apiRoutes';
import useFetch from 'hooks/useFetch';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const { courseId } = useParams();
  const [fetchCourse, course] = useFetch(apiRoutes.course(courseId));

  useEffect(() => {
    fetchCourse();
  }, []);

  return (<CourseContext.Provider value={course}>
    {children}
  </CourseContext.Provider>);
};

export const useCourse = () => useContext(CourseContext);