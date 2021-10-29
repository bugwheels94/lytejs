// Button.stories.ts | Button.stories.tsx

import React from 'react'

import { Meta } from '@storybook/react';

import { FormItem, Form } from './index';

export default {
  component: FormItem,
  title: 'Components/FormInput',
} as Meta;

export const Primary: React.VFC<{}> = () => <Form><FormItem name="ankit" label="heu" /><FormItem name="ankit2" /></Form>;