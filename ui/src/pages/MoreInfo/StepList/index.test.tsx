import * as React from 'react';
import { render, screen } from '@testing-library/react';

import StepList from './index';

describe('StepList', () => {
  it('renders StepList component with no steps', () => {
    render(
      <StepList
        steps={[]}
        formErrors={{ name: '', ingredients: {}, steps: {} }}
        handleMoveStepUp={(index: number) => {}}
        handleMoveStepDown={(index: number) => {}}
        handleRemoveStep={(index: number) => {}}
        handleStepOnChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
        handleAddStep={() => {}}
      />,
    );

    screen.getByText('Please press the add button to add a step');
  });

  it('renders StepList component with some steps', () => {
    render(
      <StepList
        steps={[{ id: 'step1', step: 'Cut the onion' }]}
        formErrors={{ name: '', ingredients: {}, steps: {} }}
        handleMoveStepUp={(index: number) => {}}
        handleMoveStepDown={(index: number) => {}}
        handleRemoveStep={(index: number) => {}}
        handleStepOnChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
        handleAddStep={() => {}}
      />,
    );

    screen.getByDisplayValue('Cut the onion');
  });
});
