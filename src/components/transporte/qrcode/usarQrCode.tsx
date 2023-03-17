import React, { useCallback, useState, useRef, useEffect } from 'react';

import { Link, useRouteMatch, useParams, useHistory } from 'react-router-dom';
import Input from '../../ui/input/v2';
import Button from '../../ui/button';
import Card, { AlertCard } from '../../ui/card';
import { Column, Row } from '../../ui/layout';
import BackMain from '../../ui/main/back-main';
import { BodyP, Small, SSmall, Strong } from '../../ui/typography';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useTransporte } from '../../../hooks/transporteHook';
import { OperadoraTranspote } from '../../../dtos/operadorasTrasporte';
import TabSelector, { PagedLoadTab, PagedLoadTabs } from '../../ui/tabSelector';
import { CartaoQrCodeApi, LinhasApi } from 'services/apis';
import { IcSearch } from 'components/ui/icons';
import { Linha, TipoServico, FavoritarLinhaRequest } from 'dtos/linha';
import CardOnibus from './cardOnibus';
import { ModalAlert } from 'components/ui/modal';
import { PATHS } from 'routes/rotas-path';
interface CompraQrCodeParams {
  codigoOperadora: string;
}

const tipoLinha = new Map<number, string>();
tipoLinha.set(TipoServico.Linha, 'Linha');
tipoLinha.set(TipoServico.Estacao, 'Estação / Entrada');

const tabs: PagedLoadTabs = new PagedLoadTabs([
  new PagedLoadTab(0, 'Ponto de ônibus'),
  new PagedLoadTab(1, 'Estação'),
]);

const qMaxFavoritos = 3;

const UsarQrCode: React.FC = () => {
  let { url } = useRouteMatch();
  const history = useHistory();
  let { codigoOperadora } = useParams<CompraQrCodeParams>();
  const { operadorasTranspote, setCartaoQrcode, setQrcodes, getQrcodes } = useTransporte();
  const [operadora, setOperadora] = useState<OperadoraTranspote>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const formRef = useRef<FormHandles>(null);
  const [tipo, setTipo] = useState<number>(0);
  const [filtro, setFiltro] = useState<string>('');
  const [selecionado, setSelecionado] = useState<Linha>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalSaldo, setModalSaldo] = useState<boolean>(false);
  const [modalConfirmar, setModalConfirmar] = useState<boolean>(false);
  const nomeTipo = tipoLinha.get(tipo);

  const handleSubmit = useCallback(async () => {
    if (operadora?.CartaoQrcode?.Saldo < selecionado.ValorTarifa) {
      setModalSaldo(true);
      return;
    }
    setModalConfirmar(true);
  }, [operadora, selecionado]);

  const submit = useCallback(async () => {
    if (operadora?.CartaoQrcode?.Saldo < selecionado.ValorTarifa) {
      setModalSaldo(true);
      return;
    }
    setLoading(true);
    const tipoCartao = await CartaoQrCodeApi.BuscaListaTipoCartao(operadora.Codigo);
    const qrCode = await CartaoQrCodeApi.GerarQrCode({
      CodigoTipoCartao: tipoCartao.Codigo,
      CodigoCartaoTransporte: operadora.CartoesUsuario.find(c => c.HasQrCode).Codigo,
      CodigoLinha: selecionado.Id,
      ValorTarifa: selecionado.ValorTarifa,
    });
    setLoading(false);
    if (qrCode) {
      setQrcodes([...getQrcodes(), qrCode]);
      history.push(url.replace('gerar', `detalhes/${qrCode.CodigoQRCode}/compra`));
    }
  }, [operadora, selecionado, setQrcodes, getQrcodes, history, url]);
  const favoritar = useCallback(
    async (linhaFav: Linha, favorito: boolean) => {
      const request: FavoritarLinhaRequest = {
        CodigoCartaoTransporte: operadora.CartoesUsuario.find(c => c.HasQrCode).Codigo,
        DescricaoLinha: linhaFav.Codigo,
        IdLinhaSBE: linhaFav.Id,
        CodigoOperadora: operadora.Codigo,
        IsFavoritar: favorito,
      };
      let isSucess = await LinhasApi.Favoritar(request);
      if (isSucess && favorito) {
        setFavoritos([...favoritos, linhaFav.Codigo]);
      }
      if (isSucess && !favorito) {
        const favoritosTmp = [...favoritos].remove(l => l === linhaFav.Codigo);
        setFavoritos(favoritosTmp);
      }
    },
    [operadora, setFavoritos, favoritos],
  );
  const buscarLinhas = useCallback(async () => {
    if (operadora && operadora.CartaoQrcode) {
      let estacoesP = LinhasApi.ListarLinhasVigentes(operadora.Codigo, true);
      let linhasP = LinhasApi.ListarLinhasVigentes(operadora.Codigo, false);
      const linhasTmp = [...(await estacoesP), ...(await linhasP)];
      setLinhas(linhasTmp);
    }
  }, [operadora]);
  const buscarFavoritos = useCallback(async () => {
    if (operadora && operadora.CartaoQrcode) {
      let estacoesP = LinhasApi.ListarFavoritos(true);
      let linhasP = LinhasApi.ListarFavoritos(false);
      const linhasTmp = [...(await estacoesP), ...(await linhasP)];
      setFavoritos(linhasTmp);
    }
  }, [operadora]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([buscarLinhas(), buscarFavoritos()]);
      setLoading(false);
    })();
  }, [operadora, buscarLinhas, buscarFavoritos]);

  useEffect(() => {
    setLoading(true);
    const tmpOperadora = operadorasTranspote.find(c => c.Codigo === Number(codigoOperadora));
    if (tmpOperadora && tmpOperadora.CartaoQrcode) {
      setOperadora(tmpOperadora);
    } else if (tmpOperadora) {
      (async () => {
        await setCartaoQrcode(tmpOperadora.Codigo);
        if (!tmpOperadora.CartaoQrcode) {
          setModalSaldo(true);
        }
      })();
    }
    setLoading(false);
  }, [codigoOperadora, operadorasTranspote, setCartaoQrcode, setOperadora]);
  return (
    <BackMain
      title="Usar QRCode"
      loading={loading}
      backUrl={`${PATHS.transporte.qrcode}/${codigoOperadora}`}
    >
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Column gap="12px">
          <TabSelector
            tabs={tabs}
            selectedId={tipo}
            onClick={setTipo}
            disabled={!!selecionado}
            sticky
          />
          <Card color="primary">
            <Column padding="20px">
              <Small>Saldo QRCode</Small>
              <BodyP margin="0">R$ {operadora?.CartaoQrcode?.Saldo?.toDecimalString()}</BodyP>
            </Column>
          </Card>
          <Strong>Insira os dados da {nomeTipo} para realizar o pagamento com QRCode:</Strong>
          <AlertCard
            titulo="Aviso"
            texto={`Após a geração do QRCode será informada a data e hora de validade para utilização do QRCode na ${nomeTipo} solicitada.`}
          />
          <Row align="center" gap="12px" color="primary" padding=" 0 12px 0 0">
            <Input
              name="NumLinha"
              placeholder={nomeTipo}
              onChange={event => setFiltro(event.target.value)}
            />
            <IcSearch size="30" />
          </Row>
          <Column>
            {favoritos.length === qMaxFavoritos && <Small>Máximo de favoritos atingido</Small>}
            {!selecionado &&
              linhas
                .filter(
                  l =>
                    l.TipoServico === tipo &&
                    (filtro
                      ? l.Nome.includes(filtro.toUpperCase()) ||
                        l.Codigo.includes(filtro.toUpperCase())
                      : favoritos.includes(l.Codigo)),
                )
                .map((linha, i) => (
                  <CardOnibus
                    key={i}
                    linha={linha}
                    isFavorite={favoritos.includes(linha.Codigo)}
                    canFavorite={favoritos.length < qMaxFavoritos}
                    onClick={l => setSelecionado(l)}
                    onFavorited={favoritar}
                  />
                ))}
            {selecionado && (
              <CardOnibus
                selected
                linha={selecionado}
                isFavorite={favoritos.includes(selecionado.Codigo)}
                canFavorite={favoritos.length < qMaxFavoritos}
                onClick={l => setSelecionado(null)}
              />
            )}
          </Column>
          <Button type="submit" disabled={!selecionado}>
            Gerar QRCode
          </Button>
        </Column>
      </Form>
      {/* Modais */}
      {modalSaldo && (
        <ModalAlert
          title="Atenção"
          onClose={() => {
            if (!operadora?.CartaoQrcode) {
              history.replace(`${PATHS.transporte.qrcode}/${codigoOperadora}`);
            }
          }}
        >
          <SSmall>
            Você não possui saldo QRCode. Para comprar saldo vá em Comprar QRCode clicando no botão
            abaixo.
          </SSmall>
          <Row gap="12px">
            <Button
              flex="1 1 50%"
              theme="light"
              onClick={() => {
                if (!operadora?.CartaoQrcode) {
                  history.replace(`${PATHS.transporte.qrcode}/${codigoOperadora}`);
                } else {
                  setModalSaldo(false);
                }
              }}
            >
              Cancelar
            </Button>
            <Link style={{ flex: '1 1 50%' }} to={url.replace('gerar', 'compra')}>
              <Button>Comprar</Button>
            </Link>
          </Row>
        </ModalAlert>
      )}
      {modalConfirmar && (
        <ModalAlert title="Atenção">
          <SSmall>
            Ao gerar o QRCode será debitada em seu saldo QRCode o valor da tarifa correspondente à
            linha de ônibus selecionada. Deseja continuar a operação?
          </SSmall>
          <Row gap="12px">
            <Button flex="1" theme="light" onClick={() => setModalConfirmar(false)}>
              Cancelar
            </Button>
            <Button
              flex="1"
              onClick={() => {
                setModalConfirmar(false);
                submit();
              }}
            >
              Comprar
            </Button>
          </Row>
        </ModalAlert>
      )}
    </BackMain>
  );
};

export default UsarQrCode;
