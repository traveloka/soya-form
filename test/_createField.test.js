import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { __createForm } from '../src/_createForm';
import _createField from '../src/_createField';

describe('field container', () => {
  class Field extends React.Component {
    render() {
      return <div />;
    }
  }
  const reduceMockProps = value => (props, name) => ({
    ...props,
    [name]: value,
  });
  const formId = 'simpleForm';
  const FieldContainer = _createField(Field);
  let fields, fieldNames, renderer;
  let props = {
    errorMessages: [],
    name: ['foo'],
    ...[
      'isFormEnabled',
      'isFormSubmitting',
      'isDisabled',
      'isFieldEnabled',
      'isValidating',
      'touched',
    ].reduce(reduceMockProps(false), {}),
    ...[
      'setDefaultValue',
      'addErrorMessages',
      'mergeFields',
      'toggleLock',
    ].reduce(reduceMockProps(() => jest.fn()), {}),
    createHandleChange: () => () => jest.fn(),
  };

  beforeEach(() => {
    fields = {};
    fieldNames = [];
    renderer = createRenderer();
    props = {
      ...props,
      form: __createForm(fields, fieldNames)(formId, action => action),
      asyncValidators: [jest.fn(), jest.fn(), jest.fn()],
      changeValidators: [jest.fn(), jest.fn(), jest.fn()],
      submitValidators: [jest.fn(), jest.fn(), jest.fn()],
    };
    renderer.render(<FieldContainer {...props} />);
  });

  it('should create field component', () => {
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should handle register async validators', () => {
    const fieldContainer = renderer.getMountedInstance();
    fieldContainer.registerAsyncValidators([jest.fn(), jest.fn(), jest.fn()]);
    expect(fieldContainer.__asyncValidators).toMatchSnapshot();
  });

  it('should handle register change validators', () => {
    const fieldContainer = renderer.getMountedInstance();
    fieldContainer.registerChangeValidators([jest.fn(), jest.fn(), jest.fn()]);
    expect(fieldContainer.__changeValidators).toMatchSnapshot();
  });

  it('should handle register submit validators', () => {
    const fieldContainer = renderer.getMountedInstance();
    fieldContainer.registerSubmitValidators([jest.fn(), jest.fn(), jest.fn()]);
    expect(fieldContainer.__submitValidators).toMatchSnapshot();
  });

  it('should register change, async, and submit validators on mount', async () => {
    await fields[props.name].validateAll();
    expect([
      ...props.asyncValidators,
      ...props.changeValidators,
      ...props.submitValidators,
    ].reduce((sum, { mock }) => sum + mock.calls.length, 0)).toBe(9);
  });

  it('should unregister change, async, and submit validators on unmount', () => {
    renderer.unmount();
    expect({
      __fields: fields,
      __fieldNames: fieldNames,
    }).toMatchSnapshot();
  });
});
