/* eslint-disable-next-line react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useContext } from 'react';
import apiRoutes from 'app/apiRoutes';
import styled, { ThemeContext } from 'styled-components';
import { useDispatch } from "react-redux";
import {
  addTag,
  removeTag,
  addTagToBlueprint,
  removeTagFromBlueprint,
} from 'data/cardsSlice';
import AddButton from 'components/atoms/buttons/AddButton';
import ListOverlay from 'components/atoms/ListOverlay';
import { useUser } from 'app/UserContext';
import { useCourse } from 'app/CourseContext';
import EditablePill from 'components/molecules/EditablePill';

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin: 0 5px 5px 0;
    vertical-align: middle;
    display: inline-block;
  }
`;

const NewTag = ({ onAddNewTag, tagOptions, userTag }) => {
  const themeContext = useContext(ThemeContext);

  return (<ListOverlay overlayPosition={{ bottom: 8, left: 8 }} options={tagOptions} onSelect={onAddNewTag}>
    <AddButton color={userTag ? themeContext.userTag : themeContext.courseTag} />
  </ListOverlay>);
}

export default ({ cardId, userTags = [], courseTags = [], ...otherProps }) => {
  const dispatch = useDispatch();
  const [user] = useUser();
  const [course] = useCourse();

  const userTagOptions = user.courses[course._id].tags;
  const courseTagOptions = course.tags;

  console.log('userTags: ', userTags);
  console.log('courseTags: ', courseTags);

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

  return <TagsContainer {...otherProps}>
    {courseTags.map(tag =>
      <EditablePill
        key={tag}
        text={tag}
        onDelete={() => removeCourseTagFromCardHandler(tag)}
      />
    )}
    <NewTag onAddNewTag={handleAddCourseTag} tagOptions={courseTagOptions} />
    {userTags.map(tag =>
      <EditablePill
        userTag
        key={tag}
        text={tag}
        onDelete={() => removeUserTagFromCardHandler(tag)}
      />
    )}
    <NewTag userTag onAddNewTag={handleAddUserTag} tagOptions={userTagOptions} />
  </TagsContainer>;
}
