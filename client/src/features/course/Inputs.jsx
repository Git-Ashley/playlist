import React from 'react';
import styled from 'styled-components';
import { useUser } from 'app/UserContext';
import { useCourse } from 'app/CourseContext';
import Select from 'react-select';

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
  { label: 'Reviewed', value: 'AFTER' },
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
  reviewDateMode,
  sortField,
  sortMode,
  setExcludeUserTags,
  setIncludeCourseTags,
  setReviewDateMode,
  setSortField,
  setSortMode,
  onApply,
}) => {
  const user = useUser();
  const course = useCourse();

  //1. Initiate as review mode, then call onApply in a componentDidMount hook (useEffect)
  //... review date just a checkbox for toggling values btwn BEFORE / ALL.
  //2. Add ability to change shit around.
  //3. Pretty UI last.
  if (!course) {
    return 'BE PATIENT!!!';
  }
  return (
    <InputContainer>
      <div>
      {course.tags.map(tag =>
        <CheckboxInput
          key={tag}
          onChange={check => onTagCheck(check, tag, includeCourseTags, setIncludeCourseTags)}
          label={tag}
          checked={includeCourseTags.includes(tag)}
        />
      )}
      </div>
      <hr />
        <label>Review status</label>
        <Select
          options={reviewModeOptions}
          onChange={({value}) => setReviewDateMode(value)}
          value={reviewModeOptions.find(({ value }) => value === reviewDateMode)}
        />
      <hr />
        <label>Sort by</label>
        <Select
          options={sortFieldOptions}
          onChange={({value}) => setSortField(value)}
          value={sortFieldOptions.find(({ value }) => value === sortField)}
        />
        <Select
          options={sortModeOptions}
          onChange={({value}) => setSortMode(value)}
          value={sortModeOptions.find(({ value }) => value === sortMode)}
        />
      <hr />
      <CheckboxInput
        onChange={check => onTagCheck(!check, 'ignore', excludeUserTags, setExcludeUserTags)}
        label='Show ignored'
        checked={!excludeUserTags.includes('ignore')}
      />
      <button type='button' onClick={onApply}>Apply</button>
    </InputContainer>
  );
}