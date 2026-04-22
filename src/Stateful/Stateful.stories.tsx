import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";
import { Stateful } from "./Stateful";

const meta = {
  title: "Stateful",
  component: Stateful,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Stateful>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
