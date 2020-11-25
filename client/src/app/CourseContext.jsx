import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from "react-router";
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch(apiRoutes.course(courseId))
      .then(course => {
        setCourse(course);
        setIsLoading(false);
      })
      .catch(console.log);
  }, []);

  return (<CourseContext.Provider value={[course, setCourse, isLoading]}>
    {children}
  </CourseContext.Provider>);
};

export const useCourse = () => useContext(CourseContext);
