import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";
import { Presentation } from "./Presentation";

const meta = {
  title: "Presentation",
  component: Presentation,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Presentation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    searchResults: ["test", "test2"],
    renderResult: (result: any, index: number) => {
      return <div>{result}</div>;
    },
  } as any,
};
