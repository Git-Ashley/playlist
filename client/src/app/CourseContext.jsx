import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from "react-router";
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    apiFetch(apiRoutes.course(courseId))
      .then(setCourse)
      .catch(console.log);
  }, []);

  return (<CourseContext.Provider value={[course, setCourse]}>
    {children}
  </CourseContext.Provider>);
};

export const useCourse = () => useContext(CourseContext);
