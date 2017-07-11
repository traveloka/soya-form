# soya-form
[![Build Status](https://travis-ci.org/traveloka/soya-form.svg?branch=master)](https://travis-ci.org/traveloka/soya-form)
[![Coverage Status](https://coveralls.io/repos/github/traveloka/soya-form/badge.svg?branch=master)](https://coveralls.io/github/traveloka/soya-form?branch=master)

React form library for soya.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Documentation](#documentation)
  - [Input and Field](#input-and-field)
  - [Rendering Fields](#rendering-fields)
  - [Complex field names](#complex-field-names)
  - [API](#api)
- [License](#license)

## Prerequisites
The form library uses Redux. So before starting, we recommend reading [Redux](http://redux.js.org) documentation first.

## Documentation

### Input and Field
Input component's purpose is to gather input from user and report it to an owner component via callback props. It also accepts value from props and renders it to the user. This Input component is processed with the `createField()` helper, wrapping it with a higher order component that writes to and reads from redux store state (`FormSegment`, to be precise). Field is what we call an Input component that's wrapped so that it's connected to redux state.

Here's an example of a simple Input component (no async validations, disabled state, error messages, only taking input and calling the callback):

```js
import React from 'react';
import { createField } from 'soya-form';

class TextInput extends React.Component {
  render() {
    return <input type="text" value={this.props.value} onChange={this.handleChange.bind(this)} />
  }

  handleChange(event) {
    // Callback is provided by higher order component.
    this.props.handleChange(event.target.value, event);
  }
}

export default createField(TextInput);
```

Soya's form library doesn't care what goes on inside Input component, it's the developer's prerogative. Input component might render into canvas or read user's input from mouse movements, it's up to you. The form library also doesn't care about the nature of the value, it can be string, list, or a complex object - as long as it's acceptable to store it in redux state (this rules out types like functions or class instances).

The only contract is for Input fields to call the callback functions provided by the higher order components. To see the list of callback functions and other props provided by the higher order component, go to [Field API](Field-API).

### Rendering Fields
Before rendering the Field component, we need to first create a `Form` component. This class's purpose is to represent a form, a place where all fields can register to, and orchestrating actions like form-wide validation. To create a `Form` component, simply give it a unique id:

```js
import { createForm } from 'soya-form';

export default createForm('FORM_ID')(Component);
```

When we've created a proper Field component, we can just render it by passing the field's name:

```js
<TextField name="firstName" />
```

This will render a component that reads and writes to `form` segment in the state tree, creating this structure:

```json
{
  "form": {
    "FORM_ID": {
      "fields": {
        "firstName": {
          "value": null,
          "errorMessages": [],
          "isEnabled": true,
          "isValidating": false
        }
      },
      "isEnabled": true
    }
  }
}
```

To submit the form, we can call the `Form` instance's `submit` method, like this:

```js
const callback = function(result) {
  if (result.isValid) {
    // Access form values with result.values
  }
};
```

Here's an example of result object, based on examples above:

```json
{
  "isValid": true,
  "values": {
    "firstName": "Rick"
  }
}
```

For more information about the `submit` method, please see [Form API](./Form-API.md#form-api).

### Complex field names
Field names can be complex. For example:

```js
<TextField name={['name', 'first']} />
<TextField name={['name', 'last']} />
```

The above components will result in the following values map:

```json
{
  "name": {
    "first": "...",
    "last": "..."
  }
}
```

We can also create list, by inserting numbers instead of string in the `name` prop:

```js
<TextField name={['wishlist', 0]} />
<TextField name={['wishlist', 1]} />
```

This results in the following values map:

```json
{
  "wishlist": [
    "...",
    "..."
  ]
}
```

This complex name forms the basis of [Repeatable Fields](#repeatable-fields).

### API
You can read the API documentation [here](./API.md#api).
  - [`createField(Component)`](./API.md#createfieldcomponent)
  - [`createForm([formId])`](./API.md#createformformid)
  - [`createRepeatable(Component)`](./API.md#createrepeatablecomponent)
  - [Form](./Form-API.md#form-api)
    - [`addErrors(errorMessages)`](./Form-API.md#adderrorserrormessages)
    - [`clearErrors(fieldNames)`](./Form-API.md#clearerrorsfieldnames)
    - [`clearForm()`](./Form-API.md#clearform)
    - [`disable()`](./Form-API.md#disable)
    - [`disableField(fieldName)`](./Form-API.md#disablefieldfieldname)
    - [`disableFields(fieldNameList)`](./Form-API.md#disablefieldsfieldnamelist)
    - [`enable()`](./Form-API.md#enable)
    - [`enableField(fieldName)`](./Form-API.md#enablefieldfieldname)
    - [`enableFields(fieldNameList)`](./Form-API.md#enablefieldsfieldnamelist)
    - [`getFormId()`](./Form-API.md#getformid)
    - [`lockSubmission()`](./Form-API.md#locksubmission)
    - [`setDefaultValue(fieldName, value)`](./Form-API.md#setdefaultvaluefieldname-value)
    - [`setDefaultValues(values)`](./Form-API.md#setdefaultvaluesvalues)
    - [`setErrors(fieldName, errorMessages)`](./Form-API.md#seterrorsfieldname-errormessages)
    - [`setValue(fieldName, value)`](./Form-API.md#setvaluefieldname-value)
    - [`setValues(values)`](./Form-API.md#setvaluesvalues)
    - [`submit(callback, [formWideValidation])`](./Form-API.md#submitcallback-formwidevalidation)
    - [`unlockSubmission()`](./Form-API.md#unlocksubmission)

## License
MIT
