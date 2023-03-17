import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { Column } from '../../ui/layout';
import BackMain from '../../ui/main/back-main';
import { Title, Strong, Small } from '../../ui/typography';
import TabSelector, { PagedLoadTab, PagedLoadTabs } from '../../ui/tabSelector';
import CartaoQrCodeApi from '../../../services/apis/cartaoQrCodeApi';
import { useTransporte } from '../../../hooks/transporteHook';
import { OperadoraTranspote } from '../../../dtos/operadorasTrasporte';
import InfiniteScroll from '../../ui/infiniteScroll';
import { ListarQrCodeResquest, QrCode } from 'dtos/cartaoQrcode';
import CardQrCode from './cardQrCode';
import NoQrcode from 'assets/no-qrcode.png';
import { PATHS } from 'routes/rotas-path';
interface CompraQrCodeParams {
  codigoOperadora: string;
}

export const NoQRcode = styled.img`
  max-width: 250px;
`;

const MeusQrCodes: React.FC = () => {
  let { codigoOperadora } = useParams<CompraQrCodeParams>();
  const { operadorasTranspote, setCartaoQrcode, setQrcodes } = useTransporte();
  const [operadora, setOperadora] = useState<OperadoraTranspote>(null);
  const [tabs] = useState<PagedLoadTabs>(
    new PagedLoadTabs([new PagedLoadTab(1, 'Disponíveis'), new PagedLoadTab(2, 'Todos')]),
  );
  const [tabAtual, setTabAtual] = useState<number>(1);
  const [disponiveis, setDisponiveis] = useState<QrCode[]>([]);
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const buscarDisponiceis = useCallback(
    async (parms: ListarQrCodeResquest) => {
      if (tabs.isActive(1)) {
        tabs.next(1);
        setLoading(true);
        const disponiceisTmp = await CartaoQrCodeApi.QrCodeDisponiveis(parms);
        setDisponiveis([...disponiveis, ...disponiceisTmp]);
        if (disponiceisTmp.length < 20) {
          tabs.stop(1);
        }
        setLoading(false);
      }
    },
    [disponiveis, setDisponiveis, tabs],
  );
  const buscarTodos = useCallback(
    async (parms: ListarQrCodeResquest) => {
      if (tabs.isActive(2)) {
        tabs.next(2);
        setLoading(true);
        parms.DtInicial = new Date(2000, 1, 1);
        parms.DtFinal = new Date().addDays(1);
        const qrCodeTmp = await CartaoQrCodeApi.QrCodeTodosStatus(parms);
        setQrCodes([...qrCodes, ...qrCodeTmp]);
        if (qrCodeTmp.length < 20) {
          tabs.stop(2);
        }
        setLoading(false);
      }
    },
    [qrCodes, setQrCodes, tabs],
  );

  const buscar = useCallback(async () => {
    if (operadora && operadora.CartaoQrcode) {
      const parms = {
        CodOperadora: operadora.Codigo,
        CodExtCartao: operadora.CartaoQrcode.Numero,
        Pag: tabs.get(tabAtual).countLoads,
        QtdPag: 30,
      };
      tabAtual === 1 ? buscarDisponiceis(parms) : buscarTodos(parms);
    }
  }, [operadora, tabAtual, tabs, buscarDisponiceis, buscarTodos]);

  const goToTab = useCallback(
    (id: number) => {
      setTabAtual(id);
    },
    [setTabAtual],
  );

  const onOperadorasChange = useCallback(async () => {
    const tmpOperadora = operadorasTranspote.find(o => o.Codigo === Number(codigoOperadora));
    if (tmpOperadora && tmpOperadora.CartaoQrcode) {
      setOperadora(tmpOperadora);
      if (tabs.get(tabAtual).countLoads === 0 && operadorasTranspote) {
        buscar();
      }
    } else if (tmpOperadora) {
      await setCartaoQrcode(tmpOperadora.Codigo);
    }
  }, [buscar, tabAtual, tabs, operadorasTranspote, setCartaoQrcode, codigoOperadora]);

  const onTabChange = useCallback(() => {
    if (tabs.get(tabAtual).countLoads === 0 && operadorasTranspote) {
      buscar();
    }
  }, [buscar, tabs, tabAtual, operadorasTranspote]);

  useEffect(() => {
    onOperadorasChange();
  }, [operadorasTranspote, setCartaoQrcode, onOperadorasChange]);

  useEffect(() => {
    onTabChange();
  }, [tabAtual, onTabChange]);

  useEffect(() => {
    setQrcodes(disponiveis);
  }, [disponiveis, setQrcodes]);

  const isDisponiveis = tabAtual === 1;
  const listaQrcodes = isDisponiveis ? disponiveis : qrCodes;
  return (
    <BackMain
      title="Meus QRCodes"
      minHeight={'400px'}
      loading={loading}
      backUrl={`${PATHS.transporte.qrcode}/${codigoOperadora}`}
    >
      <InfiniteScroll hasMore={tabs.isActive(tabAtual)} onReachBottom={buscar}>
        <Column gap="12px">
          <TabSelector tabs={tabs} selectedId={tabAtual} onClick={goToTab} />
          {listaQrcodes
            .map(q => {
              return { ...q, Data: q.DataEvento ?? q.DataGeracao };
            })
            .sort((a, b) => b.Data?.getTime() - a.Data?.getTime())
            .group(q => {
              return q.Data?.format('dd/MM/yyyy');
            })
            .map(({ key: data, group }) => (
              <Column key={data}>
                {<Title>{data}</Title>}
                {group.map((qrCode, i) => (
                  <CardQrCode key={i} qrCode={qrCode} disponiveis={isDisponiveis} />
                ))}
              </Column>
            ))}
          {listaQrcodes.length === 0 && (
            <Column align="center" justify="center" gap="12px" padding="12px 0">
              <NoQRcode src={NoQrcode} alt="Sem QRcode" />
              <Strong>Nenhum QRCode por aqui!</Strong>
              <Small>
                {isDisponiveis
                  ? 'Você ainda não fez nenhum pagamento utilizando o QRCode no KIM.'
                  : 'Você não possui nenhum QRCode disponível.'}
              </Small>
            </Column>
          )}
        </Column>
      </InfiniteScroll>
    </BackMain>
  );
};

export default MeusQrCodes;
