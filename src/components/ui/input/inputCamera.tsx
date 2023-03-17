import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';

import { Caption } from 'components/ui/typography/v2';
import { Column, Row } from 'components/ui/layout';

import { Fab } from 'components/ui/button';
import Modal from 'components/ui/modal';
import { IcCamera, IcClose, IcCheck } from 'components/ui/icons';

export const CameraDisponivel = () =>
  'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

const Actions = styled(Row)`
  margin-top: -28px;
  z-index: 10;
`;

const Img = styled.img`
  border-radius: 10px;
  max-height: 100%;
`;
interface size {
  height: number;
  width: number;
}
interface CameraProps {
  onClose: () => void;
  onSubmit: (imagen: string) => void;
  isOpen: boolean;
  title: string;
  descricao?: string;
  descricaoConfirmacao?: string;
  camera?: 'front' | 'back';
}
const InputCamera: React.FC<CameraProps> = ({
  onSubmit,
  onClose,
  isOpen,
  title,
  descricaoConfirmacao,
  descricao,
  camera = 'front',
}) => {
  const [showAction, setShowAction] = useState<boolean>(false);
  const [baseImg, setBaseImg] = useState<string>(null);
  const [srcSize, setSrcize] = useState<size>(null);
  const [imgSize, setImgSize] = useState<size>(null);
  const webcamRef = useRef<Webcam>(null);
  const _onSubmit = useCallback(async () => {
    onSubmit(baseImg);
    onClose();
  }, [baseImg, onSubmit, onClose]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot(srcSize ?? undefined);
    setBaseImg(imageSrc);
    const video = webcamRef.current.video;
    if (video) {
      setImgSize({
        width: video.offsetWidth,
        height: video.offsetHeight,
      });
    }
    setShowAction(false);
  }, [webcamRef, setImgSize, setShowAction, srcSize]);

  const onUserMedia = useCallback(
    (stream: MediaStream) => {
      setShowAction(true);
      const { width, height } = stream?.getVideoTracks?.()[0]?.getSettings();
      setSrcize({ width, height });
    },
    [setSrcize],
  );
  const onUserMediaError = useCallback((a: any) => {
    console.log('onUserMediaError', a);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setBaseImg(null);
      setShowAction(false);
    }
  }, [isOpen, setBaseImg, setShowAction]);
  const videoConstraints = {
    video: {
      width: {
        ideal: 1920,
        max: 2560,
      },
      height: {
        ideal: 1080,
        max: 1440,
      },
    },
    facingMode: camera === 'front' ? 'user' : 'environment',
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen} minWidth="350px" title={title}>
      <Column gap="6px" flex="1" justify="center" padding="1rem .25rem">
        {baseImg ? (
          <Column>
            <Column gap="12px">
              <Caption align="center">{descricaoConfirmacao}</Caption>
              <Img
                src={baseImg}
                alt="Foto"
                height={`${imgSize.height}px`}
                width={`${imgSize.width}px`}
              />
            </Column>
            <Actions justify="center" gap="12px">
              <Fab onClick={() => setBaseImg(null)} color="danger">
                <IcClose />
              </Fab>
              <Fab onClick={() => _onSubmit()} color="success">
                <IcCheck />
              </Fab>
            </Actions>
          </Column>
        ) : (
          <Column>
            <Column gap="12px">
              <Caption align="center">{descricao}</Caption>
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored={camera === 'front'}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={onUserMedia}
                onUserMediaError={onUserMediaError}
                style={{ borderRadius: '10px', width: '100%', height: '100%' }}
                onPause={() => console.log('onpause')}
              />
            </Column>
            {showAction && (
              <Actions justify="center">
                <Fab onClick={capture}>
                  <IcCamera />
                </Fab>
              </Actions>
            )}
          </Column>
        )}
      </Column>
    </Modal>
  );
};

export default InputCamera;
