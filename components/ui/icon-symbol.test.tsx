import { render, screen } from "@testing-library/react-native";

import { IconSymbol as IconSymbolIos } from "./icon-symbol.ios";
import { IconSymbol } from "./icon-symbol.tsx";

describe("IconSymbol", () => {
  it("maps app icon names to Material icons", () => {
    render(<IconSymbol name="person.fill" color="#111111" size={20} />);

    const icon = screen.getByTestId("material-icon");
    expect(icon.props.children).toBe("person");
    expect(icon.props.color).toBe("#111111");
    expect(icon.props.size).toBe(20);
  });

  it("renders the iOS symbol variant with the same semantic name", () => {
    render(<IconSymbolIos name="person.fill" color="#222222" size={18} />);

    const symbol = screen.getByTestId("symbol-view");
    expect(symbol.props.name).toBe("person.fill");
    expect(symbol.props.tintColor).toBe("#222222");
  });
});
