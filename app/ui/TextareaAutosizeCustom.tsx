import * as React from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { forwardRef } from 'react';

const TextareaAutosizeCustom = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => {
  return <TextareaAutosize ref={ref} aria-label="empty textarea" placeholder="Type anything…" {...props} maxRows={3}/>;
});

const purple = {
  50: '#f5f3ff',
  100: '#ede9fe',
  200: '#ddd6fe',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',
  600: '#7c3aed',
  700: '#6d28d9',
  800: '#5b21b6',
  900: '#4c1d95',
  950: '#2e1065',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  margin: auto;
  resize: none;
  width: 100%;
  color: ${theme.palette.mode === 'dark' ? grey[300] : purple[500]};
  background-color: rgb(209 213 219);
  border: none;

  // firefox
  &:focus-visible {
    outline: 0;
  }

`,
);

export default TextareaAutosizeCustom;
