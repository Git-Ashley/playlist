/* eslint-disable-next-line react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import apiRoutes from 'app/apiRoutes';
import { useDispatch } from "react-redux";
import {
  addTag,
  removeTag,
  addTagToBlueprint,
  removeTagFromBlueprint,
} from 'data/cardsSlice';
import { useUser } from 'app/UserContext';
import { useCourse } from 'app/CourseContext';
import { PillContainer, Pill, NewTag } from 'components/molecules/TagPill';

export default ({ cardId, userTags = [], courseTags = [], ...otherProps }) => {
  const dispatch = useDispatch();
  const [user] = useUser();
  const [course] = useCourse();

  const userTagOptions = user.courses[course._id] ?
    user.courses[course._id].tags : [];
  const courseTagOptions = course.tags;

  const handleAddUserTag = useCallback((tag) => {
    dispatch(addTag(cardId, tag));
  }, []);
  const removeUserTagFromCardHandler = useCallback((tag) => {
    dispatch(removeTag(cardId, tag));
  }, []);

  const handleAddCourseTag = useCallback((tag) => {
    dispatch(addTagToBlueprint(cardId, tag));
  }, []);
  const removeCourseTagFromCardHandler = useCallback((tag) => {
    dispatch(removeTagFromBlueprint(cardId, tag));
  }, []);

  return <PillContainer {...otherProps}>
    {courseTags.map(tag =>
      <Pill
        key={tag}
        text={tag}
        onDelete={() => removeCourseTagFromCardHandler(tag)}
      />
    )}
    <NewTag onAddNewTag={handleAddCourseTag} tagOptions={courseTagOptions} />
    {userTags.map(tag =>
      <Pill
        userTag
        key={tag}
        text={tag}
        onDelete={() => removeUserTagFromCardHandler(tag)}
      />
    )}
    <NewTag userTag onAddNewTag={handleAddUserTag} tagOptions={userTagOptions} />
  </PillContainer>;
}
