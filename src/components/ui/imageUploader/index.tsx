import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  ButtonHTMLAttributes,
  ImgHTMLAttributes,
} from 'react';
import { ColorScheme } from '../../../styles/consts';

import Button from '../button';
import InputErrorAlert from '../inputErrorAlert';

import { Container } from './styles';

interface ImageUploaderProps {
  name?: string;
  color?: ColorScheme;
  theme?: 'default' | 'light' | 'outlined';
  onChange?(file: File, callback: (rejectImage?: boolean) => void): void;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  name,
  onChange,
  buttonProps,
  imgProps,
  color = 'primary',
  theme = 'default',
}) => {
  const [image, setImage] = useState<File>();
  const [imgSrc, setImgSrc] = useState<string>();
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>();

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

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files.length > 0) {
      let file = event.currentTarget.files[0];
      if (file.type.startsWith('image/')) {
        let reader = new FileReader();
        setImage(file);
        reader.readAsDataURL(file);
        reader.addEventListener('load', () => {
          setImgSrc(reader.result.toString());
        });
      } else {
        setImage(undefined);
        setImgSrc(undefined);
        setError('Arquivo enviado não é uma imagem');
      }
    } else {
      setImage(undefined);
      setImgSrc(undefined);
    }
  }, []);
  return (
    <Container>
      {imgSrc && <img {...imgProps} src={imgSrc} alt="preview" style={{ maxHeight: '30vh' }} />}
      <input accept="image/*" ref={inputRef} type="file" onChange={handleChange} name={name} />
      <Button color={color as any} theme={theme} {...buttonProps} onClick={handleClick}>
        {imgSrc ? 'Alterar' : 'Selecionar'} Imagem
      </Button>
      <InputErrorAlert error={error} clearError={clearError} />
    </Container>
  );
};

export default ImageUploader;
