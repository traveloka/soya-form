import React from "react";
import { Provider } from "react-redux";
import TestRenderer from "react-test-renderer";
import { createConfigureStore } from "soya-next/redux";
import { createField, createForm, createSelector, withForm } from "../src";

let store;
const configureStore = createConfigureStore();

describe("createField", () => {
  beforeEach(() => {
    store = configureStore();
  });

  const noop = () => {}; // eslint-disable-line no-empty-function
  const InputField = createField(({ handleChange, name, value }) => (
    <input
      type="text"
      name={name}
      value={value}
      onChange={e => handleChange(e.target.value)}
    />
  ));
  const FORM_ID = "mockForm";
  const MockForm = createForm(FORM_ID)(({ children }) => (
    <form>{children}</form>
  ));

  it("should update form state on input change", () => {
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm>
          <InputField name="foo" />
        </MockForm>
      </Provider>
    );
    const { root } = renderer;
    const foo = root.findByType("input");
    foo.props.onChange({ target: { value: "bar" } });
    const selector = createSelector(store.getState(), FORM_ID);
    expect(selector.getFieldValue(["foo"])).toBe("bar");
  });

  it("should call all change handlers on input change", () => {
    const changeHandlers = [jest.fn(), jest.fn()];
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm>
          <InputField name="foo" changeHandlers={changeHandlers} />
        </MockForm>
      </Provider>
    );
    const { root } = renderer;
    const foo = root.findByType("input");
    foo.props.onChange({ target: { value: "bar" } });
    changeHandlers.forEach(handler => expect(handler).toBeCalledWith("bar"));
  });

  it("should validate on input change", () => {
    const changeValidators = [
      jest.fn(() => "Required"),
      jest.fn(() => "Min length is 5")
    ];
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm>
          <InputField name="foo" changeValidators={changeValidators} />
        </MockForm>
      </Provider>
    );
    const { root } = renderer;
    const foo = root.findByType("input");
    foo.props.onChange({ target: { value: "bar" } });
    changeValidators.forEach(handler => expect(handler).toBeCalledWith("bar"));
    const selector = createSelector(store.getState(), FORM_ID);
    expect(selector.getField(["foo"])).toMatchSnapshot();
  });

  it("should lock the form on async validation", async () => {
    const asyncValidators = [
      jest.fn(() => Promise.resolve("Required")),
      jest.fn(() => Promise.resolve("Min length is 5"))
    ];
    const ButtonSave = withForm(({ form }) => (
      <button type="submit" onSubmit={async () => await form.submit(noop)}>
        Save
      </button>
    ));

    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm>
          <InputField name="foo" asyncValidators={asyncValidators} />
          <ButtonSave />
        </MockForm>
      </Provider>
    );
    const { root } = renderer;
    const foo = root.findByType("input");
    foo.props.onChange({ target: { value: "bar" } });
    const save = root.findByType("button");
    const submitPromise = save.props.onSubmit();
    let selector = createSelector(store.getState(), FORM_ID);
    expect(selector.getField(["foo"]).isValidating).toBe(true);
    await submitPromise;
    selector = createSelector(store.getState(), FORM_ID);
    expect(selector.getField(["foo"]).isValidating).toBe(false);
    asyncValidators.forEach(handler => expect(handler).toBeCalledWith("bar"));
  });
});
