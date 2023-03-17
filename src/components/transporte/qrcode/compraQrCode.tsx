import React, { useCallback, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import Input from '../../ui/input/v2';
import Button, { SelectButton } from '../../ui/button';
import Card from '../../ui/card';
import { Column } from '../../ui/layout';
import BackMain from '../../ui/main/back-main';
import { Title, Small, BodySpan } from '../../ui/typography';
import QrCodeValid from '../../../validations/qrCodeValid';
import { useShoppingBag } from '../../../hooks/shoppingBag';
import { useAuth } from '../../../hooks/auth';
import { useTransporte } from '../../../hooks/transporteHook';
import { CompraQRCode } from '../../../dtos/qrCode';
import { OperadoraTranspote } from '../../../dtos/operadorasTrasporte';
import { TipoPedidoEnum } from '../../../enuns/tipoPedidoEnum';
import CartaoQrCodeApi from '../../../services/apis/cartaoQrCodeApi';
import { PATHS } from 'routes/rotas-path';
const quantidades: number[] = [1, 2, 4, 6, 8, 10];
interface CompraQrCodeParams {
  codigoOperadora: string;
}

const LogoOperadora = styled.img`
  max-height: 125px;
`;

const CompraQrCode: React.FC = () => {
  let { codigoOperadora } = useParams<CompraQrCodeParams>();
  const { operadorasTranspote, setCartaoQrcode } = useTransporte();
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();
  const { addShoppingBag } = useShoppingBag();
  const [loading, setLoading] = useState<boolean>(false);
  const [valor, setValor] = useState<string>('0');
  const [operadora, setOperadora] = useState<OperadoraTranspote>(null);

  const handleSubmit = useCallback(
    async (data: CompraQRCode) => {
      data.valorDaCompra = (data.valorDaCompra as string).ToNumber();
      const { Min, Max } = operadora?.ValorQrCode;
      const valido = await QrCodeValid.ValidarCompra(data, formRef, Min, Max);
      if (!valido) {
        return;
      }
      setLoading(true);
      const tipoCartao = await CartaoQrCodeApi.BuscaListaTipoCartao(operadora.Codigo);
      if (!operadora.CartaoQrcode) {
        const resultGerar = await CartaoQrCodeApi.GerarCartaoVirtual({
          CodigoOperadora: operadora.Codigo,
          CodigoTipoCartao: tipoCartao.Codigo,
          NomeCartaoVirtual: tipoCartao.Descricao,
        });
        if (!resultGerar) {
          setLoading(false);
          return;
        }
      }
      if (valido) {
        addShoppingBag({
          Nome: 'Compra QRCode',
          Detalhes: operadora.Nome,
          CodigoOperadora: operadora.Codigo,
          CodigoUsuarioCartao: operadora.CartoesUsuario.find(c => c.HasQrCode).Codigo,
          CodigoUsuario: user.CodigoUsuario,
          ValorRecarga: data.valorDaCompra as number,
          TipoPedido: TipoPedidoEnum.QrCode,
          CodigoAssinante: null,
          CodigoTipoCartao: tipoCartao.Codigo,
        });
      }
      setLoading(false);
    },
    [addShoppingBag, user, operadora],
  );

  useEffect(() => {
    const tmpOperadora = operadorasTranspote.find(o => o.Codigo === Number(codigoOperadora));
    if (tmpOperadora && tmpOperadora.CartaoQrcode) {
      setOperadora(tmpOperadora);
    } else if (tmpOperadora) {
      setLoading(true);
      (async () => {
        await setCartaoQrcode(tmpOperadora.Codigo);
        setOperadora(tmpOperadora);
        setLoading(false);
      })();
    }
  }, [codigoOperadora, setCartaoQrcode, operadorasTranspote]);

  return (
    <BackMain
      title="Comprar QRcode"
      loading={loading}
      backUrl={`${PATHS.transporte.qrcode}/${codigoOperadora}`}
    >
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Column gap="12px">
          <Card color="primary" justify="center" align="center" minHeight="150px">
            <LogoOperadora src={operadora?.Logo} />
          </Card>
          <BodySpan>Selecione a quantidade:</BodySpan>
          <SelectButton
            onChange={valorSelecionado => setValor(valorSelecionado)}
            defaultValue={valor}
            buttons={quantidades.map((quantidade, i) => ({
              key: i,
              value: `${(quantidade * operadora?.ValorTarifa).toDecimalString()}`,
              text: `${quantidade} QR code`,
            }))}
          />
          <BodySpan>Ou informe outro valor</BodySpan>
          <Input
            name="valorDaCompra"
            mask="decimal"
            value={valor}
            prefix="R$"
            onChange={event => setValor(event.target.value)}
          />
          {operadora && (
            <Small>
              Valor mínimo de R$ {operadora?.ValorQrCode.Min?.toDecimalString()} e máximo de R${' '}
              {operadora?.ValorQrCode.Max?.toDecimalString()}
            </Small>
          )}
          <Card color="warning" theme="light">
            <Column padding="12px">
              <Title>Atenção</Title>
              <Small>
                Ao confirmar a compra, será debitado um valor de conveniência referente à taxa de
                serviços de 1% devida à Transfácil.
              </Small>
            </Column>
          </Card>
          <Button type="submit">Confirmar Compra</Button>
        </Column>
      </Form>
    </BackMain>
  );
};

export default CompraQrCode;
