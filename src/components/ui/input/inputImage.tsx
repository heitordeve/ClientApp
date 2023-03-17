import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

import InputErrorAlert from '../inputErrorAlert';
import { Flex, Row } from '../layout';
import { Subtitle } from '../typography';
import Button, { Fab } from '../button';
import { IcCamera, IcAnexo } from '../icons';
import { IlPhoto } from '../illustrations';
import { useField } from '@unform/core';
import InputCamera, { CameraDisponivel } from './inputCamera';

const Img = styled.img<{ radius: number }>`
  max-width: 100%;
  max-height: 100%;
  border-radius: ${({ radius }) => radius}px;
`;

const Container = styled(Flex)`
  position: relative;
`;
const Label = styled(Row).attrs({ as: 'label' })`
  margin-bottom: 0;
`;

const Input = styled.input`
  display: none;
`;

interface InputImageProps {
  name: string;
  label: string;
  direction?: 'col' | 'row';
  camera?: 'front' | 'back';
  cameraDescricaoConfirmacao?: string;
  onChange?(file: File, callback: (rejectImage?: boolean) => void): void;
}

const InputImage: React.FC<InputImageProps> = ({
  name,
  label,
  onChange,
  camera,
  cameraDescricaoConfirmacao,
  direction = 'col',
}) => {
  const [image, setImage] = useState<File>();
  const [imgSrc, setImgSrc] = useState<string>();
  const [_error, _setError] = useState<string>();
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>();
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      clearValue: () => {
        setImage(undefined);
        setImgSrc(undefined);
      },
      getValue: () => image,
    });
  }, [inputRef, fieldName, registerField, image]);

  useEffect(() => {
    if (onChange && image) {
      onChange(image, rejectImage => {
        if (rejectImage === true) {
          setImage(undefined);
          setImgSrc(undefined);
        }
      });
    }
  }, [image, onChange]);

  const handleChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files.length > 0) {
      let file = event.currentTarget.files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
        setImgSrc(await file.toBase64(true));
        return;
      }
      const msgError = 'Arquivo enviado não é uma imagem';
      _setError(msgError);
      setImage(undefined);
      setImgSrc(undefined);
    }
  }, []);
  const isCol = direction === 'col';

  return (
    <Container direction={direction} gap="6px">
      <Row
        justify="center"
        align="center"
        height={isCol ? '200px' : '55px'}
        width={isCol ? '100%' : '73px'}
      >
        {imgSrc ? (
          <Img src={imgSrc} alt="preview" radius={isCol ? 10 : 5} />
        ) : (
          <IlPhoto size="100%" radius={isCol ? 10 : 5} />
        )}
      </Row>
      <Row align="center" gap="6px" flex="1">
        {direction === 'row' && <Subtitle flex="1">{label}</Subtitle>}
        <Label flex={isCol ? 1 : 0}>
          <Input
            accept="image/*"
            ref={inputRef}
            defaultValue={defaultValue}
            type="file"
            onChange={handleChange}
            name={name}
          />
          {isCol ? (
            <Button as="span">
              {imgSrc ? 'Alterar' : 'Selecionar'} {label} <IcAnexo size="24px" />
            </Button>
          ) : (
            <Fab size={48} color="primary" aria-label="upload picture" as="span">
              <IcAnexo />
            </Fab>
          )}
        </Label>
        {camera && CameraDisponivel() && (
          <Fab
            size={48}
            color="primary"
            aria-label="upload picture"
            onClick={() => setShowCamera(true)}
          >
            <IcCamera />
          </Fab>
        )}
      </Row>

      <InputErrorAlert
        error={error || _error}
        clearError={() => {
          clearError();
          _setError(undefined);
        }}
      />
      <InputCamera
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onSubmit={img => setImgSrc(img)}
        camera={camera}
        title={label}
        descricaoConfirmacao={cameraDescricaoConfirmacao}
      />
    </Container>
  );
};

export default InputImage;
