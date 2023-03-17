import React, { useState, useCallback, useRef } from 'react';
import { FormControl } from '@material-ui/core';

import { BodyP, Title, Subtitle } from 'components/ui/typography';
import { TipoCartaoApi } from 'services/apis';
import { Column } from 'components/ui/layout';

import { useVias } from './viasHook';
import { InputImage } from 'components/ui/input';
import { RadioLabel, RadioGroup } from 'components/ui/radio';
import Button from 'components/ui/button';
import PrimeiraViaTrasportValid, { DocumentoModel } from 'validations/PrimeiraViaTrasportValid';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { TipoDocumentoPrimeiraVia } from 'enuns/tipoDocumentoPrimeiraVia';
import { useLoad } from 'hooks';

const descricaoDocumento =
  'Como ficou a foto? Se as informações não estiverem legíveis, tire outra por favor.';
const descricaoSelfie =
  'Como ficou a foto? O foco ficou bom? Se não estiver bom, tire outra por favor.';

const PrimeiraViaDocumentos: React.FC = () => {
  const [tipoDocumento, setTipoDocumento] = useState<string>(null);
  const { onNext } = useVias();
  const { addLoad, removeLoad } = useLoad();
  const formRef = useRef<FormHandles>(null);

  const onSubmit = useCallback(
    async (data: DocumentoModel) => {
      const LOAD = 'SubmiDOcumentos';
      const valido = await PrimeiraViaTrasportValid.ValidarDocumentos(data, formRef);
      if (valido) {
        const request = [
          {
            tipoDocumento:
              tipoDocumento === 'RG'
                ? TipoDocumentoPrimeiraVia.rgFrente
                : TipoDocumentoPrimeiraVia.cnhFrente,
            imagemBase64: await data.frente.toBase64(),
          },
          {
            tipoDocumento:
              tipoDocumento === 'RG'
                ? TipoDocumentoPrimeiraVia.rgVerso
                : TipoDocumentoPrimeiraVia.rgFrente,
            imagemBase64: await data.verso.toBase64(),
          },
          {
            tipoDocumento: TipoDocumentoPrimeiraVia.selfie,
            imagemBase64: await data.selfie.toBase64(),
          },
        ];
        addLoad(LOAD);
        const result = await TipoCartaoApi.envioDocumento(request);
        removeLoad(LOAD);
        if (result) {
          onNext();
        }
      }
    },
    [tipoDocumento, onNext, addLoad, removeLoad],
  );

  const handleChangeTipo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoDocumento(event.target.value);
  };

  return (
    <Form ref={formRef} onSubmit={onSubmit}>
      <Column gap="6px">
        <Title justify="center">Escolha o documento </Title>
        <BodyP>
          Qual o tipo de documento de verificação você deseja utilizar em sua solicitação?
        </BodyP>
        <FormControl>
          <RadioGroup
            ariaLabel="Tipo Documento"
            name="tipoDocumento"
            defaultValue={tipoDocumento}
            onChange={handleChangeTipo}
          >
            <RadioLabel value="RG" label="RG" />
            <RadioLabel value="CNH" label="CNH" />
          </RadioGroup>
        </FormControl>
        {tipoDocumento && (
          <Column gap="12px">
            <Subtitle>Anexos</Subtitle>
            <InputImage
              direction="row"
              name="frente"
              label={`Frente ${tipoDocumento}`}
              camera="back"
              cameraDescricaoConfirmacao={descricaoDocumento}
            />
            <InputImage
              direction="row"
              name="verso"
              label={`Verso ${tipoDocumento}`}
              camera="back"
              cameraDescricaoConfirmacao={descricaoDocumento}
            />
            <InputImage
              direction="row"
              name="selfie"
              label={`Selfie`}
              camera="front"
              cameraDescricaoConfirmacao={descricaoSelfie}
            />
          </Column>
        )}
        {tipoDocumento && <Button type="submit">Proximo</Button>}
      </Column>
    </Form>
  );
};

export default PrimeiraViaDocumentos;
