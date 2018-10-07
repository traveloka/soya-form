# API

## `createField(Component)`

Create a field component that connects to the form component above.

### Arguments

- `Component` _(ReactComponent)_: React component to be created as field component.

### Returns

_(ReactComponent)_

#### Accepts the following props

- `parseValue: (value) => parsedValue [Optional]`: Parses the value given from the field input component to the type that you want when submitting the form. Example of the use case: parse string to number, timestamp to localized date format, or extract an field from object.

```js
import React from 'react';
import { createForm, createField } from 'soya-form';

const Field = createField((props) => <input type="text" value={props.value} />);

class Form extends React.Component {
  componentDidMount() {
    this.form.setValue('testField', 3.14);
  }

  handleSubmit = () => {
    this.props.form.submit(({ values }) => {
      console.log(values.testField); // this will return 3;
    })
  }

  render() {
    return (
      <div>
        <Field name={'testField'} form={props.form} parseValue={(value) => Math.floor(Number(value)) }/>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  }
)};

export default createForm('FORM')(Form);
```

#### Return the following props

- `value` _(Any)_: Current value of the field.

```js
import { createField } from "soya-form";

export default createField(props => <input type="text" value={props.value} />);
```

- `errorMessages` _(Array.\<String|ReactComponent\>)_: A list of error messages.

```js
import { createField } from "soya-form";

export default createField(props => (
  <div>
    <input />
    {props.errorMessages.length > 0 ? (
      <span>{this.props.errorMessages[0]}</span>
    ) : null}
  </div>
));
```

- `isDisabled` _(Boolean)_: Will be true if the field is disabled, or if the form is disabled. When this value is true, render your component in a way that it only displays the value, not allowing editing.

```js
import { createField } from "soya-form";

export default createField(props => (
  <input type="text" disabled={props.isDisabled} />
));
```

- `isValidating` _(Boolean)_: Will be true if async validations on this field are currently being run. Normally used to render loading widgets so the user is aware of it loading. Here's an example:

```js
import { createField } from "soya-form";

export default createField(props => (
  <div>
    <input />
    {props.isValidating && <img src={loadingGif} />}
  </div>
));
```

- `handleChange(value)`
  You'll need to call this method when values change and you need it written to redux state tree. For example, on HTML text input component, this should be called in onChange. Pass the changed value so that it can be written to redux state tree.

- `handleAsyncValidation()`
  When this method is called, async validations registered to the field will be run against the current value stored in redux state tree. You'll need to call this method when you think it's time to run async validation. You shouldn't call this method on every change because that would be a waste of bandwidth. You can call this in onBlur or create your own interval to validate every N seconds, it's your call.

- `setDefaultValue(value)`
  Sets default value to the field. Value won't be set if field is already initiated, so setDefaultValue() won't work twice (unless if you clear the form). A good pattern is to read default value from props and set it on componentWillMount() and componentWillReceiveProps(), like so:

```js
import React from 'react';
import { createField } from 'soya-next';

class TextInput extends React.Component {
  ...
  componentWillMount() {
    if (this.props.defaultValue) {
      this.props.setDefaultValue(this.props.defaultValue);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultValue) {
      this.props.setDefaultValue(this.props.defaultValue);
    }
  }
  ...
}

export default createField(TextInput);
```

## `createForm([formId])`

Accepts the ID of the form. The form ID must be unique.

### Arguments

- [`formId`] _(String|Function(props))_: If omitted, fallback to `formId` props.

### Returns

_(Function)_: A higher order React component class that passed `form` object. See [form](#form) section for documentation.

### Examples

- Create form using `contact` as form ID

```js
import { createForm } from "soya-form";

export default createForm("FORM_ID")(({ form }) => {
  // TODO: render your form component
});
```

- Create form using `id` props as form ID

```js
import { createForm } from "soya-form";

export default createForm(props => props.id)(({ form }) => {
  // TODO: render your form component
});
```

## `createRepeatable(Component)`

Create repeatable field component that connects to the form component above and renders list of field components.

### Arguments

- `Component` _(ReactComponent)_: React component to be created as repeatable field component.

### Returns

_(ReactComponent)_: Repeatable field component that passes the following props:

- `index` _(Number)_: The index of each field components.
- `totalItem` _(Number)_: Total of rendered field components.
- `name(name)` _(Function)_: Concatenates field names hierarchically.
- `addListItem()` _(Function)_: Add new field component.
- `removeListItem(index)` _(Function)_: Remove a field component at `index`.
- `reorderListItem(index, targetIndex)` _(Function)_: Move a field component from `targetIndex` to `index`.
- `reorderListItemDec(index, amount)` _(Function)_: Move down `amount` times a field component at `index`.
- `reorderListItemInc(index, amount)` _(Function)_: Move up `amount` times a field component at `index`.

## `createRepeatableAction(Component)`

Create action component which that connects to the form component above and inject some props to be used to control repeatablefield under the same `fieldName`.

### Arguments

- `Component` _(ReactComponent)_: React component to be created as repeatable action component.

### Returns

_(ReactComponent)_: Repeatable action component that passes the following props:

- `addListItem(fieldName)()` _(Function)_: Add new field component.
- `removeListItem(fieldName)(index)` _(Function)_: Remove a field component at `index`.
- `reorderListItem(fieldName)(index, targetIndex)` _(Function)_: Move a field component from `targetIndex` to `index`.
- `reorderListItemDec(fieldName)(index, amount)` _(Function)_: Move down `amount` times a field component at `index`.
- `reorderListItemInc(fieldName)(index, amount)` _(Function)_: Move up `amount` times a field component at `index`.

### Examples :

- Separate repeatable action type

```js
import { createRepeatable, createRepetableAction } from "soya-form";

const RepeatableAction = createRepeatableAction(({ name, addListItem }) => (
  <button
    onClick={() => {
      const names = name.slice();
      if (typeof names[names.length - 1] === "string") {
        names.push(names.length);
      }
      addListItem(names)();
    }}
  >
    Add Item
  </button>
));

const RepeatableInput = createRepetable(() => (
  <input type="text" name={this.props.name("item_name")} />
));

export default createForm("FORM_ID")(({ form }) => (
  <div>
    <RepeatableAction />
    <RepeatableInput />
  </div>
));
```

## Form

You can read Form API documentation [here](./Form-API.md#form).

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
