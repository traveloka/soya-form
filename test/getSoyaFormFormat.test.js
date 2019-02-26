import {
  transform,
  transformObject,
  transformArray
} from "../src/getSoyaFormFormat";

const exampleObjectInput = {
  simple: "value",
  nested: {
    simple: "value"
  },
  deep: {
    nested: {
      complex: "value"
    }
  },
  simpleArray: ["1"],
  nestedWith: {
    simpleArray: [1, 3]
  }
};

const exampleArrayInput = [
  "test",
  1,
  {
    objectInsideArray: {
      nested: {
        complex: "value"
      },
      andHaveArray: [
        1,
        {
          anotherComplexObjToo: "one"
        }
      ]
    }
  }
];

const exampleMixedInput = {
  simple: "simple value",
  array: [1, 2, 3],
  boolean: true,
  fieldNull: null,
  nested: {
    object: "nested object",
    test: ["again", 1, 2]
  },
  another: {
    deep: {
      nested: {
        obj: "val"
      },
      sibling: 2
    }
  },
  arrayOfObject: [
    {
      name: "a",
      value: "b",
      nested: ["array again"]
    },
    {
      name: "c",
      value: "d",
      differentKey: "e"
    }
  ]
};

describe("getSoyaFormFormat", () => {
  describe("transformObject", () => {
    test("with empty parentKeys", () => {
      expect(transformObject(exampleObjectInput, [])).toEqual([
        { fieldName: ["simple"], value: "value" },
        { fieldName: ["nested", "simple"], value: "value" },
        { fieldName: ["deep", "nested", "complex"], value: "value" },
        { fieldName: ["simpleArray", 0], value: "1" },
        { fieldName: ["nestedWith", "simpleArray", 0], value: 1 },
        { fieldName: ["nestedWith", "simpleArray", 1], value: 3 }
      ]);
    });

    test("with Non-empty parentKeys", () => {
      expect(transformObject(exampleObjectInput, ["base"])).toEqual([
        { fieldName: ["base", "simple"], value: "value" },
        { fieldName: ["base", "nested", "simple"], value: "value" },
        { fieldName: ["base", "deep", "nested", "complex"], value: "value" },
        { fieldName: ["base", "simpleArray", 0], value: "1" },
        { fieldName: ["base", "nestedWith", "simpleArray", 0], value: 1 },
        { fieldName: ["base", "nestedWith", "simpleArray", 1], value: 3 }
      ]);
    });
  });

  describe("transformArray", () => {
    test("with empty parentKeys", () => {
      expect(transformArray(exampleArrayInput, [])).toEqual([
        { fieldName: [0], value: "test" },
        { fieldName: [1], value: 1 },
        {
          fieldName: [2, "objectInsideArray", "nested", "complex"],
          value: "value"
        },
        {
          fieldName: [2, "objectInsideArray", "andHaveArray", 0],
          value: 1
        },
        {
          fieldName: [
            2,
            "objectInsideArray",
            "andHaveArray",
            1,
            "anotherComplexObjToo"
          ],
          value: "one"
        }
      ]);
    });

    test("with Non-empty parentKeys", () => {
      expect(transformArray(exampleArrayInput, ["base"])).toEqual([
        { fieldName: ["base", 0], value: "test" },
        { fieldName: ["base", 1], value: 1 },
        {
          fieldName: ["base", 2, "objectInsideArray", "nested", "complex"],
          value: "value"
        },
        {
          fieldName: ["base", 2, "objectInsideArray", "andHaveArray", 0],
          value: 1
        },
        {
          fieldName: [
            "base",
            2,
            "objectInsideArray",
            "andHaveArray",
            1,
            "anotherComplexObjToo"
          ],
          value: "one"
        }
      ]);
    });
  });

  describe("transform", () => {
    expect(transform(exampleMixedInput)).toEqual([
      { fieldName: "simple", value: "simple value" },
      { fieldName: ["array", 0], value: 1 },
      { fieldName: ["array", 1], value: 2 },
      { fieldName: ["array", 2], value: 3 },
      { fieldName: "boolean", value: true },
      { fieldName: "fieldNull", value: null },
      { fieldName: ["nested", "object"], value: "nested object" },
      { fieldName: ["nested", "test", 0], value: "again" },
      { fieldName: ["nested", "test", 1], value: 1 },
      { fieldName: ["nested", "test", 2], value: 2 },
      {
        fieldName: ["another", "deep", "nested", "obj"],
        value: "val"
      },
      { fieldName: ["another", "deep", "sibling"], value: 2 },
      { fieldName: ["arrayOfObject", 0, "name"], value: "a" },
      { fieldName: ["arrayOfObject", 0, "value"], value: "b" },
      {
        fieldName: ["arrayOfObject", 0, "nested", 0],
        value: "array again"
      },
      { fieldName: ["arrayOfObject", 1, "name"], value: "c" },
      { fieldName: ["arrayOfObject", 1, "value"], value: "d" },
      {
        fieldName: ["arrayOfObject", 1, "differentKey"],
        value: "e"
      }
    ]);
  });
});
