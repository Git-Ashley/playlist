import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import styled, { ThemeContext } from 'styled-components';
import { useUser } from 'app/UserContext';
import { useCourse } from 'app/CourseContext';
import Select from 'components/molecules/Select';
import CreateInput from 'components/molecules/CreateInput';
import TextEntry from 'components/molecules/TextEntry';
import apiFetch from 'util/apiFetch';
import apiRoutes from 'app/apiRoutes';
import LoadingPlaceholder from 'components/molecules/LoadingPlaceholder';
import { CardOutline } from 'styles/Cards';
import Text from 'styles/Text';
import Button from 'components/atoms/buttons/Button';
import { searchCards, setPage, selectCount } from 'features/cardTable/cardTableSlice';
import { BiSearchAlt2 as SearchIcon } from 'react-icons/bi';
import AddCardModal from 'features/AddCardModal';

const InputContainer = styled(CardOutline)`
  padding: 10px;
  width: 270px;

  & > * {
    margin-bottom: 10px;
  }

  & > section {
    & > * {
      margin-bottom: 10px;
    }
  }

  & > :nth-child(3) {

  }

  & >:last-child {
    margin: auto;
  }

  @media screen and (max-width: ${props => props.theme.screen.l - 1}px) {
    & > :nth-child(n+3) {
      display: none;
    }
  }
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

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
`;

const QuickFilters = styled.div`
  display: flex;
  justify-content: space-evenly;

  & > * {
    width: 75px;
    text-align: center;
  }
`;

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

export default () => {
  const [user, setUser] = useUser();
  const [course, setCourse, isCourseLoading] = useCourse();
  const { courseId } = useParams();
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const [includeUserTags, setIncludeUserTags] = useState([]);
  const [excludeUserTags, setExcludeUserTags] = useState(['ignore']);
  const [includeCourseTags, setIncludeCourseTags] = useState([]);
  //TODO: const [excludeCourseTags, setExcludeCourseTags] = useState([]);

  const [sortField, setSortField] = useState('primary_index');
  const [sortMode, setSortMode] = useState(1);
  const [reviewDateMode, setReviewDateMode] = useState('UNLEARNT');

  const dispatch = useDispatch();
  const count = useSelector(selectCount());

  const apply = useCallback(() => {
    dispatch(searchCards({
      excludeUserTags,
      //excludeCourseTags,
      includeUserTags,
      includeCourseTags,
      reviewDateMode,
      sortField,
      sortMode,
      courseId,
    }));
    setPage(1);
  }, [
    dispatch,
    excludeUserTags,
    includeCourseTags,
    includeUserTags,
    reviewDateMode,
    sortField,
    sortMode,
  ]);

  const onSelectLearn = useCallback(() => {
    const newExcludeUserTags = ['ignore'];
    const newIncludeCourseTags = [];
    const newIncludeUserTags = [];
    const newSortField = 'primary_index';
    const newSortMode = 1;
    const newReviewDateMode = 'UNLEARNT';

    setExcludeUserTags(newExcludeUserTags);
    setIncludeUserTags(newIncludeUserTags);
    setIncludeCourseTags(newIncludeCourseTags);
    setSortField(newSortField);
    setSortMode(newSortMode);
    setReviewDateMode(newReviewDateMode);

    dispatch(searchCards({
      excludeUserTags: newExcludeUserTags,
      includeUserTags: newIncludeUserTags,
      includeCourseTags: newIncludeCourseTags,
      reviewDateMode: newReviewDateMode,
      sortField: newSortField,
      sortMode: newSortMode,
      courseId,
    }));
  }, [dispatch]);

  const onSelectReview = useCallback(() => {
    const newExcludeUserTags = ['ignore'];
    const newIncludeCourseTags = [];
    const newIncludeUserTags = [];
    const newSortField = 'review_date';
    const newSortMode = 1;
    const newReviewDateMode = 'BEFORE';

    setExcludeUserTags(newExcludeUserTags);
    setIncludeUserTags(newIncludeUserTags);
    setIncludeCourseTags(newIncludeCourseTags);
    setSortField(newSortField);
    setSortMode(newSortMode);
    setReviewDateMode(newReviewDateMode);

    dispatch(searchCards({
      excludeUserTags: newExcludeUserTags,
      includeUserTags: newIncludeUserTags,
      includeCourseTags: newIncludeCourseTags,
      reviewDateMode: newReviewDateMode,
      sortField: newSortField,
      sortMode: newSortMode,
      courseId,
    }));
  }, [course]);

  useEffect(() => {
    apply();
  }, []);

  const handleCreateUserTag = useCallback(newTag => {
    apiFetch(apiRoutes.createUserTag(courseId), {
      tag: newTag
    }).then(updatedUser => {
      if (!updatedUser || updatedUser._id !== user._id) {
        throw updatedUser;
      }

      setUser(updatedUser);
    }).catch(console.log);
  });

  const handleCreateCourseTag = useCallback(newTag => {
    apiFetch(apiRoutes.createCourseTag(courseId), {
      tag: newTag
    }).then(updatedCourse => {
      if (!updatedCourse || updatedCourse._id !== courseId) {
        throw updatedCourse;
      }

      setCourse(updatedCourse);
    }).catch(console.log);
  });

  const handleCreateFinish = useCallback(() => {
    setShowAddCardModal(false);
    apply();
  }, [apply, setShowAddCardModal]);

  const theme = useContext(ThemeContext);

  if (isCourseLoading) {
    return <LoadingPlaceholder />;
  }

  const userCourseInfo = user.courses[courseId];
  const userTags = (userCourseInfo && userCourseInfo.tags) || [];

  return (
    <InputContainer>
      <Text.SubHeader bold center>{count} Cards</Text.SubHeader>
      <QuickFilters>
        <Button onClick={onSelectLearn}>Learn</Button>
        <Button onClick={onSelectReview}>Review</Button>
      </QuickFilters>
      <Center>
        <TextEntry
          icon={SearchIcon}
          inputWidth={50}
          onEnter={kanji => dispatch(searchCards({ value: kanji }))}
          placeholder='kanji'
        />
      </Center>
      <Center>
        <Button width={100} onClick={() => setShowAddCardModal(true)}>Add card</Button>
      </Center>
      <section>
        <Text.SubHeader>Course tags</Text.SubHeader>
        {course.tags.map(tag =>
          <CheckboxInput
            key={tag}
            onChange={check => onTagCheck(check, tag, includeCourseTags, setIncludeCourseTags)}
            label={tag}
            checked={includeCourseTags.includes(tag)}
          />
        )}
        <CreateInput onCreate={handleCreateCourseTag} />
      </section>
      <section>
        <Text.SubHeader>User tags</Text.SubHeader>
        {userTags.map(tag =>
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
      </section>
      <section>
        <Text.SubHeader>Review status</Text.SubHeader>
        <Select
          backgroundColor={theme.secondaryInput}
          options={reviewModeOptions}
          onSelect={setReviewDateMode}
          value={reviewDateMode}
          width={160}
        />
      </section>
      <section>
        <Text.SubHeader>Sort by</Text.SubHeader>
        <Select
          backgroundColor={theme.secondaryInput}
          options={sortFieldOptions}
          onSelect={setSortField}
          value={sortField}
          width={160}
        />
        <Select
          backgroundColor={theme.secondaryInput}
          options={sortModeOptions}
          onSelect={setSortMode}
          value={sortMode}
          width={160}
        />
      </section>
      <CheckboxInput
        onChange={check => onTagCheck(!check, 'ignore', excludeUserTags, setExcludeUserTags)}
        label='Show ignored'
        checked={!excludeUserTags.includes('ignore')}
      />
      <Button type='button' onClick={apply}>Apply</Button>
      <AddCardModal
        show={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onCreateFinish={handleCreateFinish}
      />
    </InputContainer>
  );
}
