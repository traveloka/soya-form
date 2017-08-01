import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import _createRepeatable from '../src/_createRepeatable';

describe('repeatable container', () => {
  const reduceMockProps = (props, name) => ({
    ...props,
    [name]: jest.fn(),
  });

  class Repeatable extends React.Component {
    render() {
      return <div />;
    }
  }

  it('should create 3 repeatable components', () => {
    const RepeatableContainer = _createRepeatable(Repeatable);
    const props = {
      init: jest.fn(),
      length: 3,
      name: ['foo'],
      form: {
        ...[
          'lockSubmission',
          'unlockSubmission',
          'disable',
          'enable',
          'disableField',
          'enableField',
          'disableFields',
          'enableFields',
          'setValue',
          'setValues',
          'setDefaultValue',
          'setDefaultValues',
          'setErrors',
          'addErrors',
          'clearForm',
          'clearErrors',
          'getFormId',
          'regField',
          'unregField',
          'validateAll',
          'submit',
        ].reduce(reduceMockProps, {}),
      },
      ...[
        'addListItem',
        'removeListItem',
        'reorderListItem',
        'reorderListItemDec',
        'reorderListItemInc',
      ].reduce(reduceMockProps, {}),
    };
    const renderer = createRenderer();
    expect(
      renderer.render(<RepeatableContainer {...props} />)
    ).toMatchSnapshot();
  });
});
