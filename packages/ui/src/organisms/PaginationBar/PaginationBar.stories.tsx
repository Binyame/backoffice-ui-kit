import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PaginationBar } from './PaginationBar';

const meta = {
  title: 'Organisms/PaginationBar',
  component: PaginationBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof PaginationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive pagination
export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
      <PaginationBar
        currentPage={currentPage}
        totalPages={10}
        totalItems={95}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
};

// First page
export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 95,
    pageSize: 10,
    onPageChange: () => {},
  },
};

// Middle page
export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    totalItems: 95,
    pageSize: 10,
    onPageChange: () => {},
  },
};

// Last page
export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    totalItems: 95,
    pageSize: 10,
    onPageChange: () => {},
  },
};

// Many pages
export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50,
    totalItems: 500,
    pageSize: 10,
    onPageChange: () => {},
  },
};

// Few pages
export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    totalItems: 25,
    pageSize: 10,
    onPageChange: () => {},
  },
};

// Single page
export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 5,
    pageSize: 10,
    onPageChange: () => {},
  },
};

// Without page size selector
export const WithoutPageSize: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    totalItems: 95,
    pageSize: 10,
    showPageSize: false,
    onPageChange: () => {},
  },
};

// Loading state
export const Loading: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    totalItems: 95,
    pageSize: 10,
    loading: true,
    onPageChange: () => {},
  },
};
