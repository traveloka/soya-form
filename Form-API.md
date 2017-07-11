# Form API

## `addErrors(errorMessages)`
Instead of setting error messages, adding them to the existing list.

### Arguments
- `errorMessages` *(Array.\<Object\>)*: A list of error message objects with the following properties:
  - `fieldName` *(String)*: Field name.
  - `errorMessages` *(Array.\<String|ReactComponent\>)*: A list of error messages.

### Examples
```js
form.addErrors([
  {fieldName: 'firstName', errorMessages: ['This field is required']},
  {fieldName: 'lastName', errorMessages: ['This field is required']}
]);
```

## `clearErrors(fieldNames)`
Clears errors in the given field names.

### Arguments
- `fieldNames` *(Array.\<String\>)*: A list of field names.

### Examples
```js
form.clearErrors(['firstName', 'lastName']);
```

## `clearForm()`
Clears the entire form, resetting it to the uninitialized state. This means `setDefaultValue()` will work again.

### Examples
```js
form.clearForm();
```

## `disable()`
Set the form enabled state to false, this disables the entire form. For more information, please see [Disabling Fields](./Disabling-Fields.md).

### Examples
```js
form.disable();
```

## `disableField(fieldName)`
Disables a specific field. For more information, please see [Disabling Fields](./Disabling-Fields.md).

### Arguments
- `fieldName` *(String)*: Field name to be disabled.

### Examples
```js
import { createForm } from 'soya-form';

export default createForm('FORM_ID')(({ form }) => (
  <button onClick={() => form.disableField('lastName')}>Disable</button>
));
```

## `disableFields(fieldNameList)`
Disable all fields included in `fieldNameList`. For more information, please see [Disabling Fields](./Disabling-Fields.md).

### Arguments
- `fieldNameList` *(Array.\<String\>)*: A list of field names to be disabled.

### Examples
```js
import { createForm } from 'soya-form';

export default createForm('FORM_ID')(({ form }) => (
  <button onClick={() => form.disableFields(['firstName', 'lastName'])}>Disable Fields</button>
));
```

## `enable()`
Set the form enabled state to true, this enables the form. For more information, please see [Disabling Fields](./Disabling-Fields.md).

### Examples
```js
form.enable();
```

## `enableField(fieldName)`
Enables a specific field. For more information, please see [Disabling Fields](./Disabling-Fields.md).

### Arguments
- `fieldName` *(String)*: Field name to be enabled.

### Examples
```js
import { createForm } from 'soya-form';

export default createForm('FORM_ID')(({ form }) => (
  <button onClick={() => form.enableField('lastName')}>Enable</button>
));
```

## `enableFields(fieldNameList)`
Enable all fields included in `fieldNameList`. For more information, please see [Disabling Fields](./Disabling-Fields.md).

### Arguments
- `fieldNameList` *(Array.\<String\>)*: A list of field names to be enabled.

### Examples
```js
import { createForm } from 'soya-form';

export default createForm('FORM_ID')(({ form }) => (
  <button onClick={() => form.enableFields(['firstName', 'lastName'])}>Enable Fields</button>
));
```

## `getFormId()`
Get the form ID.

### Returns
*(String)*: Form ID given to the form.

### Examples
```js
import { createForm } from 'soya-form';

export default createForm('FORM_ID')(({ form }) => form.getFormId());
```

## `lockSubmission()`
Disables the entire form for submission. This is a state different from field and form enabled status. For more information, please see [Disabling Fields](./Disabling-Fields.md).

### Examples
```js
form.lockSubmission();
```

## `setDefaultValue(fieldName, value)`
Same as `setValue()`, however this won't actually set the value if the field is already initialized in redux state.

### Arguments
- `fieldName` *(String)*: Field name.
- `value` *(Any)*: Any field value.

### Examples
```js
form.setDefaultValue('firstName', 'Anri');
```

## `setDefaultValues(values)`
Same as `setValues()`, however this won't actually set the value if the field is already initialized in redux state.

### Arguments
- `values` *(Array.\<Object\>)*: An array of object with the following properties:
  - `fieldName` *(String)*: Field name.
  - `value` *(Any)*: Any field value.

### Examples
```js
form.setDefaultValues([
  {fieldName: 'firstName', value: 'Anri'},
  {fieldName: 'lastName', value: 'of Astora'}
]);
```

## `setErrors(fieldName, errorMessages)`
Sets error messages to multiple fields. `errorMessages` is a list of error messages (strings).

### Arguments
- `fieldName` *(String)*: Field name.
- `errorMessages` *(Array.\<String|ReactComponent\>)*: A list of error messages.

### Examples
```js
form.setErrors('nickname', [
  'Must not contain special characters',
  'Must be more than three letters'
]);
```

## `setValue(fieldName, value)`
Sets value to the field with the given name. Will always override.

### Arguments
- `fieldName` *(String)*: Field name.
- `value` *(Any)*: Any field value.

### Examples
```js
form.setValue('firstName', 'Anri');
```

## `setValues(values)`
Batch set value to form.

### Arguments
- `values` *(Array.\<Object\>)*: An array of object with the following properties:
  - `fieldName` *(String)*: Field name.
  - `value` *(Any)*: Any field value.

### Examples
```js
form.setValues([
  {fieldName: 'firstName', value: 'Anri'},
  {fieldName: 'lastName', value: 'of Astora'}
]);
```

## `submit(callback, [formWideValidation])`
Disables the form and runs all sync and async validations on all fields registered to the form.

### Arguments
- `callback` *(Function)*: A function that accepts the validation result as the sole argument. It'll be called regardless of validation result.
- [`formWideValidation`] *(Function)*: Useful if you want to do validations that deal with multiple fields at once (password confirmation fields, for example). This function will be called only if the values pass sync and async validations of each field. The function accepts a single argument, the values map itself, and must return a validation result structure (see examples for more detail).

### Examples
```js
import { createForm } from 'soya-form';

const callback = function(result) {
  if (result.isValid) {
     // You can access form values with result.values
  }
};

const formWideValidation = function(data) {
  if (data.password !== data.passwordConfirm) {
    return {
      isValid: false,
      errorMessages: [
        {fieldName: 'passwordConfirm', messages: ['Value must be the same as password field.']}
      ]
    };
  }
  return {isValid: true, errorMessages:{}};
};

export default createForm('FORM_ID')(({ form }) => (
  <button
    type='submit'
    onClick={() => form.submit(callback, formWideValidation)}
  >
    Submit
  </button>
));
```

## `unlockSubmission()`
Enables the entire form for submission. This is a state different from field and form enabled status. For more information, please see [Disabling Fields](./Disabling-Fields.md).

### Examples
```js
form.unlockSubmission();
```
