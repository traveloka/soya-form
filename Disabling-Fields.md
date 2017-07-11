# Disabling Fields

You can enable and disable a form in many ways. There are multiple state properties that affect whether a Field component is enabled or disabled (more information about the methods can be found in [Form API](./Form-API.md):

- Form `isEnabled` status. You can set this with `Form.enable()` and `Form.disable()`. If this is false, all fields are disabled.
- Form `isSubmitting` status. You can set this with `Form.lockSubmission()` and `Form.unlockSubmission()`. If this is true, all fields are disabled.
- Field `isEnabled` status. You can set this with `Form.enableField()` and `Form.disableField()`. If this is false, the field is disabled.
- Field `isValidating` status. This cannot be set manually. If this is true, the field is disabled.

## Why have separate `isEnabled` status for both Form and Field?

There were use cases where one field is disabled, but the rest of the form is enabled. There are also cases where you might want to disable the form, but when you're enabling the form you don't want to accidentally enable fields that was supposed to be disabled.

## Why disable the field when it's validating?

We don't disable fields when synchronous change validations are run. However we do disable the field when async validations are run. This is so that error messages does not get displayed for the wrong input value.

## Why have a separate `isSubmitting` state? Why not just use Form `isEnabled` state?

Because it's different semantically. A form that is disabled might still be submitted programmatically. There were use cases where we want to be able to submit a disabled form (disabled so that values aren't changed), but we don't want to overwrite the form's `isEnabled` state when locking the form for submission.
