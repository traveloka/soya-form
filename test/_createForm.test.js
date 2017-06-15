import React from 'react';
import TestUtils from 'react-dom/test-utils';
import _createForm, { __createForm } from '../src/_createForm';

const formId = 'simpleForm';
const dispatch = action => action;

describe('form container', () => {
  class Form extends React.Component {
    render() {
      return <div />;
    }
  }

  it('should receive the form in the props', () => {
    const FormContainer = _createForm()(Form);
    const tree = TestUtils.renderIntoDocument(<FormContainer formId={formId} dispatch={dispatch} />);
    const form = TestUtils.findRenderedComponentWithType(tree, Form);
    expect(form.props.form.getFormId()).toBe(formId);
  });
});

describe('form', () => {
  let fields, fieldNames, form;

  beforeEach(() => {
    fields = {};
    fieldNames = [];
    form = __createForm(fields, fieldNames)(formId, dispatch);
  });

  it('should dispatch an action to lock submission', () => {
    expect(form.lockSubmission()).toMatchSnapshot();
  });

  it('should dispatch an action to unlock submission', () => {
    expect(form.unlockSubmission()).toMatchSnapshot();
  });

  it('should dispatch an action to disable form', () => {
    expect(form.disable()).toMatchSnapshot();
  });

  it('should dispatch an action to enable form', () => {
    expect(form.enable()).toMatchSnapshot();
  });

  it('should dispatch an action to disable field', () => {
    expect(form.disableField(['foo'])).toMatchSnapshot();
    expect(form.disableField(['foo', 'bar'])).toMatchSnapshot();
  });

  it('should dispatch an action to enable field', () => {
    expect(form.enableField(['foo'])).toMatchSnapshot();
    expect(form.enableField(['foo', 'bar'])).toMatchSnapshot();
  });

  it('should dispatch an action to disable fields', () => {
    expect(form.disableFields([['foo'], ['bar']])).toMatchSnapshot();
    expect(form.disableFields([['foo', 'bar'], ['oof', 'rab']])).toMatchSnapshot();
  });

  it('should dispatch an action to enable fields', () => {
    expect(form.enableFields([['foo'], ['bar']])).toMatchSnapshot();
    expect(form.enableFields([['foo', 'bar'], ['oof', 'rab']])).toMatchSnapshot();
  });

  it('should dispatch an action to set value', () => {
    expect(form.setValue(['foo'], 'Hello')).toMatchSnapshot();
    expect(form.setValue(['foo', 'bar'], 'Hello World')).toMatchSnapshot();
  });

  it('should dispatch an action to set values', () => {
    expect(form.setValues([{
      fieldName: ['foo'],
      value: 'Hello',
    }, {
      fieldName: ['foo', 'bar'],
      value: 'Hello World',
    }])).toMatchSnapshot();
  });

  it('should dispatch an action to set default value', () => {
    expect(form.setDefaultValue(['foo'], 'Hello')).toMatchSnapshot();
    expect(form.setDefaultValue(['foo', 'bar'], 'Hello World')).toMatchSnapshot();
  });

  it('should dispatch an action to set default values', () => {
    expect(form.setDefaultValues([{
      fieldName: ['foo'],
      value: 'Hello',
    }, {
      fieldName: ['foo', 'bar'],
      value: 'Hello World',
    }])).toMatchSnapshot();
  });

  it('should dispatch an action to set error messages', () => {
    expect(form.setErrors(['foo'], ['Error 1', 'Error 2'])).toMatchSnapshot();
    expect(form.setErrors(['foo', 'bar'], ['Error 1', 'Error 2'])).toMatchSnapshot();
  });

  it('should dispatch an action to add error messages', () => {
    expect(form.addErrors(['foo'], ['Error 1', 'Error 2'])).toMatchSnapshot();
    expect(form.addErrors(['foo', 'bar'], ['Error 1', 'Error 2'])).toMatchSnapshot();
  });

  it('should dispatch an action to clear form', () => {
    expect(form.clearForm()).toMatchSnapshot();
  });

  it('should dispatch an action to clear error messages', () => {
    expect(form.clearErrors(['foo'])).toMatchSnapshot();
    expect(form.clearErrors(['foo', 'bar'])).toMatchSnapshot();
  });

  it('should register a field', () => {
    form.regField(['foo'], () => {});
    expect({
      fields,
      fieldNames,
    }).toMatchSnapshot();
  });

  it('should unregister a field', () => {
    form.regField(['foo'], () => {});
    form.regField(['bar'], () => {});
    const _previous = {
      fields: { ...fields },
      fieldNames: [ ...fieldNames ],
    };
    form.unregField(['foo']);
    form.unregField(['foo']);
    expect({
      _previous,
      current: {
        fields,
        fieldNames,
      },
    }).toMatchSnapshot();
  });

  it('should validate all registered fields', async () => {
    form.regField(['foo', 'bar'], () => Promise.resolve({
      isValid: true,
      value: 'Value 1',
      name: ['foo', 'bar'],
    }));
    form.regField(['foo', 'oof', 0], () => Promise.resolve({
      isValid: true,
      value: 'Value 2',
      name: ['foo', 'oof', 0],
    }));
    expect(await form.validateAll()).toMatchSnapshot();
  });

  it('should validate all registered fields', async () => {
    form.regField([0, 'foo'], () => Promise.resolve({
      isValid: true,
      value: 'Value 1',
      name: [0, 'foo'],
    }));
    expect(await form.validateAll()).toMatchSnapshot();
  });

  it('should throw on validations error', async () => {
    form.regField(['foo', 'bar'], () => Promise.reject(new Error('Field is required')));
    try {
      await form.validateAll();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it('should submit the form with submission callback', async () => {
    form.regField(['foo', 'bar'], () => Promise.resolve({
      isValid: false,
      value: 'Value 1',
      name: ['foo', 'bar'],
    }));
    form.regField(['foo', 'oof', 0], () => Promise.resolve({
      isValid: true,
      value: 'Value 2',
      name: ['foo', 'oof', 0],
    }));
    await form.submit((result) => {
      expect(result).toMatchSnapshot()
    });
  });

  it('should submit the form with submission and validation callback', async () => {
    form.regField(['foo', 'bar'], () => Promise.resolve({
      isValid: true,
      value: 'Value 1',
      name: ['foo', 'bar'],
    }));
    form.regField(['foo', 'oof', 0], () => Promise.resolve({
      isValid: true,
      value: 'Value 2',
      name: ['foo', 'oof', 0],
    }));
    const validationFunc1 = jest.fn();
    await form.submit(
      (result) => {
        expect(validationFunc1.mock.calls.length).toBe(1);
        expect(result).toMatchSnapshot()
      },
      validationFunc1
    );
    const validationFunc2 = jest.fn(() => Promise.resolve({
      isValid: false,
      errorMessages: ['Field must be a number'],
    }));
    await form.submit(
      (result) => {
        expect(validationFunc2.mock.calls.length).toBe(1);
        expect(result).toMatchSnapshot()
      },
      validationFunc2
    );
  });

  it('should throw on form submission error', async () => {
    form.regField(['foo', 'bar'], () => Promise.resolve({
      isValid: true,
      value: 'Hello World',
      name: ['foo', 'bar'],
    }));
    const submitFunc = jest.fn();
    try {
      await form.submit(
        submitFunc,
        () => Promise.reject(new Error('Form validation error'))
      );
    } catch (error) {
      expect(submitFunc.mock.calls.length).toBe(1);
      expect(error).toMatchSnapshot();
    }
  });

  it('should throw on form submission error', async () => {
    form.regField(['foo', 'bar'], () => Promise.reject(new Error('Form submission error')));
    try {
      await form.submit();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });
});
