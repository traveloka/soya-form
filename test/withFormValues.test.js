import React from "react";
import TestUtils from "react-dom/test-utils";
import TestRenderer from "react-test-renderer";
import { Provider } from "react-redux";
import { createConfigureStore } from "soya-next/redux";
import {
  createField,
  createForm,
  withFormValues,
  createRepeatable
} from "../src";
import { CONTEXT_NAME } from "../src/_constants";

let store;
const configureStore = createConfigureStore();

describe("WithFormValues", () => {
  beforeEach(() => {
    store = configureStore();
  });

  const ArrayField = createRepeatable(({ name }) => (
    <div>
      <InputField name={name("title")} />
      <InputField name={name("start")} />
      <InputField name={name("end")} />
    </div>
  ));
  const InputField = createField(({ handleChange, name, value }) => (
    <input
      type="text"
      name={name}
      value={value}
      onChange={e => handleChange(e.target.value)}
    />
  ));
  const FORM_ID = "mockForm";
  const Component = ({ formValues }) => JSON.stringify(formValues);
  const FlatFormValues = withFormValues(FORM_ID, ["firstName", "lastName"])(
    Component
  );
  const DeepFormValues = withFormValues(FORM_ID, ["firstName", ["address", "streetName"], ["experiences", 0, "title"]])(
    Component
  );
  const MockForm = createForm(FORM_ID)(() => (
    <form>
      <InputField name="firstName" />
      <InputField name="middleName" />
      <InputField name="lastName" />
      <InputField name={["address", "streetName"]} />
      <InputField name={["address", "streetNo"]} />
      <InputField name={["address", "city"]} />
      <InputField name={["address", "countryCode"]} />
      <InputField name={["address", "contact"]} />
      <ArrayField name="experiences" />
      <FlatFormValues />
      <DeepFormValues />
    </form>
  ));

  it("should have formValues prop", () => {
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm />
      </Provider>
    );
    const { root } = renderer;
    expect(root.findAllByType(Component).map(component => component.props)).toMatchSnapshot();
  });
});
