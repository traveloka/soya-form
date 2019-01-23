import React from "react";
import TestUtils from "react-dom/test-utils";
import MaskedInput from "react-text-mask";
import { Provider } from "react-redux";
import { createConfigureStore } from "soya-next/redux";
import { createField, createForm, createSelector } from "../src";

const store = createConfigureStore()();

const MaskedInputField = createField(
  class extends React.Component {
    componentDidMount() {
      this.props.setDefaultValue(this.props.defaultValue);
    }

    render() {
      const { handleChange, name, value, mask, guide } = this.props;
      return (
        <MaskedInput
          mask={mask}
          guide={guide}
          name={name}
          value={value}
          onChange={e => handleChange(e.target.value, e)}
        />
      );
    }
  }
);
const InputField = createField(
  class extends React.Component {
    componentDidMount() {
      this.props.setDefaultValue(this.props.defaultValue);
    }

    render() {
      const { handleChange, name, value } = this.props;
      return (
        <input
          name={name}
          value={value}
          onChange={e => handleChange(e.target.value, e)}
        />
      );
    }
  }
);
const FORM_ID = "mockForm";
const FORM_ID_2 = "mockForm2";
const MockForm = createForm(FORM_ID)(props => <form {...props} />);
const MockForm2 = createForm(FORM_ID_2)(props => <form {...props} />);

describe("normalize", () => {
  it("limits allowed range of value", () => {
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MockForm2>
          <InputField
            name="foo"
            normalize={value => value < 10 ? "10" : value > 100 ? "100" : value}
            defaultValue="1"
          />
        </MockForm2>
      </Provider>
    );
    const node = TestUtils.findRenderedDOMComponentWithTag(tree, "input");
    TestUtils.Simulate.change(node);
    expect(node.value).toBe("10");
    expect(
      createSelector(
        store.getState(),
        FORM_ID_2
      ).getFieldValue(["foo"])
    ).toBe("10");

    node.value = "123";
    TestUtils.Simulate.change(node);
    expect(node.value).toBe("100");
    expect(
      createSelector(
        store.getState(),
        FORM_ID_2
      ).getFieldValue(["foo"])
    ).toBe("100");
  });

  it("stores unmasked value but displays masked value", () => {
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MockForm>
          <MaskedInputField
            name="foo"
            normalize={value => value.replace(/\D+/g, "")}
            defaultValue="123"
            mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            guide
          />
        </MockForm>
      </Provider>
    );
    const node = TestUtils.findRenderedDOMComponentWithTag(tree, "input");
    TestUtils.Simulate.change(node);
    expect(node.value).toBe("(123) ___-____");
    expect(
      createSelector(
        store.getState(),
        FORM_ID
      ).getFieldValue(["foo"])
    ).toBe("123");

    node.value = "1234";
    TestUtils.Simulate.change(node);
    expect(node.value).toBe("(123) 4__-____");
    expect(
      createSelector(
        store.getState(),
        FORM_ID
      ).getFieldValue(["foo"])
    ).toBe("1234");
  });
});
