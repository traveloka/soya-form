import React from "react";
import { Provider } from "react-redux";
import TestRenderer from "react-test-renderer";
import { createConfigureStore } from "soya-next/redux";
import {
  createField,
  createForm,
  createRepeatable,
  createRepeatableAction
} from "../src";

let store;
const configureStore = createConfigureStore();

describe("createRepeatable", () => {
  beforeEach(() => {
    store = configureStore();
  });

  const mockData = [
    ["web engineer", "01-08-2015", "01-08-2016"],
    ["web intern", "01-08-2016", "01-08-2017"],
    ["web architect", "01-08-2017", "01-08-2018"]
  ];
  const InputField = createField(({ handleChange, name, value }) => (
    <input
      type="text"
      name={`${name}`}
      value={value}
      onChange={e => handleChange(e.target.value)}
    />
  ));
  const Up = props => <button {...props}>Up</button>;
  const Down = props => <button {...props}>Down</button>;
  const Add = props => <button {...props}>Add</button>;
  const Remove = props => <button {...props}>Remove</button>;
  const Experience = ({
    name,
    index,
    addListItem,
    removeListItem,
    reorderListItemDec,
    reorderListItemInc
  }) => (
    <div>
      <InputField name={name("title")} />
      <InputField name={name("start")} />
      <InputField name={name("end")} />
      <Up onClick={() => reorderListItemDec(index, 1)} />
      <Down onClick={() => reorderListItemInc(index, 1)} />
      <Add onClick={() => addListItem()} />
      <Remove onClick={() => removeListItem(index)} />
    </div>
  );
  const ArrayField = createRepeatable(Experience);
  const FORM_ID = "mockForm";
  const MockForm = createForm(FORM_ID)(({ children }) => (
    <form>
      <ArrayField name="experiences" minLength={3} />
    </form>
  ));

  const ArrayFieldAction = createRepeatableAction(({ name, addListItem }) => (
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

  const MockForm2 = createForm(FORM_ID)(({ children }) => (
    <form>
      <ArrayFieldAction name="experiences" />
      <ArrayField name="experiences" minLength={3} />
    </form>
  ));

  it("should render repeatable component", () => {
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm />
      </Provider>
    );
    expect(renderer).toMatchSnapshot();
  });

  it("should render repeatable component on change", () => {
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm />
      </Provider>
    );
    const { root } = renderer;
    const arrays = root.findAllByType(Experience);
    mockData.forEach((experience, index) => {
      arrays[index].findAllByType("input").forEach((input, index) => {
        input.props.onChange({ target: { value: experience[index] } });
      });
    });
    expect(renderer).toMatchSnapshot();
  });

  it("should render moved repeatable component", () => {
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm />
      </Provider>
    );
    const { root } = renderer;
    const ups = root.findAllByType(Up);
    const downs = root.findAllByType(Down);
    const arrays = root.findAllByType(Experience);
    mockData.forEach((experience, index) => {
      arrays[index].findAllByType("input").forEach((input, index) => {
        input.props.onChange({ target: { value: experience[index] } });
      });
    });
    downs[0].props.onClick();
    ups[2].props.onClick();
    expect(renderer).toMatchSnapshot();
  });

  it("should render added repeatable component", () => {
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm />
      </Provider>
    );
    const { root } = renderer;
    const adds = root.findAllByType(Add);
    adds[0].props.onClick();
    expect(renderer).toMatchSnapshot();
  });

  it("should remove repeatable component", () => {
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm />
      </Provider>
    );
    const { root } = renderer;
    const adds = root.findAllByType(Add);
    adds[0].props.onClick();
    const removes = root.findAllByType(Remove);
    removes[2].props.onClick();
    expect(renderer).toMatchSnapshot();
  });

  it("should render repeatable action component", () => {
    const renderer = TestRenderer.create(
      <Provider store={store}>
        <MockForm2 />
      </Provider>
    );
    expect(renderer).toMatchSnapshot();
  });
});
