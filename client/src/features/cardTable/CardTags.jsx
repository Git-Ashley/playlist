/* eslint-disable-next-line react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import apiRoutes from 'app/apiRoutes';
import useFetch from 'hooks/useFetch';
import styled from 'styled-components';
import { useDispatch } from "react-redux";
import { addTag, removeTag, addTagToBlueprint } from 'data/cardsSlice';
import Modal from 'components/Modal';
import AddButton from 'components/atoms/buttons/AddButton';
import { useUser } from 'app/UserContext';
import { useCourse } from 'app/CourseContext';
import EditablePill from 'components/molecules/EditablePill';

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin: 0 5px 5px 0;
  }
`;

// OVerlay
const OverlayWrapper = styled.div`
  position: relative;
`;

const TagsDropdownWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: white;
  border-radius: 3px;
  z-index: 2;
  box-shadow: 3px 3px 5px rgba(0,0,0,0.4);

  & > * {
    padding: 5px;
    cursor: pointer;

    &:hover {
      background-color: #c5dfec;
    }
  }
`;

const TagsDropdown = ({ options, onSelect }) => {
  return (<TagsDropdownWrapper>
    {options.map(option =>
      <div
        key={option}
        onClick={e => {
          e.stopPropagation();
          onSelect(option)
        }}
      >
        {option}
      </div>)
    }
  </TagsDropdownWrapper>);
}

const DropdownOverlay = ({ options, onSelect, children }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const clickHandler = () => {
      setShowOverlay(false);
    };

    document.addEventListener('click', clickHandler);

    return () => document.removeEventListener('click', clickHandler);
  }, []);

  const handleClickOverlayContainer = useCallback((e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowOverlay(true);
  }, [showOverlay]);

  const handleSelect = (option) => {
    onSelect(option);
    setShowOverlay(false);
  }

  return <OverlayWrapper onClick={handleClickOverlayContainer}>
    {children}
    {showOverlay && <TagsDropdown
        options={options}
        onSelect={handleSelect}
      />
    }
  </OverlayWrapper>;
}
// End overlay

const NewTag = ({ onAddNewTag, tagOptions, userTag }) => {
  const [addNewTagMode, setAddNewTagMode] = useState(false);

  return (<DropdownOverlay options={tagOptions} onSelect={onAddNewTag}>
    <AddButton color={userTag ? window.USER_TAG_COLOR : window.COURSE_TAG_COLOR} />
  </DropdownOverlay>);
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
    console.log('Remove tag:', tag);
  }, []);//dispatch(removeUserTagFromCard(card._id, tag));

  const handleAddCourseTag = useCallback((tag) => {
    dispatch(addTagToBlueprint(cardId, tag));
  }, []);
  const removeCourseTagFromCardHandler = useCallback((tag) => {
    console.log('Remove tag:', tag);
  }, []);//dispatch(removeUserTagFromCard(card._id, tag));

  return <TagsContainer {...otherProps}>
    {courseTags.map(tag =>
      <EditablePill
        key={tag}
        text={tag}
        onDelete={() => removeUserTagFromCardHandler(tag)}
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
