import React from "react";
import { render } from "@testing-library/react";

import { intlEnWrapper, intlZhWrapper } from "../../LocaleContext";
import AboutDialog from "./index";

describe("For en locale", () => {
  test("renders `The Mao Kun Map` heading", () => {
    const { getByText } = render(<AboutDialog />, intlEnWrapper);
    const titleText = getByText(/^the mao kun map$/i);
    expect(titleText).toBeInTheDocument();
  });
});

describe("For zh locale", () => {
  test("renders `The Mao Kun Map` heading", () => {
    const { getByText } = render(<AboutDialog />, intlZhWrapper);
    const titleText = getByText(/^鄭和航海圖$/i);
    expect(titleText).toBeInTheDocument();
  });
});
