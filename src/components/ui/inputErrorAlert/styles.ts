import styled from 'styled-components';

export const ErrorMessage = styled.span`
  position: relative;
  width: 100%;
  color: #fff !important;
  font-size: 0.7rem;
  line-height: 1.5;

  & > .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
    font-size: 1rem;

    &:hover {
      cursor: pointer;
    }
  }

  &:hover > .btn-close {
    display: block !important;
  }
`;

export const ErrorAlert = styled.div`
  position: absolute;
  top: 100%;
  left: 5%;
  width: 90%;
  z-index: 10;
  padding: 0.25rem 0.5rem;
  margin-top: .1rem;
  background-color: rgba(220, 53, 69, 0.9);
  border-radius: 0.25rem;

  display: flex;

  & > * {
    flex-grow: 1;
  }
`;

