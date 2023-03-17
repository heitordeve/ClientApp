import React, { useState, useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { Column, Row } from '../ui/layout';
import { Headline, Subtitle, BodyP, Small } from '../ui/typography';
import { Card } from '../ui/card';
import Modal from '../ui/modal';

import Input from '../ui/input';
import ImageUploader from '../ui/imageUploader';
import Button from '../ui/button';
import toBase64 from '../../utils/toBase64';
import * as Yup from 'yup';
import { alertService } from '../../hooks/alert';
import getValidationErrors from '../../utils/getValidationErrors';
import PedidoApi from '../../services/apis/pedidoApi';
import FastApi from '../../services/apis/fastApi';
import { PedidoFast } from '../../dtos/Fast';
import PedidoValid from '../../validations/pedidoValid';

interface ModalSendProofProps {
  numPedido: number;
  onClose: () => void;
}

interface ExtractFormData {
  valueNumber: string;
}

const SendProof: React.FC<ModalSendProofProps> = ({ numPedido, onClose }) => {
  const formRef = useRef<FormHandles>(null);

  const [, setIsOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageType, setImageType] = useState<string>();
  const [imageBase, setImageBase] = useState<string>();

  const onImgChange = useCallback(
    async (img: File, callback: (rejectImage?: boolean) => void) => {
      try {
        const base64 = await toBase64(img);
        setImageType(img.type);
        setImageBase(base64.toString().replace(`data:${img.type};base64,`, ''));
      } catch (e) {
        callback(true);
        const errMsg = 'Erro ao converter imagem, tente enviar outo arquivo';
        alertService.error('Erro', errMsg);
      }
    },
    [],
  );

  const novoGedPedido = useCallback(async (): Promise<boolean> => {
    return await PedidoApi.NovoGedPedido({
      CodigoPedido: numPedido,
      Documento64: imageBase,
    });
  }, [imageBase,numPedido]);

  const fastCashValidate = useCallback(
    async (pedidoFast: PedidoFast, codigoValue: number): Promise<boolean> => {
      const result = await FastApi.Validar({
        Tid: pedidoFast.Transaction.Tid,
        Pid: pedidoFast.Transaction.Pid,
        AmountPaid: codigoValue,
        ValidationCode1: pedidoFast.Validation.ValidationCode1,
        ValidationCode2: pedidoFast.Validation.ValidationCode2,
        ValidationCode3: pedidoFast.Validation.ValidationCode3,
        ValidationCode4: pedidoFast.Validation.ValidationCode4,
        Base64Image: imageBase,
        Base64ImageExtension: imageType,
        PaymentTime: new Date(),
      });
      return result;
    },
    [ imageBase, imageType],
  );
  const handleSubmit = useCallback(
    async (data: ExtractFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});
        await PedidoValid.EnvioComprovante.validate(data, {
          abortEarly: false,
        });
        const pedido = await FastApi.Obter(numPedido);
        const enviado = await fastCashValidate(
          pedido,
          Number(data.valueNumber),
        );
        if (enviado && (await novoGedPedido())) {
          setIsOpen(false);
          alertService.success('success', 'Anexo enviado com sucesso!');
        }
      } catch (error) {
        setLoading(false);
        window.scrollTo(0, 0);
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
          setTimeout(() => {
            formRef.current?.setErrors({});
          }, 3000);
        }
      }
      setLoading(false);
    },
    [numPedido, formRef, novoGedPedido, fastCashValidate],
  );

  return (
    <Modal
      title="Comprovação"
      onClose={onClose}
      loading={loading}
      minWidth="450px"
      footer={
        <Button
          disabled={!imageBase}
          type="submit"
          onClick={() => formRef.current.submitForm()}
        >
          Enviar
        </Button>
      }
    >
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Card justify="center">
          <Column justify="center" maxWidth="300px" gap="12px">
            <Column gap="12px">
              <Subtitle>Informe o valor que você pagou:</Subtitle>
              <Row gap="6px">
                <Headline color="primary" align="center">
                  R$
                </Headline>
                <Input name="valueNumber" />
              </Row>
            </Column>
            <BodyP>
              Nos envie uma foto do comprovante de transferência/depósito do
              pedido.
            </BodyP>
            <Small>
              A foto deve estar nítida para conferência da transação.
            </Small>
            <ImageUploader
              theme="light"
              imgProps={{
                style: {
                  height: '200px',
                },
              }}
              onChange={onImgChange}
            />
          </Column>
        </Card>
      </Form>
    </Modal>
  );
};

export default SendProof;
