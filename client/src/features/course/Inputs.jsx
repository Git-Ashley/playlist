import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useUser } from 'app/UserContext';
import { useCourse } from 'app/CourseContext';
import Select from 'components/molecules/Select';
import CreateInput from 'components/molecules/CreateInput';
import apiFetch from 'util/apiFetch';
import apiRoutes from 'app/apiRoutes';
import LoadingPlaceholder from 'components/molecules/LoadingPlaceholder';

const InputContainer = styled.div`
`;

const onTagCheck = (check, tag, tagSet, setTagSet) => {
  const newArr = [...tagSet];
  if (check && !newArr.includes(tag)) {
    newArr.push(tag);
  } else if (!check && newArr.includes(tag)) {
    var index = newArr.indexOf(tag);
    newArr.splice(index, 1);
  }
  setTagSet(newArr)
};

const CheckboxInput = ({ label, checked = false, onChange, htmlFor }) => (
  <div>
    <input
        id={htmlFor || label}
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
    />
    <label style={{userSelect: 'none'}} htmlFor={htmlFor || label}>{label}</label>
  </div>
);

const reviewModeOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Needs review', value: 'BEFORE' },
  { label: 'Learnt', value: 'LEARNT' },
  { label: 'Unlearnt', value: 'UNLEARNT' },
];

const sortFieldOptions = [
  { label: 'Primary index', value: 'primary_index' },
  { label: 'Secondary index', value: 'secondary_index' },
  { label: 'Tertiary index', value: 'tertiary_index' },
  { label: 'Review date', value: 'review_date' },
];

const sortModeOptions = [
  { label: 'Ascending', value: 1 },
  { label: 'Descending', value: -1 },
];

export default ({
  excludeUserTags,
  includeCourseTags,
  includeUserTags,
  reviewDateMode,
  sortField,
  sortMode,
  setExcludeUserTags,
  setIncludeCourseTags,
  setIncludeUserTags,
  setReviewDateMode,
  setSortField,
  setSortMode,
  onApply,
}) => {
  const [user, setUser] = useUser();
  const [course, setCourse] = useCourse();

  const handleCreateUserTag = useCallback(newTag => {
    apiFetch(apiRoutes.createUserTag(course._id), {
      tag: newTag
    }).then(updatedUser => {
      if (!updatedUser || updatedUser._id !== user._id) {
        throw updatedUser;
      }

      setUser(updatedUser);
    }).catch(console.log);
  });

  const handleCreateCourseTag = useCallback(newTag => {
    apiFetch(apiRoutes.createCourseTag(course._id), {
      tag: newTag
    }).then(updatedCourse => {
      if (!updatedCourse || updatedCourse._id !== course._id) {
        throw updatedCourse;
      }

      setCourse(updatedCourse);
    }).catch(console.log);
  });

  if (!course) {
    return <LoadingPlaceholder />;
  }

  return (
    <InputContainer>
      <div>
        <label>Course tags</label>
        {course.tags.map(tag =>
          <CheckboxInput
            key={tag}
            onChange={check => onTagCheck(check, tag, includeCourseTags, setIncludeCourseTags)}
            label={tag}
            checked={includeCourseTags.includes(tag)}
          />
        )}
        <CreateInput onCreate={handleCreateCourseTag} />
      </div>
      <hr />
      <div>
        <label>User tags</label>
        {user.courses[course._id].tags.map(tag =>
          <CheckboxInput
              key={tag}
              onChange={check => onTagCheck(check, tag, includeUserTags, setIncludeUserTags)}
              label={tag}
              checked={includeUserTags.includes(tag)}
          />
        )}
        <CheckboxInput
            key='ignore'
            onChange={check => onTagCheck(check, 'ignore', includeUserTags, setIncludeUserTags)}
            label='ignore'
            checked={includeUserTags.includes('ignore')}
        />
        <CreateInput onCreate={handleCreateUserTag} />
      </div>
      <hr />
        <label>Review status</label>
        <Select
          options={reviewModeOptions}
          onSelect={setReviewDateMode}
          value={reviewDateMode}
        />
      <hr />
        <label>Sort by</label>
        <Select
          options={sortFieldOptions}
          onSelect={setSortField}
          value={sortField}
        />
        <Select
          options={sortModeOptions}
          onSelect={setSortMode}
          value={sortMode}
        />
      <hr />
      <CheckboxInput
        onSelect={check => onTagCheck(!check, 'ignore', excludeUserTags, setExcludeUserTags)}
        label='Show ignored'
        checked={!excludeUserTags.includes('ignore')}
      />
      <button type='button' onClick={onApply}>Apply</button>
    </InputContainer>
  );
}
