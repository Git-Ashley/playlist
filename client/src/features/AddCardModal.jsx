import React, { useCallback, useState } from 'react';
import { useDispatch } from "react-redux";
import styled from 'styled-components';
import ConfirmModal from 'components/molecules/Modal/Confirm';
import TextField from 'components/molecules/Fields/Text';
import { PillContainer, Pill, NewTag } from 'components/molecules/TagPill';
import { useCourse } from 'app/CourseContext';
import { createCard } from 'data/cardsSlice';
import toastr from 'toastr';

const PaddedPillContainer = styled(PillContainer)`
  margin-bottom: 20px;
`;

export default ({ onClose, onCreateFinish, show }) => {
  const [value, setValue] = useState('幡');
  const [definition, setDefinition] = useState('some def');
  const [primary, setPrimary] = useState('test primary');
  const [secondary, setSecondary] = useState('');
  const [tags, setTags] = useState(['test tag']);

  const [course] = useCourse();
  const courseTagOptions = course.tags || [];

  const dispatch = useDispatch();

  const handleOnAdd = useCallback(() => {
    const newCard = {
      value,
      definition,
      primary_index: primary,
      secondary_index: secondary,
      course_tags: tags,
      course_id: course._id,
    };

    const asyncAdd = async () => {
      try {
        const { msg } = await dispatch(createCard(newCard));
        toastr.info(msg);
      } catch(e) {
        toastr.error(e.msg);
        return onClose();
      }

      if (onCreateFinish) {
        onCreateFinish();
      } else {
        onClose();
      }
    }

    asyncAdd();
  }, [dispatch, course, value, definition, primary, secondary, tags]);

  return (
    <ConfirmModal
      show={show}
      onClose={onClose}
      onDecline={onClose}
      onConfirm={handleOnAdd}
      confirmLabel='Add'
      header='Create card'
    >
      <TextField
        label='Value'
        value={value}
        onChange={e => setValue(e.target.value)}
        inputWidth={170}
      />
      <TextField
        label='Definition'
        value={definition}
        onChange={e => setDefinition(e.target.value)}
        inputWidth={170}
      />
      <TextField
        label='Primary'
        value={primary}
        onChange={e => setPrimary(e.target.value)}
        inputWidth={170}
      />
      <TextField
        label='Secondary'
        value={secondary}
        onChange={e => setSecondary(e.target.value)}
        inputWidth={170}
      />
      <PaddedPillContainer width={170}>
        {tags.map(tag =>
          <Pill
            key={tag}
            text={tag}
            onDelete={() => console.log('dlete tag')}
          />
        )}
        <NewTag
          onAddNewTag={tag => courseTagOptions.length && setTags(tags.concat(tag))}
          tagOptions={courseTagOptions}
        />
      </PaddedPillContainer>
    </ConfirmModal>
  );
}
